import { JudgmentResult } from '../value-objects/judgment-result.vo';

export const VOICE_JUDGE = Symbol('VOICE_JUDGE');

export interface IVoiceJudge {
  judgeVoices(
    audio1Buffer: Buffer,
    audio1MimeType: string,
    audio2Buffer: Buffer,
    audio2MimeType: string,
    sentence: string,
  ): Promise<JudgmentResult>;
}
