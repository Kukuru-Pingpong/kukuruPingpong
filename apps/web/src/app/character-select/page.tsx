'use client';

import { useGame } from '@/contexts/GameContext';
import { CharacterSelectScreen } from '@/features/character-select';

export default function CharacterSelectPage() {
  const { mode, playerNum, p1Character, handleSelectCharacter, nickname } = useGame();
  return (
    <CharacterSelectScreen
      mode={mode}
      playerNum={playerNum}
      p1Character={p1Character}
      onSelect={handleSelectCharacter}
      nickname={nickname}
    />
  );
}
