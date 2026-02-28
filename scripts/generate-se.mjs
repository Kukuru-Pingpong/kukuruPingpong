/**
 * Gemini TTS로 효과음 생성 스크립트
 * 사용법: node scripts/generate-se.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, '../apps/web/public/se');

// .env 파일에서 API 키 읽기 (서버 키 우선)
const serverEnvPath = path.resolve(__dirname, '../apps/server/.env');
const rootEnvPath = path.resolve(__dirname, '../.env');
const envContent = fs.existsSync(serverEnvPath)
  ? fs.readFileSync(serverEnvPath, 'utf-8')
  : fs.readFileSync(rootEnvPath, 'utf-8');
const apiKey = envContent.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();

if (!apiKey) {
  console.error('GEMINI_API_KEY를 .env에서 찾을 수 없습니다.');
  process.exit(1);
}

const sounds = [
  { text: '쿠쿠롱!', filename: 'hit.wav', prompt: '짧고 귀엽게, 장난스러운 느낌으로 "쿠쿠롱!" 이라고 말해주세요. 게임 효과음처럼 힘차고 빠르게요.' },
  { text: '쿠쿠로삥뽕!', filename: 'combo.wav', prompt: '신나고 강렬하게, 콤보 효과음처럼 "쿠쿠로삥뽕!" 이라고 말해주세요. 게임 콤보 느낌으로 더 세게, 더 신나게요!' },
];

function pcmToWav(pcmBuffer, sampleRate = 24000, channels = 1, bitsPerSample = 16) {
  const byteRate = sampleRate * channels * (bitsPerSample / 8);
  const blockAlign = channels * (bitsPerSample / 8);
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

async function generateTts(sound) {
  console.log(`생성 중: ${sound.filename} ("${sound.text}")`);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: sound.prompt }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`TTS 실패 (${sound.filename}): ${res.status} ${errText}`);
  }

  const data = await res.json();
  console.log('Response structure:', JSON.stringify(data, null, 2).slice(0, 500));
  const part = data.candidates?.[0]?.content?.parts?.[0];
  if (!part?.inlineData?.data) {
    throw new Error(`오디오 데이터 없음: ${sound.filename}`);
  }

  const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
  const wavBuffer = pcmToWav(pcmBuffer);

  const outPath = path.join(OUTPUT_DIR, sound.filename);
  fs.writeFileSync(outPath, wavBuffer);
  console.log(`완료: ${outPath} (${(wavBuffer.length / 1024).toFixed(1)}KB)`);
}

// 순차적으로 생성
for (const sound of sounds) {
  await generateTts(sound);
}

console.log('\n모든 효과음 생성 완료!');
