'use client';

import { useState, useCallback } from 'react';
import { startRecording, stopRecording, getStream } from '@/shared/audio';
import { AudioVisualizer } from '@/widgets/audio-visualizer';
import { type Character } from '@/entities/character';
import { CharacterAvatar } from '@/widgets/character-avatar';

interface RecordingScreenProps {
  sentence: string;
  quoteSource?: string;
  currentPlayer: number;
  mode: 'local' | 'online';
  onRecordingDone: (blob: Blob, playerNum: number) => void;
  p1Character?: Character | null;
  p2Character?: Character | null;
}

export default function RecordingScreen({
  sentence,
  quoteSource,
  currentPlayer,
  mode,
  onRecordingDone,
  p1Character,
  p2Character,
}: RecordingScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState('0:00');
  const [status, setStatus] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleToggleRecord = useCallback(async () => {
    if (!isRecording) {
      try {
        await startRecording((time) => setTimer(time));
        setIsRecording(true);
        setStream(getStream());
        setStatus('');
      } catch (err: any) {
        alert('마이크 접근이 필요합니다: ' + err.message);
      }
    } else {
      setIsRecording(false);
      const blob = await stopRecording();
      if (blob) {
        onRecordingDone(blob, currentPlayer);
        if (mode === 'online') {
          setStatus('녹음 완료! 상대방을 기다리는 중...');
        }
      }
    }
  }, [isRecording, currentPlayer, mode, onRecordingDone]);

  const currentChar = currentPlayer === 1 ? p1Character : p2Character;
  const pClass = currentPlayer === 1 ? 'p1' : 'p2';

  return (
    <div className="screen">
      <div className="container">
        {currentChar && (
          <div className="recording-avatar" style={{ borderColor: currentChar.auraColor }}>
            <CharacterAvatar
              image={currentChar.image}
              emoji={currentChar.emoji}
              size={56}
              className="recording-avatar-emoji"
            />
            <span className="recording-avatar-name" style={{ color: currentChar.auraColor }}>
              {currentChar.name}
            </span>
          </div>
        )}

        <h2>문장을 읽어주세요!</h2>
        <div className="sentence-box">
          {sentence || '문장을 불러오는 중...'}
          {quoteSource && <span className="quote-source">— {quoteSource}</span>}
        </div>

        <div>
          <p className="turn-label">
            {mode === 'local'
              ? '감정을 담아 읽어보세요!'
              : <><span className={`player-label ${pClass}`}>Player {currentPlayer}</span> 녹음하세요!</>
            }
          </p>

          <div style={{ marginBottom: 20 }}>
            <AudioVisualizer stream={stream} isActive={isRecording} />
          </div>

          <button
            className={`btn-record${isRecording ? ' recording' : ''}`}
            onClick={handleToggleRecord}
          >
            <span className="record-dot" />
            {isRecording ? '녹음 중지' : '녹음 시작'}
          </button>

          <p className="timer">{timer}</p>
          {status && <p className="status-text">{status}</p>}
        </div>
      </div>
    </div>
  );
}
