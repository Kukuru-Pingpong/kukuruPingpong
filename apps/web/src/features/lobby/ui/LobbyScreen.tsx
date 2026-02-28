'use client';

interface LobbyScreenProps {
  onLocal: () => void;
  onOnline: () => void;
  nickname: string;
}

export default function LobbyScreen({ onLocal, onOnline, nickname }: LobbyScreenProps) {
  return (
    <div className="lobby-container">
      {/* Retro Header */}
      <header className="retro-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>🎮</span>
          <span style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>KUKURU PINGPONG</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="retro-badge">{nickname || 'PLAYER'}</div>
          <span style={{ cursor: 'pointer' }}>⚙️</span>
        </div>
      </header>

      <main className="screen" style={{ paddingTop: '80px', flexDirection: 'column', gap: '24px' }}>
        <div className="retro-badge-light" style={{ margin: '0 auto' }}>
          INSERT COIN TO START
        </div>

        <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: '8px' }}>SELECT MODE</h1>

        <div className="retro-badge" style={{ margin: '0 auto', fontSize: '0.6rem' }}>
          {'> IMITATE LINES. BECOME LEGEND. <'}
        </div>

        <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '460px', margin: '0 auto' }}>
          {/* VS CPU Card */}
          <div className="retro-frame" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '2rem', textAlign: 'center' }}>🤖</div>
            <h2 style={{ fontSize: '0.8rem', textAlign: 'center' }}>VS CPU</h2>
            <p style={{ fontSize: '0.5rem', textAlign: 'center', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              TRAINING MODE. TEST YOUR SKILL.
            </p>
            <button className="retro-button" onClick={onLocal} style={{ width: '100%', marginTop: 'auto' }}>
              {'> START'}
            </button>
          </div>

          {/* VS HUMAN Card */}
          <div className="retro-frame" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '2rem', textAlign: 'center' }}>⚔️</div>
            <h2 style={{ fontSize: '0.8rem', textAlign: 'center' }}>VS HUMAN</h2>
            <p style={{ fontSize: '0.5rem', textAlign: 'center', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              MULTIPLAYER. FIGHT REAL PLAYERS.
            </p>
            <button className="retro-button" onClick={onOnline} style={{ width: '100%', marginTop: 'auto' }}>
              {'> FIND'}
            </button>
          </div>
        </div>

        {/* PASSWORD Section */}
        <div className="retro-frame" style={{ width: '100%', maxWidth: '460px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem' }}>🔗</span>
            <span style={{ fontSize: '0.7rem' }}>PASSWORD</span>
          </div>
          <p style={{ fontSize: '0.5rem', marginBottom: '12px', color: 'var(--text-secondary)' }}>
            ENTER 6-DIGIT SECRET CODE
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="000000" 
              maxLength={6}
              style={{ 
                background: 'var(--bg-main)', 
                border: '2px solid var(--border)',
                borderRadius: '0px',
                fontFamily: 'var(--font-pixel)',
                fontSize: '0.8rem',
                color: 'var(--text-primary)',
                padding: '8px'
              }}
            />
            <button className="retro-button" style={{ height: '40px' }}>JOIN</button>
          </div>
        </div>

        <footer style={{ marginTop: 'auto', paddingBottom: '24px', textAlign: 'center', width: '100%' }}>
          <div className="gb-footer" style={{ marginBottom: '12px' }}>INSERT COIN TO CONTINUE...</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.5rem', color: 'var(--text-secondary)' }}>
            <span style={{ color: '#00ff00' }}>● ONLINE</span>
            <span>1248 PLYRS</span>
            <span>VER 1.0.4</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
