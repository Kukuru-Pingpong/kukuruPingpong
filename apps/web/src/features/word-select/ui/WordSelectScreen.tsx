'use client';

import { useState } from 'react';
import { quotes } from '@/entities/quote';
import { type Character } from '@/entities/character';
import { BattleHud } from '@/widgets/battle-hud';

interface WordSelectScreenProps {
  mode: 'local' | 'online';
  playerNum?: number;
  opponentReady?: boolean;
  onSubmitLocal: (word: string, quote: { text: string; source: string }) => void;
  onSubmitOnline?: (word: string) => void;
  p1Character?: Character | null;
  p2Character?: Character | null;
  p1Hp?: number;
  p2Hp?: number;
  round?: number;
  nickname: string;
}

export default function WordSelectScreen({
  mode,
  playerNum,
  opponentReady,
  onSubmitLocal,
  onSubmitOnline,
  p1Character,
  p2Character,
  p1Hp = 3,
  p2Hp = 3,
  round = 1,
  nickname,
}: WordSelectScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [keyword1, setKeyword1] = useState<string | null>(null);
  const [keyword2, setKeyword2] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [quote1] = useState(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  const [quote2] = useState(() => {
    const others = quotes.filter((q) => q.source !== quote1.source);
    return others[Math.floor(Math.random() * others.length)];
  });

  const [onlineQuote] = useState(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  });
  const [onlinePick, setOnlinePick] = useState<string | null>(null);

  const handleNext = () => {
    if (!keyword1) return;
    setStep(2);
  };

  const handleSubmit = () => {
    if (mode === 'local') {
      if (!keyword1 || !keyword2) return;
      const useFirst = Math.random() < 0.5;
      const selectedQuote = useFirst ? quote1 : quote2;
      const selectedKeyword = useFirst ? keyword1 : keyword2;
      onSubmitLocal(selectedKeyword, { text: selectedQuote.text, source: selectedQuote.source });
      setSubmitted(true);
    } else {
      if (!onlinePick) {
        alert('키워드를 선택해주세요!');
        return;
      }
      onSubmitOnline?.(onlinePick);
      setSubmitted(true);
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

      <main className="screen" style={{ paddingTop: '80px', flexDirection: 'column', gap: '12px' }}>
        <BattleHud
          p1Character={p1Character ?? null}
          p2Character={p2Character ?? null}
          p1Hp={p1Hp}
          p2Hp={p2Hp}
          round={round}
        />

        <div className="retro-badge-light" style={{ margin: '0 auto' }}>
          KEYWORD SELECTION
        </div>

        <h1 style={{ fontSize: '1rem', textAlign: 'center', marginBottom: '8px' }}>
          {mode === 'local' 
            ? `PLAYER ${step} TURN` 
            : `PICK YOUR CLUE`
          }
        </h1>

        <div className="retro-frame" style={{ width: '100%', maxWidth: '460px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.5rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            CHOOSE A KEYWORD FROM THE WORK.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {((mode === 'local' ? (step === 1 ? quote1 : quote2) : onlineQuote).keywords).map((w) => {
              const isSelected = mode === 'local' ? (step === 1 ? keyword1 === w : keyword2 === w) : onlinePick === w;
              return (
                <button
                  key={w}
                  className={`retro-badge${isSelected ? '' : '-light'}`}
                  onClick={() => {
                    if (submitted) return;
                    if (mode === 'local') {
                      if (step === 1) setKeyword1(w);
                      else setKeyword2(w);
                    } else {
                      setOnlinePick(w);
                    }
                  }}
                  style={{ 
                    padding: '8px 12px', 
                    fontSize: '0.6rem',
                    cursor: submitted ? 'not-allowed' : 'pointer',
                    border: isSelected ? '2px solid var(--border)' : '1px solid var(--border)',
                    boxShadow: isSelected ? '0 0 8px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: '460px', margin: '0 auto', marginTop: '12px' }}>
          {mode === 'local' ? (
            <button
              className="retro-button"
              onClick={step === 1 ? handleNext : handleSubmit}
              disabled={step === 1 ? !keyword1 : !keyword2 || submitted}
              style={{ width: '100%' }}
            >
              {step === 1 ? '> NEXT PLAYER' : (submitted ? 'MIXING...' : '> START BATTLE')}
            </button>
          ) : (
            <>
              <button
                className="retro-button"
                onClick={handleSubmit}
                disabled={submitted || !onlinePick}
                style={{ width: '100%' }}
              >
                {submitted ? 'WAITING...' : '> START BATTLE'}
              </button>
              {submitted && (
                <div style={{ textAlign: 'center', fontSize: '0.45rem', marginTop: '12px', color: 'var(--text-secondary)' }}>
                  {opponentReady ? 'OPPONENT READY!' : 'WAITING FOR OPPONENT...'}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
