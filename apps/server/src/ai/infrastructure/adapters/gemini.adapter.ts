import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ISentenceGenerator } from '../../domain/services/sentence-generator.interface';
import { IVoiceJudge } from '../../domain/services/voice-judge.interface';
import { ITextToSpeech } from '../../domain/services/text-to-speech.interface';
import { IWordGenerator } from '../../domain/services/word-generator.interface';
import { IImageGenerator } from '../../domain/services/image-generator.interface';
import { JudgmentResult } from '../../domain/value-objects/judgment-result.vo';

@Injectable()
export class GeminiAdapter implements ISentenceGenerator, IVoiceJudge, ITextToSpeech, IWordGenerator, IImageGenerator {
  private genAI: GoogleGenerativeAI;
  private apiBaseUrl: string;
  private textModel: string;
  private ttsModel: string;
  private imageModel: string;

  constructor(private config: ConfigService) {
    this.genAI = new GoogleGenerativeAI(this.config.get<string>('GEMINI_API_KEY'));
    this.apiBaseUrl = this.config.get<string>('GEMINI_API_BASE_URL') || 'https://generativelanguage.googleapis.com/v1beta';
    this.textModel = this.config.get<string>('GEMINI_TEXT_MODEL') || 'gemini-3-flash-preview';
    this.ttsModel = this.config.get<string>('GEMINI_TTS_MODEL') || 'gemini-2.5-flash-preview-tts';
    this.imageModel = this.config.get<string>('GEMINI_IMAGE_MODEL') || 'gemini-3.1-flash-image-preview';
  }

  async generateSentence(word: string, quote: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: this.textModel });

    const prompt = `당신은 창의적인 문장 리믹서입니다.
아래에 유명한 명대사가 주어집니다. 플레이어가 고른 단어 하나를 명대사에 자연스럽게 녹여서 새로운 문장 하나를 만들어주세요.

규칙:
- 원래 명대사의 분위기와 어투를 최대한 살려주세요
- 단어가 자연스럽게 포함되어야 합니다
- 감정이입해서 읽을 수 있는 드라마틱한 문장이어야 합니다
- 문장 하나만 출력하세요. 다른 설명은 하지 마세요

명대사: "${quote}"
단어: ${word}`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  }

  generateAiWord(): string {
    const pool = [
      '고양이', '우주', '치킨', '양말', '용암', '할머니', '로켓', '김치', '무지개',
      '슬리퍼', '두부', '공룡', '선풍기', '해파리', '라면', '트럭', '수박', '장화',
      '냉장고', '해적', '도넛', '외계인', '지렁이', '바나나', '망치', '유령', '소방차',
      '낙타', '피자', '잠수함', '빨래', '미라', '코끼리', '호랑이', '크레인',
      '짬뽕', '좀비', '파인애플', '고래', '화산', '펭귄', '마늘',
      '드래곤', '빙수', '선인장', '헬리콥터', '문어', '치약', '비둘기', '젤리',
      '오징어', '번개', '솜사탕', '다이너마이트', '하마', '떡볶이',
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async textToSpeech(text: string): Promise<{ buffer: Buffer; mimeType: string }> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');

    const res = await fetch(
      `${this.apiBaseUrl}/models/${this.ttsModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `다음 문장을 감정을 담아 자연스럽게 읽어주세요: ${text}` }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: 'Kore',
                },
              },
            },
          },
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Gemini TTS 실패: ${res.status} ${errText}`);
    }

    const data = await res.json();
    const part = data.candidates?.[0]?.content?.parts?.[0];
    if (!part?.inlineData?.data) {
      throw new Error('Gemini TTS: 오디오 데이터 없음');
    }

    const pcmBase64 = part.inlineData.data;
    const pcmBuffer = Buffer.from(pcmBase64, 'base64');

    const wavBuffer = this.pcmToWav(pcmBuffer, 24000, 1, 16);
    return { buffer: wavBuffer, mimeType: 'audio/wav' };
  }

  private pcmToWav(pcmData: Buffer, sampleRate: number, channels: number, bitsPerSample: number): Buffer {
    const byteRate = sampleRate * channels * (bitsPerSample / 8);
    const blockAlign = channels * (bitsPerSample / 8);
    const dataSize = pcmData.length;
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

    return Buffer.concat([header, pcmData]);
  }

  async generateCharacterImage(
    name: string,
    emoji: string,
    description: string,
  ): Promise<{ base64: string; mimeType: string }> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');

    const prompt = `Create a cute Korean-style chibi character illustration for a voice acting battle game.
Character name: "${name}"
Character traits: ${description}
Symbol: ${emoji}

Requirements:
- Cute chibi/SD style (2-3 head proportions)
- Dynamic pose showing personality
- Vibrant colors matching the character's aura
- Clean white/transparent background
- No text or watermarks
- Game character portrait style
- Expressive face showing the character's personality`;

    const res = await fetch(
      `${this.apiBaseUrl}/models/${this.imageModel}:generateContent?key=${apiKey}`,
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
      throw new Error(`Gemini 이미지 생성 실패: ${res.status} ${errText}`);
    }

    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error('Gemini 이미지: 응답 파트 없음');
    }

    const imagePart = parts.find((p: any) => p.inlineData?.data);
    if (!imagePart) {
      throw new Error('Gemini 이미지: 이미지 데이터 없음');
    }

    return {
      base64: imagePart.inlineData.data,
      mimeType: imagePart.inlineData.mimeType || 'image/png',
    };
  }

  async judgeVoices(
    audio1Buffer: Buffer,
    audio1MimeType: string,
    audio2Buffer: Buffer,
    audio2MimeType: string,
    sentence: string,
  ): Promise<JudgmentResult> {
    const model = this.genAI.getGenerativeModel({ model: this.textModel });

    const prompt = `당신은 음성 연기 대회의 심사위원입니다.
두 참가자가 같은 문장을 읽었습니다.

문장: "${sentence}"

다음 기준으로 두 음성을 평가해주세요:
1. 감정이입 (얼마나 감정을 잘 담았는가)
2. 표현력 (억양, 강약, 리듬감)
3. 발음 정확도
4. 몰입감 (듣는 사람을 끌어들이는 힘)

반드시 아래 JSON 형식으로만 응답하세요:
{
  "player1_score": 0~100 사이 점수,
  "player2_score": 0~100 사이 점수,
  "winner": 1 또는 2,
  "reason": "판정 이유를 한국어로 2-3문장으로 설명",
  "player1_feedback": "플레이어 1에 대한 한줄 피드백",
  "player2_feedback": "플레이어 2에 대한 한줄 피드백"
}`;

    const audio1Data = {
      inlineData: {
        data: audio1Buffer.toString('base64'),
        mimeType: audio1MimeType || 'audio/webm',
      },
    };
    const audio2Data = {
      inlineData: {
        data: audio2Buffer.toString('base64'),
        mimeType: audio2MimeType || 'audio/webm',
      },
    };

    const result = await model.generateContent([prompt, audio1Data, audio2Data]);
    const responseText = result.response.text().trim();

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      return JSON.parse(jsonMatch[0]);
    } catch {
      return {
        player1_score: 50,
        player2_score: 50,
        winner: 1,
        reason: responseText,
        player1_feedback: '',
        player2_feedback: '',
      };
    }
  }
}
