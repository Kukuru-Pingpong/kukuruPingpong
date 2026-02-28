'use client';

import { GameProvider, useGame } from '@/contexts/GameContext';
import { Loading } from '@/shared/ui';

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
    </GameProvider>
  );
}
