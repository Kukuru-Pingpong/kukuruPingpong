'use client';

import { WordSelectScreen } from '@/features/word-select';
import { useGame } from '@/contexts/GameContext';

export default function WordSelectPage() {
  const {
    mode,
    playerNum,
    sentence,
    loading,
    handleOnlineQuoteReady,
    handleWordSelectRecordDone,
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
        sentence={sentence}
        loading={loading}
        onQuoteReady={handleOnlineQuoteReady}
        onRecordingComplete={handleWordSelectRecordDone}
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
