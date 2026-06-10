"use client";

import { useRef, useEffect, useState } from "react";

interface Props {
  audioUrl: string;
  color?: string;
  height?: number;
  progress?: number;
}

export function AudioWaveform({ audioUrl, color = "var(--success)", height = 40, progress = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [peaks, setPeaks] = useState<number[]>([]);

  useEffect(() => {
    let cancelled = false;
    const generatePeaks = async () => {
      try {
        const res = await fetch(audioUrl);
        const buf = await res.arrayBuffer();
        const ctx = new AudioContext();
        const audioBuffer = await ctx.decodeAudioData(buf);
        const data = audioBuffer.getChannelData(0);
        // Downsample to ~200 samples
        const step = Math.max(1, Math.floor(data.length / 200));
        const samples: number[] = [];
        for (let i = 0; i < data.length; i += step) {
          let max = 0;
          for (let j = i; j < Math.min(i + step, data.length); j++) {
            max = Math.max(max, Math.abs(data[j]));
          }
          samples.push(max);
        }
        if (!cancelled) setPeaks(samples);
      } catch {
        // Generate random peaks as fallback
        const samples = Array.from({ length: 100 }, () => Math.random() * 0.8 + 0.2);
        if (!cancelled) setPeaks(samples);
      }
    };
    generatePeaks();
    return () => { cancelled = true; };
  }, [audioUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const barW = Math.max(1, (w / peaks.length) - 0.5);

    ctx.clearRect(0, 0, w, h);

    peaks.forEach((peak, i) => {
      const x = i * (barW + 0.5);
      const barH = peak * (h - 4);
      const y = (h - barH) / 2;
      const isProcessed = (i / peaks.length) <= progress;
      ctx.fillStyle = isProcessed ? color : "rgba(255,255,255,0.1)";
      ctx.fillRect(x, y, barW, barH);
    });
  }, [peaks, color, progress]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={height}
      className="w-full"
      style={{ height, display: "block" }}
    />
  );
}
