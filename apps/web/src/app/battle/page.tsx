'use client';

import { useGame } from '@/contexts/GameContext';
import { BattleScreen } from '@/features/battle';

export default function BattlePage() {
  const {
    p1Character,
    p2Character,
    p1Hp,
    p2Hp,
    round,
    judgment,
    handleBattleComplete,
    handleJudge,
    mode,
    playerNum,
    recordings,
    sentence,
    nickname,
    lastWinner,
    goHome,
  } = useGame();

  return (
    <BattleScreen
      p1Character={p1Character}
      p2Character={p2Character}
      p1Hp={p1Hp}
      p2Hp={p2Hp}
      round={round}
      judgment={judgment}
      onBattleComplete={handleBattleComplete}
      onJudge={handleJudge}
      mode={mode}
      playerNum={playerNum}
      recordings={recordings}
      sentence={sentence}
      nickname={nickname}
      lastWinner={lastWinner}
      onGoHome={goHome}
    />
  );
}
