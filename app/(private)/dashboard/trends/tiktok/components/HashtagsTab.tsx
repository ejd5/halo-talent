"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp, TrendingDown, Minus, Plus, BarChart3,
  ExternalLink, Loader,
} from "lucide-react";

interface Hashtag {
  name: string;
  videos_count: number;
  rank: number;
  rank_diff: number;
  industry?: string;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function VelocityBadge({ diff }: { diff: number }) {
  if (diff > 0) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--danger)" }}>
        <TrendingDown size={10} /> -{diff}
      </span>
    );
  }
  if (diff < 0) {
    return (
      <span className="flex items-center gap-1 text-[10px] font-medium" style={{ color: "var(--success)" }}>
        <TrendingUp size={10} /> +{Math.abs(diff)}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-[10px]" style={{ color: "rgba(245,240,235,0.2)" }}>
      <Minus size={10} /> —
    </span>
  );
}

interface Props {
  hashtags: Hashtag[];
  onAnalyse: (name: string) => void;
  onAddToWatchlist: (keyword: string) => void;
}

export function HashtagsTab({ hashtags, onAnalyse, onAddToWatchlist }: Props) {
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const addToWatchlist = async (name: string, i: number) => {
    try {
      await fetch("/api/dashboard/trends/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: name, sources: ["tiktok"] }),
      });
      setCopiedIndex(i);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {}
  };

  if (hashtags.length === 0) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <BarChart3 size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
        <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>
          Aucun hashtag pour cette région
        </p>
        <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
          Essaie avec un pays plus large ou une période différente
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr style={{ color: "rgba(245,240,235,0.3)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
            <th className="text-left font-medium py-2.5 px-3 sticky top-0" style={{ backgroundColor: "var(--bg-primary)" }}>Rank</th>
            <th className="text-left font-medium py-2.5 px-3 sticky top-0" style={{ backgroundColor: "var(--bg-primary)" }}>Hashtag</th>
            <th className="text-right font-medium py-2.5 px-3 sticky top-0" style={{ backgroundColor: "var(--bg-primary)" }}>Vidéos</th>
            <th className="text-left font-medium py-2.5 px-3 sticky top-0" style={{ backgroundColor: "var(--bg-primary)" }}>Industrie</th>
            <th className="text-center font-medium py-2.5 px-3 sticky top-0" style={{ backgroundColor: "var(--bg-primary)" }}>Vélocité</th>
            <th className="text-right font-medium py-2.5 px-3 sticky top-0" style={{ backgroundColor: "var(--bg-primary)" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hashtags.map((h, i) => (
            <tr
              key={h.name}
              className="transition-all"
              style={{
                backgroundColor: i % 2 === 0 ? "rgba(245,240,235,0.02)" : "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(199,91,57,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  i % 2 === 0 ? "rgba(245,240,235,0.02)" : "transparent";
              }}
            >
              <td className="py-2.5 px-3">
                <div className="flex items-center gap-1">
                  <span className="font-medium tabular-nums" style={{ color: "var(--text-primary)" }}>
                    #{h.rank}
                  </span>
                  <VelocityBadge diff={h.rank_diff} />
                </div>
              </td>
              <td className="py-2.5 px-3">
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                  #{h.name}
                </span>
              </td>
              <td className="py-2.5 px-3 text-right tabular-nums" style={{ color: "rgba(245,240,235,0.5)" }}>
                {formatCount(h.videos_count)}
              </td>
              <td className="py-2.5 px-3">
                {h.industry ? (
                  <span className="text-[9px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(245,240,235,0.06)", color: "rgba(245,240,235,0.3)" }}>
                    {h.industry}
                  </span>
                ) : (
                  <span style={{ color: "rgba(245,240,235,0.15)" }}>—</span>
                )}
              </td>
              <td className="py-2.5 px-3 text-center">
                <VelocityBadge diff={h.rank_diff} />
              </td>
              <td className="py-2.5 px-3">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() =>
                      router.push(`/studio/composer?source=tiktok&hashtag=${encodeURIComponent(h.name)}`)
                    }
                    className="text-[9px] px-2 py-1 font-medium transition-all hover:opacity-70"
                    style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
                  >
                    Utiliser
                  </button>
                  <button
                    onClick={() => onAnalyse(h.name)}
                    className="text-[9px] px-2 py-1 transition-all hover:opacity-70"
                    style={{ color: "rgba(245,240,235,0.3)" }}
                  >
                    Analyser
                  </button>
                  <button
                    onClick={() => addToWatchlist(h.name, i)}
                    className="text-[9px] px-2 py-1 transition-all hover:opacity-70"
                    style={{ color: copiedIndex === i ? "var(--success)" : "rgba(245,240,235,0.2)" }}
                  >
                    {copiedIndex === i ? "✓" : "+ Watchlist"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
