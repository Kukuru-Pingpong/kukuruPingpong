'use client';

import { useEffect, useState } from 'react';
import type { Judgment } from '@/shared/api';

interface ResultScreenProps {
  judgment: Judgment;
  onPlayAgain: () => void;
  isLocalAi?: boolean;
}

export default function ResultScreen({ judgment, onPlayAgain, isLocalAi }: ResultScreenProps) {
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  useEffect(() => {
    let frame1: ReturnType<typeof setInterval>;
    let frame2: ReturnType<typeof setInterval>;

    const s1 = Number(judgment.player1_score) || 0;
    const s2 = Number(judgment.player2_score) || 0;
    const step1 = Math.max(1, Math.floor(s1 / 30));
    const step2 = Math.max(1, Math.floor(s2 / 30));

    let cur1 = 0;
    let cur2 = 0;

    frame1 = setInterval(() => {
      cur1 = Math.min(cur1 + step1, s1);
      setScore1(cur1);
      if (cur1 >= s1) clearInterval(frame1);
    }, 30);

    frame2 = setInterval(() => {
      cur2 = Math.min(cur2 + step2, s2);
      setScore2(cur2);
      if (cur2 >= s2) clearInterval(frame2);
    }, 30);

    return () => {
      clearInterval(frame1);
      clearInterval(frame2);
    };
  }, [judgment]);

  const titleClass =
    judgment.winner === 1
      ? 'result-title p1-win'
      : judgment.winner === 2
        ? 'result-title p2-win'
        : 'result-title draw';

  const p1Label = isLocalAi ? '나' : 'Player 1';
  const p2Label = isLocalAi ? 'AI' : 'Player 2';

  const titleText =
    judgment.winner === 1
      ? `🏆 ${p1Label} 승리!`
      : judgment.winner === 2
        ? `🏆 ${p2Label} 승리!`
        : '🤝 무승부!';

  return (
    <div className="screen">
      <div className="container">
        <h2 className={titleClass}>{titleText}</h2>

        <div className="scores">
          <div className={`score-card p1-bg${judgment.winner === 1 ? ' winner' : ''}`}>
            <h3>{p1Label}</h3>
            <div className="score-number">{score1}</div>
            <p className="feedback">{judgment.player1_feedback}</p>
          </div>
          <div className={`score-card p2-bg${judgment.winner === 2 ? ' winner' : ''}`}>
            <h3>{p2Label}</h3>
            <div className="score-number">{score2}</div>
            <p className="feedback">{judgment.player2_feedback}</p>
          </div>
        </div>

        <div className="judge-reason">
          <span className="judge-reason-label">⚖️ AI 심판 코멘트</span>
          {judgment.reason}
        </div>

        <button className="btn btn-primary btn-large" onClick={onPlayAgain}>
          다시 하기!
        </button>
      </div>
    </div>
  );
}
