"use client";

import { useState, useCallback } from "react";
import {
  Globe, Search, Loader, Plus, X, Download, BookmarkCheck,
  TrendingUp, ArrowUp, ArrowDown, Sparkles,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import type { TrendData, RelatedQuery, RegionInterest } from "@/lib/trends/providers/google";

// ─── Constants ───────────────────────────────────────────────────

const GEO_OPTIONS = [
  { value: "FR", label: "France" },
  { value: "US", label: "États-Unis" },
  { value: "GB", label: "Royaume-Uni" },
  { value: "CA", label: "Canada" },
  { value: "BE", label: "Belgique" },
  { value: "CH", label: "Suisse" },
  { value: "DE", label: "Allemagne" },
  { value: "ES", label: "Espagne" },
  { value: "IT", label: "Italie" },
  { value: "BR", label: "Brésil" },
];

const TIMEFRAMES = [
  { value: "now 7-d", label: "7 jours" },
  { value: "today 1-m", label: "1 mois" },
  { value: "today 12-m", label: "12 mois" },
  { value: "today 5-y", label: "5 ans" },
];

const SUGGESTIONS = [
  "IA création contenu",
  "OnlyFans marketing",
  "newsletter créateur",
  "short video trends",
  "personal branding",
  "creator economy",
  "automation marketing",
  "community building",
];

const KEYWORDS_STORAGE = "gt_compare_keywords";

// ─── Component ───────────────────────────────────────────────────

export default function GoogleTrendsPage() {
  const [query, setQuery] = useState("");
  const [geo, setGeo] = useState("FR");
  const [timeframe, setTimeframe] = useState("today 1-m");
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [results, setResults] = useState<(TrendData | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const activeKeywordCount = keywords.filter(Boolean).length;

  // ── Search ───────────────────────────────────────────────────

  const runSearch = useCallback(async () => {
    const active = keywords.filter(Boolean);
    if (active.length === 0) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/trends/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: active }),
      });

      if (res.status === 429) {
        setError("Trop de requêtes. Attends une minute avant de réessayer.");
        return;
      }
      if (!res.ok) {
        setError("Erreur lors de la recherche. Réessaie.");
        return;
      }

      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      setError("Erreur réseau. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  }, [keywords]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) runSearch();
  };

  // ── Keyword management ───────────────────────────────────────

  const addKeyword = () => {
    if (keywords.length >= 5) return;
    setKeywords((prev) => [...prev, ""]);
  };

  const removeKeyword = (idx: number) => {
    if (keywords.length <= 1) {
      setKeywords([""]);
      return;
    }
    setKeywords((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateKeyword = (idx: number, val: string) => {
    setKeywords((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  // ── Watchlist ────────────────────────────────────────────────

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

  // ── CSV export ───────────────────────────────────────────────

  const exportCSV = () => {
    if (results.length === 0) return;

    const dateMap = new Map<string, Record<string, number | string>>();

    for (const r of results) {
      if (!r) continue;
      for (const p of r.interest_over_time) {
        if (!dateMap.has(p.date)) {
          dateMap.set(p.date, { date: p.date });
        }
        const entry = dateMap.get(p.date)!;
        entry[r.keyword] = p.value;
      }
    }

    const rows = Array.from(dateMap.values()).sort(
      (a, b) => String(a.date).localeCompare(String(b.date)),
    );
    const header = ["date", ...results.filter(Boolean).map((r) => r!.keyword)];
    const csv = [
      header.join(","),
      ...rows.map((row) => header.map((h) => row[h as keyof typeof row] ?? "").join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "google_trends.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Chart data ───────────────────────────────────────────────

  const chartData: { date: string; [kw: string]: number | string | null }[] = [];
  if (results.length > 0) {
    const dateSet = new Set<string>();
    for (const r of results) {
      if (!r) continue;
      for (const p of r.interest_over_time) dateSet.add(p.date);
    }

    const sortedDates = Array.from(dateSet).sort();
    for (const date of sortedDates) {
      const point: { date: string; [kw: string]: number | string | null } = { date };
      for (const r of results) {
        if (!r) continue;
        const match = r.interest_over_time.find((p) => p.date === date);
        point[r.keyword] = match?.value ?? null;
      }
      chartData.push(point);
    }
  }

  const CHART_COLORS = ["var(--accent)", "var(--success)", "#4285F4", "#FFD700", "#A855F7"];

  // ── Empty state ──────────────────────────────────────────────

  const hasResults = results.some(Boolean);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Google Trends
        </h1>
        <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
          Explore les tendances de recherche · Apify + SerpApi + Cache 6h
        </p>
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Geo */}
        <select
          value={geo}
          onChange={(e) => setGeo(e.target.value)}
          className="px-3 py-1.5 text-xs border bg-transparent"
          style={{ borderColor: "rgba(245,240,235,0.1)", color: "var(--text-primary)" }}
        >
          {GEO_OPTIONS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>

        {/* Timeframe */}
        <div className="flex gap-0.5">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              onClick={() => setTimeframe(tf.value)}
              className="text-[10px] px-2 py-1.5 font-medium transition-all"
              style={{
                backgroundColor:
                  timeframe === tf.value
                    ? "rgba(199,91,57,0.12)"
                    : "transparent",
                color: timeframe === tf.value ? "var(--accent)" : "rgba(245,240,235,0.3)",
                border:
                  timeframe === tf.value
                    ? "1px solid rgba(199,91,57,0.3)"
                    : "1px solid transparent",
              }}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Search / Run */}
        <button
          onClick={runSearch}
          disabled={loading || activeKeywordCount === 0}
          className="flex items-center gap-1.5 text-xs px-4 py-1.5 font-medium transition-all"
          style={{
            backgroundColor: "var(--accent-soft)",
            color: "var(--accent)",
            border: "1px solid var(--accent-border)",
            opacity: loading || activeKeywordCount === 0 ? 0.5 : 1,
          }}
        >
          {loading ? (
            <Loader size={12} className="animate-spin" />
          ) : (
            <Search size={12} />
          )}
          {loading ? "Recherche..." : "Analyser"}
        </button>

        {/* Export CSV */}
        {hasResults && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-1 text-xs px-3 py-1.5 font-medium transition-all hover:opacity-70"
            style={{ color: "rgba(245,240,235,0.4)" }}
          >
            <Download size={12} />
            CSV
          </button>
        )}
      </div>

      {/* Keyword inputs */}
      <div className="space-y-2 mb-5">
        {keywords.map((kw, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className="text-[10px] font-mono w-4 shrink-0"
              style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}
            >
              #{i + 1}
            </span>
            <input
              type="text"
              value={kw}
              onChange={(e) => updateKeyword(i, e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                i === 0 ? "Entrez un mot-clé..." : "Mot-clé comparatif..."
              }
              className="flex-1 px-3 py-2 text-sm bg-transparent border"
              style={{
                borderColor: "rgba(245,240,235,0.1)",
                color: "var(--text-primary)",
              }}
            />
            {keywords.length > 1 && (
              <button
                onClick={() => removeKeyword(i)}
                className="p-1 hover:opacity-70"
                style={{ color: "rgba(245,240,235,0.2)" }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}

        {keywords.length < 5 && (
          <button
            onClick={addKeyword}
            className="flex items-center gap-1 text-xs px-2 py-1 font-medium transition-all hover:opacity-70"
            style={{ color: "rgba(245,240,235,0.3)" }}
          >
            <Plus size={12} /> Comparer ({keywords.length}/5)
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          className="text-xs px-3 py-2 mb-4"
          style={{
            backgroundColor: "rgba(196,69,54,0.1)",
            color: "var(--danger)",
            border: "1px solid rgba(196,69,54,0.2)",
          }}
        >
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div
          className="p-6 animate-pulse"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid rgba(245,240,235,0.06)",
          }}
        >
          <div
            className="h-48 mb-4"
            style={{ backgroundColor: "rgba(245,240,235,0.04)" }}
          />
          <div
            className="h-4 w-1/3 mb-2"
            style={{ backgroundColor: "rgba(245,240,235,0.04)" }}
          />
          <div
            className="h-4 w-1/2"
            style={{ backgroundColor: "rgba(245,240,235,0.04)" }}
          />
        </div>
      )}

      {/* Results */}
      {hasResults && !loading && (
        <div className="space-y-6">
          {/* Main chart */}
          <div
            className="p-4"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid rgba(245,240,235,0.06)",
            }}
          >
            <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              Évolution de l&apos;intérêt
            </h2>
            <div style={{ width: "100%", height: 256, position: "relative" }}>
              <ResponsiveContainer width="100%" height={256}>
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(245,240,235,0.04)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "rgba(245,240,235,0.3)" }}
                    axisLine={{ stroke: "rgba(245,240,235,0.06)" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "rgba(245,240,235,0.3)" }}
                    axisLine={{ stroke: "rgba(245,240,235,0.06)" }}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-primary)",
                      border: "1px solid rgba(245,240,235,0.1)",
                      borderRadius: 0,
                      fontSize: 12,
                      color: "var(--text-primary)",
                    }}
                    labelStyle={{ color: "rgba(245,240,235,0.5)", fontSize: 10 }}
                  />
                  {results.filter(Boolean).map((r, i) => (
                    <Line
                      key={r!.keyword}
                      type="monotone"
                      dataKey={r!.keyword}
                      stroke={CHART_COLORS[i % CHART_COLORS.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, fill: CHART_COLORS[i % CHART_COLORS.length] }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {results.filter(Boolean).map((r, i) => (
                <div key={r!.keyword} className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2"
                    style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-xs" style={{ color: "rgba(245,240,235,0.5)" }}>
                    {r!.keyword}
                  </span>
                  <span className="text-[10px] tabular-nums" style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}>
                    {r!.current_value}/100
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Related queries */}
            <div
              className="p-4"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid rgba(245,240,235,0.06)",
              }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-primary)" }}>
                Requêtes associées
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Top */}
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.3)" }}>
                    Top
                  </p>
                  <div className="space-y-1">
                    {(results.find(Boolean)?.related_queries?.top ?? []).slice(0, 8).map((q, i) => (
                      <RelatedRow key={i} query={q} color="var(--success)" />
                    ))}
                  </div>
                </div>
                {/* Rising */}
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.3)" }}>
                    En hausse
                  </p>
                  <div className="space-y-1">
                    {(results.find(Boolean)?.related_queries?.rising ?? []).slice(0, 8).map((q, i) => (
                      <RelatedRow key={i} query={q} color="var(--accent)" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Interest by region */}
            <div
              className="p-4"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid rgba(245,240,235,0.06)",
              }}
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-primary)" }}>
                Intérêt par région
              </h3>
              <div className="space-y-1">
                {(results.find(Boolean)?.interest_by_region ?? []).slice(0, 10).map((r, i) => (
                  <RegionRow key={i} region={r} />
                ))}
              </div>
            </div>
          </div>

          {/* Per-keyword detail */}
          {results.filter(Boolean).map((r) => (
            <div
              key={r!.keyword}
              className="p-4"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid rgba(245,240,235,0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {r!.keyword}
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] px-1.5 py-0.5 font-medium"
                    style={{
                      backgroundColor:
                        r!.source === "apify"
                          ? "rgba(66,133,244,0.1)"
                          : r!.source === "serpapi"
                            ? "rgba(199,91,57,0.1)"
                            : r!.source === "cache"
                              ? "rgba(122,154,101,0.1)"
                              : "rgba(245,240,235,0.06)",
                      color:
                        r!.source === "apify"
                          ? "#4285F4"
                          : r!.source === "serpapi"
                            ? "var(--accent)"
                            : r!.source === "cache"
                              ? "var(--success)"
                              : "rgba(245,240,235,0.3)",
                    }}
                  >
                    {r!.source === "apify"
                      ? "Apify"
                      : r!.source === "serpapi"
                        ? "SerpApi"
                        : r!.source === "cache"
                          ? "Cache 6h"
                          : "Mock"}
                  </span>
                  <button
                    onClick={() => addToWatchlist(r!.keyword)}
                    className="flex items-center gap-1 text-[10px] px-2 py-1 font-medium transition-all hover:opacity-70"
                    style={{ color: "rgba(245,240,235,0.3)" }}
                  >
                    <BookmarkCheck size={10} />
                    {copied ? "Ajouté !" : "Watchlist"}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(245,240,235,0.4)" }}>
                <span>
                  Pic : <strong style={{ color: "var(--text-primary)" }}>{r!.peak_value}</strong>/100
                </span>
                <span>
                  Actuel : <strong style={{ color: "var(--text-primary)" }}>{r!.current_value}</strong>/100
                </span>
                <span>
                  Source : <strong style={{ color: "var(--text-primary)" }}>{r!.source === "apify" ? "Apify" : r!.source === "serpapi" ? "SerpApi" : r!.source === "cache" ? "Cache Supabase" : "Mock (dev)"}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!hasResults && !loading && !error && (
        <div
          className="flex flex-col items-center py-16 text-center"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid rgba(245,240,235,0.06)",
          }}
        >
          <Globe size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
          <h2 className="text-sm font-semibold mt-4" style={{ color: "rgba(245,240,235,0.15)" }}>
            Cherche un mot-clé pour commencer
          </h2>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
            Compare jusqu&apos;à 5 mots-clés avec l&apos;historique Google Trends
          </p>

          <div className="mt-6 max-w-md">
            <p className="text-[10px] font-medium mb-2" style={{ color: "rgba(245,240,235,0.2)" }}>
              Suggestions populaires
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setKeywords([s]);
                    setTimeout(runSearch, 100);
                  }}
                  className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 font-medium transition-all"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent)",
                    border: "1px solid var(--accent-border)",
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

// ─── Sub-components ──────────────────────────────────────────────

function RelatedRow({ query, color }: { query: RelatedQuery; color: string }) {
  return (
    <div
      className="flex items-center justify-between py-1 px-1.5 text-xs"
      style={{ borderBottom: "1px solid rgba(245,240,235,0.03)" }}
    >
      <span className="truncate flex-1" style={{ color: "var(--text-primary)" }}>
        {query.query}
      </span>
      <span className="tabular-nums ml-2" style={{ color }}>
        {query.value}
      </span>
    </div>
  );
}

function RegionRow({ region }: { region: RegionInterest }) {
  const intensity = region.value / 100;
  const bgOpacity = 0.04 + intensity * 0.12;

  return (
    <div
      className="flex items-center justify-between py-1.5 px-2 text-xs"
      style={{
        borderBottom: "1px solid rgba(245,240,235,0.03)",
        backgroundColor: `rgba(199,91,57,${bgOpacity})`,
      }}
    >
      <span style={{ color: "var(--text-primary)" }}>{region.region}</span>
      <div className="flex items-center gap-2">
        <div
          className="h-1.5 w-16"
          style={{ backgroundColor: "rgba(245,240,235,0.06)" }}
        >
          <div
            className="h-full"
            style={{
              width: `${region.value}%`,
              backgroundColor: "var(--accent)",
            }}
          />
        </div>
        <span className="tabular-nums w-8 text-right" style={{ color: "rgba(245,240,235,0.4)" }}>
          {region.value}
        </span>
      </div>
    </div>
  );
}
