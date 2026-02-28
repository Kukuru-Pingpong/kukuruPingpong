'use client';

import { useState } from 'react';
import { characters, type Character } from '@/entities/character';
import { CharacterAvatar } from '@/widgets/character-avatar';

interface CharacterSelectScreenProps {
  mode: 'local' | 'online';
  playerNum?: number;
  p1Character: Character | null;
  onSelect: (character: Character, player: 1 | 2) => void;
}

export default function CharacterSelectScreen({
  mode,
  playerNum,
  p1Character,
  onSelect,
}: CharacterSelectScreenProps) {
  const [selected, setSelected] = useState<Character | null>(null);

  const isP2Turn = mode === 'local' && p1Character !== null;
  const currentSelectingPlayer = mode === 'local' ? (isP2Turn ? 2 : 1) : (playerNum as 1 | 2);
  const pClass = currentSelectingPlayer === 1 ? 'p1' : 'p2';

  const handleCardClick = (char: Character) => {
    if (isP2Turn && p1Character && char.id === p1Character.id) return;
    setSelected(char);
  };

  const handleConfirm = () => {
    if (!selected) return;
    onSelect(selected, currentSelectingPlayer);
    if (mode === 'local' && !isP2Turn) {
      setSelected(null);
    }
  };

  return (
    <div className="char-select-screen">
      <div className="char-select-header">
        <span className={`player-label ${pClass}`}>
          Player {currentSelectingPlayer}
        </span>
        {' '}캐릭터 선택
      </div>

      <div className="char-grid">
        {characters.map((char) => {
          const isLocked = isP2Turn && p1Character?.id === char.id;
          const isSelected = selected?.id === char.id;

          return (
            <button
              key={char.id}
              className={`char-card${isSelected ? ' selected' : ''}${isLocked ? ' locked disabled' : ''}`}
              onClick={() => handleCardClick(char)}
              disabled={isLocked}
              style={isSelected ? { borderColor: char.auraColor, boxShadow: `0 0 20px ${char.auraColor}40` } : undefined}
            >
              <CharacterAvatar
                image={char.image}
                emoji={char.emoji}
                name={char.name}
                size={999}
                className="char-emoji"
              />
              {isLocked && (
                <span style={{
                  position: 'absolute',
                  bottom: 2,
                  left: 0,
                  right: 0,
                  fontSize: '0.6rem',
                  color: 'var(--accent)',
                }}>
                  P1 선택됨
                </span>
              )}
            </button>
          );
        })}
      </div>

      <button
        className="btn btn-primary btn-large char-confirm"
        onClick={handleConfirm}
        disabled={!selected}
      >
        {selected ? (
          <>
            <CharacterAvatar
              image={selected.image}
              emoji={selected.emoji}
              size={28}
              className=""
            />
            {' '}{selected.name} 선택!
          </>
        ) : '캐릭터를 골라주세요'}
      </button>
    </div>
  );
}
