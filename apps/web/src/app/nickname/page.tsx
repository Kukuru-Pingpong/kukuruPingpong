'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { NicknamePopup } from '@/features/title';
import { useGame } from '@/contexts/GameContext';

export default function NicknamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { nickname, nicknameLoaded, setNickname } = useGame();

  const charId = searchParams.get('char') || '1';

  if (!nicknameLoaded) return null;

  if (nickname) {
    router.replace('/');
    return null;
  }

  return (
    <div className="title-screen">
      <NicknamePopup
        characterImage={`/characters/${charId}.png`}
        onComplete={(name) => {
          setNickname(name);
          router.replace('/');
        }}
      />
    </div>
  );
}
