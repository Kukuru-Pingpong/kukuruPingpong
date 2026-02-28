'use client';

import { LobbyScreen } from '@/features/lobby';
import { NicknameScreen } from '@/features/nickname';
import { useGame } from '@/contexts/GameContext';

export default function LobbyPage() {
  const { handleLocal, handleOnline, nickname, setNickname } = useGame();

  if (!nickname) {
    return (
      <div className="app">
        <NicknameScreen onComplete={(name) => setNickname(name)} />
      </div>
    );
  }

  return (
    <div className="app">
      <LobbyScreen onLocal={handleLocal} onOnline={handleOnline} nickname={nickname} />
    </div>
  );
}
