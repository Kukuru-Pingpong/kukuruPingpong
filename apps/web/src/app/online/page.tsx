'use client';

import { OnlineLobbyScreen } from '@/features/online-lobby';
import { useGame } from '@/contexts/GameContext';

export default function OnlineLobbyPage() {
  const { resetGame, handleCreateRoom, handleJoinRoom, nickname } = useGame();

  return (
    <div style={{ background: '#8bac6d', minHeight: '100vh' }}>
      <OnlineLobbyScreen
        onBack={resetGame}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        nickname={nickname}
      />
    </div>
  );
}
