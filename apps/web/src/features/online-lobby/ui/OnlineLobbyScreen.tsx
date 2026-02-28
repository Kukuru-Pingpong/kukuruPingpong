'use client';

import { useState } from 'react';

interface OnlineLobbyScreenProps {
  onBack: () => void;
  onCreateRoom: () => Promise<string>;
  onJoinRoom: (code: string) => Promise<string | null>;
  nickname: string;
}

export default function OnlineLobbyScreen({
  onBack,
  onCreateRoom,
  onJoinRoom,
  nickname,
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
    <div className="lobby-container">
      {/* Retro Header */}
      <header className="retro-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={onBack}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'inherit', 
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '0 4px'
            }}
          >
            ←
          </button>
          <span style={{ fontSize: '1.2rem' }}>⚔️</span>
          <span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>PVP ARENA</span>
        </div>
        <div className="retro-badge">{nickname || 'PLAYER'}</div>
      </header>

      <main className="screen" style={{ paddingTop: '80px', flexDirection: 'column', gap: '24px' }}>
        <div className="retro-badge-light" style={{ margin: '0 auto' }}>
          MULTIPLAYER LOBBY
        </div>

        <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '8px' }}>CHOOSE YOUR PATH</h1>

        <div className="retro-badge" style={{ margin: '0 auto', fontSize: '0.6rem' }}>
          {'> HOST A BATTLE OR JOIN THE FRAY <'}
        </div>

        <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '460px', margin: '0 auto' }}>
          {/* CREATE ROOM Card */}
          <div className="retro-frame" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '180px' }}>
            <div style={{ fontSize: '2rem', textAlign: 'center' }}>👑</div>
            <h2 style={{ fontSize: '0.8rem', textAlign: 'center' }}>CREATE ROOM</h2>
            {!waiting ? (
              <>
                <div className="retro-badge" style={{ fontSize: '0.45rem', alignSelf: 'center' }}>BE THE KING</div>
                <button className="retro-button" onClick={handleCreate} style={{ width: '100%', marginTop: 'auto' }}>
                  {'> PRESS START <'}
                </button>
              </>
            ) : (
              <>
                <div className="retro-badge" style={{ fontSize: '0.45rem', alignSelf: 'center' }}>ROOM CODE</div>
                <div style={{ 
                  fontSize: '1.2rem', 
                  textAlign: 'center', 
                  fontWeight: 'bold', 
                  color: 'var(--text-primary)',
                  letterSpacing: '2px',
                  background: 'var(--bg-main)',
                  padding: '4px',
                  border: '2px solid var(--border)'
                }}>
                  {displayCode}
                </div>
                <p style={{ fontSize: '0.45rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  WAITING...
                </p>
              </>
            )}
          </div>

          {/* JOIN ROOM Card */}
          <div className="retro-frame" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '180px' }}>
            <div style={{ fontSize: '2rem', textAlign: 'center' }}>🔑</div>
            <h2 style={{ fontSize: '0.8rem', textAlign: 'center' }}>JOIN ROOM</h2>
            <div className="retro-badge" style={{ fontSize: '0.45rem', alignSelf: 'center' }}>ENTER CODE</div>
            <input 
              type="text" 
              placeholder="000000" 
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              style={{ 
                width: '100%',
                background: 'var(--bg-main)', 
                border: '2px solid var(--border)',
                borderRadius: '0px',
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                padding: '4px',
                textAlign: 'center'
              }}
            />
            <button className="retro-button" onClick={handleJoin} style={{ width: '100%', marginTop: 'auto' }}>
              {'> ENTER'}
            </button>
          </div>
        </div>

        {waiting && (
          <div className="retro-badge-light" style={{ margin: '0 auto', animation: 'gb-blink 1s step-end infinite' }}>
            WAITING FOR CHALLENGER...
          </div>
        )}

        <footer style={{ marginTop: 'auto', paddingBottom: '24px', textAlign: 'center', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.5rem', color: 'var(--text-secondary)' }}>
            <span>SERVER: ASIA-1</span>
            <span>PING: 24MS</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
