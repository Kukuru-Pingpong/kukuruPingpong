'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { type Character, calculateDamage } from '@/entities/character';
import { BattleHud } from '@/widgets/battle-hud';
import { playBlob } from '@/shared/audio';
import type { Judgment } from '@/shared/api';

interface BattleScreenProps {
  p1Character: Character | null;
  p2Character: Character | null;
  p1Hp: number;
  p2Hp: number;
  round: number;
  judgment: Judgment | null;
  onBattleComplete: () => void;
  onJudge?: () => Promise<void>;
  mode: 'local' | 'online';
  playerNum?: number;
  recordings?: { 1: Blob | null; 2: Blob | null };
  sentence?: string;
  nickname: string;
}

type Phase = 'enter' | 'scores' | 'charge' | 'projectile' | 'hit' | 'hp' | 'done';

export default function BattleScreen({
  p1Character,
  p2Character,
  p1Hp,
  p2Hp,
  round,
  judgment,
  onBattleComplete,
  onJudge,
  mode,
  playerNum,
  recordings,
  sentence,
  nickname,
}: BattleScreenProps) {
  const [phase, setPhase] = useState<Phase>('enter');
  const [displayP1Score, setDisplayP1Score] = useState(0);
  const [displayP2Score, setDisplayP2Score] = useState(0);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [damage, setDamage] = useState(0);
  const [displayP1Hp, setDisplayP1Hp] = useState(p1Hp);
  const [displayP2Hp, setDisplayP2Hp] = useState(p2Hp);
  const [judging, setJudging] = useState(false);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio auto-play state
  const [nowPlaying, setNowPlaying] = useState<0 | 1 | 2>(0);
  const [autoPlayDone, setAutoPlayDone] = useState(false);
  const audio1Ref = useRef<HTMLAudioElement>(null);
  const audio2Ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!judgment && onJudge && !judging) {
      if (mode === 'local' || (mode === 'online' && playerNum === 1)) {
        setJudging(true);
        onJudge();
      }
    }
  }, [judgment, onJudge, mode, playerNum, judging]);

  const autoPlay = useCallback(async () => {
    if (!recordings?.[1] || !recordings?.[2]) return;
    if (!audio1Ref.current || !audio2Ref.current) return;

    setNowPlaying(1);
    try {
      await Promise.all([
        playBlob(recordings[1], audio1Ref.current),
        playBlob(recordings[2], audio2Ref.current),
      ]);
    } catch { /* ignore */ }

    setNowPlaying(0);
    setAutoPlayDone(true);
  }, [recordings]);

  useEffect(() => {
    if (!judgment && recordings?.[1] && recordings?.[2] && !autoPlayDone) {
      autoPlay();
    }
  }, [recordings, judgment, autoPlayDone, autoPlay]);

  useEffect(() => {
    if (judgment) {
      if (audio1Ref.current) {
        audio1Ref.current.pause();
        audio1Ref.current.currentTime = 0;
      }
      if (audio2Ref.current) {
        audio2Ref.current.pause();
        audio2Ref.current.currentTime = 0;
      }
      setNowPlaying(0);
    }
  }, [judgment]);

  useEffect(() => {
    if (!judgment) return;

    const w = judgment.winner as 1 | 2;
    const loser = w === 1 ? 2 : 1;
    const s1 = judgment.player1_total ?? judgment.player1_score ?? 0;
    const s2 = judgment.player2_total ?? judgment.player2_score ?? 0;
    
    const dmg = calculateDamage(
      w === 1 ? s1 : s2,
      loser === 1 ? s1 : s2,
    );

    setWinner(w);
    setDamage(dmg);
    setPhase('enter');

    phaseTimerRef.current = setTimeout(() => {
      setPhase('scores');
      animateScores(s1, s2);

      phaseTimerRef.current = setTimeout(() => {
        setPhase('charge');

        phaseTimerRef.current = setTimeout(() => {
          setPhase('projectile');

          phaseTimerRef.current = setTimeout(() => {
            setPhase('hit');

            phaseTimerRef.current = setTimeout(() => {
              setPhase('hp');
              if (loser === 1) {
                setDisplayP1Hp(Math.max(0, p1Hp - dmg));
              } else {
                setDisplayP2Hp(Math.max(0, p2Hp - dmg));
              }

              phaseTimerRef.current = setTimeout(() => {
                setPhase('done');

                phaseTimerRef.current = setTimeout(() => {
                  onBattleComplete();
                }, 2000);
              }, 500);
            }, 500);
          }, 500);
        }, 500);
      }, 1000);
    }, 500);

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [judgment]);

  const animateScores = (target1: number, target2: number) => {
    const duration = 800;
    const fps = 30;
    const frames = Math.ceil(duration / (1000 / fps));
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / frames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayP1Score(Math.round(target1 * eased));
      setDisplayP2Score(Math.round(target2 * eased));

      if (frame >= frames) {
        clearInterval(interval);
        setDisplayP1Score(target1);
        setDisplayP2Score(target2);
      }
    }, 1000 / fps);
  };

  const loser = winner === 1 ? 2 : 1;

  if (!judgment) {
    return (
      <div className="lobby-container">
        <header className="retro-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>🎮</span>
            <span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>KUKURU PINGPONG</span>
          </div>
          <div className="retro-badge">{nickname || 'PLAYER'}</div>
        </header>

        <main className="screen" style={{ paddingTop: '100px', flexDirection: 'column', gap: '24px' }}>
          {sentence && (
            <div className="retro-frame-dark" style={{ width: '100%', maxWidth: '460px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>"{sentence}"</p>
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '460px' }}>
            <div className={`retro-frame${nowPlaying === 1 ? '-dark' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '3rem' }}>{p1Character?.emoji}</span>
              <div className="retro-badge" style={{ fontSize: '0.45rem', marginTop: '8px' }}>P1</div>
              <audio ref={audio1Ref} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>VS</div>
            <div className={`retro-frame${nowPlaying === 1 ? '-dark' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
              <span style={{ fontSize: '3rem' }}>{p2Character?.emoji}</span>
              <div className="retro-badge" style={{ fontSize: '0.45rem', marginTop: '8px' }}>P2</div>
              <audio ref={audio2Ref} />
            </div>
          </div>

          <div className="retro-badge-light" style={{ margin: '0 auto', animation: 'gb-blink 1s step-end infinite' }}>
            AI JUDGING VOICES...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="lobby-container">
      <header className="retro-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🎮</span>
          <span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>KUKURU PINGPONG</span>
        </div>
        <div className="retro-badge">{nickname || 'PLAYER'}</div>
      </header>

      <main className="screen" style={{ paddingTop: '100px', flexDirection: 'column', gap: '20px' }}>
        <BattleHud
          p1Character={p1Character}
          p2Character={p2Character}
          p1Hp={displayP1Hp}
          p2Hp={displayP2Hp}
          round={round}
        />

        <div className="battle-arena" style={{ width: '100%', maxWidth: '460px', height: '300px', position: 'relative' }}>
          {/* Battle Characters */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            width: '100%',
            marginTop: '40px'
          }}>
            {/* P1 */}
            <div style={{ 
              textAlign: 'center',
              transform: phase === 'charge' && winner === 1 ? 'scale(1.2)' : 'none',
              transition: 'all 0.2s',
              opacity: phase === 'hit' && loser === 1 ? 0.5 : 1
            }}>
              <span style={{ fontSize: '4rem', filter: phase === 'charge' && winner === 1 ? 'drop-shadow(0 0 10px var(--border))' : 'none' }}>
                {p1Character?.emoji}
              </span>
              {(phase === 'hit' || phase === 'hp') && loser === 1 && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-40px', 
                  left: '20px', 
                  fontSize: '1.5rem', 
                  color: '#ff0000',
                  fontFamily: 'var(--font-pixel)',
                  animation: 'damageFloat 1s forwards'
                }}>-{damage}</div>
              )}
            </div>

            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', opacity: 0.3 }}>VS</div>

            {/* P2 */}
            <div style={{ 
              textAlign: 'center',
              transform: phase === 'charge' && winner === 2 ? 'scale(1.2)' : 'none',
              transition: 'all 0.2s',
              opacity: phase === 'hit' && loser === 2 ? 0.5 : 1
            }}>
              <span style={{ fontSize: '4rem', filter: phase === 'charge' && winner === 2 ? 'drop-shadow(0 0 10px var(--border))' : 'none' }}>
                {p2Character?.emoji}
              </span>
              {(phase === 'hit' || phase === 'hp') && loser === 2 && (
                <div style={{ 
                  position: 'absolute', 
                  top: '-40px', 
                  right: '20px', 
                  fontSize: '1.5rem', 
                  color: '#ff0000',
                  fontFamily: 'var(--font-pixel)',
                  animation: 'damageFloat 1s forwards'
                }}>-{damage}</div>
              )}
            </div>
          </div>

          {/* Projectile */}
          {phase === 'projectile' && winner && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: winner === 1 ? '20%' : '80%',
              fontSize: '2rem',
              animation: winner === 1 ? 'projectileFlyRight 0.5s forwards' : 'projectileFlyLeft 0.5s forwards'
            }}>
              ✨
            </div>
          )}

          {/* Scores */}
          {phase !== 'enter' && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around', 
              width: '100%', 
              marginTop: '40px',
              fontFamily: 'var(--font-pixel)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.5rem', marginBottom: '4px' }}>P1 SCORE</div>
                <div style={{ fontSize: '1.5rem' }}>{displayP1Score}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.5rem', marginBottom: '4px' }}>P2 SCORE</div>
                <div style={{ fontSize: '1.5rem' }}>{displayP2Score}</div>
              </div>
            </div>
          )}

          {/* Attack Line */}
          {phase === 'charge' && winner && (
            <div className="retro-frame" style={{ 
              position: 'absolute', 
              bottom: '0', 
              left: '50%', 
              transform: 'translateX(-50%)',
              width: '100%',
              fontSize: '0.6rem',
              textAlign: 'center'
            }}>
              &quot;{winner === 1 ? p1Character?.attackLine : p2Character?.attackLine}&quot;
            </div>
          )}

          {phase === 'done' && (
            <div className="retro-badge-light" style={{ 
              position: 'absolute', 
              bottom: '0', 
              left: '50%', 
              transform: 'translateX(-50%)',
              padding: '8px 16px'
            }}>
              ROUND COMPLETE!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
