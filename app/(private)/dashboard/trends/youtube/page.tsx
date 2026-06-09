"use client";

import { useState, useCallback } from "react";
import {
  PlaySquare, Search, Loader, Eye, ThumbsUp, MessageCircle,
  BookmarkCheck, Clock, Sparkles,
} from "lucide-react";
interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  publishedAt: string;
  duration: string;
  tags: string[];
  category: string;
}

interface YouTubeTrendData {
  keyword: string;
  geo: string;
  category: string;
  videos: YouTubeVideo[];
  source: string;
}

// ─── Constants ───────────────────────────────────────────────────

const GEO_OPTIONS = [
  { value: "", label: "Monde" },
  { value: "FR", label: "France" },
  { value: "US", label: "États-Unis" },
  { value: "GB", label: "Royaume-Uni" },
  { value: "CA", label: "Canada" },
  { value: "BE", label: "Belgique" },
  { value: "CH", label: "Suisse" },
];

const CATEGORIES = [
  { value: "", label: "Toutes" },
  { value: "tech", label: "Tech" },
  { value: "business", label: "Business" },
  { value: "marketing", label: "Marketing" },
  { value: "growth", label: "Croissance" },
  { value: "entertainment", label: "Divertissement" },
];

const SUGGESTIONS = [
  "automatisation CRM",
  "IA contenu",
  "croissance YouTube",
  "marketing automation",
  "outils créateur",
];

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function formatDuration(d: string): string {
  const match = d.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return d;
  const h = parseInt(match[1] ?? "0", 10);
  const m = parseInt(match[2] ?? "0", 10);
  const s = parseInt(match[3] ?? "0", 10);
  if (h) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  return `Il y a ${days} jours`;
}

// ─── Page ────────────────────────────────────────────────────────

export default function YouTubeTrendsPage() {
  const [query, setQuery] = useState("");
  const [geo, setGeo] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState<YouTubeTrendData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [playerVideo, setPlayerVideo] = useState<YouTubeVideo | null>(null);

  const runSearch = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ q: query.trim() });
      if (geo) params.set("geo", geo);
      if (category) params.set("category", category);

      const res = await fetch(`/api/trends/youtube?${params}`);

      if (res.status === 429) {
        setError("Trop de requêtes. Attends une minute.");
        return;
      }
      if (!res.ok) {
        setError("Erreur lors de la recherche.");
        return;
      }

      const result = await res.json();
      setData(result);
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }, [query, geo, category]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) runSearch();
  };

  const addToWatchlist = async (kw: string) => {
    try {
      await fetch("/api/dashboard/trends/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw }),
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const videos = data?.videos ?? [];
  const hasResults = videos.length > 0;

  // ── Render ──────────────────────────────────────────────────

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
          YouTube Trends
        </h1>
        <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
          Recherche vidéos par mot-clé · YouTube Data API + Cache 6h
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Search input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(245,240,235,0.2)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Chercher un mot-clé..."
            className="w-full pl-7 pr-2 py-1.5 text-xs bg-transparent border"
            style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
          />
        </div>

        {/* Geo */}
        <select
          value={geo}
          onChange={(e) => setGeo(e.target.value)}
          className="px-3 py-1.5 text-xs border bg-transparent"
          style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
        >
          {GEO_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-1.5 text-xs border bg-transparent"
          style={{ borderColor: "rgba(245,240,235,0.1)", color: "#F5F0EB" }}
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        {/* Search button */}
        <button
          onClick={runSearch}
          disabled={loading || !query.trim()}
          className="flex items-center gap-1.5 text-xs px-4 py-1.5 font-medium transition-all"
          style={{
            backgroundColor: "rgba(199,91,57,0.12)",
            color: "#C75B39",
            border: "1px solid rgba(199,91,57,0.3)",
            opacity: loading || !query.trim() ? 0.5 : 1,
          }}
        >
          {loading ? <Loader size={12} className="animate-spin" /> : <PlaySquare size={12} />}
          {loading ? "Recherche..." : "Chercher"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="text-xs px-3 py-2 mb-4"
          style={{ backgroundColor: "rgba(196,69,54,0.1)", color: "#C44536", border: "1px solid rgba(196,69,54,0.2)" }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 animate-pulse"
              style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}
            >
              <div className="w-32 h-20 shrink-0" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-3/4" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
                <div className="h-2 w-1/2" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
                <div className="h-2 w-1/4" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {hasResults && !loading && (
        <div className="space-y-4">
          {/* Source badge + stats bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] px-1.5 py-0.5 font-medium"
                style={{
                  backgroundColor: data?.source === "youtube_api"
                    ? "rgba(255,0,0,0.1)" : data?.source === "cache"
                      ? "rgba(122,154,101,0.1)" : "rgba(245,240,235,0.06)",
                  color: data?.source === "youtube_api"
                    ? "#FF0000" : data?.source === "cache"
                      ? "#7A9A65" : "rgba(245,240,235,0.3)",
                }}
              >
                {data?.source === "youtube_api" ? "YouTube Data API"
                  : data?.source === "cache" ? "Cache 6h" : "Mock"}
              </span>
              <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                {videos.length} vidéos trouvées
              </span>
            </div>
            <button
              onClick={() => addToWatchlist(query)}
              className="flex items-center gap-1 text-[10px] px-2 py-1 font-medium transition-all hover:opacity-70"
              style={{ color: "rgba(245,240,235,0.3)" }}
            >
              <BookmarkCheck size={10} />
              {copied ? "Ajouté !" : "Watchlist"}
            </button>
          </div>

          {/* Video list */}
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onPlay={() => setPlayerVideo(video)} />
          ))}
        </div>
      )}

      {/* Video player modal */}
      {playerVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          onClick={() => setPlayerVideo(null)}
        >
          <div
            className="w-full max-w-3xl"
            style={{ aspectRatio: "16/9" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm truncate" style={{ color: "#F5F0EB" }}>
                {playerVideo.title}
              </p>
              <button
                onClick={() => setPlayerVideo(null)}
                className="text-xs px-2 py-1 hover:opacity-70"
                style={{ color: "rgba(245,240,235,0.5)" }}
              >
                Fermer
              </button>
            </div>
            <iframe
              src={`https://www.youtube.com/embed/${playerVideo.id}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: "none" }}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasResults && !loading && !error && (
        <div
          className="flex flex-col items-center py-16 text-center"
          style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}
        >
          <PlaySquare size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
          <h2 className="text-sm font-semibold mt-4" style={{ color: "rgba(245,240,235,0.15)" }}>
            Cherche un mot-clé pour commencer
          </h2>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
            Explore les vidéos tendances sur YouTube
          </p>

          <div className="mt-6 max-w-md">
            <p className="text-[10px] font-medium mb-2" style={{ color: "rgba(245,240,235,0.2)" }}>
              Suggestions
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setQuery(s);
                    setTimeout(runSearch, 100);
                  }}
                  className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 font-medium transition-all"
                  style={{
                    backgroundColor: "rgba(199,91,57,0.08)",
                    color: "#C75B39",
                    border: "1px solid rgba(199,91,57,0.15)",
                  }}
                >
                  <Sparkles size={10} />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Video Card ──────────────────────────────────────────────────

function VideoCard({ video, onPlay }: { video: YouTubeVideo; onPlay: () => void }) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="flex gap-3 p-3 transition-colors cursor-pointer hover:opacity-90"
      style={{ backgroundColor: "#2A2420", border: "1px solid rgba(245,240,235,0.06)" }}
      onClick={onPlay}
    >
      {/* Thumbnail */}
      <div
        className="relative w-44 h-24 shrink-0 overflow-hidden group"
        style={{ backgroundColor: "rgba(245,240,235,0.04)" }}
      >
        {video.thumbnail && !imgErr ? (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <PlaySquare size={20} style={{ color: "rgba(245,240,235,0.1)" }} />
          </div>
        )}
        {/* Duration badge */}
        {video.duration && (
          <span
            className="absolute bottom-1 right-1 text-[9px] px-1 py-0.5 font-medium"
            style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#F5F0EB" }}
          >
            {formatDuration(video.duration)}
          </span>
        )}
        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <PlaySquare size={16} style={{ color: "#FF0000" }} />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <button
          onClick={onPlay}
          className="text-sm font-semibold line-clamp-2 text-left hover:underline"
          style={{ color: "#F5F0EB" }}
        >
          {video.title}
        </button>

        <p className="text-[11px] mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
          {video.channelTitle}
        </p>

        <p className="text-[10px] line-clamp-1 mt-1" style={{ color: "rgba(245,240,235,0.25)" }}>
          {video.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Eye size={10} style={{ color: "rgba(245,240,235,0.2)" }} />
            <span className="text-[10px] tabular-nums" style={{ color: "rgba(245,240,235,0.35)" }}>
              {formatCount(video.viewCount)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp size={10} style={{ color: "rgba(245,240,235,0.2)" }} />
            <span className="text-[10px] tabular-nums" style={{ color: "rgba(245,240,235,0.35)" }}>
              {formatCount(video.likeCount)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={10} style={{ color: "rgba(245,240,235,0.2)" }} />
            <span className="text-[10px] tabular-nums" style={{ color: "rgba(245,240,235,0.35)" }}>
              {formatCount(video.commentCount)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={10} style={{ color: "rgba(245,240,235,0.2)" }} />
            <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.35)" }}>
              {timeAgo(video.publishedAt)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
