'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { quotes } from '@/entities/quote';
import { type Character } from '@/entities/character';
import { BattleHud } from '@/widgets/battle-hud';
import { startRecording, stopRecording, getStream, initAudio } from '@/shared/audio';
import { AudioVisualizer } from '@/widgets/audio-visualizer';

interface WordSelectScreenProps {
  mode: 'local' | 'online';
  playerNum?: number;
  sentence?: string;
  loading?: string;
  onQuoteReady?: (quote: { text: string; source: string }) => void;
  onRecordingComplete: (blob: Blob, quote: { text: string; source: string }) => void;
  p1Character?: Character | null;
  p2Character?: Character | null;
  p1Hp?: number;
  p2Hp?: number;
  round?: number;
  nickname: string;
}

type Phase = 'waiting' | 'ready' | 'countdown' | 'recording' | 'done';

export default function WordSelectScreen({
  mode,
  playerNum,
  sentence: externalSentence,
  loading,
  onQuoteReady,
  onRecordingComplete,
  p1Character,
  p2Character,
  p1Hp = 3,
  p2Hp = 3,
  round = 1,
  nickname,
}: WordSelectScreenProps) {
  const [phase, setPhase] = useState<Phase>('waiting');
  const [countdown, setCountdown] = useState(3);
  const [timer, setTimer] = useState('00:00');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const completedRef = useRef(false);
  const recordingStartedRef = useRef(false);

  const [quote] = useState(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  // Determine the displayed quote text
  const isOnlineP2 = mode === 'online' && playerNum === 2;
  const displayText = isOnlineP2 ? (externalSentence || '') : quote.text;
  const displaySource = isOnlineP2 ? '' : quote.source;

  // Request mic permission early
  useEffect(() => {
    initAudio().catch(() => {});
  }, []);

  // Phase: waiting → ready (after brief delay)
  useEffect(() => {
    if (phase !== 'waiting') return;

    if (isOnlineP2) {
      // P2 waits for sentence from socket
      if (externalSentence) {
        const t = setTimeout(() => setPhase('ready'), 500);
        return () => clearTimeout(t);
      }
    } else {
      // Local or Online P1: emit quote and start
      if (mode === 'online' && playerNum === 1) {
        onQuoteReady?.({ text: quote.text, source: quote.source });
      }
      const t = setTimeout(() => setPhase('ready'), 500);
      return () => clearTimeout(t);
    }
  }, [phase, isOnlineP2, externalSentence, mode, playerNum, quote, onQuoteReady]);

  // Phase: ready → countdown (after 1s showing the quote)
  useEffect(() => {
    if (phase !== 'ready') return;
    const t = setTimeout(() => setPhase('countdown'), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  // Phase: countdown 3...2...1
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      setPhase('recording');
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Phase: auto-start recording
  useEffect(() => {
    if (phase !== 'recording') return;
    if (recordingStartedRef.current) return;
    recordingStartedRef.current = true;

    let stopped = false;

    const doRecord = async () => {
      try {
        await startRecording((time) => {
          setTimer(time);
        });
        setStream(getStream());

        // Auto-stop after 5 seconds
        setTimeout(async () => {
          if (stopped) return;
          stopped = true;
          const blob = await stopRecording();
          if (blob && !completedRef.current) {
            completedRef.current = true;
            setPhase('done');
            const q = isOnlineP2
              ? { text: externalSentence || '', source: '' }
              : { text: quote.text, source: quote.source };
            onRecordingComplete(blob, q);
          }
        }, 5000);
      } catch (err: any) {
        alert('마이크 접근이 필요합니다: ' + err.message);
      }
    };

    doRecord();

    return () => {
      stopped = true;
    };
  }, [phase, quote, externalSentence, isOnlineP2, onRecordingComplete]);

  return (
    <div className="lobby-container">
      <header className="retro-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🎮</span>
          <span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>KUKURU PINGPONG</span>
        </div>
        <div className="retro-badge">{nickname || 'PLAYER'}</div>
      </header>

      <main className="screen" style={{ paddingTop: '80px', flexDirection: 'column', gap: '16px' }}>
        <BattleHud
          p1Character={p1Character ?? null}
          p2Character={p2Character ?? null}
          p1Hp={p1Hp}
          p2Hp={p2Hp}
          round={round}
        />

        <div className="retro-badge-light" style={{ margin: '0 auto' }}>
          VOICE BATTLE
        </div>

        {/* Quote Display */}
        <div
          className="retro-frame-dark"
          style={{
            width: '100%',
            maxWidth: '460px',
            margin: '0 auto',
            minHeight: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            textAlign: 'center',
          }}
        >
          {displaySource && (
            <div className="retro-badge-light" style={{ fontSize: '0.4rem', margin: '0 auto' }}>
              {displaySource}
            </div>
          )}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p style={{ fontSize: '0.9rem', lineHeight: '1.8', wordBreak: 'keep-all' }}>
              {displayText ? `"${displayText}"` : '명대사를 기다리는 중...'}
            </p>
          </div>
        </div>

        {/* Phase: Waiting for sentence (online P2) */}
        {phase === 'waiting' && isOnlineP2 && !externalSentence && (
          <div style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
            상대방이 명대사를 선택하는 중...
          </div>
        )}

        {/* Phase: Ready - show the quote */}
        {(phase === 'waiting' || phase === 'ready') && displayText && (
          <div style={{ textAlign: 'center', fontSize: '0.6rem', color: 'var(--text-secondary)' }}>
            이 명대사를 읽어주세요!
          </div>
        )}

        {/* Phase: Countdown */}
        {phase === 'countdown' && (
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: 'bold',
                animation: 'gb-blink 0.5s step-end infinite',
              }}
            >
              {countdown}
            </div>
            <div style={{ fontSize: '0.5rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              곧 녹음이 시작됩니다...
            </div>
          </div>
        )}

        {/* Phase: Recording */}
        {phase === 'recording' && (
          <>
            <div
              className="retro-frame"
              style={{
                margin: '0 auto',
                padding: '8px 16px',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                className="retro-badge"
                style={{
                  fontSize: '0.4rem',
                  background: '#ff0000',
                  color: '#fff',
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                }}
              >
                REC
              </div>
              <span
                style={{
                  fontSize: '1.2rem',
                  fontFamily: 'var(--font-pixel)',
                  letterSpacing: '2px',
                }}
              >
                {timer}
              </span>
            </div>

            <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto', height: '60px' }}>
              <AudioVisualizer stream={stream} isActive={true} />
            </div>

            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#ff0000',
                margin: '0 auto',
                animation: 'gb-blink 0.5s step-end infinite',
                boxShadow: '0 0 20px #ff0000',
              }}
            />
          </>
        )}

        {/* Phase: Done */}
        {phase === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <div className="retro-badge" style={{ fontSize: '0.6rem', margin: '0 auto' }}>
              RECORDING COMPLETE!
            </div>
            <div
              style={{
                fontSize: '0.45rem',
                color: 'var(--text-secondary)',
                marginTop: '8px',
              }}
            >
              {loading || 'AI가 분석 중...'}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
