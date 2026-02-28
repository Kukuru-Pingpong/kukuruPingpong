'use client';

import { useEffect, useCallback } from 'react';

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  const handleInteraction = useCallback(() => {
    onStart();
  }, [onStart]);

  useEffect(() => {
    const handleKeyDown = () => handleInteraction();
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteraction]);

  return (
    <div className="title-screen" onClick={handleInteraction}>
      <div className="title-band">
        <h1 className="title-text">KUKURU PINGPONG</h1>
      </div>
      <p className="title-press">PRESS ANY BUTTON TO START...</p>
    </div>
  );
}
