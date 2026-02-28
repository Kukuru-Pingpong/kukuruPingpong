const MIN_DAMAGE = 5;

export class BattleService {
  static calculateDamage(winnerScore: number, loserScore: number): number {
    const raw = winnerScore - loserScore;
    return Math.max(raw, MIN_DAMAGE);
  }

  static isKo(hp: number): boolean {
    return hp <= 0;
  }
}
