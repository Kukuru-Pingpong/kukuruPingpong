'use client';

import { useGame } from '@/contexts/GameContext';
import { KoScreen } from '@/features/ko';

export default function KoPage() {
  const { p1Character, p2Character, koLoser, round, resetGame } = useGame();

  return (
    <KoScreen
      p1Character={p1Character}
      p2Character={p2Character}
      koLoser={koLoser}
      round={round}
      onRematch={resetGame}
    />
  );
}
