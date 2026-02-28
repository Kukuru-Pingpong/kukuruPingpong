'use client';

import { useRouter } from 'next/navigation';
import { TitleScreen } from '@/features/title';
import { LobbyScreen } from '@/features/lobby';
import { useGame } from '@/contexts/GameContext';

export default function HomePage() {
  const router = useRouter();
  const { handleLocal, handleOnline, nickname, nicknameLoaded, goHome } = useGame();

  if (!nicknameLoaded) return null;

  if (!nickname) {
    return <TitleScreen onStart={() => router.push('/avatar')} />;
  }

  return (
    <div className="app">
      <LobbyScreen
        onLocal={handleLocal}
        onOnline={handleOnline}
        nickname={nickname}
        onReset={goHome}
      />
    </div>
  );
}
