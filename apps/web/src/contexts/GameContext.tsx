'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import {
  generateSentence,
  generateTts,
  requestJudgment,
  type Judgment,
} from '@/shared/api';
import { blobToBase64, base64ToBlob, cleanupAudio } from '@/shared/audio';
import { getSocket, disconnectSocket } from '@/shared/socket';
import { getRandomQuote } from '@/entities/quote';
import { type Character, STARTING_HP, calculateDamage, getCharacterById } from '@/entities/character';
import type { Socket } from 'socket.io-client';

interface GameContextType {
  mode: 'local' | 'online';
  sentence: string;
  quoteSource: string;
  recordings: { 1: Blob | null; 2: Blob | null };
  currentPlayer: number;
  judgment: Judgment | null;
  loading: string;
  playerNum: number;
  opponentWordReady: boolean;
  socketRef: React.RefObject<Socket | null>;

  // Battle state
  p1Character: Character | null;
  p2Character: Character | null;
  p1Hp: number;
  p2Hp: number;
  round: number;
  lastDamage: { target: 1 | 2; amount: number } | null;
  isKo: boolean;
  koLoser: 1 | 2 | null;
  nickname: string;

  setMode: (mode: 'local' | 'online') => void;
  setSentence: (s: string) => void;
  setQuoteSource: (s: string) => void;
  setRecordings: React.Dispatch<React.SetStateAction<{ 1: Blob | null; 2: Blob | null }>>;
  setCurrentPlayer: (n: number) => void;
  setJudgment: (j: Judgment | null) => void;
  setLoading: (s: string) => void;
  setPlayerNum: (n: number) => void;
  setOpponentWordReady: (b: boolean) => void;
  setNickname: (name: string) => void;

  resetGame: () => void;
  setupSocket: () => Socket;
  handleLocal: () => void;
  handleOnline: () => void;
  handleCreateRoom: () => Promise<string>;
  handleJoinRoom: (code: string) => Promise<string | null>;
  handleLocalSubmit: (word: string, quote: { text: string; source: string }) => void;
  handleOnlineSubmit: (word: string) => void;
  handleRecordingDone: (blob: Blob, pNum: number) => Promise<void>;
  handleJudge: () => Promise<void>;
  handleSelectCharacter: (character: Character, player: 1 | 2) => void;
  handleBattleComplete: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [mode, setMode] = useState<'local' | 'online'>('local');
  const [nickname, setNickname] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('kukuru_nickname') || '' : ''
  );
  const [loading, setLoading] = useState('');
  const [sentence, setSentence] = useState('');
  const [quoteSource, setQuoteSource] = useState('');
  const [recordings, setRecordings] = useState<{ 1: Blob | null; 2: Blob | null }>({
    1: null,
    2: null,
  });
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [judgment, setJudgment] = useState<Judgment | null>(null);

  // Online state
  const [playerNum, setPlayerNum] = useState(0);
  const [opponentWordReady, setOpponentWordReady] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const quoteRef = useRef('');
  const playerNumRef = useRef(playerNum);

  // Battle state
  const [p1Character, setP1Character] = useState<Character | null>(null);
  const [p2Character, setP2Character] = useState<Character | null>(null);
  const [p1Hp, setP1Hp] = useState(STARTING_HP);
  const [p2Hp, setP2Hp] = useState(STARTING_HP);
  const [round, setRound] = useState(1);
  const [lastDamage, setLastDamage] = useState<{ target: 1 | 2; amount: number } | null>(null);
  const [isKo, setIsKo] = useState(false);
  const [koLoser, setKoLoser] = useState<1 | 2 | null>(null);

  useEffect(() => {
    playerNumRef.current = playerNum;
  }, [playerNum]);

  useEffect(() => {
    return () => {
      disconnectSocket();
      cleanupAudio();
    };
  }, []);

  const resetGame = useCallback(() => {
    setMode('local');
    setSentence('');
    setQuoteSource('');
    setRecordings({ 1: null, 2: null });
    setCurrentPlayer(1);
    setJudgment(null);
    setPlayerNum(0);
    setOpponentWordReady(false);
    setLoading('');
    setP1Character(null);
    setP2Character(null);
    setP1Hp(STARTING_HP);
    setP2Hp(STARTING_HP);
    setRound(1);
    setLastDamage(null);
    setIsKo(false);
    setKoLoser(null);
    quoteRef.current = '';
    disconnectSocket();
    cleanupAudio();
    router.push('/');
  }, [router]);

  const setupSocket = useCallback(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on('game-start', () => {
      router.push('/character-select');
    });

    socket.on('both-characters-selected', ({ char1, char2 }: { char1: number; char2: number }) => {
      const c1 = getCharacterById(char1);
      const c2 = getCharacterById(char2);
      if (c1) setP1Character(c1);
      if (c2) setP2Character(c2);
      router.push('/word-select');
    });

    socket.on('opponent-word-submitted', () => {
      setOpponentWordReady(true);
    });

    socket.on('words-ready', async ({ word1, word2 }: { word1: string; word2: string }) => {
      if (playerNumRef.current === 1) {
        setLoading('AI가 명대사를 재해석하는 중...');
        try {
          const quote = getRandomQuote();
          const picked = Math.random() < 0.5 ? word1 : word2;
          const { sentence: s } = await generateSentence(picked, quote.text);
          setSentence(s);
          socket.emit('sentence-ready', { sentence: s });
          setLoading('');
          router.push('/recording');
        } catch {
          setLoading('');
          alert('문장 생성 실패');
        }
      } else {
        setLoading('AI가 명대사를 재해석하는 중...');
      }
    });

    socket.on('sentence-generated', ({ sentence: s }: { sentence: string }) => {
      setSentence(s);
      setLoading('');
      router.push('/recording');
    });

    socket.on('opponent-recording-done', () => {});

    socket.on('both-recordings-done', ({ audio1, audio2 }: { audio1: string; audio2: string }) => {
      setRecordings({
        1: base64ToBlob(audio1),
        2: base64ToBlob(audio2),
      });
      // Go to battle instead of listen
      if (playerNumRef.current === 1) {
        // P1 auto-judges
        setLoading('AI 심판이 판정 중...');
      }
      router.push('/battle');
    });

    socket.on('judgment-result', (j: Judgment) => {
      setJudgment(j);
      setLoading('');
    });

    socket.on('round-result', ({ hp, round: r }: { hp: Record<number, number>; round: number }) => {
      setP1Hp(hp[1]);
      setP2Hp(hp[2]);
      setRound(r);
    });

    socket.on('opponent-left', () => {
      alert('상대방이 나갔습니다.');
      resetGame();
    });

    return socket;
  }, [router, resetGame]);

  // Lobby handlers
  const handleLocal = useCallback(() => {
    setMode('local');
    setRecordings({ 1: null, 2: null });
    setCurrentPlayer(1);
    setP1Character(null);
    setP2Character(null);
    setP1Hp(STARTING_HP);
    setP2Hp(STARTING_HP);
    setRound(1);
    setIsKo(false);
    setKoLoser(null);
    setLastDamage(null);
    router.push('/character-select');
  }, [router]);

  const handleOnline = useCallback(() => {
    setMode('online');
    setRecordings({ 1: null, 2: null });
    setP1Character(null);
    setP2Character(null);
    setP1Hp(STARTING_HP);
    setP2Hp(STARTING_HP);
    setRound(1);
    setIsKo(false);
    setKoLoser(null);
    setLastDamage(null);
    setupSocket();
    router.push('/online');
  }, [router, setupSocket]);

  const handleCreateRoom = useCallback(async (): Promise<string> => {
    const socket = socketRef.current!;
    return new Promise((resolve) => {
      socket.emit('create-room', (data: { roomCode: string; playerNum: number }) => {
        setPlayerNum(data.playerNum);
        playerNumRef.current = data.playerNum;
        resolve(data.roomCode);
      });
    });
  }, []);

  const handleJoinRoom = useCallback(async (code: string): Promise<string | null> => {
    const socket = socketRef.current!;
    return new Promise((resolve) => {
      socket.emit('join-room', code, (data: { roomCode?: string; playerNum?: number; error?: string }) => {
        if (data.error) {
          resolve(data.error);
        } else {
          setPlayerNum(data.playerNum!);
          playerNumRef.current = data.playerNum!;
          resolve(null);
        }
      });
    });
  }, []);

  // Character select handler
  const handleSelectCharacter = useCallback((character: Character, player: 1 | 2) => {
    if (mode === 'local') {
      if (player === 1) {
        setP1Character(character);
      } else {
        setP2Character(character);
        // Both selected, go to word select
        router.push('/word-select');
      }
    } else {
      // Online: emit selection
      if (player === 1) setP1Character(character);
      else setP2Character(character);
      socketRef.current?.emit('select-character', { characterId: character.id });
    }
  }, [mode, router]);

  // Word select handlers
  const handleLocalSubmit = useCallback((_word: string, quote: { text: string; source: string }) => {
    setSentence(quote.text);
    setQuoteSource(quote.source);
    setCurrentPlayer(1);
    router.push('/recording');
  }, [router]);

  const handleOnlineSubmit = useCallback((word: string) => {
    socketRef.current?.emit('submit-word', { word });
  }, []);

  // Recording handler
  const handleRecordingDone = useCallback(
    async (blob: Blob, pNum: number) => {
      if (mode === 'local') {
        setRecordings((prev) => ({ ...prev, 1: blob }));
        setLoading('AI가 문장을 읽는 중...');
        try {
          const ttsBlob = await generateTts(sentence);
          setRecordings((prev) => ({ ...prev, 2: ttsBlob }));
          setLoading('');
          // 배틀 화면으로 먼저 이동 (판정은 배틀 화면에서 진행)
          router.push('/battle');
        } catch (err: any) {
          setLoading('');
          alert('AI 음성 생성 실패: ' + err.message);
        }
      } else {
        setRecordings((prev) => ({ ...prev, [playerNumRef.current]: blob }));
        const base64 = await blobToBase64(blob);
        socketRef.current?.emit('recording-done', { audioBase64: base64 });
      }
    },
    [mode, sentence, router],
  );

  // Judge handler (for online, P1 auto-judges when both recordings ready)
  const handleJudge = useCallback(async () => {
    if (!recordings[1] || !recordings[2]) {
      alert('두 녹음이 모두 필요합니다!');
      return;
    }
    setLoading('AI 심판이 판정 중...');
    try {
      const j = await requestJudgment(recordings[1], recordings[2], sentence);
      setJudgment(j);

      if (mode === 'online' && playerNumRef.current === 1) {
        socketRef.current?.emit('judgment-ready', j);
      }

      setLoading('');
    } catch (err: any) {
      setLoading('');
      alert('판정 실패: ' + err.message);
    }
  }, [recordings, sentence, mode]);

  // Battle complete: calculate damage, update HP, route to next round or KO
  const handleBattleComplete = useCallback(() => {
    if (!judgment) return;

    // Handle tie (winner === 0): no damage, just continue to next round
    if (judgment.winner === 0) {
      setTimeout(() => {
        setRound((r) => r + 1);
        setSentence('');
        setQuoteSource('');
        setRecordings({ 1: null, 2: null });
        setCurrentPlayer(1);
        setJudgment(null);
        setOpponentWordReady(false);
        router.push('/word-select');

        if (mode === 'online' && playerNumRef.current === 1) {
          socketRef.current?.emit('round-complete', {
            hp: { 1: p1Hp, 2: p2Hp },
            round: round + 1,
            ko: false,
          });
        }
      }, 500);
      return;
    }

    const winner = judgment.winner as 1 | 2;
    const loser = winner === 1 ? 2 : 1;
    const winnerScore = winner === 1 ? judgment.player1_score : judgment.player2_score;
    const loserScore = loser === 1 ? judgment.player1_score : judgment.player2_score;

    const damage = calculateDamage(winnerScore, loserScore);
    setLastDamage({ target: loser, amount: damage });

    const newHp = loser === 1 ? p1Hp - damage : p2Hp - damage;
    if (loser === 1) {
      setP1Hp(Math.max(0, newHp));
    } else {
      setP2Hp(Math.max(0, newHp));
    }

    if (newHp <= 0) {
      // KO!
      setIsKo(true);
      setKoLoser(loser);
      setTimeout(() => {
        router.push('/ko');
      }, 500);

      if (mode === 'online' && playerNumRef.current === 1) {
        socketRef.current?.emit('round-complete', {
          hp: { 1: loser === 1 ? 0 : p1Hp, 2: loser === 2 ? 0 : p2Hp },
          round: round,
          ko: true,
        });
      }
    } else {
      // Next round
      setTimeout(() => {
        setRound((r) => r + 1);
        setSentence('');
        setQuoteSource('');
        setRecordings({ 1: null, 2: null });
        setCurrentPlayer(1);
        setJudgment(null);
        setOpponentWordReady(false);
        router.push('/word-select');

        if (mode === 'online' && playerNumRef.current === 1) {
          socketRef.current?.emit('round-complete', {
            hp: { 1: loser === 1 ? newHp : p1Hp, 2: loser === 2 ? newHp : p2Hp },
            round: round + 1,
            ko: false,
          });
        }
      }, 500);
    }
  }, [judgment, p1Hp, p2Hp, round, mode, router]);

  const value: GameContextType = {
    mode,
    sentence,
    quoteSource,
    recordings,
    currentPlayer,
    judgment,
    loading,
    playerNum,
    opponentWordReady,
    socketRef,

    // Battle
    p1Character,
    p2Character,
    p1Hp,
    p2Hp,
    round,
    lastDamage,
    isKo,
    koLoser,
    nickname,

    setMode,
    setSentence,
    setQuoteSource,
    setRecordings,
    setCurrentPlayer,
    setJudgment,
    setLoading,
    setPlayerNum,
    setOpponentWordReady,
    setNickname,

    resetGame,
    setupSocket,
    handleLocal,
    handleOnline,
    handleCreateRoom,
    handleJoinRoom,
    handleLocalSubmit,
    handleOnlineSubmit,
    handleRecordingDone,
    handleJudge,
    handleSelectCharacter,
    handleBattleComplete,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
