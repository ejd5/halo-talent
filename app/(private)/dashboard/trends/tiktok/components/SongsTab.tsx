"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Music2, Loader } from "lucide-react";
import { SongCard } from "./SongCard";

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

interface Props {
  songs: Song[];
  onAnalyse: (song: Song) => void;
}

const PER_PAGE = 20;

export function SongsTab({ songs, onAnalyse }: Props) {
  const [visible, setVisible] = useState(PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasMore = visible < songs.length;

  // Infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible((v) => Math.min(v + PER_PAGE, songs.length));
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, songs.length]);

  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <Music2 size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
        <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>
          Aucun son tendance pour cette région
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
          Essaie de sélectionner une période plus longue
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {songs.slice(0, visible).map((song, i) => (
          <SongCard key={`${song.title}-${i}`} song={song} onAnalyse={onAnalyse} />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Loader size={14} className="animate-spin" style={{ color: "rgba(245,240,235,0.15)" }} />
        </div>
      )}

      {songs.length > PER_PAGE && (
        <p className="text-[10px] text-center mt-4" style={{ color: "rgba(245,240,235,0.15)" }}>
          {visible} / {songs.length} sons affichés
        </p>
      )}
    </div>
  );
}
