export class Hp {
  private readonly value: number;

  constructor(value: number) {
    this.value = Math.max(0, Math.min(3, value));
  }

  static full(): Hp {
    return new Hp(3);
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
