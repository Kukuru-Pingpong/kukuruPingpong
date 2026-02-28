export class Hp {
  private readonly value: number;

  constructor(value: number) {
    this.value = Math.max(0, Math.min(100, value));
  }

  static full(): Hp {
    return new Hp(100);
  }

  subtract(amount: number): Hp {
    return new Hp(this.value - amount);
  }

  isZero(): boolean {
    return this.value <= 0;
  }

  toNumber(): number {
    return this.value;
  }
}
