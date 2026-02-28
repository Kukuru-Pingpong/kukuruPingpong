'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ResultScreen } from '@/features/result';
import { useGame } from '@/contexts/GameContext';

export default function ResultPage() {
  const router = useRouter();
  const { judgment, mode, resetGame, p1Character, p2Character, nickname } = useGame();

  useEffect(() => {
    if (!judgment) {
      router.push('/');
    }
  }, [judgment, router]);

  if (!judgment) {
    return null;
  }

  return (
    <div className="app">
      <ResultScreen
        judgment={judgment}
        onPlayAgain={resetGame}
        isLocalAi={mode === 'local'}
        p1Character={p1Character}
        p2Character={p2Character}
        nickname={nickname}
      />
    </div>
  );
}
