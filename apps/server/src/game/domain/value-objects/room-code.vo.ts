export class RoomCode {
  private constructor(private readonly value: string) {}

  static generate(): RoomCode {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return new RoomCode(code);
  }

  static from(code: string): RoomCode {
    if (!code || code.length !== 6) {
      throw new Error('유효하지 않은 방 코드입니다.');
    }
    return new RoomCode(code.toUpperCase());
  }

  toString(): string {
    return this.value;
  }
}
