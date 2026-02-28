'use client';

import { LobbyScreen } from '@/features/lobby';
import { useGame } from '@/contexts/GameContext';

export default function LobbyPage() {
  const { handleLocal, handleOnline } = useGame();

  return (
    <div className="app">
      <LobbyScreen onLocal={handleLocal} onOnline={handleOnline} />
    </div>
  );
}
