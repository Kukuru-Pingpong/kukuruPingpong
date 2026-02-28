export const SENTENCE_GENERATOR = Symbol('SENTENCE_GENERATOR');

export interface ISentenceGenerator {
  generateSentence(word: string, quote: string): Promise<string>;
}
