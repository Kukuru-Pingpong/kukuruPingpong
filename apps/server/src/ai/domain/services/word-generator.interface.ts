export const WORD_GENERATOR = Symbol('WORD_GENERATOR');

export interface IWordGenerator {
  generateAiWord(): string;
}
