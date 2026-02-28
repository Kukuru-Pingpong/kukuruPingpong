'use client';

import { useState, useEffect } from 'react';
import { type Character } from '@/entities/character';
import type { Judgment } from '@/shared/api';

interface VictoryScreenProps {
  p1Character: Character | null;
  p2Character: Character | null;
  koLoser: 1 | 2 | null;
  round: number;
  judgment: Judgment | null;
  onRematch: () => void;
  nickname: string;
  onGoHome: () => void;
}

function getRank(score: number): string {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

type VictoryPhase = 'banner' | 'character' | 'report' | 'full';

export default function VictoryScreen({
  p1Character,
  p2Character,
  koLoser,
  round,
  judgment,
  onRematch,
  nickname,
  onGoHome,
}: VictoryScreenProps) {
  const [phase, setPhase] = useState<VictoryPhase>('banner');

  const winner = koLoser === 1 ? 2 : 1;
  const winnerChar = winner === 1 ? p1Character : p2Character;

  const winnerTone = winner === 1 ? (judgment?.player1_tone ?? 0) : (judgment?.player2_tone ?? 0);
  const loserTone = winner === 1 ? (judgment?.player2_tone ?? 0) : (judgment?.player1_tone ?? 0);
  const winnerEmotion = winner === 1 ? (judgment?.player1_emotion ?? 0) : (judgment?.player2_emotion ?? 0);
  const loserEmotion = winner === 1 ? (judgment?.player2_emotion ?? 0) : (judgment?.player1_emotion ?? 0);
  const winnerRhythm = winner === 1 ? (judgment?.player1_rhythm ?? 0) : (judgment?.player2_rhythm ?? 0);
  const loserRhythm = winner === 1 ? (judgment?.player2_rhythm ?? 0) : (judgment?.player1_rhythm ?? 0);
  const winnerPronunciation = winner === 1 ? (judgment?.player1_pronunciation ?? 0) : (judgment?.player2_pronunciation ?? 0);
  const loserPronunciation = winner === 1 ? (judgment?.player2_pronunciation ?? 0) : (judgment?.player1_pronunciation ?? 0);

  const winnerTotal = winner === 1 ? (judgment?.player1_total ?? 0) : (judgment?.player2_total ?? 0);
  const totalScore = Math.round(winnerTotal * 38.5);
  const rank = getRank(winnerTotal);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('character'), 800);
    const t2 = setTimeout(() => setPhase('report'), 1600);
    const t3 = setTimeout(() => setPhase('full'), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const categories = [
    { label: 'TONE', winner: winnerTone, loser: loserTone },
    { label: 'EMOTION', winner: winnerEmotion, loser: loserEmotion },
    { label: 'RHYTHM', winner: winnerRhythm, loser: loserRhythm },
    { label: 'PRONUNCIATION', winner: winnerPronunciation, loser: loserPronunciation },
  ];

  return (
    <div className="lobby-container" style={{ background: 'var(--bg-main)', minHeight: '100vh' }}>
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

      <main className="screen" style={{ paddingTop: '80px', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        {/* VICTORY Banner */}
        <div style={{
          background: 'var(--bg-card)',
          border: '4px solid var(--border)',
          padding: '12px 48px',
          animation: 'koScaleUp 0.5s both',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            color: 'var(--text-light)',
            textAlign: 'center',
            letterSpacing: '6px',
            fontFamily: 'var(--font-pixel)',
          }}>
            VICTORY
          </h1>
        </div>

        <div style={{ fontSize: '0.6rem', textAlign: 'center', fontFamily: 'var(--font-pixel)' }}>
          FINISHED IN {round} ROUNDS
        </div>

        {/* Content: Character + Status Report */}
        {(phase === 'character' || phase === 'report' || phase === 'full') && (
          <div style={{
            display: 'flex',
            gap: '16px',
            width: '100%',
            maxWidth: '460px',
            animation: 'fadeSlideUp 0.4s both',
          }}>
            {/* Winner Character */}
            <div style={{ flex: '0 0 140px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div className="retro-frame" style={{ padding: '8px', position: 'relative' }}>
                <div className="retro-badge" style={{ position: 'absolute', top: '-10px', right: '-10px', fontSize: '0.4rem', padding: '2px 6px' }}>
                  WINNER
                </div>
                <img
                  src={winnerChar?.image}
                  alt={winnerChar?.name}
                  style={{ width: '120px', height: '120px', objectFit: 'cover', imageRendering: 'pixelated' }}
                />
              </div>
              <div style={{ fontSize: '0.5rem', fontFamily: 'var(--font-pixel)', textAlign: 'center' }}>
                PLAYER {winner}
              </div>
              <div style={{ fontSize: '0.4rem', opacity: 0.7 }}>{winnerChar?.name}</div>
            </div>

            {/* Status Report */}
            {(phase === 'report' || phase === 'full') && (
              <div style={{ flex: 1, animation: 'fadeSlideUp 0.4s both' }}>
                <div className="retro-frame-dark" style={{ padding: '12px' }}>
                  <div className="retro-badge" style={{ fontSize: '0.4rem', marginBottom: '12px', display: 'inline-block', padding: '2px 8px' }}>
                    STATUS REPORT
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.4rem', color: 'var(--text-light)' }}>
                    <span>YOU</span>
                    <span>VS</span>
                    <span>AI</span>
                  </div>

                  {categories.map(({ label, winner: w, loser: l }) => (
                    <div key={label} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.35rem', color: 'var(--text-light)', marginBottom: '4px' }}>
                        <span>{label}</span>
                        <span>{w}% {l}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px', height: '10px' }}>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                          <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: `${w}%`,
                            background: 'var(--bg-surface)',
                            transition: 'width 0.8s ease-out',
                          }} />
                        </div>
                        <div style={{ flex: 1, background: 'rgba(255,255,255,0.1)', position: 'relative' }}>
                          <div style={{
                            position: 'absolute', left: 0, top: 0, bottom: 0,
                            width: `${l}%`,
                            background: 'var(--accent)',
                            transition: 'width 0.8s ease-out',
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Total Score + Rank */}
        {phase === 'full' && (
          <div style={{ animation: 'fadeSlideUp 0.4s both', width: '100%', maxWidth: '460px' }}>
            <div className="retro-frame-dark" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
            }}>
              <div>
                <div style={{ fontSize: '0.35rem', color: 'var(--text-light)', marginBottom: '4px' }}>TOTAL SCORE</div>
                <div style={{ fontSize: '2rem', color: 'var(--text-light)', fontFamily: 'var(--font-pixel)' }}>
                  {totalScore.toLocaleString()}
                </div>
              </div>
              <div style={{
                fontSize: '0.4rem',
                color: 'var(--text-light)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ fontSize: '0.35rem', opacity: 0.6 }}>RANK</span>
                <div style={{
                  background: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  padding: '6px 10px',
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-pixel)',
                  border: '2px solid var(--border)',
                  fontWeight: 'bold',
                }}>
                  {rank}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button className="retro-button-light" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={onRematch}>
                REMATCH
              </button>
              <button className="retro-button" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => window.location.href = '/'}>
                EXIT TO LOBBY
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
