'use client';

import { useState } from 'react';
import { TitleScreen, CharacterSelectScreen, NicknamePopup } from '@/features/title';
import { LobbyScreen } from '@/features/lobby';
import { useGame } from '@/contexts/GameContext';

type Phase = 'title' | 'character' | 'nickname' | 'lobby';

const CHARACTER_IMAGES: Record<string, string> = {
  robot: '/characters/robot.png',
  soldier: '/characters/soldier.png',
};

export default function LobbyPage() {
  const { handleLocal, handleOnline, nickname, setNickname } = useGame();
  const [phase, setPhase] = useState<Phase>('title');
  const [selectedChar, setSelectedChar] = useState<string>('');

  if (phase === 'title') {
    return <TitleScreen onStart={() => setPhase('character')} />;
  }

  if (phase === 'character') {
    return (
      <CharacterSelectScreen
        onSelect={(charId) => {
          setSelectedChar(charId);
          if (nickname) {
            setPhase('lobby');
          } else {
            setPhase('nickname');
          }
        }}
      />
    );
  }

  if (phase === 'nickname') {
    return (
      <div className="title-screen">
        <NicknamePopup
          characterImage={CHARACTER_IMAGES[selectedChar] || '/characters/robot.png'}
          onComplete={(name) => {
            setNickname(name);
            setPhase('lobby');
          }}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <LobbyScreen onLocal={handleLocal} onOnline={handleOnline} nickname={nickname} />
    </div>
  );
}
