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
  lastWinner?: 1 | 2 | null;
  onGoHome: () => void;
}

type Phase =
  | 'enter'
  | 'scores'
  | 'charge'
  | 'projectile'
  | 'hit'
  | 'hp'
  | 'done';

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
  lastWinner,
  onGoHome,
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
  const seAudioRef = useRef<HTMLAudioElement | null>(null);

  // 히트 효과음 재생
  useEffect(() => {
    if (phase === 'hit' && winner) {
      const isCombo = lastWinner === winner;
      const src = isCombo ? '/se/combo.wav' : '/se/hit.wav';
      if (!seAudioRef.current) {
        seAudioRef.current = new Audio();
      }
      seAudioRef.current.src = src;
      seAudioRef.current.play().catch(() => {});
    }
  }, [phase, winner, lastWinner]);

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
    } catch {
      /* ignore */
    }

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

    const dmg = calculateDamage(w === 1 ? s1 : s2, loser === 1 ? s1 : s2);

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
            paddingTop: '100px',
            flexDirection: 'column',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          {sentence && (
            <div
              className="retro-frame-dark"
              style={{ width: '100%', maxWidth: '460px', textAlign: 'center' }}
            >
              <p style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
                "{sentence}"
              </p>
            </div>
          )}

          <div
            style={{
              display: 'flex',
              gap: '16px',
              width: '100%',
              maxWidth: '460px',
            }}
          >
            <div
              className={`retro-frame${nowPlaying === 1 ? '-dark' : ''}`}
              style={{ flex: 1, textAlign: 'center' }}
            >
              <img
                src={p1Character?.image}
                alt={p1Character?.name}
                style={{
                  width: '64px',
                  height: '64px',
                  objectFit: 'cover',
                  imageRendering: 'pixelated',
                }}
              />
              <div
                className="retro-badge"
                style={{ fontSize: '0.45rem', marginTop: '8px' }}
              >
                P1
              </div>
              <audio ref={audio1Ref} />
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
              }}
            >
              VS
            </div>
            <div
              className={`retro-frame${nowPlaying === 1 ? '-dark' : ''}`}
              style={{ flex: 1, textAlign: 'center' }}
            >
              <img
                src={p2Character?.image}
                alt={p2Character?.name}
                style={{
                  width: '64px',
                  height: '64px',
                  objectFit: 'cover',
                  imageRendering: 'pixelated',
                }}
              />
              <div
                className="retro-badge"
                style={{ fontSize: '0.45rem', marginTop: '8px' }}
              >
                P2
              </div>
              <audio ref={audio2Ref} />
            </div>
          </div>

          <div
            className="retro-badge-light"
            style={{
              margin: '0 auto',
              animation: 'gb-blink 1s step-end infinite',
            }}
          >
            AI JUDGING VOICES...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="lobby-container">
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
          paddingTop: '100px',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center',
        }}
      >
        <BattleHud
          p1Character={p1Character}
          p2Character={p2Character}
          p1Hp={displayP1Hp}
          p2Hp={displayP2Hp}
          round={round}
        />

        <div
          className="battle-arena"
          style={{
            width: '100%',
            maxWidth: '460px',
            height: '300px',
            position: 'relative',
            animation: phase === 'hit' ? 'hitShake 0.4s ease-in-out' : 'none',
          }}
        >
          {/* Hit flash overlay */}
          {phase === 'hit' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#fff',
                zIndex: 10,
                animation: 'hitFlash 0.4s forwards',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Battle Characters */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginTop: '40px',
            }}
          >
            {/* P1 */}
            <div
              style={{
                textAlign: 'center',
                position: 'relative',
                transform:
                  phase === 'charge' && winner === 1 ? 'scale(1.2)' : 'none',
                transition: 'all 0.2s',
                animation:
                  phase === 'hit' && loser === 1
                    ? 'hitRecoilLeft 0.4s ease-out'
                    : 'none',
                opacity: phase === 'hit' && loser === 1 ? 0.5 : 1,
              }}
            >
              <img
                src={p1Character?.image}
                alt={p1Character?.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  imageRendering: 'pixelated',
                  filter:
                    phase === 'charge' && winner === 1
                      ? 'drop-shadow(0 0 10px var(--border))'
                      : 'none',
                }}
              />
              {(phase === 'hit' || phase === 'hp') && loser === 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1.5rem',
                    color: '#ff0000',
                    fontFamily: 'var(--font-pixel)',
                    animation: 'damageFloat 1s forwards',
                    zIndex: 20,
                  }}
                >
                  -{damage}
                </div>
              )}
            </div>

            <div
              style={{ fontSize: '1.5rem', fontWeight: 'bold', opacity: 0.3 }}
            >
              VS
            </div>

            {/* P2 */}
            <div
              style={{
                textAlign: 'center',
                position: 'relative',
                transform:
                  phase === 'charge' && winner === 2 ? 'scale(1.2)' : 'none',
                transition: 'all 0.2s',
                animation:
                  phase === 'hit' && loser === 2
                    ? 'hitRecoil 0.4s ease-out'
                    : 'none',
                opacity: phase === 'hit' && loser === 2 ? 0.5 : 1,
              }}
            >
              <img
                src={p2Character?.image}
                alt={p2Character?.name}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  imageRendering: 'pixelated',
                  filter:
                    phase === 'charge' && winner === 2
                      ? 'drop-shadow(0 0 10px var(--border))'
                      : 'none',
                }}
              />
              {(phase === 'hit' || phase === 'hp') && loser === 2 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '1.5rem',
                    color: '#ff0000',
                    fontFamily: 'var(--font-pixel)',
                    animation: 'damageFloat 1s forwards',
                    zIndex: 20,
                  }}
                >
                  -{damage}
                </div>
              )}
            </div>
          </div>

          {/* Impact burst on hit */}
          {phase === 'hit' && winner && (
            <>
              {/* Center burst */}
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: loser === 1 ? '15%' : '85%',
                  width: '60px',
                  height: '60px',
                  background:
                    'radial-gradient(circle, #fff 0%, #ffaa00 40%, transparent 70%)',
                  borderRadius: '50%',
                  animation: 'impactBurst 0.4s ease-out forwards',
                  zIndex: 15,
                  pointerEvents: 'none',
                }}
              />
              {/* Shockwave ring */}
              <div
                style={{
                  position: 'absolute',
                  top: '40%',
                  left: loser === 1 ? '15%' : '85%',
                  width: '40px',
                  height: '40px',
                  border: '4px solid #ffaa00',
                  borderRadius: '50%',
                  animation: 'impactRing 0.5s ease-out forwards',
                  zIndex: 15,
                  pointerEvents: 'none',
                }}
              />
              {/* Sparks */}
              {[0, 1, 2, 3, 4, 5].map((i) => {
                const angle = i * 60 * (Math.PI / 180);
                const dist = 40 + Math.random() * 20;
                const tx = Math.cos(angle) * dist;
                const ty = Math.sin(angle) * dist;
                return (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: loser === 1 ? '15%' : '85%',
                      width: '6px',
                      height: '6px',
                      background: i % 2 === 0 ? '#fff' : '#ffaa00',
                      borderRadius: '50%',
                      animation: `sparkOut 0.4s ease-out forwards`,
                      animationDelay: `${i * 30}ms`,
                      transform: `translate(${tx}px, ${ty}px)`,
                      zIndex: 16,
                      pointerEvents: 'none',
                    }}
                  />
                );
              })}
            </>
          )}

          {/* Projectile */}
          {phase === 'projectile' && winner && (
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: winner === 1 ? '20%' : '80%',
                fontSize: '2rem',
                animation:
                  winner === 1
                    ? 'projectileFlyRight 0.5s forwards'
                    : 'projectileFlyLeft 0.5s forwards',
              }}
            >
              ✨
            </div>
          )}

          {/* Scores */}
          {phase !== 'enter' && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
                marginTop: '40px',
                fontFamily: 'var(--font-pixel)',
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.5rem', marginBottom: '4px' }}>
                  P1 SCORE
                </div>
                <div style={{ fontSize: '1.5rem' }}>{displayP1Score}</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.5rem', marginBottom: '4px' }}>
                  P2 SCORE
                </div>
                <div style={{ fontSize: '1.5rem' }}>{displayP2Score}</div>
              </div>
            </div>
          )}

          {/* Attack Line */}
          {phase === 'charge' && winner && (
            <div
              className="retro-frame"
              style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100%',
                fontSize: '0.6rem',
                textAlign: 'center',
              }}
            >
              &quot;
              {winner === 1 ? p1Character?.attackLine : p2Character?.attackLine}
              &quot;
            </div>
          )}

          {phase === 'done' && (
            <div
              className="retro-badge-light"
              style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 16px',
              }}
            >
              ROUND COMPLETE!
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
