'use client';

import type { Character } from '@/entities/character';
import { CharacterAvatar } from '@/widgets/character-avatar';

interface BattleHudProps {
  p1Character: Character | null;
  p2Character: Character | null;
  p1Hp: number;
  p2Hp: number;
  round: number;
}

function hpBarClass(hp: number, player: 'p1' | 'p2') {
  let cls = `hp-bar ${player}`;
  if (hp <= 20) cls += ' critical';
  else if (hp <= 40) cls += ' low';
  return cls;
}

export default function BattleHud({ p1Character, p2Character, p1Hp, p2Hp, round }: BattleHudProps) {
  if (!p1Character || !p2Character) return null;

  return (
    <div className="battle-hud">
      <div className="hud-player">
        <div className="hud-info">
          <span className="hud-emoji">
            <CharacterAvatar image={p1Character.image} emoji={p1Character.emoji} size={28} className="" />
          </span>
          <span className="hud-name" style={{ color: 'var(--p1-color)' }}>{p1Character.name}</span>
        </div>
        <div className="hp-bar-container">
          <div className={hpBarClass(p1Hp, 'p1')} style={{ width: `${p1Hp}%` }} />
        </div>
        <span className="hud-hp-text">{p1Hp}/100</span>
      </div>

      <div className="hud-round">
        <span className="round-label">Round</span>
        <span className="round-number">{round}</span>
      </div>

      <div className="hud-player right">
        <div className="hud-info">
          <span className="hud-name" style={{ color: 'var(--p2-color)' }}>{p2Character.name}</span>
          <span className="hud-emoji">
            <CharacterAvatar image={p2Character.image} emoji={p2Character.emoji} size={28} className="" />
          </span>
        </div>
        <div className="hp-bar-container">
          <div className={hpBarClass(p2Hp, 'p2')} style={{ width: `${p2Hp}%` }} />
        </div>
        <span className="hud-hp-text">{p2Hp}/100</span>
      </div>
    </div>
  );
}
