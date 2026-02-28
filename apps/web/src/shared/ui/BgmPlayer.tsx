'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const LOBBY_PATHS = ['/', '/select-mode'];

export default function BgmPlayer() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const unlockedRef = useRef(false);

  const isLobby = LOBBY_PATHS.includes(pathname);

  // Create audio element once
  useEffect(() => {
    const audio = new Audio('/audio/theme.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Unlock audio on first user interaction anywhere
  useEffect(() => {
    if (unlockedRef.current) return;

    const unlock = () => {
      unlockedRef.current = true;
      const audio = audioRef.current;
      if (audio && isLobby) {
        audio.play().catch(() => {});
      }
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('keydown', unlock);
    };

    document.addEventListener('click', unlock);
    document.addEventListener('touchstart', unlock);
    document.addEventListener('keydown', unlock);

    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('touchstart', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, [isLobby]);

  // Play/pause based on route
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isLobby) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [isLobby]);

  return null;
}
