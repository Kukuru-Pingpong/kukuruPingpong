'use client';

import { useRef, useState } from 'react';
import { playBlob } from '@/shared/audio';

interface ListenScreenProps {
  sentence: string;
  recording1: Blob | null;
  recording2: Blob | null;
  onJudge: () => void;
  isLocalAi?: boolean;
}

export default function ListenScreen({
  sentence,
  recording1,
  recording2,
  onJudge,
  isLocalAi,
}: ListenScreenProps) {
  const audio1Ref = useRef<HTMLAudioElement>(null);
  const audio2Ref = useRef<HTMLAudioElement>(null);
  const [playing1, setPlaying1] = useState(false);
  const [playing2, setPlaying2] = useState(false);
  const [played1, setPlayed1] = useState(false);
  const [played2, setPlayed2] = useState(false);

  const handlePlay1 = async () => {
    if (!recording1 || !audio1Ref.current) return;
    setPlaying1(true);
    await playBlob(recording1, audio1Ref.current);
    setPlaying1(false);
    setPlayed1(true);
  };

  const handlePlay2 = async () => {
    if (!recording2 || !audio2Ref.current) return;
    setPlaying2(true);
    await playBlob(recording2, audio2Ref.current);
    setPlaying2(false);
    setPlayed2(true);
  };

  return (
    <div className="screen">
      <div className="container">
        <h2>서로의 목소리를 들어보세요!</h2>
        <div className="sentence-box small">{sentence}</div>

        <div className="listen-players">
          <div className="listen-card">
            <h3 className="player-label p1">{isLocalAi ? '나 (Player 1)' : 'Player 1'}</h3>
            <button
              className={`btn-play${playing1 ? ' playing' : ''}`}
              onClick={handlePlay1}
              disabled={!recording1 || playing1}
            >
              {playing1 ? '■ 재생 중...' : played1 ? '▶ 다시 듣기' : '▶ 재생'}
            </button>
            <audio ref={audio1Ref} />
          </div>

          <div className="vs-badge">VS</div>

          <div className="listen-card">
            <h3 className="player-label p2">{isLocalAi ? 'AI (Player 2)' : 'Player 2'}</h3>
            <button
              className={`btn-play${playing2 ? ' playing' : ''}`}
              onClick={handlePlay2}
              disabled={!recording2 || playing2}
            >
              {playing2 ? '■ 재생 중...' : played2 ? '▶ 다시 듣기' : '▶ 재생'}
            </button>
            <audio ref={audio2Ref} />
          </div>
        </div>

        <button className="btn btn-primary btn-large" onClick={onJudge}>
          ⚖️ AI 심판 판정!
        </button>
      </div>
    </div>
  );
}
