'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { type Character, calculateDamage } from '@/entities/character';
import { BattleHud } from '@/widgets/battle-hud';
import { CharacterAvatar } from '@/widgets/character-avatar';
import { playBlob } from '@/shared/audio';
import type { Judgment } from '@/shared/api';

interface BattleScreenProps {
  p1Character: Character | null;
  p2Character: Character | null;
  p1Hp: number;
  p2Hp: number;
  round: number;
  judgment: Judgment | null;
  onBattleComplete: () => void;
  onJudge?: () => Promise<void>;
  mode: 'local' | 'online';
  playerNum?: number;
  recordings?: { 1: Blob | null; 2: Blob | null };
  sentence?: string;
}

type Phase = 'enter' | 'scores' | 'charge' | 'projectile' | 'hit' | 'hp' | 'done';

export default function BattleScreen({
  p1Character,
  p2Character,
  p1Hp,
  p2Hp,
  round,
  judgment,
  onBattleComplete,
  onJudge,
  mode,
  playerNum,
  recordings,
  sentence,
}: BattleScreenProps) {
  const [phase, setPhase] = useState<Phase>('enter');
  const [displayP1Score, setDisplayP1Score] = useState(0);
  const [displayP2Score, setDisplayP2Score] = useState(0);
  const [winner, setWinner] = useState<1 | 2 | null>(null);
  const [damage, setDamage] = useState(0);
  const [displayP1Hp, setDisplayP1Hp] = useState(p1Hp);
  const [displayP2Hp, setDisplayP2Hp] = useState(p2Hp);
  const [judging, setJudging] = useState(false);
  const phaseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio auto-play state
  const [nowPlaying, setNowPlaying] = useState<0 | 1 | 2>(0); // 0=none, 1=p1, 2=p2
  const [autoPlayDone, setAutoPlayDone] = useState(false);
  const audio1Ref = useRef<HTMLAudioElement>(null);
  const audio2Ref = useRef<HTMLAudioElement>(null);
  const judgmentRef = useRef(judgment);

  // Keep ref in sync
  useEffect(() => {
    judgmentRef.current = judgment;
  }, [judgment]);

  // 1) 배틀 화면 진입 시 판정 요청 (로컬: 무조건 / 온라인: P1만)
  useEffect(() => {
    if (!judgment && onJudge && !judging) {
      if (mode === 'local' || (mode === 'online' && playerNum === 1)) {
        setJudging(true);
        onJudge();
      }
    }
  }, [judgment, onJudge, mode, playerNum, judging]);

  // 2) 녹음 자동 동시 재생: P1 + P2 함께
  const autoPlay = useCallback(async () => {
    if (!recordings?.[1] || !recordings?.[2]) return;
    if (!audio1Ref.current || !audio2Ref.current) return;

    setNowPlaying(1); // 1 = 재생 중 표시용 (둘 다 재생)
    try {
      await Promise.all([
        playBlob(recordings[1], audio1Ref.current),
        playBlob(recordings[2], audio2Ref.current),
      ]);
    } catch { /* ignore */ }

    setNowPlaying(0);
    setAutoPlayDone(true);
  }, [recordings]);

  useEffect(() => {
    if (!judgment && recordings?.[1] && recordings?.[2] && !autoPlayDone) {
      autoPlay();
    }
  }, [recordings, judgment, autoPlayDone, autoPlay]);

  // 3) 판정 도착 시 재생 중이면 정지
  useEffect(() => {
    if (judgment) {
      if (audio1Ref.current) {
        audio1Ref.current.pause();
        audio1Ref.current.currentTime = 0;
      }
      if (audio2Ref.current) {
        audio2Ref.current.pause();
        audio2Ref.current.currentTime = 0;
      }
      setNowPlaying(0);
    }
  }, [judgment]);

  // 4) 판정 결과 → 배틀 애니메이션
  useEffect(() => {
    if (!judgment) return;

    const w = judgment.winner as 1 | 2;
    const loser = w === 1 ? 2 : 1;
    const dmg = calculateDamage(
      w === 1 ? judgment.player1_score : judgment.player2_score,
      loser === 1 ? judgment.player1_score : judgment.player2_score,
    );

    setWinner(w);
    setDamage(dmg);
    setPhase('enter');

    phaseTimerRef.current = setTimeout(() => {
      setPhase('scores');
      animateScores(judgment.player1_score, judgment.player2_score);

      phaseTimerRef.current = setTimeout(() => {
        setPhase('charge');

        phaseTimerRef.current = setTimeout(() => {
          setPhase('projectile');

          phaseTimerRef.current = setTimeout(() => {
            setPhase('hit');

            phaseTimerRef.current = setTimeout(() => {
              setPhase('hp');
              if (loser === 1) {
                setDisplayP1Hp(Math.max(0, p1Hp - dmg));
              } else {
                setDisplayP2Hp(Math.max(0, p2Hp - dmg));
              }

              phaseTimerRef.current = setTimeout(() => {
                setPhase('done');

                phaseTimerRef.current = setTimeout(() => {
                  onBattleComplete();
                }, 2000);
              }, 500);
            }, 500);
          }, 500);
        }, 500);
      }, 1000);
    }, 500);

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [judgment]);

  const animateScores = (target1: number, target2: number) => {
    const duration = 800;
    const fps = 30;
    const frames = Math.ceil(duration / (1000 / fps));
    let frame = 0;

    const interval = setInterval(() => {
      frame++;
      const progress = frame / frames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayP1Score(Math.round(target1 * eased));
      setDisplayP2Score(Math.round(target2 * eased));

      if (frame >= frames) {
        clearInterval(interval);
        setDisplayP1Score(target1);
        setDisplayP2Score(target2);
      }
    }, 1000 / fps);
  };

  const c1 = p1Character;
  const c2 = p2Character;
  const loser = winner === 1 ? 2 : 1;

  // ===== 판정 대기 화면: 음성 자동 재생 =====
  if (!judgment) {
    return (
      <div className="screen">
        <div className="container" style={{ textAlign: 'center' }}>
          {sentence && (
            <div className="sentence-box small" style={{ marginBottom: 20 }}>
              {sentence}
            </div>
          )}

          <div className="listen-players" style={{ marginBottom: 24 }}>
            {/* Player 1 */}
            <div className={`listen-card${nowPlaying ? ' listen-active' : ''}`}>
              <div className={`listen-avatar${nowPlaying ? ' pulse' : ''}`}>
                {c1 && (
                  <CharacterAvatar image={c1.image} emoji={c1.emoji} size={72} className="" />
                )}
              </div>
              <h3 className="player-label p1" style={{ marginTop: 8 }}>
                {mode === 'local' ? '나' : 'Player 1'}
              </h3>
              {nowPlaying > 0 && (
                <div className="listen-indicator">
                  <span className="listen-bar" /><span className="listen-bar" /><span className="listen-bar" />
                </div>
              )}
              <audio ref={audio1Ref} />
            </div>

            <div className="vs-badge">VS</div>

            {/* Player 2 */}
            <div className={`listen-card${nowPlaying ? ' listen-active' : ''}`}>
              <div className={`listen-avatar${nowPlaying ? ' pulse' : ''}`}>
                {c2 && (
                  <CharacterAvatar image={c2.image} emoji={c2.emoji} size={72} className="" />
                )}
              </div>
              <h3 className="player-label p2" style={{ marginTop: 8 }}>
                {mode === 'local' ? 'AI' : 'Player 2'}
              </h3>
              {nowPlaying > 0 && (
                <div className="listen-indicator">
                  <span className="listen-bar" /><span className="listen-bar" /><span className="listen-bar" />
                </div>
              )}
              <audio ref={audio2Ref} />
            </div>
          </div>

          <div className="loading-spinner" style={{ margin: '0 auto 12px' }} />
          <p className="loading-text">
            {nowPlaying ? '두 목소리를 듣고 있어요...' : 'AI 심판이 판정 중...'}
          </p>
        </div>
      </div>
    );
  }

  // ===== 배틀 애니메이션 =====
  return (
    <div className="screen">
      <div className="container">
        <BattleHud
          p1Character={c1}
          p2Character={c2}
          p1Hp={displayP1Hp}
          p2Hp={displayP2Hp}
          round={round}
        />

        <div className="battle-arena">
          <div className="battle-characters">
            <div className={`battle-char left${phase === 'charge' && winner === 1 ? ' charging' : ''}${phase === 'hit' && loser === 1 ? ' hit' : ''}`}>
              <div style={{ position: 'relative' }}>
                {c1 && (
                  <CharacterAvatar image={c1.image} emoji={c1.emoji} size={64} className="battle-char-emoji" />
                )}
                {phase === 'charge' && winner === 1 && (
                  <div className="aura" style={{ background: c1?.auraColor, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                )}
              </div>
              <span className="battle-char-name" style={{ color: 'var(--p1-color)' }}>
                {c1?.name}
              </span>
              {(phase === 'hit' || phase === 'hp') && loser === 1 && (
                <div className="damage-popup" style={{ top: '-20px' }}>-{damage}</div>
              )}
            </div>

            <span className="battle-vs">VS</span>

            <div className={`battle-char right${phase === 'charge' && winner === 2 ? ' charging' : ''}${phase === 'hit' && loser === 2 ? ' hit' : ''}`}>
              <div style={{ position: 'relative' }}>
                {c2 && (
                  <CharacterAvatar image={c2.image} emoji={c2.emoji} size={64} className="battle-char-emoji" />
                )}
                {phase === 'charge' && winner === 2 && (
                  <div className="aura" style={{ background: c2?.auraColor, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
                )}
              </div>
              <span className="battle-char-name" style={{ color: 'var(--p2-color)' }}>
                {c2?.name}
              </span>
              {(phase === 'hit' || phase === 'hp') && loser === 2 && (
                <div className="damage-popup" style={{ top: '-20px' }}>-{damage}</div>
              )}
            </div>
          </div>

          {phase === 'projectile' && winner && (
            <div
              className={`projectile ${winner === 1 ? 'to-right' : 'to-left'}`}
              style={{ top: '40%' }}
            >
              {(winner === 1 ? c1 : c2) && (
                <CharacterAvatar
                  image={(winner === 1 ? c1! : c2!).image}
                  emoji={(winner === 1 ? c1! : c2!).emoji}
                  size={40}
                  className=""
                />
              )}
            </div>
          )}

          {phase !== 'enter' && (
            <div className="battle-scores">
              <div className="battle-score">
                <span className="battle-score-label">P1</span>
                <div className="battle-score-number p1">{displayP1Score}</div>
              </div>
              <div className="battle-score">
                <span className="battle-score-label">P2</span>
                <div className="battle-score-number p2">{displayP2Score}</div>
              </div>
            </div>
          )}

          {phase === 'charge' && winner && (
            <div className="attack-line">
              &quot;{winner === 1 ? c1?.attackLine : c2?.attackLine}&quot;
            </div>
          )}

          {phase === 'done' && (
            <p className="desc" style={{ animation: 'fadeIn 0.3s ease' }}>
              {winner === 1 ? 'Player 1' : 'Player 2'} 라운드 승리! 다음 라운드 준비 중...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
