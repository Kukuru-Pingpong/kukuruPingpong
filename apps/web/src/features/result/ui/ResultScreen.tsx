'use client';

import { useEffect, useState } from 'react';
import type { Judgment } from '@/shared/api';
import { type Character } from '@/entities/character';

interface ResultScreenProps {
  judgment: Judgment;
  onPlayAgain: () => void;
  isLocalAi?: boolean;
  p1Character?: Character | null;
  p2Character?: Character | null;
  nickname?: string;
  onGoHome: () => void;
}

function getRank(score: number): string {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

function DualCategoryBar({
  label,
  p1Value,
  p2Value,
}: {
  label: string;
  p1Value: number;
  p2Value: number;
}) {
  const [v1, setV1] = useState(0);
  const [v2, setV2] = useState(0);

  useEffect(() => {
    let cur1 = 0;
    let cur2 = 0;
    const interval = setInterval(() => {
      cur1 = Math.min(cur1 + 2, p1Value);
      cur2 = Math.min(cur2 + 2, p2Value);
      setV1(cur1);
      setV2(cur2);
      if (cur1 >= p1Value && cur2 >= p2Value) clearInterval(interval);
    }, 20);
    return () => clearInterval(interval);
  }, [p1Value, p2Value]);

  return (
    <div style={{ marginBottom: '8px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.4rem',
          marginBottom: '2px',
          color: 'var(--text-secondary)',
        }}
      >
        <span>{label}</span>
      </div>
      <div style={{ display: 'flex', height: '10px', gap: '2px' }}>
        <div
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: `${v1}%`,
              height: '100%',
              background: 'var(--text-primary)',
            }}
          />
        </div>
        <div
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'flex-start',
          }}
        >
          <div
            style={{
              width: `${v2}%`,
              height: '100%',
              background: 'var(--text-primary)',
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.4rem',
          marginTop: '2px',
        }}
      >
        <span>{v1}%</span>
        <span>{v2}%</span>
      </div>
    </div>
  );
}

export default function ResultScreen({
  judgment,
  onPlayAgain,
  isLocalAi,
  p1Character,
  p2Character,
  nickname,
  onGoHome,
}: ResultScreenProps) {
  const isWinner = judgment.winner === 1;
  const p1Total = judgment.player1_total ?? 0;
  const p2Total = judgment.player2_total ?? 0;

  const displayScore = Math.round(p1Total * 50);
  const rank = getRank(p1Total);
  const winnerChar = judgment.winner === 1 ? p1Character : p2Character;
  const feedback =
    judgment.winner === 1
      ? judgment.player1_feedback
      : judgment.player2_feedback;

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
        style={{ paddingTop: '80px', flexDirection: 'column', gap: '24px' }}
      >
        {/* Victory/Defeat Banner */}
        <div
          className="retro-frame"
          style={{
            width: '100%',
            maxWidth: '460px',
            margin: '0 auto',
            textAlign: 'center',
            background: isWinner ? 'var(--bg-surface)' : 'var(--bg-card)',
            color: isWinner ? 'var(--text-primary)' : 'var(--text-light)',
            animation: 'gb-blink 1s step-end infinite',
          }}
        >
          <h1 style={{ fontSize: '2rem', letterSpacing: '4px' }}>
            {judgment.winner === 0
              ? 'DRAW!'
              : isWinner
                ? 'VICTORY!'
                : 'DEFEAT!'}
          </h1>
          <div style={{ fontSize: '0.5rem', marginTop: '4px' }}>
            NEW RECORD!
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            width: '100%',
            maxWidth: '460px',
            margin: '0 auto',
          }}
        >
          {/* Winner Display */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <div
              className="retro-frame"
              style={{
                width: '100%',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                className="retro-badge"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                WINNER
              </div>
              <span style={{ fontSize: '4rem' }}>
                {winnerChar?.emoji || '👤'}
              </span>
            </div>

            <div
              className="retro-frame"
              style={{
                width: '100%',
                background: 'var(--bg-main)',
                fontSize: '0.45rem',
                padding: '8px',
                minHeight: '60px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '10px',
                  fontSize: '1rem',
                  color: 'var(--border)',
                }}
              >
                💬
              </div>
              {feedback || judgment.reason}
            </div>

            <div style={{ fontSize: '0.6rem', textAlign: 'center' }}>
              PLAYER {judgment.winner === 0 ? '1&2' : judgment.winner}
              <div
                style={{ fontSize: '0.45rem', color: 'var(--text-secondary)' }}
              >
                {judgment.winner === 1
                  ? nickname || 'STARLORD'
                  : isLocalAi
                    ? 'AI CPU'
                    : 'OPPONENT'}
              </div>
            </div>
          </div>

          {/* Status Report */}
          <div
            className="retro-frame"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            <div
              className="retro-badge-light"
              style={{
                fontSize: '0.4rem',
                position: 'absolute',
                top: '-8px',
                left: '10px',
              }}
            >
              STATUS REPORT
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.35rem',
                color: 'var(--text-secondary)',
                marginBottom: '4px',
              }}
            >
              <span>YOU</span>
              <span>CPU/OPP</span>
            </div>

            <DualCategoryBar
              label="TONE"
              p1Value={judgment.player1_tone}
              p2Value={judgment.player2_tone}
            />
            <DualCategoryBar
              label="EMOTION"
              p1Value={judgment.player1_emotion}
              p2Value={judgment.player2_emotion}
            />
            <DualCategoryBar
              label="RHYTHM"
              p1Value={judgment.player1_rhythm}
              p2Value={judgment.player2_rhythm}
            />
            <DualCategoryBar
              label="PRONUNC"
              p1Value={judgment.player1_pronunciation}
              p2Value={judgment.player2_pronunciation}
            />

            <div
              style={{
                marginTop: 'auto',
                borderTop: '2px dashed var(--border)',
                paddingTop: '8px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: '0.4rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    TOTAL SCORE
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    {displayScore}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '0.4rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    RANK
                  </div>
                  <div
                    style={{
                      fontSize: '1.2rem',
                      fontWeight: 'bold',
                      border: '2px solid var(--border)',
                      padding: '2px 8px',
                      background: 'var(--bg-card)',
                      color: 'var(--text-light)',
                    }}
                  >
                    {rank}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            width: '100%',
            maxWidth: '460px',
            margin: '0 auto',
          }}
        >
          <button
            className="retro-button-light"
            onClick={onPlayAgain}
            style={{ flex: 1 }}
          >
            {'> REMATCH'}
          </button>
          <button
            className="retro-button"
            onClick={() => (window.location.href = '/')}
            style={{ flex: 1 }}
          >
            {'> EXIT TO LOBBY'}
          </button>
        </div>
      </main>
    </div>
  );
}
