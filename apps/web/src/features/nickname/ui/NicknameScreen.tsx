'use client';

import { useState } from 'react';

interface NicknameScreenProps {
  onComplete: (nickname: string) => void;
}

export default function NicknameScreen({ onComplete }: NicknameScreenProps) {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    localStorage.setItem('kukuru_nickname', trimmed);
    onComplete(trimmed);
  };

  return (
    <div className="nickname-screen">
      <div className="nickname-card">
        <h1 className="nickname-title">KUKURU PINGPONG</h1>
        <p className="nickname-subtitle">명대사 배틀</p>
        <div className="nickname-form">
          <label className="nickname-label">ENTER YOUR NAME</label>
          <input
            className="nickname-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="PLAYER NAME"
            maxLength={12}
            autoFocus
          />
          <button
            className="nickname-btn"
            onClick={handleSubmit}
            disabled={!input.trim()}
          >
            START GAME ▶
          </button>
        </div>
      </div>
    </div>
  );
}
