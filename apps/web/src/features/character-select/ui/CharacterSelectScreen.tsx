'use client';

import { useState, useEffect, useRef } from 'react';
import { characters, type Character } from '@/entities/character';
import { CharacterAvatar } from '@/widgets/character-avatar';

interface CharacterSelectScreenProps {
  mode: 'local' | 'online';
  playerNum?: number;
  p1Character: Character | null;
  onSelect: (character: Character, player: 1 | 2) => void;
  nickname: string;
  onGoHome: () => void;
}

export default function CharacterSelectScreen({
  mode,
  playerNum,
  p1Character,
  onSelect,
  nickname,
  onGoHome,
}: CharacterSelectScreenProps) {
  const [selected, setSelected] = useState<Character | null>(null);
  const [cpuSelecting, setCpuSelecting] = useState(false);
  const [cpuHighlight, setCpuHighlight] = useState<number | null>(null);
  const cpuTimerRef = useRef<NodeJS.Timeout | null>(null);

  const isP2Turn = mode === 'local' && p1Character !== null;
  const currentSelectingPlayer =
    mode === 'local' ? (isP2Turn ? 2 : 1) : (playerNum as 1 | 2);

  // CPU 자동 캐릭터 선택
  useEffect(() => {
    if (mode === 'local' && isP2Turn && !cpuSelecting) {
      setCpuSelecting(true);

      const available = characters.filter((c) => c.id !== p1Character?.id);
      let tick = 0;
      const totalTicks = 8;

      // 랜덤하게 캐릭터를 하이라이트하는 애니메이션
      cpuTimerRef.current = setInterval(() => {
        const randomChar =
          available[Math.floor(Math.random() * available.length)];
        setCpuHighlight(randomChar.id);
        tick++;

        if (tick >= totalTicks) {
          if (cpuTimerRef.current) clearInterval(cpuTimerRef.current);
          // 최종 선택
          const finalChoice =
            available[Math.floor(Math.random() * available.length)];
          setCpuHighlight(finalChoice.id);
          setTimeout(() => {
            onSelect(finalChoice, 2);
          }, 500);
        }
      }, 250);
    }

    return () => {
      if (cpuTimerRef.current) clearInterval(cpuTimerRef.current);
    };
  }, [isP2Turn]);

  const handleCardClick = (char: Character) => {
    if (cpuSelecting) return;
    if (isP2Turn && p1Character && char.id === p1Character.id) return;
    setSelected(char);
  };

  const handleConfirm = () => {
    if (!selected || cpuSelecting) return;
    onSelect(selected, currentSelectingPlayer);
    if (mode === 'local' && !isP2Turn) {
      setSelected(null);
    }
  };

  return (
    <div className="lobby-container">
      {/* Header */}
      <header className="lobby-header">
        <div className="lobby-header-left">
          <span className="lobby-header-title">KUKURU PINGPONG</span>
        </div>
        <div className="lobby-header-right">
          <div className="lobby-nickname-badge">
            nickname: {nickname || 'PLAYER'}
          </div>
          <button className="lobby-reset-btn" onClick={onGoHome}>
            Go To Home
          </button>
        </div>
      </header>

      <main
        className="screen"
        style={{
          paddingTop: '80px',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        {cpuSelecting ? (
          <>
            <div
              className="retro-badge-light"
              style={{
                margin: '0 auto',
                fontSize: '0.5rem',
                animation: 'gb-blink 1s step-end infinite',
              }}
            >
              상대방이 선택하는 중입니다...
            </div>

            <div
              className="retro-frame"
              style={{
                width: '100%',
                maxWidth: '460px',
                margin: '0 auto',
                padding: '8px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  gap: '6px',
                }}
              >
                {characters.map((char) => {
                  const isLocked = p1Character?.id === char.id;
                  const isHighlighted = cpuHighlight === char.id;

                  return (
                    <div
                      key={char.id}
                      className={`retro-frame${isHighlighted ? '-dark' : ''}`}
                      style={{
                        padding: '4px',
                        opacity: isLocked ? 0.3 : 1,
                        aspectRatio: '1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: isHighlighted
                          ? '4px solid var(--border)'
                          : '2px solid var(--border)',
                        boxShadow: isHighlighted
                          ? '0 0 10px var(--border)'
                          : 'none',
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <img
                        src={char.image}
                        alt={char.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          imageRendering: 'pixelated',
                        }}
                      />
                      {isLocked && (
                        <div
                          className="retro-badge"
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            fontSize: '0.3rem',
                            padding: '1px 2px',
                          }}
                        >
                          P1
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="retro-badge-light" style={{ margin: '0 auto' }}>
              PLAYER {currentSelectingPlayer} SELECTION
            </div>

            <h1
              style={{
                fontSize: '1.2rem',
                textAlign: 'center',
                marginBottom: '8px',
                width: '100%',
              }}
            >
              CHOOSE YOUR FIGHTER
            </h1>

            <div
              className="retro-frame"
              style={{
                width: '100%',
                maxWidth: '460px',
                margin: '0 auto',
                padding: '8px',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gridTemplateRows: 'repeat(2, 1fr)',
                  gap: '6px',
                }}
              >
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
                        border: isSelected
                          ? '4px solid var(--border)'
                          : '2px solid var(--border)',
                        boxShadow: isSelected
                          ? '0 0 10px var(--border)'
                          : 'none',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      <img
                        src={char.image}
                        alt={char.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          imageRendering: 'pixelated',
                        }}
                      />
                      {isLocked && (
                        <div
                          className="retro-badge"
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            fontSize: '0.3rem',
                            padding: '1px 2px',
                          }}
                        >
                          P1
                        </div>
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
                {selected ? `> CONFIRM ${selected.name}` : 'SELECT A FIGHTER'}
              </button>
            </div>

            {mode === 'online' && !selected && (
              <div
                className="retro-badge-light"
                style={{
                  margin: '0 auto',
                  fontSize: '0.45rem',
                  animation: 'gb-blink 1s step-end infinite',
                }}
              >
                WAITING FOR OPPONENT...
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
