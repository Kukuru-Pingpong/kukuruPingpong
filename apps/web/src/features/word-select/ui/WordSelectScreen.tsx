'use client';

import { useState } from 'react';
import { quotes } from '@/entities/quote';
import { type Character } from '@/entities/character';
import { BattleHud } from '@/widgets/battle-hud';

interface WordSelectScreenProps {
  mode: 'local' | 'online';
  playerNum?: number;
  opponentReady?: boolean;
  onSubmitLocal: (word: string, quote: { text: string; source: string }) => void;
  onSubmitOnline?: (word: string) => void;
  p1Character?: Character | null;
  p2Character?: Character | null;
  p1Hp?: number;
  p2Hp?: number;
  round?: number;
}

export default function WordSelectScreen({
  mode,
  playerNum,
  opponentReady,
  onSubmitLocal,
  onSubmitOnline,
  p1Character,
  p2Character,
  p1Hp = 100,
  p2Hp = 100,
  round = 1,
}: WordSelectScreenProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [keyword1, setKeyword1] = useState<string | null>(null);
  const [keyword2, setKeyword2] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [quote1] = useState(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  });

  const [quote2] = useState(() => {
    const others = quotes.filter((q) => q.source !== quote1.source);
    return others[Math.floor(Math.random() * others.length)];
  });

  const [onlineQuote] = useState(() => {
    return quotes[Math.floor(Math.random() * quotes.length)];
  });
  const [onlinePick, setOnlinePick] = useState<string | null>(null);

  const handleNext = () => {
    if (!keyword1) return;
    setStep(2);
  };

  const handleSubmit = () => {
    if (mode === 'local') {
      if (!keyword1 || !keyword2) return;
      const useFirst = Math.random() < 0.5;
      const selectedQuote = useFirst ? quote1 : quote2;
      const selectedKeyword = useFirst ? keyword1 : keyword2;
      onSubmitLocal(selectedKeyword, { text: selectedQuote.text, source: selectedQuote.source });
      setSubmitted(true);
    } else {
      if (!onlinePick) {
        alert('키워드를 선택해주세요!');
        return;
      }
      onSubmitOnline?.(onlinePick);
      setSubmitted(true);
    }
  };

  return (
    <div className="screen">
      <div className="container">
        <BattleHud
          p1Character={p1Character ?? null}
          p2Character={p2Character ?? null}
          p1Hp={p1Hp}
          p2Hp={p2Hp}
          round={round}
        />

        {mode === 'local' ? (
          <>
            {step === 1 ? (
              <>
                <h2>
                  <span className="player-label p1">Player 1</span> 키워드 선택
                </h2>
                <p className="desc">어떤 작품의 단서일까요? 하나를 골라보세요!</p>
                <div className="word-chips">
                  {quote1.keywords.map((w) => (
                    <button
                      key={w}
                      className={`word-chip${keyword1 === w ? ' selected' : ''}`}
                      onClick={() => setKeyword1(w)}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleNext}
                  disabled={!keyword1}
                  style={{ marginTop: 20 }}
                >
                  다음
                </button>
              </>
            ) : (
              <>
                <h2>
                  <span className="player-label p2">Player 2</span> 키워드 선택
                </h2>
                <p className="desc">다른 작품의 단서예요. 하나를 골라보세요!</p>
                <div className="word-chips">
                  {quote2.keywords.map((w) => (
                    <button
                      key={w}
                      className={`word-chip${keyword2 === w ? ' selected' : ''}`}
                      onClick={() => !submitted && setKeyword2(w)}
                      disabled={submitted}
                    >
                      {w}
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-primary btn-large"
                  onClick={handleSubmit}
                  disabled={submitted || !keyword2}
                  style={{ marginTop: 20 }}
                >
                  {submitted ? '명대사를 리믹스하는 중...' : '출발!'}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <h2>키워드를 선택하세요</h2>
            <p className="desc">어떤 작품의 단서일까요?</p>
            <div className="word-group">
              <span className={`player-label ${playerNum === 1 ? 'p1' : 'p2'}`}>
                Player {playerNum}
              </span>
              <div className="word-chips" style={{ marginTop: 12 }}>
                {onlineQuote.keywords.map((w) => (
                  <button
                    key={w}
                    className={`word-chip${onlinePick === w ? ' selected' : ''}`}
                    onClick={() => !submitted && setOnlinePick(w)}
                    disabled={submitted}
                  >
                    {w}
                  </button>
                ))}
              </div>
              {submitted && (
                <p className="status-text" style={{ marginTop: 8 }}>
                  {opponentReady ? '상대방이 키워드를 제출했습니다!' : '상대방을 기다리는 중...'}
                </p>
              )}
            </div>
            <button
              className="btn btn-primary btn-large"
              onClick={handleSubmit}
              disabled={submitted || !onlinePick}
              style={{ marginTop: 16 }}
            >
              {submitted ? '대기 중...' : '출발!'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
