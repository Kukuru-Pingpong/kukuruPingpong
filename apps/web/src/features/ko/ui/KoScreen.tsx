'use client';

import { useState, useEffect } from 'react';
import { type Character } from '@/entities/character';

interface KoScreenProps {
  p1Character: Character | null;
  p2Character: Character | null;
  koLoser: 1 | 2 | null;
  round: number;
  onRematch: () => void;
}

type KoPhase = 'flash' | 'ko-text' | 'characters' | 'info';

export default function KoScreen({
  p1Character,
  p2Character,
  koLoser,
  round,
  onRematch,
}: KoScreenProps) {
  const [phase, setPhase] = useState<KoPhase>('flash');
  const [shaking, setShaking] = useState(false);

  const winner = koLoser === 1 ? 2 : 1;

  useEffect(() => {
    const t1 = setTimeout(() => {
      setPhase('ko-text');
      setTimeout(() => setShaking(true), 300);
      setTimeout(() => setShaking(false), 600);
    }, 900);

    const t2 = setTimeout(() => {
      setPhase('characters');
    }, 1800);

    const t3 = setTimeout(() => {
      setPhase('info');
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <div className="lobby-container" style={{ background: 'var(--bg-card)', color: 'var(--text-light)', height: '100vh', position: 'fixed', inset: 0, zIndex: 2000 }}>
      {phase === 'flash' && (
        <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 2001, animation: 'koFlash 0.9s forwards' }} />
      )}

      <main className="screen" style={{ flexDirection: 'column', gap: '40px', justifyContent: 'center', alignItems: 'center' }}>
        {(phase === 'ko-text' || phase === 'characters' || phase === 'info') && (
          <h1 className={shaking ? 'ko-shake' : ''} style={{ 
            fontSize: '10rem',
            color: '#ff0000', 
            textAlign: 'center',
            letterSpacing: '8px',
            fontFamily: 'var(--font-pixel)',
            animation: 'koScaleUp 0.5s forwards'
          }}>
            K.O.
          </h1>
        )}

        {(phase === 'characters' || phase === 'info') && (
          <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', width: '100%' }}>
            <div style={{ 
              textAlign: 'center', 
              opacity: winner === 1 ? 1 : 0.3, 
              transform: winner === 1 ? 'scale(1.2)' : 'scale(0.8) rotate(15deg)',
              transition: 'all 0.5s'
            }}>
              <div className="retro-frame" style={{ padding: '8px', background: winner === 1 ? 'var(--bg-surface)' : 'var(--bg-card)' }}>
                <img src={p1Character?.image} alt={p1Character?.name} style={{ width: '80px', height: '80px', objectFit: 'cover', imageRendering: 'pixelated' }} />
              </div>
              <div className="retro-badge" style={{ marginTop: '12px' }}>{winner === 1 ? 'WINNER' : 'LOSER'}</div>
            </div>

            <div style={{ 
              textAlign: 'center', 
              opacity: winner === 2 ? 1 : 0.3, 
              transform: winner === 2 ? 'scale(1.2)' : 'scale(0.8) rotate(-15deg)',
              transition: 'all 0.5s'
            }}>
              <div className="retro-frame" style={{ padding: '8px', background: winner === 2 ? 'var(--bg-surface)' : 'var(--bg-card)' }}>
                <img src={p2Character?.image} alt={p2Character?.name} style={{ width: '80px', height: '80px', objectFit: 'cover', imageRendering: 'pixelated' }} />
              </div>
              <div className="retro-badge" style={{ marginTop: '12px' }}>{winner === 2 ? 'WINNER' : 'LOSER'}</div>
            </div>
          </div>
        )}

        {phase === 'info' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
            <div className="retro-badge-light" style={{ padding: '8px 16px' }}>
              FINISHED IN {round} ROUNDS
            </div>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button className="retro-button-light" onClick={onRematch}>
                {'> REMATCH'}
              </button>
              <button className="retro-button" onClick={() => window.location.href = '/'}>
                {'> EXIT'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
