'use client';

import { useState } from 'react';

interface NicknamePopupProps {
  characterImage: string;
  onComplete: (nickname: string) => void;
}

export function NicknamePopup({ characterImage, onComplete }: NicknamePopupProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed.length < 2) {
      setError('Nickname must be at least 2 letters.');
      return;
    }
    localStorage.setItem('kukuru_nickname', trimmed);
    onComplete(trimmed);
  };

  return (
    <div className="np-overlay">
      <div className="np-popup">
        {/* Character preview */}
        <div className="np-preview">
          <img src={characterImage} alt="Selected character" className="np-preview-img" />
        </div>

        <h2 className="np-title">SET NICKNAME</h2>

        <div className="np-info">
          <p>Nickname must be at least 2 letters.</p>
          <p>Please follow the community guidelines.</p>
        </div>

        {error && <p className="np-error">{error}</p>}

        <input
          className="np-input"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError('');
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="_ _ _ _ _ _"
          maxLength={12}
          autoFocus
        />

        <button
          className="retro-button np-btn"
          onClick={handleSubmit}
          disabled={!input.trim()}
        >
          {'> START'}
        </button>
      </div>
    </div>
  );
}
