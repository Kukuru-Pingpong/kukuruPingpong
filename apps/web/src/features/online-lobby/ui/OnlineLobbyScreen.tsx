'use client';

import { useState } from 'react';

interface OnlineLobbyScreenProps {
  onBack: () => void;
  onCreateRoom: () => Promise<string>;
  onJoinRoom: (code: string) => Promise<string | null>;
}

export default function OnlineLobbyScreen({
  onBack,
  onCreateRoom,
  onJoinRoom,
}: OnlineLobbyScreenProps) {
  const [displayCode, setDisplayCode] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const handleCreate = async () => {
    const code = await onCreateRoom();
    setDisplayCode(code);
    setWaiting(true);
  };

  const handleJoin = async () => {
    if (!joinCode.trim()) {
      alert('방 코드를 입력해주세요!');
      return;
    }
    const error = await onJoinRoom(joinCode.trim().toUpperCase());
    if (error) {
      alert(error);
    }
  };

  return (
    <div className="screen">
      <div className="container">
        <h2>온라인 대전</h2>
        <div className="online-options">
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={waiting}
          >
            방 만들기
          </button>
          <div className="divider">또는</div>
          <div className="join-form">
            <input
              type="text"
              placeholder="방 코드 입력"
              maxLength={6}
              className="input-field"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            />
            <button className="btn btn-secondary" onClick={handleJoin}>
              참가하기
            </button>
          </div>
        </div>

        {waiting && (
          <div className="room-info">
            <p>
              방 코드: <span className="room-code">{displayCode}</span>
            </p>
            <p className="waiting-text">
              상대방을 기다리는 중
              <span className="dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </p>
          </div>
        )}

        <button className="btn-back" onClick={onBack}>
          ← 돌아가기
        </button>
      </div>
    </div>
  );
}
