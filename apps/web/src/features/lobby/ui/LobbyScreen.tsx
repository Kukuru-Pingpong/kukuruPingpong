'use client';

interface LobbyScreenProps {
  onLocal: () => void;
  onOnline: () => void;
  nickname: string;
  onReset: () => void;
}

export default function LobbyScreen({
  onLocal,
  onOnline,
  nickname,
  onReset,
}: LobbyScreenProps) {
  return (
    <div className="lobby">
      {/* Header */}
      <header className="lobby-header">
        <div className="lobby-header-left">
          <span className="lobby-header-icon">🎮</span>
          <span className="lobby-header-title">KUKURU PINGPONG</span>
        </div>
        <div className="lobby-header-right">
          <div className="lobby-nickname-badge">👤 {nickname || 'PLAYER'}</div>
          <button className="lobby-reset-btn" onClick={onReset}>
            RESET
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="lobby-main">
        <div className="lobby-top-badge">INSERT COIN TO START</div>
        <h1 className="lobby-title">SELECT MODE</h1>
        <div className="lobby-subtitle-badge">
          {'> IMITATE LINES. BECOME LEGEND. <'}
        </div>

        {/* Mode Cards */}
        <div className="lobby-cards">
          {/* VS CPU */}
          <div className="lobby-card">
            <div className="lobby-card-thumb">
              <img
                src="/characters/cpu.png"
                alt="VS CPU"
                className="lobby-card-thumb-img"
              />
              <div className="lobby-card-icon">🤖</div>
            </div>
            <div className="lobby-card-body">
              <h2 className="lobby-card-title">VS CPU</h2>
              <div className="lobby-card-desc">
                <p>TRAINING MODE.</p>
                <p>TEST YOUR SKILL.</p>
              </div>
              <button className="retro-button lobby-card-btn" onClick={onLocal}>
                {'> START GAME'}
              </button>
            </div>
          </div>

          {/* VS HUMAN */}
          <div className="lobby-card">
            <div className="lobby-card-thumb">
              <img
                src="/characters/human.png"
                alt="VS HUMAN"
                className="lobby-card-thumb-img"
              />
              <div className="lobby-card-icon">⚔️</div>
            </div>
            <div className="lobby-card-body">
              <h2 className="lobby-card-title">VS HUMAN</h2>
              <div className="lobby-card-desc">
                <p>MULTIPLAYER.</p>
                <p>FIGHT REAL PLAYERS.</p>
              </div>
              <button
                className="retro-button lobby-card-btn"
                onClick={onOnline}
              >
                {'> FIND MATCH'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="lobby-footer">
          <span>■ ONLINE</span>
          <span>👤 1248 PLYRS</span>
          <span>VER 1.0.4</span>
        </footer>
      </main>
    </div>
  );
}
