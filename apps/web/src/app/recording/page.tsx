'use client';

import { RecordingScreen } from '@/features/recording';
import { useGame } from '@/contexts/GameContext';

export default function RecordingPage() {
  const {
    sentence,
    quoteSource,
    mode,
    playerNum,
    handleRecordingDone,
    p1Character,
    p2Character,
  } = useGame();

  return (
    <div className="app">
      <RecordingScreen
        sentence={sentence}
        quoteSource={quoteSource}
        currentPlayer={mode === 'local' ? 1 : playerNum}
        mode={mode}
        onRecordingDone={handleRecordingDone}
        p1Character={p1Character}
        p2Character={p2Character}
      />
    </div>
  );
}
