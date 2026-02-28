'use client';

import { OnlineLobbyScreen } from '@/features/online-lobby';
import { useGame } from '@/contexts/GameContext';

export default function OnlineLobbyPage() {
  const { resetGame, handleCreateRoom, handleJoinRoom } = useGame();

  return (
    <div className="app">
      <OnlineLobbyScreen
        onBack={resetGame}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
      />
    </div>
  );
}
