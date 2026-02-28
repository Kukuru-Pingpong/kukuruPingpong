import { MIN_DAMAGE } from '../model/constants';

export function calculateDamage(winnerScore: number, loserScore: number): number {
  const raw = winnerScore - loserScore;
  return Math.max(raw, MIN_DAMAGE);
}
