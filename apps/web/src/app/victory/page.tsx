'use client';

import { useGame } from '@/contexts/GameContext';
import { VictoryScreen } from '@/features/victory';

export default function VictoryPage() {
  const { p1Character, p2Character, koLoser, round, judgment, resetGame } = useGame();

  return (
    <VictoryScreen
      p1Character={p1Character}
      p2Character={p2Character}
      koLoser={koLoser}
      round={round}
      judgment={judgment}
      onRematch={resetGame}
    />
  );
}
