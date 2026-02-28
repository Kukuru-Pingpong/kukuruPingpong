import { Injectable, Inject } from '@nestjs/common';
import { SENTENCE_GENERATOR, ISentenceGenerator } from '../../domain/services/sentence-generator.interface';
import { VOICE_JUDGE, IVoiceJudge } from '../../domain/services/voice-judge.interface';
import { TEXT_TO_SPEECH, ITextToSpeech } from '../../domain/services/text-to-speech.interface';
import { WORD_GENERATOR, IWordGenerator } from '../../domain/services/word-generator.interface';
import { IMAGE_GENERATOR, IImageGenerator } from '../../domain/services/image-generator.interface';
import { JudgmentResult } from '../../domain/value-objects/judgment-result.vo';

@Injectable()
export class AiService {
  constructor(
    @Inject(SENTENCE_GENERATOR) private readonly sentenceGenerator: ISentenceGenerator,
    @Inject(VOICE_JUDGE) private readonly voiceJudge: IVoiceJudge,
    @Inject(TEXT_TO_SPEECH) private readonly tts: ITextToSpeech,
    @Inject(WORD_GENERATOR) private readonly wordGenerator: IWordGenerator,
    @Inject(IMAGE_GENERATOR) private readonly imageGenerator: IImageGenerator,
  ) {}

  async generateSentence(word: string, quote: string): Promise<string> {
    return this.sentenceGenerator.generateSentence(word, quote);
  }

  generateAiWord(): string {
    return this.wordGenerator.generateAiWord();
  }

  async textToSpeech(text: string): Promise<{ buffer: Buffer; mimeType: string }> {
    return this.tts.textToSpeech(text);
  }

  async generateCharacterImage(
    name: string,
    emoji: string,
    description: string,
  ): Promise<{ base64: string; mimeType: string }> {
    return this.imageGenerator.generateCharacterImage(name, emoji, description);
  }

  async judgeVoices(
    audio1Buffer: Buffer,
    audio1MimeType: string,
    audio2Buffer: Buffer,
    audio2MimeType: string,
    sentence: string,
  ): Promise<JudgmentResult> {
    return this.voiceJudge.judgeVoices(audio1Buffer, audio1MimeType, audio2Buffer, audio2MimeType, sentence);
  }

  async judgeLocalBattle(
    originalBuffer: Buffer,
    originalMimeType: string,
    playerBuffer: Buffer,
    playerMimeType: string,
    sentence: string,
  ): Promise<JudgmentResult> {
    return this.voiceJudge.judgeVoices(originalBuffer, originalMimeType, playerBuffer, playerMimeType, sentence);
  }
}
