#!/usr/bin/env node

/**
 * 캐릭터 이미지 생성 스크립트
 * 실행: node scripts/generate-character-images.mjs
 *
 * Gemini API로 8개 캐릭터 일러스트를 생성해서
 * apps/front/public/characters/ 에 저장합니다.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'apps/front/public/characters');

// .env에서 API 키 읽기
const envPath = path.join(ROOT, '.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const apiKey = envContent.match(/GEMINI_API_KEY=(.+)/)?.[1]?.trim();

if (!apiKey) {
  console.error('GEMINI_API_KEY not found in .env');
  process.exit(1);
}

const characters = [
  {
    id: 1,
    name: '불꽃 대사왕',
    emoji: '🔥',
    description: '붉은 불꽃 아우라를 가진 열정적인 연기왕. 머리카락이 불꽃처럼 타오르고 빨간 망토를 두른 카리스마 넘치는 캐릭터',
  },
  {
    id: 2,
    name: '눈물 여왕',
    emoji: '💧',
    description: '푸른 물방울 아우라의 감성적인 여왕. 은빛 머리에 파란 드레스를 입고 눈물 같은 보석 왕관을 쓴 우아한 캐릭터',
  },
  {
    id: 3,
    name: '츤데레 검사',
    emoji: '⚖️',
    description: '보라색 아우라의 도도한 검사. 정의의 저울을 들고 검사 정장을 입은 쿨하지만 속은 다정한 캐릭터',
  },
  {
    id: 4,
    name: '열혈 형사',
    emoji: '🔍',
    description: '황금빛 아우라의 정의로운 형사. 트렌치코트에 돋보기를 들고 다니는 열정적이고 정의감 넘치는 캐릭터',
  },
  {
    id: 5,
    name: '재벌 3세',
    emoji: '💎',
    description: '다이아몬드 아우라의 화려한 재벌. 금색 정장에 다이아몬드 반지를 끼고 고급스러운 분위기를 풍기는 캐릭터',
  },
  {
    id: 6,
    name: '천재 해커',
    emoji: '💻',
    description: '사이버 민트색 아우라의 천재 해커. 후드티에 해킹 고글을 쓰고 홀로그램 키보드를 두드리는 미래적인 캐릭터',
  },
  {
    id: 7,
    name: '전설의 조폭',
    emoji: '🐉',
    description: '용의 아우라를 가진 전설의 조폭 보스. 검은 정장에 용 문신이 있고 카리스마 넘치는 근엄한 캐릭터',
  },
  {
    id: 8,
    name: '로맨스 요정',
    emoji: '✨',
    description: '반짝이는 핑크 아우라의 로맨스 요정. 날개 달린 요정 드레스에 하트 지팡이를 든 사랑스러운 캐릭터',
  },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

async function generateImage(char) {
  const outFile = path.join(OUT_DIR, `${char.id}.png`);

  // 이미 존재하면 스킵
  if (fs.existsSync(outFile)) {
    console.log(`⏭️  [${char.id}] ${char.name} — 이미 존재, 스킵`);
    return;
  }

  const prompt = `Create a cute Korean-style chibi character illustration for a voice acting battle game.
Character name: "${char.name}"
Character traits: ${char.description}
Symbol: ${char.emoji}

Requirements:
- Cute chibi/SD style (2-3 head proportions)
- Dynamic pose showing personality
- Vibrant colors matching the character's aura
- Clean white background
- No text or watermarks
- Game character portrait style
- Expressive face showing the character's personality`;

  console.log(`🎨 [${char.id}] ${char.name} 생성 중...`);

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error(`❌ [${char.id}] ${char.name} 실패: ${res.status}`, errText.substring(0, 200));
    return;
  }

  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find((p) => p.inlineData?.data);

  if (!imagePart) {
    console.error(`❌ [${char.id}] ${char.name} — 이미지 데이터 없음`);
    return;
  }

  const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
  fs.writeFileSync(outFile, buffer);
  console.log(`✅ [${char.id}] ${char.name} → ${outFile} (${(buffer.length / 1024).toFixed(1)}KB)`);
}

async function main() {
  console.log('🚀 캐릭터 이미지 생성 시작\n');

  // 하나씩 순서대로 (API rate limit 고려)
  for (const char of characters) {
    try {
      await generateImage(char);
    } catch (err) {
      console.error(`❌ [${char.id}] ${char.name} 에러:`, err.message);
    }
    // rate limit 방지 3초 대기
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log('\n🏁 완료!');
}

main();
