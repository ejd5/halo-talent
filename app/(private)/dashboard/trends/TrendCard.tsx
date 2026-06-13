"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AggregatedTrend, TrendItem } from "@/lib/trends/types";
import { SOURCE_LABELS, SOURCE_COLORS } from "@/lib/trends/types";

interface TrendCardProps {
  trend: AggregatedTrend | TrendItem;
  compact?: boolean;
}

export function TrendCard({ trend, compact }: TrendCardProps) {
  const router = useRouter();
  const [ignored, setIgnored] = useState(false);

  if (ignored) return null;

  const t = trend as any;
  const isAggregated = "sources" in trend && Array.isArray(t.sources);
  const sources = isAggregated ? t.sources as TrendItem["source"][] : [t.source as TrendItem["source"]];
  const relevanceScore: number = isAggregated ? t.relevanceScore : t.score;
  const viralityScore: number = isAggregated ? t.viralityScore : t.score;
  const oppWindow: string = isAggregated ? t.opportunityWindow : ", ";

  return (
    <div
      className="group relative transition-all"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid rgba(245,240,235,0.06)",
        borderLeft: `3px solid ${relevanceScore > 75 ? "var(--accent)" : relevanceScore > 50 ? "rgba(199,91,57,0.4)" : "rgba(245,240,235,0.1)"}`,
      }}
    >
      <div className="p-3">
        {/* Badge row */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5"
            style={{
              backgroundColor: t.momentum > 30 ? "rgba(199,91,57,0.15)" : "rgba(245,240,235,0.06)",
              color: t.momentum > 30 ? "var(--accent)" : "rgba(245,240,235,0.3)",
            }}
          >
            {t.momentum > 0 ? `+${t.momentum}%` : `${t.momentum}%`}
          </span>
          {t.momentum > 30 && (
            <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>
              MONTANT
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-sm font-semibold mb-2 line-clamp-2"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          {t.title}
        </h3>

        {/* Sparkline */}
        {t.sparkline.length > 0 && (
          <div className="mb-3 h-8">
            <Sparkline data={t.sparkline} />
          </div>
        )}

        {/* Source icons */}
        <div className="flex items-center gap-2 mb-3">
          {sources.map((s) => (
            <span
              key={s}
              className="text-[9px] px-1.5 py-0.5 font-medium"
              style={{ backgroundColor: `${SOURCE_COLORS[s]}15`, color: SOURCE_COLORS[s] }}
            >
              {SOURCE_LABELS[s]}
            </span>
          ))}
        </div>

        {!compact && (
          <>
            {/* Relevance bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-[9px] mb-1">
                <span style={{ color: "rgba(245,240,235,0.3)" }}>Pertinence ADN</span>
                <span className="font-medium" style={{ color: relevanceScore > 70 ? "var(--accent)" : "rgba(245,240,235,0.3)" }}>
                  {relevanceScore}/100
                </span>
              </div>
              <div className="h-1" style={{ backgroundColor: "rgba(245,240,235,0.06)" }}>
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${relevanceScore}%`,
                    backgroundColor: relevanceScore > 70 ? "var(--accent)" : "rgba(245,240,235,0.15)",
                  }}
                />
              </div>
            </div>

            {/* Virality bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-[9px] mb-1">
                <span style={{ color: "rgba(245,240,235,0.3)" }}>Viralité prédite</span>
                <span className="font-medium" style={{ color: viralityScore > 70 ? "var(--accent)" : "rgba(245,240,235,0.3)" }}>
                  {viralityScore}/100
                </span>
              </div>
              <div className="h-1" style={{ backgroundColor: "rgba(245,240,235,0.06)" }}>
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${viralityScore}%`,
                    backgroundColor: viralityScore > 70 ? "var(--accent)" : "rgba(245,240,235,0.15)",
                  }}
                />
              </div>
            </div>

            {/* Opportunity window */}
            <p className="text-[9px] mb-3" style={{ color: "rgba(245,240,235,0.2)" }}>
              Fenêtre : {oppWindow}
            </p>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push(`/studio/composer?trend=${encodeURIComponent(t.query)}`)}
            className="flex-1 text-[10px] font-semibold uppercase tracking-wider py-1.5 transition-all"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
          >
            Créer un contenu
          </button>
          <button
            onClick={() => setIgnored(true)}
            className="text-[10px] px-2 py-1.5 font-medium transition-all hover:opacity-70"
            style={{ color: "rgba(245,240,235,0.2)" }}
          >
            Ignorer
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Mini sparkline ──────────────────────────────────────────────

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 28;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");

  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
