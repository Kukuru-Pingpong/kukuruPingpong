'use client';

import { ListenScreen } from '@/features/listen';
import { useGame } from '@/contexts/GameContext';

export default function ListenPage() {
  const { sentence, recordings, mode, handleJudge } = useGame();

  return (
    <div className="app">
      <ListenScreen
        sentence={sentence}
        recording1={recordings[1]}
        recording2={recordings[2]}
        onJudge={handleJudge}
        isLocalAi={mode === 'local'}
      />
    </div>
  );
}
