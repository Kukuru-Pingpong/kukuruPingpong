'use client';

import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
}

const BAR_COUNT = 48;
const BAR_GAP = 2;
const SMOOTHING = 0.82;
const COLOR_TOP = '#9bbc0f';
const COLOR_MID = '#8bac0f';
const COLOR_BOT = '#306230';

export default function AudioVisualizer({ stream, isActive }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;

    // Handle DPI scaling
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();

    if (!stream || !isActive) {
      // Draw idle state — subtle flat bars
      const { width, height } = { width: canvas.clientWidth, height: canvas.clientHeight };
      const barWidth = (width - (BAR_COUNT - 1) * BAR_GAP) / BAR_COUNT;
      const centerY = height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < BAR_COUNT; i++) {
        const x = i * (barWidth + BAR_GAP);
        const h = 2;
        ctx.fillStyle = 'rgba(155, 188, 15, 0.3)';
        ctx.beginPath();
        ctx.rect(x, centerY - h / 2, barWidth, h);
        ctx.fill();
      }
      return;
    }

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = SMOOTHING;

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    audioCtxRef.current = audioCtx;
    sourceRef.current = source;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const drawWidth = canvas.clientWidth;
    const drawHeight = canvas.clientHeight;
    const barWidth = (drawWidth - (BAR_COUNT - 1) * BAR_GAP) / BAR_COUNT;
    const centerY = drawHeight / 2;
    const step = Math.floor(bufferLength / BAR_COUNT);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < BAR_COUNT; i++) {
        const rawValue = dataArray[i * step] || 0;
        const value = rawValue / 255;
        const barHeight = Math.max(2, value * centerY * 0.92);
        const x = i * (barWidth + BAR_GAP);

        // Gradient per bar
        const grad = ctx.createLinearGradient(x, centerY - barHeight, x, centerY + barHeight);
        grad.addColorStop(0, COLOR_TOP);
        grad.addColorStop(0.5, COLOR_MID);
        grad.addColorStop(1, COLOR_BOT);
        ctx.fillStyle = grad;

        // Upper half
        ctx.beginPath();
        ctx.rect(x, centerY - barHeight, barWidth, barHeight);
        ctx.fill();

        // Lower half (mirror)
        ctx.beginPath();
        ctx.rect(x, centerY, barWidth, barHeight);
        ctx.fill();
      }

      // Subtle glow on center line
      ctx.fillStyle = 'rgba(139, 172, 15, 0.15)';
      ctx.fillRect(0, centerY - 0.5, drawWidth, 1);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
      source.disconnect();
      audioCtx.close();
    };
  }, [stream, isActive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '60px',
        borderRadius: '0px',
        background: 'var(--bg-card)',
        display: 'block',
        border: '2px solid var(--border)'
      }}
    />
  );
}
