import { Hp } from '../value-objects/hp.vo';

export class Player {
  public characterId: number | null = null;
  public word: string | null = null;
  public audioData: string | null = null;
  public hp: Hp;

  constructor(
    public readonly socketId: string,
    public readonly playerNum: 1 | 2,
  ) {
    this.hp = Hp.full();
  }

  selectCharacter(characterId: number): void {
    this.characterId = characterId;
  }

  submitWord(word: string): void {
    this.word = word;
  }

  submitAudio(audioBase64: string): void {
    this.audioData = audioBase64;
  }

  applyDamage(amount: number): void {
    this.hp = this.hp.subtract(amount);
  }

  isKo(): boolean {
    return this.hp.isZero();
  }

  resetRound(): void {
    this.word = null;
    this.audioData = null;
  }
}
