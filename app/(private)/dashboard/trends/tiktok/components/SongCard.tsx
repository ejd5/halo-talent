"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Play, Music2, TrendingUp, TrendingDown, Minus,
  Save, BarChart3, Headphones, Clock,
} from "lucide-react";

interface Song {
  title: string;
  author: string;
  cover_url?: string;
  duration?: number;
  videos_using: number;
  rank: number;
  rank_diff?: number;
  is_commercial?: boolean;
  preview_url?: string;
  tiktok_song_id?: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function formatDuration(seconds?: number): string {
  if (!seconds) return ", ";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface Props {
  song: Song;
  onAnalyse: (song: Song) => void;
}

export function SongCard({ song, onAnalyse }: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current && song.preview_url) {
      audioRef.current = new Audio(song.preview_url);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else {
      audioRef.current?.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <div
      className="group relative transition-all"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(245,240,235,0.06)",
      }}
    >
      {/* Cover */}
      <div
        className="relative w-full aspect-square overflow-hidden"
        style={{ backgroundColor: "rgba(245,240,235,0.04)" }}
      >
        {song.cover_url ? (
          <img
            src={song.cover_url}
            alt={song.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music2 size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
          </div>
        )}

        {/* Rank badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5" style={{ backgroundColor: "rgba(26,22,20,0.85)" }}>
          <span className="text-[9px] font-medium" style={{ color: "var(--text-primary)" }}>#{song.rank}</span>
          {song.rank_diff !== undefined && song.rank_diff !== 0 && (
            <span style={{ color: song.rank_diff < 0 ? "var(--success)" : "var(--danger)" }}>
              {song.rank_diff < 0 ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
            </span>
          )}
        </div>

        {/* Play overlay */}
        {song.preview_url && (
          <button
            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div
              className="w-10 h-10 flex items-center justify-center"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {playing ? (
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-0.5 bg-white animate-pulse" style={{ height: "60%" }} />
                  <span className="w-0.5 bg-white animate-pulse" style={{ height: "100%", animationDelay: "0.2s" }} />
                  <span className="w-0.5 bg-white animate-pulse" style={{ height: "40%", animationDelay: "0.4s" }} />
                </div>
              ) : (
                <Play size={14} style={{ color: "var(--text-primary)" }} />
              )}
            </div>
          </button>
        )}

        {/* Commercial badge */}
        <div className="absolute top-2 right-2">
          {song.is_commercial !== undefined && (
            <span
              className="text-[8px] font-medium uppercase px-1 py-0.5"
              style={{
                backgroundColor: song.is_commercial ? "rgba(122,154,101,0.15)" : "rgba(199,91,57,0.15)",
                color: song.is_commercial ? "var(--success)" : "var(--accent)",
              }}
            >
              {song.is_commercial ? "Commercial-safe" : "Organique"}
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium truncate" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          {song.title}
        </h3>
        <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>
          {song.author}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 mt-1.5">
          <div className="flex items-center gap-1">
            <Headphones size={9} style={{ color: "rgba(245,240,235,0.2)" }} />
            <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.25)" }}>
              {formatCount(song.videos_using)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={9} style={{ color: "rgba(245,240,235,0.2)" }} />
            <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.25)" }}>
              {formatDuration(song.duration)}
            </span>
          </div>
        </div>

        {/* Audio waveform (visual only) */}
        <div className="flex items-end gap-[2px] h-6 my-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 transition-all"
              style={{
                height: `${Math.random() * 60 + 20}%`,
                backgroundColor: playing
                  ? "rgba(199,91,57,0.3)"
                  : "rgba(245,240,235,0.06)",
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 mt-2">
          <button
            onClick={() => router.push(`/studio/composer?source=tiktok&type=video&song_id=${encodeURIComponent(song.tiktok_song_id || "")}&hashtag=${encodeURIComponent(song.title)}&artist=${encodeURIComponent(song.author)}`)}
            className="flex-1 text-[9px] font-semibold uppercase tracking-wider py-1.5 transition-all hover:opacity-80"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
          >
            Créer
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className="p-1.5 transition-all hover:opacity-70"
            style={{ color: saved ? "var(--accent)" : "rgba(245,240,235,0.15)" }}
            title={saved ? "Sauvegardé" : "Sauvegarder"}
          >
            <Save size={12} />
          </button>
          <button
            onClick={() => onAnalyse(song)}
            className="p-1.5 transition-all hover:opacity-70"
            style={{ color: "rgba(245,240,235,0.15)" }}
            title="Analyser"
          >
            <BarChart3 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
