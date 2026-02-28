'use client';

import { LobbyScreen } from '@/features/lobby';
import { useGame } from '@/contexts/GameContext';

export default function SelectModePage() {
  const { handleLocal, handleOnline, nickname, resetGame } = useGame();

  return (
    <LobbyScreen onLocal={handleLocal} onOnline={handleOnline} nickname={nickname} onReset={resetGame} />
  );
}
