"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp, Plus, Globe, PlaySquare, MessageCircle, Newspaper,
  Loader, ArrowRight, RefreshCw,
} from "lucide-react";
import { TrendCard } from "./TrendCard";
import type { TrendSourceData, AggregatedTrend, WatchlistEntry } from "@/lib/trends/types";

const GEO_OPTIONS = [
  { value: "FR", label: "France" },
  { value: "US", label: "US" },
  { value: "GB", label: "UK" },
  { value: "CA", label: "Canada" },
  { value: "BE", label: "Belgique" },
  { value: "CH", label: "Suisse" },
];

const TIMEFRAMES = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7 jours" },
  { value: "30d", label: "30 jours" },
  { value: "90d", label: "90 jours" },
];

interface TrendsPageData {
  sources: TrendSourceData[];
  picks: AggregatedTrend[];
  watched_keywords: { keyword: string; last_value: number }[];
}

export default function TrendsPage() {
  const router = useRouter();
  const [data, setData] = useState<TrendsPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [geo, setGeo] = useState("FR");
  const [timeframe, setTimeframe] = useState("7d");
  const [showAddKeyword, setShowAddKeyword] = useState(false);
  const [newKeyword, setNewKeyword] = useState("");

  async function loadTrends() {
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/trends?geo=${geo}&timeframe=${timeframe}`);
      const d = await res.json();
      setData(d);
    } catch {} finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTrends(); }, [geo, timeframe]);

  async function addToWatchlist() {
    if (!newKeyword.trim()) return;
    try {
      await fetch("/api/dashboard/trends/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: newKeyword.trim() }),
      });
      setNewKeyword("");
      setShowAddKeyword(false);
      loadTrends();
    } catch {}
  }

  const sourceMap: Record<string, TrendSourceData | undefined> = {};
  for (const s of data?.sources ?? []) {
    sourceMap[s.source] = s;
  }

  const colClass = (items: number) =>
    items === 0 ? "flex items-center justify-center min-h-[200px]" : "space-y-2";

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-[1.8rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Intelligence des tendances
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
            Google · YouTube · News, alimenté par Trend Spotter
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Geo selector */}
          <select
            value={geo}
            onChange={(e) => setGeo(e.target.value)}
            className="px-3 py-1.5 text-xs border bg-transparent"
            style={{ borderColor: "rgba(245,240,235,0.1)", color: "var(--text-primary)" }}
          >
            {GEO_OPTIONS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>

          {/* Timeframe selector */}
          <div className="flex gap-0.5">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className="text-[10px] px-2 py-1.5 font-medium transition-all"
                style={{
                  backgroundColor: timeframe === tf.value ? "rgba(199,91,57,0.12)" : "transparent",
                  color: timeframe === tf.value ? "var(--accent)" : "rgba(245,240,235,0.3)",
                  border: timeframe === tf.value ? "1px solid rgba(199,91,57,0.3)" : "1px solid transparent",
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Add to watchlist */}
          <button
            onClick={() => setShowAddKeyword(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-medium transition-all"
            style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
          >
            <Plus size={12} />
            Watchlist
          </button>

          {/* Refresh */}
          <button onClick={loadTrends} className="p-1.5 transition-all hover:opacity-70" style={{ color: "rgba(245,240,235,0.3)" }}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="h-3 w-20 mb-3" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-8 mb-2" style={{ backgroundColor: "rgba(245,240,235,0.04)" }} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* 4-column dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            {/* Column 1: Google Trends */}
            <div className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                <Globe size={14} style={{ color: "#4285F4" }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>Google Trends</h2>
              </div>
              <div className={colClass(sourceMap.google?.items.length ?? 0)}>
                {(sourceMap.google?.items ?? []).slice(0, 10).map((item) => (
                  <TrendSourceRow key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Column 2: TikTok (placeholder) */}
            <div className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                <TrendingUp size={14} style={{ color: "#00F2EA" }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>TikTok Creative</h2>
              </div>
              <div className="space-y-2">
                {tiktokMockHashtags.map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid rgba(245,240,235,0.03)" }}>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>#{h.tag}</p>
                      <p className="text-[9px]" style={{ color: "rgba(245,240,235,0.25)" }}>{h.views} vues</p>
                    </div>
                    <span className="text-[10px] font-medium" style={{ color: h.change > 0 ? "var(--success)" : "var(--danger)" }}>
                      {h.change > 0 ? "+" : ""}{h.change}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: YouTube */}
            <div className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                <PlaySquare size={14} style={{ color: "#FF0000" }} />
                <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>YouTube</h2>
              </div>
              <div className={colClass(sourceMap.youtube?.items.length ?? 0)}>
                {(sourceMap.youtube?.items ?? []).slice(0, 10).map((item) => (
                  <TrendSourceRow key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Column 4: News */}
            <div className="space-y-4">
              {/* News */}
              <div className="p-3" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
                <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                  <Newspaper size={14} style={{ color: "var(--text-primary)" }} />
                  <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>News</h2>
                </div>
                <div className={colClass(sourceMap.news?.items.length ?? 0)}>
                  {(sourceMap.news?.items ?? []).slice(0, 5).map((item) => (
                    <TrendSourceRow key={item.id} item={item} compact />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Central widget, trending picks */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} style={{ color: "var(--accent)" }} />
              <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
                Tendances montantes à exploiter cette semaine
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {(data?.picks ?? []).slice(0, 5).map((pick) => (
                <TrendCard key={pick.id} trend={pick} />
              ))}
              {(data?.picks ?? []).length === 0 && (
                <div className="col-span-full flex flex-col items-center py-12 text-center">
                  <TrendingUp size={24} style={{ color: "rgba(245,240,235,0.1)" }} />
                  <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>
                    Aucune tendance pour l'instant
                  </p>
                  <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
                    Les tendances apparaîtront après analyse multi-sources
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Watchlist widget */}
          <div className="p-4" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                Ma watchlist
              </h3>
              <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>
                {(data?.watched_keywords ?? []).length}/10 (Premium)
              </span>
            </div>
            {(data?.watched_keywords ?? []).length === 0 ? (
              <div className="flex items-center justify-between py-3">
                <p className="text-xs" style={{ color: "rgba(245,240,235,0.2)" }}>
                  Aucun mot-clé surveillé. Ajoutez-en depuis les tendances.
                </p>
                <button
                  onClick={() => setShowAddKeyword(true)}
                  className="flex items-center gap-1 text-[10px] font-medium px-2 py-1"
                  style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
                >
                  <Plus size={10} /> Ajouter
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {data?.watched_keywords?.slice(0, 10).map((w, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 text-xs" style={{ borderBottom: "1px solid rgba(245,240,235,0.03)" }}>
                    <span style={{ color: "var(--text-primary)" }}>{w.keyword}</span>
                    <span style={{ color: "rgba(245,240,235,0.3)" }}>
                      {w.last_value !== null ? `Score: ${w.last_value}` : ", "}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Add keyword modal */}
      {showAddKeyword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-sm p-4" style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.1)" }}>
            <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              Ajouter à ma watchlist
            </h3>
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addToWatchlist()}
              placeholder="Mot-clé à surveiller…"
              className="w-full px-3 py-2 text-sm mb-3 bg-transparent border"
              style={{ borderColor: "rgba(245,240,235,0.1)", color: "var(--text-primary)" }}
              autoFocus
            />
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => setShowAddKeyword(false)} className="text-xs px-3 py-1.5" style={{ color: "rgba(245,240,235,0.3)" }}>
                Annuler
              </button>
              <button onClick={addToWatchlist} className="text-xs px-3 py-1.5 font-medium" style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Source row (for column lists) ───────────────────────────────

function TrendSourceRow({ item, compact }: { item: any; compact?: boolean }) {
  return (
    <div
      className="flex items-center justify-between py-1.5 px-1 cursor-pointer transition-colors hover:opacity-80"
      style={{ borderBottom: "1px solid rgba(245,240,235,0.03)" }}
      onClick={() => window.open(item.url ?? "#", "_blank")}
    >
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </p>
        {!compact && (
          <p className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>
            {item.category ?? "Tendance"}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-2 shrink-0">
        {item.sparkline?.length > 0 && (
          <svg width="40" height="16" viewBox="0 0 40 16" className="shrink-0">
            <polyline
              points={item.sparkline.map((v: number, i: number) => `${(i / 6) * 40},${16 - (v / 100) * 14}`).join(" ")}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
            />
          </svg>
        )}
        <span
          className="text-[10px] font-medium tabular-nums"
          style={{ color: item.change > 0 ? "var(--success)" : item.change < 0 ? "var(--danger)" : "rgba(245,240,235,0.3)" }}
        >
          {item.change > 0 ? "+" : ""}{item.change}%
        </span>
      </div>
    </div>
  );
}

// ─── Mock TikTok data ────────────────────────────────────────────

const tiktokMockHashtags = [
  { tag: "creatorEconomy", views: "2.4M", change: 45 },
  { tag: "AIforCreators", views: "1.8M", change: 38 },
  { tag: "fanEngagement", views: "1.2M", change: 32 },
  { tag: "automationTips", views: "980K", change: 28 },
  { tag: "newsletterGrowth", views: "850K", change: 22 },
  { tag: "contentStrategy", views: "720K", change: 18 },
  { tag: "monetization", views: "650K", change: 15 },
  { tag: "personalBrand", views: "580K", change: 12 },
  { tag: "audienceBuild", views: "510K", change: 9 },
  { tag: "viralSecrets", views: "450K", change: 6 },
];
