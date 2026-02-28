'use client';

import type { Character } from '@/entities/character';

interface BattleHudProps {
  p1Character: Character | null;
  p2Character: Character | null;
  p1Hp: number;
  p2Hp: number;
  round: number;
}

export default function BattleHud({ p1Character, p2Character, p1Hp, p2Hp, round }: BattleHudProps) {
  if (!p1Character || !p2Character) return null;

  const renderHearts = (hp: number) => {
    return Array.from({ length: 3 }, (_, i) => (
      <span key={i} style={{ fontSize: '1.2rem', color: i < hp ? 'var(--text-light)' : 'rgba(255, 255, 255, 0.2)' }}>
        {i < hp ? '♥' : '♡'}
      </span>
    ));
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: 'var(--text-light)',
      background: 'var(--bg-card)',
      padding: '8px 16px',
      border: '4px solid var(--border)',
      boxShadow: '4px 4px 0px 0px var(--border)',
      marginBottom: '20px',
      width: '100%',
      maxWidth: '460px',
      margin: '0 auto 20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img src={p1Character.image} alt={p1Character.name} style={{ width: '36px', height: '36px', objectFit: 'cover', imageRendering: 'pixelated', borderRadius: '4px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '0.45rem' }}>P1: {p1Character.name}</span>
          <div style={{ display: 'flex', gap: '2px' }}>{renderHearts(p1Hp)}</div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '0.4rem', opacity: 0.6 }}>RND</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{round}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'right' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '0.45rem' }}>P2: {p2Character.name}</span>
          <div style={{ display: 'flex', gap: '2px' }}>{renderHearts(p2Hp)}</div>
        </div>
        <img src={p2Character.image} alt={p2Character.name} style={{ width: '36px', height: '36px', objectFit: 'cover', imageRendering: 'pixelated', borderRadius: '4px' }} />
      </div>
    </div>
  );
}
