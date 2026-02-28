import {
  Controller,
  Post,
  Body,
  Res,
  UploadedFiles,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { AiService } from '../../application/services/ai.service';

@Controller('api')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-sentence')
  async generateSentence(@Body() body: { word1: string; quote?: string }) {
    const { word1 } = body;
    if (!word1) {
      throw new HttpException('단어를 입력해주세요.', HttpStatus.BAD_REQUEST);
    }

    try {
      const quote = body.quote || '';
      console.log('[generate-sentence]', { word: word1, quote: quote.substring(0, 30) });

      const sentence = await this.aiService.generateSentence(word1, quote);
      return { sentence };
    } catch (err) {
      console.error('[generate-sentence] 에러:', err);
      throw new HttpException(
        { error: '문장 생성 실패: ' + (err?.message || err) },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('ai-word')
  async aiWord() {
    try {
      const word = this.aiService.generateAiWord();
      return { word };
    } catch (err) {
      console.error('[ai-word] 에러:', err);
      throw new HttpException(
        { error: 'AI 단어 생성 실패' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('tts')
  async tts(@Body() body: { text: string }, @Res() res: Response) {
    if (!body.text) {
      return res.status(400).json({ error: '텍스트가 필요합니다.' });
    }
    try {
      const { buffer, mimeType } = await this.aiService.textToSpeech(body.text);
      res.set({
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
      });
      res.send(buffer);
    } catch (err) {
      console.error('[tts] 에러:', err);
      res.status(500).json({ error: 'TTS 생성 실패: ' + (err?.message || err) });
    }
  }

  @Post('generate-character-image')
  async generateCharacterImage(
    @Body() body: { name: string; emoji: string; description: string },
    @Res() res: Response,
  ) {
    const { name, emoji, description } = body;
    if (!name || !description) {
      return res.status(400).json({ error: '캐릭터 이름과 설명이 필요합니다.' });
    }

    try {
      console.log('[generate-character-image]', { name });
      const { base64, mimeType } = await this.aiService.generateCharacterImage(name, emoji, description);
      const buffer = Buffer.from(base64, 'base64');
      res.set({
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'public, max-age=86400',
      });
      res.send(buffer);
    } catch (err) {
      console.error('[generate-character-image] 에러:', err);
      res.status(500).json({ error: '이미지 생성 실패: ' + (err?.message || err) });
    }
  }

  @Post('judge')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'audio1', maxCount: 1 },
      { name: 'audio2', maxCount: 1 },
    ]),
  )
  async judge(
    @UploadedFiles()
    files: { audio1?: Express.Multer.File[]; audio2?: Express.Multer.File[] },
    @Body() body: { sentence: string },
  ) {
    const audio1 = files.audio1?.[0];
    const audio2 = files.audio2?.[0];

    if (!audio1 || !audio2 || !body.sentence) {
      throw new HttpException('두 음성 파일과 문장이 필요합니다.', HttpStatus.BAD_REQUEST);
    }

    try {
      const judgment = await this.aiService.judgeVoices(
        audio1.buffer,
        audio1.mimetype,
        audio2.buffer,
        audio2.mimetype,
        body.sentence,
      );
      return judgment;
    } catch (err) {
      console.error('[judge] 에러:', err);
      throw new HttpException(
        { error: '판정 실패: ' + (err?.message || err) },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
