"use client";

import { useRef, useEffect, useCallback } from "react";
import { Play, Pause, SkipBack, Maximize } from "lucide-react";
import type { AspectRatio } from "./editor-types";
import { ASPECT_RATIOS, FPS } from "./editor-types";

interface Props {
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;
  aspectRatio: AspectRatio;
  onPlayPause: () => void;
  onRestart: () => void;
  onSeek: (frame: number) => void;
  previewCanvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export function EditorPreview({
  currentFrame,
  totalFrames,
  isPlaying,
  aspectRatio,
  onPlayPause,
  onRestart,
  onSeek,
  previewCanvasRef,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const ar = ASPECT_RATIOS.find((a) => a.value === aspectRatio)!;
  const previewW = 420;
  const previewH = Math.round(previewW * (ar.h / ar.w));

  const formatTime = (frame: number) => {
    const secs = Math.floor(frame / FPS);
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    const f = frame % FPS;
    return `${mins}:${s.toString().padStart(2, "0")}.${f.toString().padStart(2, "0")}`;
  };

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      onSeek(Math.round(pct * totalFrames));
    },
    [totalFrames, onSeek]
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 gap-2 min-h-0">
      {/* Canvas wrapper */}
      <div
        ref={containerRef}
        className="relative rounded-sm overflow-hidden shadow-2xl"
        style={{
          width: previewW,
          height: previewH,
          background: "#000",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <canvas
          ref={previewCanvasRef}
          width={ar.w}
          height={ar.h}
          className="w-full h-full"
          style={{ imageRendering: "auto" }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={onRestart}
          className="p-1.5 transition-colors hover:bg-white/5 rounded-sm"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <SkipBack size={14} />
        </button>
        <button
          onClick={onPlayPause}
          className="flex items-center justify-center w-8 h-8 rounded-full transition-colors hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {/* Progress bar */}
        <div
          className="relative w-56 h-1.5 rounded-sm cursor-pointer group"
          style={{ background: "rgba(255,255,255,0.06)" }}
          onClick={handleProgressClick}
        >
          <div
            className="absolute left-0 top-0 h-full rounded-sm transition-all"
            style={{
              width: `${(currentFrame / Math.max(1, totalFrames)) * 100}%`,
              background: "#C75B39",
            }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              left: `${(currentFrame / Math.max(1, totalFrames)) * 100}%`,
              background: "#C75B39",
              transform: `translate(-50%, -50%)`,
            }}
          />
        </div>

        <span className="text-[10px] tabular-nums min-w-[80px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {formatTime(currentFrame)} / {formatTime(totalFrames)}
        </span>
      </div>
    </div>
  );
}
