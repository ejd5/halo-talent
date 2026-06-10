"use client";

import { useRef, useCallback, useState, useEffect } from "react";
import { Eye, EyeOff, Lock, Unlock, Trash2, GripVertical } from "lucide-react";
import type { Track, Clip } from "./editor-types";
import { TRACK_COLORS, FPS } from "./editor-types";
import { formatDuration } from "./editor-utils";

interface Props {
  tracks: Track[];
  currentFrame: number;
  selectedClipId: string | null;
  zoom: number;
  scrollX: number;
  onSelectClip: (clipId: string, trackId: string) => void;
  onToggleVisibility: (trackId: string) => void;
  onToggleLock: (trackId: string) => void;
  onDeleteClip: (clipId: string, trackId: string) => void;
  onSeek: (frame: number) => void;
  onUpdateClip: (trackId: string, clipId: string, updates: Partial<Clip>) => void;
  onAddTrack: () => void;
}

const PIXELS_PER_SECOND = 80;
const TRACK_HEIGHT = 52;
const RULER_HEIGHT = 24;

export function EditorTimeline({
  tracks,
  currentFrame,
  selectedClipId,
  zoom,
  onSelectClip,
  onToggleVisibility,
  onToggleLock,
  onDeleteClip,
  onSeek,
  onUpdateClip,
  onAddTrack,
}: Props) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [dragClip, setDragClip] = useState<{ clipId: string; trackId: string; startX: number; origStart: number } | null>(null);
  const [resizeClip, setResizeClip] = useState<{ clipId: string; trackId: string; side: "left" | "right"; startX: number; origStart: number; origDur: number } | null>(null);

  const maxFrames = Math.max(
    ...tracks.map((t) =>
      t.clips.reduce((max, c) => Math.max(max, c.startFrame + c.durationFrames), 0)
    ),
    450
  );
  const totalDurationSec = Math.ceil(maxFrames / FPS);
  const timelineWidth = Math.max(totalDurationSec * PIXELS_PER_SECOND * zoom, 600);

  const formatRuler = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Helper to get clip left position as percentage/px
  const getClipStyle = (clip: Clip) => {
    const leftPx = (clip.startFrame / FPS) * PIXELS_PER_SECOND * zoom;
    const widthPx = (clip.durationFrames / FPS) * PIXELS_PER_SECOND * zoom;
    return { left: `${leftPx}px`, width: `${widthPx}px` };
  };

  const handleClipMouseDown = (e: React.MouseEvent, clip: Clip, trackId: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    onSelectClip(clip.id, trackId);
    setDragClip({
      clipId: clip.id,
      trackId,
      startX: e.clientX,
      origStart: clip.startFrame,
    });
  };

  const handleClipResizeStart = (e: React.MouseEvent, clip: Clip, trackId: string, side: "left" | "right") => {
    e.stopPropagation();
    setResizeClip({
      clipId: clip.id,
      trackId,
      side,
      startX: e.clientX,
      origStart: clip.startFrame,
      origDur: clip.durationFrames,
    });
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (dragClip) {
        const deltaPx = e.clientX - dragClip.startX;
        const deltaFrames = Math.round((deltaPx / (PIXELS_PER_SECOND * zoom)) * FPS);
        const newStart = Math.max(0, dragClip.origStart + deltaFrames);
        onUpdateClip(dragClip.trackId, dragClip.clipId, { startFrame: newStart });
      }
      if (resizeClip) {
        const deltaPx = e.clientX - resizeClip.startX;
        const deltaFrames = Math.round((deltaPx / (PIXELS_PER_SECOND * zoom)) * FPS);
        if (resizeClip.side === "right") {
          const newDur = Math.max(FPS, resizeClip.origDur + deltaFrames);
          onUpdateClip(resizeClip.trackId, resizeClip.clipId, { durationFrames: newDur });
        } else {
          const newStart = Math.max(0, resizeClip.origStart + deltaFrames);
          const newDur = resizeClip.origDur - (newStart - resizeClip.origStart);
          if (newDur >= FPS) {
            onUpdateClip(resizeClip.trackId, resizeClip.clipId, { startFrame: newStart, durationFrames: newDur });
          }
        }
      }
    },
    [dragClip, resizeClip, zoom, onUpdateClip]
  );

  const handleMouseUp = useCallback(() => {
    setDragClip(null);
    setResizeClip(null);
  }, []);

  // Attach global listeners for drag/resize
  const mouseMoveRef = useRef(handleMouseMove);
  mouseMoveRef.current = handleMouseMove;
  const mouseUpRef = useRef(handleMouseUp);
  mouseUpRef.current = handleMouseUp;

  useEffect(() => {
    const onMove = (e: MouseEvent) => mouseMoveRef.current(e);
    const onUp = () => mouseUpRef.current();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  });

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (timelineRef.current?.scrollLeft ?? 0);
    const seconds = x / (PIXELS_PER_SECOND * zoom);
    onSeek(Math.round(seconds * FPS));
  };

  const visibleTracks = tracks.filter((t) => t.type !== "audio" || t.clips.length > 0);

  return (
    <div
      className="shrink-0 flex flex-col"
      style={{
        height: 220,
        background: "var(--bg-primary)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Ruler */}
      <div
        ref={timelineRef}
        className="overflow-x-auto overflow-y-hidden"
        style={{ scrollbarWidth: "thin" }}
      >
        <div style={{ minWidth: timelineWidth }}>
          {/* Time ruler */}
          <div
            className="relative cursor-pointer"
            style={{ height: RULER_HEIGHT, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            onClick={handleRulerClick}
          >
            {Array.from({ length: totalDurationSec + 1 }, (_, i) => (
              <div
                key={i}
                className="absolute top-0"
                style={{ left: `${i * PIXELS_PER_SECOND * zoom}px` }}
              >
                <div className="flex items-start" style={{ height: RULER_HEIGHT }}>
                  <div className="text-[8px] px-1 pt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {formatRuler(i)}
                  </div>
                </div>
                {i < totalDurationSec && (
                  // Small tick marks every second
                  <div
                    className="absolute bottom-0 w-px"
                    style={{ height: 6, background: "rgba(255,255,255,0.06)" }}
                  />
                )}
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 w-px z-10 pointer-events-none"
              style={{
                left: `${((currentFrame / FPS)) * PIXELS_PER_SECOND * zoom}px`,
                height: 220,
                background: "var(--accent)",
                boxShadow: "0 0 4px rgba(199,91,57,0.5)",
              }}
            />
          </div>

          {/* Tracks */}
          {visibleTracks.length === 0 ? (
            <div
              className="flex items-center justify-center"
              style={{ height: 80, color: "rgba(255,255,255,0.15)" }}
            >
              <button
                onClick={onAddTrack}
                className="text-[10px] px-3 py-1.5 rounded-sm transition-colors hover:bg-white/5"
                style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
              >
                + Ajouter une piste
              </button>
            </div>
          ) : (
            visibleTracks.map((track) => (
              <div
                key={track.id}
                className="flex"
                style={{
                  height: TRACK_HEIGHT,
                  borderBottom: "1px solid var(--border-default)",
                  opacity: track.visible ? 1 : 0.3,
                }}
              >
                {/* Track label */}
                <div
                  className="flex items-center gap-1 px-2 shrink-0"
                  style={{
                    width: 160,
                    borderRight: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <GripVertical size={10} style={{ color: "rgba(255,255,255,0.15)", cursor: "grab" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] truncate flex items-center gap-1" style={{ color: "var(--text-primary)" }}>
                      <span
                        className="w-2 h-2 rounded-sm inline-block shrink-0"
                        style={{ background: TRACK_COLORS[track.type] }}
                      />
                      {track.name}
                    </div>
                    <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {track.type} · {track.clips.length} clip{track.clips.length > 1 ? "s" : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleVisibility(track.id)}
                    className="p-0.5 transition-colors hover:bg-white/10 rounded-sm"
                    style={{ color: track.visible ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)" }}
                  >
                    {track.visible ? <Eye size={10} /> : <EyeOff size={10} />}
                  </button>
                  <button
                    onClick={() => onToggleLock(track.id)}
                    className="p-0.5 transition-colors hover:bg-white/10 rounded-sm"
                    style={{ color: track.locked ? "var(--accent)" : "rgba(255,255,255,0.15)" }}
                  >
                    {track.locked ? <Lock size={10} /> : <Unlock size={10} />}
                  </button>
                </div>

                {/* Clips area */}
                <div className="relative flex-1" style={{ minWidth: timelineWidth }}>
                  {track.clips.map((clip) => {
                    const style = getClipStyle(clip);
                    const isSelected = clip.id === selectedClipId;
                    return (
                      <div
                        key={clip.id}
                        className="absolute top-1 rounded-sm cursor-pointer group"
                        style={{
                          ...style,
                          height: TRACK_HEIGHT - 8,
                          background: `${TRACK_COLORS[track.type]}22`,
                          border: `1px solid ${isSelected ? TRACK_COLORS[track.type] : "transparent"}`,
                          zIndex: isSelected ? 2 : 1,
                        }}
                        onMouseDown={(e) => handleClipMouseDown(e, clip, track.id)}
                      >
                        {/* Clip content */}
                        <div className="flex items-center gap-1.5 px-2 h-full">
                          {clip.thumbnail && (
                            <img
                              src={clip.thumbnail}
                              alt=""
                              className="w-8 h-8 rounded-sm object-cover"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] truncate" style={{ color: "var(--text-primary)" }}>
                              {clip.name}
                            </div>
                            <div className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                              {formatDuration(clip.durationFrames / FPS)}
                            </div>
                          </div>
                          {/* Delete button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteClip(clip.id, track.id);
                            }}
                            className="p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 rounded-sm"
                            style={{ color: "var(--danger)" }}
                          >
                            <Trash2 size={9} />
                          </button>
                        </div>

                        {/* Resize handles */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-white/20"
                          onMouseDown={(e) => handleClipResizeStart(e, clip, track.id, "left")}
                        />
                        <div
                          className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize opacity-0 group-hover:opacity-100 hover:bg-white/20"
                          onMouseDown={(e) => handleClipResizeStart(e, clip, track.id, "right")}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
