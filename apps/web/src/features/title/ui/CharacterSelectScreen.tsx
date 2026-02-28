'use client';

import { useState } from 'react';

const CHARACTERS = [
  { id: 'robot', name: 'CYBORG', image: '/characters/robot.png' },
  { id: 'soldier', name: 'SOLDIER', image: '/characters/soldier.png' },
];

interface CharacterSelectScreenProps {
  onSelect: (characterId: string) => void;
}

export function CharacterSelectScreen({ onSelect }: CharacterSelectScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="title-screen">
      <div className="cs-container">
        <h2 className="cs-title">SELECT CHARACTER</h2>

        <div className="cs-grid">
          {CHARACTERS.map((char) => (
            <div
              key={char.id}
              className={`cs-card ${selected === char.id ? 'cs-card-selected' : ''}`}
              onClick={() => setSelected(char.id)}
            >
              <div className="cs-portrait">
                <img src={char.image} alt={char.name} className="cs-image" />
              </div>
              <p className="cs-name">{char.name}</p>
            </div>
          ))}
        </div>

        <button
          className="retro-button cs-confirm"
          disabled={!selected}
          onClick={() => selected && onSelect(selected)}
        >
          {'> CONFIRM'}
        </button>
      </div>
    </div>
  );
}
