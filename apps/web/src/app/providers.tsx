'use client';

import { GameProvider, useGame } from '@/contexts/GameContext';
import { Loading } from '@/shared/ui';
import BgmPlayer from '@/shared/ui/BgmPlayer';

function LoadingOverlay() {
  const { loading } = useGame();
  if (!loading) return null;
  return <Loading text={loading} />;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
      {children}
      <LoadingOverlay />
      <BgmPlayer />
    </GameProvider>
  );
}
