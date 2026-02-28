'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { startRecording, stopRecording, getStream } from '@/shared/audio';
import { AudioVisualizer } from '@/widgets/audio-visualizer';
import { type Character } from '@/entities/character';

interface RecordingScreenProps {
  sentence: string;
  quoteSource?: string;
  currentPlayer: number;
  mode: 'local' | 'online';
  onRecordingDone: (blob: Blob, playerNum: number) => void;
  p1Character?: Character | null;
  p2Character?: Character | null;
  p1Hp?: number;
  p2Hp?: number;
  round?: number;
}

export default function RecordingScreen({
  sentence,
  quoteSource,
  currentPlayer,
  mode,
  onRecordingDone,
  p1Character,
  p2Character,
  p1Hp,
  p2Hp,
  round,
}: RecordingScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState('00:00');
  const [status, setStatus] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopRec = useCallback(async () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    
    setIsRecording(false);
    const blob = await stopRecording();
    if (blob) {
      onRecordingDone(blob, currentPlayer);
      if (mode === 'online') {
        setStatus('RECORDING DONE! WAITING...');
      }
    }
  }, [currentPlayer, mode, onRecordingDone]);

  const startRec = useCallback(async () => {
    try {
      setStatus('');
      await startRecording((time) => {
        setTimer(time);
        if (time === '00:05') {
          stopRec();
        }
      });
      setIsRecording(true);
      setStream(getStream());
    } catch (err: any) {
      alert('MIC ACCESS NEEDED: ' + err.message);
    }
  }, [stopRec]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    startRec();
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRec();
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, []);

  const renderHearts = (hp: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <span key={i} style={{ fontSize: '1.2rem', color: i < hp ? 'var(--text-light)' : 'rgba(255, 255, 255, 0.2)' }}>
        {i < hp ? '♥' : '♡'}
      </span>
    ));
  };

  return (
    <div className="lobby-container">
      {/* Retro HUD */}
      <div style={{
        position: 'fixed',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 1001,
        color: 'var(--text-light)',
        background: 'var(--bg-card)',
        padding: '8px 16px',
        border: '4px solid var(--border)',
        boxShadow: '4px 4px 0px 0px var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>{p1Character?.emoji || '👤'}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.45rem' }}>{currentPlayer === 1 ? 'YOU' : 'P1'}</span>
            <div style={{ display: 'flex', gap: '2px' }}>{renderHearts(p1Hp ?? 3)}</div>
          </div>
        </div>
        
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>VS</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'right' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.45rem' }}>{currentPlayer === 2 ? 'YOU' : 'P2'}</span>
            <div style={{ display: 'flex', gap: '2px' }}>{renderHearts(p2Hp ?? 3)}</div>
          </div>
          <span style={{ fontSize: '1.5rem' }}>{p2Character?.emoji || '🤖'}</span>
        </div>
      </div>

      <main className="screen" style={{ paddingTop: '100px', flexDirection: 'column', gap: '20px' }}>
        {/* Timer Box */}
        <div className="retro-frame" style={{ margin: '0 auto', padding: '8px 16px', minWidth: '100px', textAlign: 'center' }}>
          <div className="retro-badge" style={{ fontSize: '0.4rem', position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)' }}>TIMER</div>
          <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-pixel)', letterSpacing: '2px' }}>{timer}</span>
        </div>

        {/* Quote Frame */}
        <div className="retro-frame-dark" style={{ width: '100%', maxWidth: '460px', margin: '0 auto', minHeight: '160px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="retro-badge-light" style={{ fontSize: '0.4rem' }}>
              SCENE {round ?? 1}: {quoteSource || 'UNKNOWN'}
            </div>
            <div style={{ fontSize: '0.4rem', color: 'var(--text-light)', opacity: 0.6 }}>RND {round ?? 1}</div>
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', lineHeight: '1.8', wordBreak: 'keep-all' }}>
              "{sentence || '문장을 불러오는 중...'}"
            </p>
          </div>

          <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', width: '100%' }}>
            <div style={{ 
              height: '100%', 
              background: 'var(--bg-medium)', 
              width: `${(parseInt(timer.split(':')[1]) / 5) * 100}%`,
              transition: 'width 0.1s linear'
            }} />
          </div>
        </div>

        {/* Waveform */}
        <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto', height: '60px' }}>
          <AudioVisualizer stream={stream} isActive={isRecording} />
        </div>

        {/* REC Button */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: isRecording ? '#ff0000' : 'var(--bg-card)',
              border: '6px solid var(--border)',
              boxShadow: isRecording ? '0 0 20px #ff0000' : '4px 4px 0px 0px var(--border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: isRecording ? '#fff' : 'var(--text-light)',
              transition: 'all 0.1s'
            }}
          >
            <div style={{ 
              width: '20px', 
              height: '20px', 
              background: isRecording ? '#fff' : '#ff0000', 
              borderRadius: isRecording ? '4px' : '50%',
              marginBottom: '4px'
            }} />
            <span style={{ fontSize: '0.6rem', fontFamily: 'var(--font-pixel)' }}>REC</span>
          </button>
          
          <div className="retro-badge" style={{ fontSize: '0.5rem', animation: isRecording ? 'none' : 'gb-blink 1s step-end infinite' }}>
            {isRecording ? 'RECORDING...' : 'HOLD TO RECORD'}
          </div>
        </div>

        {status && (
          <div style={{ textAlign: 'center', fontSize: '0.45rem', color: 'var(--text-secondary)' }}>
            {status}
          </div>
        )}
      </main>
    </div>
  );
}
