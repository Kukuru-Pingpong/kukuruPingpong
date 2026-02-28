'use client';

import { useState, useEffect } from 'react';
import { characters } from '../data/characters';
import { generateCharacterImage } from '@/shared/api';

const CACHE_PREFIX = 'char-img-';

function getCached(id: number): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(`${CACHE_PREFIX}${id}`);
  } catch {
    return null;
  }
}

function setCache(id: number, dataUrl: string): void {
  try {
    localStorage.setItem(`${CACHE_PREFIX}${id}`, dataUrl);
  } catch {
    // localStorage full — ignore
  }
}

export function useCharacterImages(): Record<number, string> {
  const [images, setImages] = useState<Record<number, string>>({});

  useEffect(() => {
    // Load cached images first
    const cached: Record<number, string> = {};
    for (const char of characters) {
      const img = getCached(char.id);
      if (img) cached[char.id] = img;
    }
    if (Object.keys(cached).length > 0) {
      setImages(cached);
    }

    // Generate missing images
    for (const char of characters) {
      if (cached[char.id]) continue;
      generateCharacterImage(char.name, char.emoji, char.description)
        .then((dataUrl) => {
          setCache(char.id, dataUrl);
          setImages((prev) => ({ ...prev, [char.id]: dataUrl }));
        })
        .catch((err) => {
          console.warn(`캐릭터 이미지 생성 실패 (${char.name}):`, err);
        });
    }
  }, []);

  return images;
}

export function useCharacterImage(characterId: number | undefined): string | null {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (!characterId) return;

    const cached = getCached(characterId);
    if (cached) {
      setImage(cached);
      return;
    }

    const char = characters.find((c) => c.id === characterId);
    if (!char) return;

    generateCharacterImage(char.name, char.emoji, char.description)
      .then((dataUrl) => {
        setCache(char.id, dataUrl);
        setImage(dataUrl);
      })
      .catch((err) => {
        console.warn(`캐릭터 이미지 생성 실패 (${char.name}):`, err);
      });
  }, [characterId]);

  return image;
}
