// PRD formula: ceil(1 + |scoreDiff| / 20), capped at 2
export function calculateDamage(winnerScore: number, loserScore: number): number {
  const scoreDiff = Math.abs(winnerScore - loserScore);
  return Math.min(2, Math.ceil(1 + scoreDiff / 20));
}
