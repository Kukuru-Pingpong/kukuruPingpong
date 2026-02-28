import { Module } from '@nestjs/common';
import { AiService } from './application/services/ai.service';
import { AiController } from './infrastructure/controllers/ai.controller';
import { GeminiAdapter } from './infrastructure/adapters/gemini.adapter';
import { SENTENCE_GENERATOR } from './domain/services/sentence-generator.interface';
import { VOICE_JUDGE } from './domain/services/voice-judge.interface';
import { TEXT_TO_SPEECH } from './domain/services/text-to-speech.interface';
import { WORD_GENERATOR } from './domain/services/word-generator.interface';
import { IMAGE_GENERATOR } from './domain/services/image-generator.interface';

@Module({
  providers: [
    AiService,
    GeminiAdapter,
    { provide: SENTENCE_GENERATOR, useExisting: GeminiAdapter },
    { provide: VOICE_JUDGE, useExisting: GeminiAdapter },
    { provide: TEXT_TO_SPEECH, useExisting: GeminiAdapter },
    { provide: WORD_GENERATOR, useExisting: GeminiAdapter },
    { provide: IMAGE_GENERATOR, useExisting: GeminiAdapter },
  ],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
