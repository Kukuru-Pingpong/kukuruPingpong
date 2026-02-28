import type { Judgment } from './types';

const API_BASE = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/api`;

export async function generateSentence(
  word: string,
  quote?: string,
): Promise<{ sentence: string }> {
  const res = await fetch(`${API_BASE}/generate-sentence`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word1: word, quote }),
  });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error || data.message || '서버 오류');
  return { sentence: data.sentence };
}

export async function getAiWord(): Promise<string> {
  const res = await fetch(`${API_BASE}/ai-word`, { method: 'POST' });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.word;
}

export async function generateTts(text: string): Promise<Blob> {
  const res = await fetch(`${API_BASE}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error('TTS 생성 실패');
  return res.blob();
}

export async function generateCharacterImage(
  name: string,
  emoji: string,
  description: string,
): Promise<string> {
  const res = await fetch(`${API_BASE}/generate-character-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, emoji, description }),
  });
  if (!res.ok) throw new Error('캐릭터 이미지 생성 실패');
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function requestJudgment(
  blob1: Blob,
  blob2: Blob,
  sentence: string,
): Promise<Judgment> {
  const formData = new FormData();
  formData.append('audio1', blob1, 'audio1.webm');
  formData.append('audio2', blob2, 'audio2.webm');
  formData.append('sentence', sentence);

  const res = await fetch(`${API_BASE}/judge`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}

export async function requestLocalBattle(
  playerAudio: Blob,
  quoteId: number,
): Promise<Judgment> {
  const formData = new FormData();
  formData.append('playerAudio', playerAudio, 'player.webm');
  formData.append('quoteId', String(quoteId));

  const res = await fetch(`${API_BASE}/local-battle`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
}
