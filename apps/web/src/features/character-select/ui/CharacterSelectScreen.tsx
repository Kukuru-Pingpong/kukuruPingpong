'use client';

import { useState } from 'react';
import { characters, type Character } from '@/entities/character';
import { CharacterAvatar } from '@/widgets/character-avatar';

interface CharacterSelectScreenProps {
  mode: 'local' | 'online';
  playerNum?: number;
  p1Character: Character | null;
  onSelect: (character: Character, player: 1 | 2) => void;
  nickname: string;
}

export default function CharacterSelectScreen({
  mode,
  playerNum,
  p1Character,
  onSelect,
  nickname,
}: CharacterSelectScreenProps) {
  const [selected, setSelected] = useState<Character | null>(null);

  const isP2Turn = mode === 'local' && p1Character !== null;
  const currentSelectingPlayer = mode === 'local' ? (isP2Turn ? 2 : 1) : (playerNum as 1 | 2);

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
    <div className="lobby-container">
      {/* Retro Header */}
      <header className="retro-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🎮</span>
          <span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>KUKURU PINGPONG</span>
        </div>
        <div className="retro-badge">{nickname || 'PLAYER'}</div>
      </header>

      <main className="screen" style={{ paddingTop: '80px', flexDirection: 'column', gap: '20px' }}>
        <div className="retro-badge-light" style={{ margin: '0 auto' }}>
          PLAYER {currentSelectingPlayer} SELECTION
        </div>

        <h1 style={{ fontSize: '1.2rem', textAlign: 'center', marginBottom: '8px' }}>CHOOSE YOUR FIGHTER</h1>

        <div className="retro-frame" style={{ width: '100%', maxWidth: '460px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {characters.map((char) => {
              const isLocked = isP2Turn && p1Character?.id === char.id;
              const isSelected = selected?.id === char.id;

              return (
                <button
                  key={char.id}
                  className={`retro-frame${isSelected ? '-dark' : ''}`}
                  onClick={() => handleCardClick(char)}
                  disabled={isLocked}
                  style={{ 
                    padding: '4px',
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    opacity: isLocked ? 0.3 : 1,
                    aspectRatio: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: isSelected ? '4px solid var(--border)' : '2px solid var(--border)',
                    boxShadow: isSelected ? '0 0 10px var(--border)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{char.emoji}</span>
                  {isLocked && (
                    <div className="retro-badge" style={{ position: 'absolute', bottom: '2px', fontSize: '0.3rem', padding: '1px 2px' }}>P1</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '460px', margin: '0 auto' }}>
          <button
            className="retro-button"
            onClick={handleConfirm}
            disabled={!selected}
            style={{ width: '100%', display: 'flex', gap: '8px' }}
          >
            {selected ? (
              <>
                <span>{selected.emoji}</span>
                <span>CONFIRM {selected.name}</span>
              </>
            ) : 'SELECT A FIGHTER'}
          </button>
        </div>

        {mode === 'online' && !selected && (
          <div className="retro-badge-light" style={{ margin: '0 auto', fontSize: '0.45rem', animation: 'gb-blink 1s step-end infinite' }}>
            WAITING FOR OPPONENT...
          </div>
        )}
      </main>
    </div>
  );
}
