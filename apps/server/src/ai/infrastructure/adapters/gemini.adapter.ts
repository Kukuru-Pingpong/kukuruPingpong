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
export class GeminiAdapter
  implements
    ISentenceGenerator,
    IVoiceJudge,
    ITextToSpeech,
    IWordGenerator,
    IImageGenerator
{
  private genAI: GoogleGenerativeAI;
  private apiBaseUrl: string;
  private textModel: string;
  private ttsModel: string;
  private imageModel: string;

  constructor(private config: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.config.get<string>('GEMINI_API_KEY'),
    );
    this.apiBaseUrl =
      this.config.get<string>('GEMINI_API_BASE_URL') ||
      'https://generativelanguage.googleapis.com/v1beta';
    this.textModel =
      this.config.get<string>('GEMINI_TEXT_MODEL') || 'gemini-3-flash-preview';
    this.ttsModel =
      this.config.get<string>('GEMINI_TTS_MODEL') ||
      'gemini-2.5-flash-preview-tts';
    this.imageModel =
      this.config.get<string>('GEMINI_IMAGE_MODEL') ||
      'gemini-3.1-flash-image-preview';
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
      '고양이',
      '우주',
      '치킨',
      '양말',
      '용암',
      '할머니',
      '로켓',
      '김치',
      '무지개',
      '슬리퍼',
      '두부',
      '공룡',
      '선풍기',
      '해파리',
      '라면',
      '트럭',
      '수박',
      '장화',
      '냉장고',
      '해적',
      '도넛',
      '외계인',
      '지렁이',
      '바나나',
      '망치',
      '유령',
      '소방차',
      '낙타',
      '피자',
      '잠수함',
      '빨래',
      '미라',
      '코끼리',
      '호랑이',
      '크레인',
      '짬뽕',
      '좀비',
      '파인애플',
      '고래',
      '화산',
      '펭귄',
      '마늘',
      '드래곤',
      '빙수',
      '선인장',
      '헬리콥터',
      '문어',
      '치약',
      '비둘기',
      '젤리',
      '오징어',
      '번개',
      '솜사탕',
      '다이너마이트',
      '하마',
      '떡볶이',
    ];
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async textToSpeech(
    text: string,
  ): Promise<{ buffer: Buffer; mimeType: string }> {
    const apiKey = this.config.get<string>('GEMINI_API_KEY');

    const res = await fetch(
      `${this.apiBaseUrl}/models/${this.ttsModel}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `다음 문장을 감정을 담아 자연스럽게 읽어주세요: ${text}`,
                },
              ],
            },
          ],
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

  private pcmToWav(
    pcmData: Buffer,
    sampleRate: number,
    channels: number,
    bitsPerSample: number,
  ): Buffer {
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

    const prompt = `당신은 음성 연기 대회의 전문 심사위원입니다.
두 참가자가 같은 문장을 읽었습니다.

문장: "${sentence}"

다음 4가지 기준으로 각 참가자를 0~100점으로 평가해주세요:
1. 어조/분위기 (Tone): 문장의 분위기와 어조를 얼마나 잘 표현했는가 (가중치 40%)
2. 감정이입 (Emotion): 감정을 얼마나 진실되게 담았는가 (가중치 30%)
3. 리듬/표현력 (Rhythm): 억양, 강약, 리듬감이 얼마나 좋은가 (가중치 20%)
4. 발음 (Pronunciation): 발음이 얼마나 정확한가 (가중치 10%)

총점 계산: (tone * 0.4) + (emotion * 0.3) + (rhythm * 0.2) + (pronunciation * 0.1)

**중요: 동점 방지 규칙**
- 두 플레이어의 총점이 소수점까지 같을 수 없습니다. 미세하게라도 차이를 두세요.
- 만약 총점이 매우 비슷하다면 다음 순서로 승자를 결정하세요:
  1. 감정이입(Emotion) 점수가 더 높은 쪽 승리
  2. 감정도 같다면 리듬(Rhythm) 점수가 더 높은 쪽 승리
  3. 모든 점수가 같다면 소수점 단위에서 차이를 만들어 승자를 정하세요.

반드시 아래 JSON 형식으로만 응답하세요:
{
  "player1_tone": 0~100 사이 숫자,
  "player1_emotion": 0~100 사이 숫자,
  "player1_rhythm": 0~100 사이 숫자,
  "player1_pronunciation": 0~100 사이 숫자,
  "player1_total": 계산된 총점,
  "player2_tone": 0~100 사이 숫자,
  "player2_emotion": 0~100 사이 숫자,
  "player2_rhythm": 0~100 사이 숫자,
  "player2_pronunciation": 0~100 사이 숫자,
  "player2_total": 계산된 총점,
  "winner": 1 또는 2,
  "reason": "판정 이유 (한국어 2-3문장)",
  "player1_feedback": "플레이어 1 피드백",
  "player2_feedback": "플레이어 2 피드백"
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

    const result = await model.generateContent([
      prompt,
      audio1Data,
      audio2Data,
    ]);
    const responseText = result.response.text().trim();

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch[0]);

      // Recalculate totals with precision
      parsed.player1_total = Number(
        (
          parsed.player1_tone * 0.4 +
          parsed.player1_emotion * 0.3 +
          parsed.player1_rhythm * 0.2 +
          parsed.player1_pronunciation * 0.1
        ).toFixed(2),
      );
      parsed.player2_total = Number(
        (
          parsed.player2_tone * 0.4 +
          parsed.player2_emotion * 0.3 +
          parsed.player2_rhythm * 0.2 +
          parsed.player2_pronunciation * 0.1
        ).toFixed(2),
      );

      // Enforce Tie-breaking logic
      if (parsed.player1_total > parsed.player2_total) {
        parsed.winner = 1;
      } else if (parsed.player2_total > parsed.player1_total) {
        parsed.winner = 2;
      } else {
        // Tie in total score, check Emotion
        if (parsed.player1_emotion > parsed.player2_emotion) {
          parsed.winner = 1;
        } else if (parsed.player2_emotion > parsed.player1_emotion) {
          parsed.winner = 2;
        } else {
          // Tie in Emotion, check Rhythm
          if (parsed.player1_rhythm > parsed.player2_rhythm) {
            parsed.winner = 1;
          } else if (parsed.player2_rhythm > parsed.player1_rhythm) {
            parsed.winner = 2;
          } else {
            // Absolute tie, default to 1 (should be rare)
            parsed.winner = 1;
          }
        }
      }

      // Legacy compatibility
      parsed.player1_score = Math.round(parsed.player1_total);
      parsed.player2_score = Math.round(parsed.player2_total);

      return parsed;
    } catch {
      const fallback = {
        player1_tone: 50,
        player1_emotion: 50,
        player1_rhythm: 50,
        player1_pronunciation: 50,
        player1_total: 50,
        player2_tone: 50,
        player2_emotion: 50,
        player2_rhythm: 50,
        player2_pronunciation: 50,
        player2_total: 50,
        player1_score: 50,
        player2_score: 50,
        winner: 1,
        reason: '판정 중 오류가 발생했습니다.',
        player1_feedback: '다시 시도해주세요.',
        player2_feedback: '다시 시도해주세요.',
      };
      return fallback;
    }
  }
}
