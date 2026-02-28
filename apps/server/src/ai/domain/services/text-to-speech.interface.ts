export const TEXT_TO_SPEECH = Symbol('TEXT_TO_SPEECH');

export interface ITextToSpeech {
  textToSpeech(text: string): Promise<{ buffer: Buffer; mimeType: string }>;
}
