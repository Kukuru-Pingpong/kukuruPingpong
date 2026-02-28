'use client';

interface LobbyScreenProps {
  onLocal: () => void;
  onOnline: () => void;
}

export default function LobbyScreen({ onLocal, onOnline }: LobbyScreenProps) {
  return (
    <div className="screen">
      <div className="container">
        <h1 className="title">
          <span className="title-icon">🎬</span>
          K-Drama Battle
        </h1>
        <p className="subtitle">K-드라마 명대사로 펼치는 성우 배틀!</p>

        <div className="mode-buttons">
          <button className="btn btn-primary btn-large" onClick={onLocal}>
            <span className="btn-icon">👥</span>
            로컬 대전
            <span className="btn-desc">한 기기에서 번갈아 플레이</span>
          </button>
          <button className="btn btn-secondary btn-large" onClick={onOnline}>
            <span className="btn-icon">🌐</span>
            온라인 대전
            <span className="btn-desc">친구와 원격으로 대결</span>
          </button>
        </div>
      </div>
    </div>
  );
}
