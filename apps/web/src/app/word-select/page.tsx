'use client';

import { WordSelectScreen } from '@/features/word-select';
import { useGame } from '@/contexts/GameContext';

export default function WordSelectPage() {
  const {
    mode,
    playerNum,
    opponentWordReady,
    handleLocalSubmit,
    handleOnlineSubmit,
    p1Character,
    p2Character,
    p1Hp,
    p2Hp,
    round,
    nickname,
  } = useGame();

  return (
    <div className="app">
      <WordSelectScreen
        mode={mode}
        playerNum={playerNum}
        opponentReady={opponentWordReady}
        onSubmitLocal={handleLocalSubmit}
        onSubmitOnline={handleOnlineSubmit}
        p1Character={p1Character}
        p2Character={p2Character}
        p1Hp={p1Hp}
        p2Hp={p2Hp}
        round={round}
        nickname={nickname}
      />
    </div>
  );
}
