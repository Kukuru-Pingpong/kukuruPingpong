export class BattleService {
  static calculateDamage(winnerScore: number, loserScore: number): number {
    // PRD formula: ceil(1 + |scoreDiff| / 20), capped at 2
    const scoreDiff = Math.abs(winnerScore - loserScore);
    return Math.min(2, Math.ceil(1 + scoreDiff / 20));
  }

  static isKo(hp: number): boolean {
    return hp <= 0;
  }
}
