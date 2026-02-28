export const IMAGE_GENERATOR = Symbol('IMAGE_GENERATOR');

export interface IImageGenerator {
  generateCharacterImage(
    name: string,
    emoji: string,
    description: string,
  ): Promise<{ base64: string; mimeType: string }>;
}
