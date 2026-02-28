'use client';

import { useRouter } from 'next/navigation';
import { CharacterSelectScreen } from '@/features/title';
import { useGame } from '@/contexts/GameContext';

export default function AvatarPage() {
  const router = useRouter();
  const { nickname, nicknameLoaded } = useGame();

  if (!nicknameLoaded) return null;

  if (nickname) {
    router.replace('/');
    return null;
  }

  return (
    <CharacterSelectScreen
      onSelect={(charId) => router.push(`/nickname?char=${charId}`)}
    />
  );
}
