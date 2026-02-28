'use client';

import { useState, useEffect } from 'react';
import { type Character } from '@/entities/character';
import { CharacterAvatar } from '@/widgets/character-avatar';

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
    <div className="ko-overlay">
      {phase === 'flash' && <div className="ko-flash" />}

      {(phase === 'ko-text' || phase === 'characters' || phase === 'info') && (
        <div className={`ko-text${shaking ? ' ko-shake' : ''}`}>
          KO!
        </div>
      )}

      {(phase === 'characters' || phase === 'info') && (
        <div className="ko-characters">
          <div className={`ko-char ${winner === 1 ? 'winner' : 'loser'}`}>
            <span className="ko-char-emoji">
              {p1Character && (
                <CharacterAvatar image={p1Character.image} emoji={p1Character.emoji} size={64} className="" />
              )}
            </span>
            <span className="ko-char-name" style={{ color: 'var(--p1-color)' }}>
              {p1Character?.name}
            </span>
            <span className={`ko-char-label ${winner === 1 ? 'win' : 'lose'}`}>
              {winner === 1 ? 'WIN!' : 'LOSE'}
            </span>
          </div>

          <div className={`ko-char ${winner === 2 ? 'winner' : 'loser'}`}>
            <span className="ko-char-emoji">
              {p2Character && (
                <CharacterAvatar image={p2Character.image} emoji={p2Character.emoji} size={64} className="" />
              )}
            </span>
            <span className="ko-char-name" style={{ color: 'var(--p2-color)' }}>
              {p2Character?.name}
            </span>
            <span className={`ko-char-label ${winner === 2 ? 'win' : 'lose'}`}>
              {winner === 2 ? 'WIN!' : 'LOSE'}
            </span>
          </div>
        </div>
      )}

      {phase === 'info' && (
        <div className="ko-info">
          <p className="ko-round-text">
            <strong>{round}라운드</strong> 만에 결판!
          </p>
          <button className="btn btn-primary btn-large" onClick={onRematch}>
            다시 도전하기
          </button>
        </div>
      )}
    </div>
  );
}
