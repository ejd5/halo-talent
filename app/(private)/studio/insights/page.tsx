"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, BarChart3, TrendingUp, Lightbulb, Beaker, Sparkles,
  Loader, Heart, MessageCircle, Share2, Eye, ThumbsUp,
  AlertTriangle, ChevronDown, ChevronUp, Zap, Brain,
  Target, Clock, RefreshCw, ExternalLink, CheckCircle,
  XCircle, TrendingDown, Play, Plus, Search,
} from "lucide-react";
import type {
  AnalyticsInsight, PeriodComparison, ContentFeedback,
  ContentMetric, AbTest, PerformanceEntry,
} from "@/lib/analytics/types";
import { INSIGHT_CATEGORY_LABELS, INSIGHT_CATEGORY_COLORS, PLATFORM_COLORS } from "@/lib/analytics/types";

type Tab = "performance" | "apprentissage" | "abtests" | "recommandations";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "apprentissage", label: "Apprentissage", icon: Brain },
  { id: "abtests", label: "A/B Tests", icon: Beaker },
  { id: "recommandations", label: "Recommandations", icon: Sparkles },
];

export default function InsightsPage() {
  const [tab, setTab] = useState<Tab>("performance");

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      {/* Header */}
      <div className="px-4 md:px-6 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/studio" className="p-1 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.4)" }}>
            <ArrowLeft size={14} />
          </Link>
          <h1 className="text-lg italic" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Insights & Performance</h1>
        </div>
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Analyse tes contenus, apprends de tes données, optimise ta stratégie
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-4 md:px-6 overflow-x-auto" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 px-3 py-2.5 text-[11px] whitespace-nowrap transition-colors"
              style={{
                color: isActive ? "var(--accent)" : "rgba(255,255,255,0.4)",
                borderBottom: isActive ? "1px solid var(--accent)" : "1px solid transparent",
              }}>
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {tab === "performance" && <PerformanceTab />}
      {tab === "apprentissage" && <ApprentissageTab />}
      {tab === "abtests" && <AbTestsTab />}
      {tab === "recommandations" && <RecommandationsTab />}
    </div>
  );
}

// ─── Performance Tab ───

function PerformanceTab() {
  const [data, setData] = useState<{
    comparison: PeriodComparison | null;
    chart: any[];
    insights: AnalyticsInsight[];
  }>({ comparison: null, chart: [], insights: [] });
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ContentMetric[]>([]);
  const [sortField, setSortField] = useState<string>("metric_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [metricsLoading, setMetricsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, metricsRes] = await Promise.all([
          fetch("/api/studio/insights?mode=dashboard"),
          fetch("/api/studio/insights?mode=chart&days=30"),
        ]);
        const summary = await summaryRes.json();
        const chartData = await metricsRes.json();
        setData({
          comparison: summary.comparison ?? null,
          chart: chartData.chart ?? [],
          insights: summary.insights ?? [],
        });
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadMetrics() {
      setMetricsLoading(true);
      try {
        const params = new URLSearchParams({ mode: "metrics", limit: "50" });
        const res = await fetch(`/api/studio/insights?${params}`);
        const d = await res.json();
        setMetrics(d.metrics ?? []);
      } catch {} finally {
        setMetricsLoading(false);
      }
    }
    loadMetrics();
  }, []);

  function toggleSort(field: string) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const sortedMetrics = [...metrics].sort((a, b) => {
    const av = (a as any)[sortField] ?? 0;
    const bv = (b as any)[sortField] ?? 0;
    return sortDir === "asc"
      ? Number(av) - Number(bv)
      : Number(bv) - Number(av);
  });

  if (loading) {
    return <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>;
  }

  const { comparison, chart } = data;
  const maxChartVal = Math.max(...chart.map((c: any) => c.impressions ?? 0), 1);

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Period Comparison */}
      {comparison && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            label="Posts publiés"
            current={comparison.current.total_posts}
            previous={comparison.previous.total_posts}
            format="number"
          />
          <MetricCard
            label="Engagement moyen"
            current={comparison.current.avg_engagement}
            previous={comparison.previous.avg_engagement}
            format="percent"
            change={comparison.changes.engagement_change}
          />
          <MetricCard
            label="Impressions"
            current={comparison.current.total_impressions}
            previous={comparison.previous.total_impressions}
            format="number"
            change={comparison.changes.impressions_change}
          />
          <MetricCard
            label="Likes"
            current={comparison.current.total_likes}
            previous={comparison.previous.total_likes}
            format="number"
            change={comparison.changes.likes_change}
          />
        </div>
      )}

      {/* 30-Day Chart */}
      {chart.length > 0 && (
        <div className="rounded-sm p-4" style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}>
          <h3 className="text-[11px] font-medium mb-3 flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
            <BarChart3 size={12} /> 30 derniers jours
          </h3>
          <div className="flex items-end gap-[2px] h-24">
            {chart.map((c: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full rounded-sm transition-all hover:opacity-80 cursor-pointer relative group"
                  style={{
                    height: `${Math.max((c.impressions / maxChartVal) * 100, 3)}%`,
                    background: c.engagement_rate > 2 ? "var(--success)" : "var(--accent)",
                    opacity: 0.6 + (c.impressions / maxChartVal) * 0.4,
                  }}
                  title={`${c.date}: ${c.impressions} impressions, ${(c.engagement_rate ?? 0).toFixed(1)}% eng.`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5 text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            <span>{chart[0]?.date}</span>
            <span>{chart[chart.length - 1]?.date}</span>
          </div>
        </div>
      )}

      {/* Content Metrics Table */}
      <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--border-default)" }}>
        <div className="px-3 py-2 text-[11px] font-medium flex items-center justify-between" style={{ color: "var(--text-primary)", borderBottom: "1px solid rgba(255,255,255,0.06) " }}>
          <span>Contenus récents</span>
          {metricsLoading && <Loader size={10} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />}
        </div>
        {metrics.length === 0 && !metricsLoading ? (
          <div className="flex flex-col items-center py-12 text-center">
            <BarChart3 size={24} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucune donnée de performance</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
              Les métriques apparaîtront quand tu auras publié du contenu
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead>
                <tr style={{ color: "rgba(255,255,255,0.3)", borderBottom: "1px solid var(--border-default)" }}>
                  {["Date", "Platforme", "Type", "Impressions", "Engagement", "Likes", "Comments", "Partages"].map((h) => (
                    <th key={h} className="text-left px-2 py-2 font-medium cursor-pointer hover:text-white transition-colors"
                      onClick={() => toggleSort(h.toLowerCase())}>
                      {h} {sortField === h.toLowerCase() && (sortDir === "asc" ? "▲" : "▼")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedMetrics.map((m, i) => (
                  <tr key={m.id || i} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                    <td className="px-2 py-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {new Date(m.metric_date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-2 py-2">
                      <span className="px-1.5 py-0.5 rounded-sm text-[8px]" style={{
                        background: `${PLATFORM_COLORS[m.platform] || "#666"}20`,
                        color: PLATFORM_COLORS[m.platform] || "#999",
                      }}>
                        {m.platform}
                      </span>
                    </td>
                    <td className="px-2 py-2" style={{ color: "rgba(255,255,255,0.5)" }}>{m.content_type}</td>
                    <td className="px-2 py-2" style={{ color: "var(--text-primary)" }}>{m.impressions.toLocaleString()}</td>
                    <td className="px-2 py-2">
                      <span style={{ color: (m.engagement_rate ?? 0) > 3 ? "var(--success)" : (m.engagement_rate ?? 0) > 1 ? "var(--text-primary)" : "var(--danger)" }}>
                        {(m.engagement_rate ?? 0).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-2 py-2" style={{ color: "rgba(255,255,255,0.6)" }}>{m.likes}</td>
                    <td className="px-2 py-2" style={{ color: "rgba(255,255,255,0.6)" }}>{m.comments}</td>
                    <td className="px-2 py-2" style={{ color: "rgba(255,255,255,0.6)" }}>{m.shares}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ label, current, previous, format, change }: {
  label: string;
  current: number;
  previous: number;
  format: "number" | "percent";
  change?: number;
}) {
  const displayVal = format === "percent" ? `${current.toFixed(2)}%` : current.toLocaleString();
  const isUp = (change ?? 0) >= 0;

  return (
    <div className="rounded-sm p-3" style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}>
      <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{label}</p>
      <p className="text-lg font-medium mt-0.5" style={{ color: "var(--text-primary)" }}>{displayVal}</p>
      {change !== undefined && (
        <p className="text-[8px] mt-0.5 flex items-center gap-0.5" style={{ color: isUp ? "var(--success)" : "var(--danger)" }}>
          {isUp ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
          {isUp ? "+" : ""}{change}% vs période précédente
        </p>
      )}
    </div>
  );
}

// ─── Apprentissage Tab ───

function ApprentissageTab() {
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [feedbacks, setFeedbacks] = useState<ContentFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<ContentFeedback | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [summaryRes, fbRes] = await Promise.all([
          fetch("/api/studio/insights?mode=dashboard"),
          fetch("/api/studio/insights/feedback"),
        ]);
        const summary = await summaryRes.json();
        const fbData = await fbRes.json();
        setInsights(summary.insights ?? []);
        setFeedbacks(fbData.feedbacks ?? []);
        setLastFeedback(fbData.feedbacks?.[0] ?? null);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function runAnalysis() {
    setFeedbackLoading(true);
    try {
      const res = await fetch("/api/studio/insights/feedback", { method: "POST" });
      const data = await res.json();
      if (data.feedback) {
        setLastFeedback(data.feedback);
        setFeedbacks((prev) => [data.feedback, ...prev]);
      }
    } catch {} finally {
      setFeedbackLoading(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>;
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Insights Feed */}
      <div className="rounded-sm" style={{ border: "1px solid var(--border-default)" }}>
        <div className="px-3 py-2 text-[11px] font-medium flex items-center justify-between" style={{ color: "var(--text-primary)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="flex items-center gap-1.5"><Lightbulb size={12} /> Insights générés</span>
          <button onClick={runAnalysis} disabled={feedbackLoading}
            className="flex items-center gap-1 px-2 py-1 text-[9px] rounded-sm transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ background: "rgba(199,91,57,0.2)", color: "var(--accent)" }}>
            {feedbackLoading ? <Loader size={8} className="animate-spin" /> : <RefreshCw size={8} />}
            Analyser
          </button>
        </div>
        {insights.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <Brain size={24} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun insight pour le moment</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
              Lance une analyse pour découvrir des patterns dans tes contenus
            </p>
            <button onClick={runAnalysis} disabled={feedbackLoading}
              className="flex items-center gap-1.5 mt-4 px-3 py-1.5 text-[10px] rounded-sm transition-opacity hover:opacity-80"
              style={{ background: "var(--accent)", color: "#FFF" }}>
              <Zap size={10} /> Lancer l&apos;analyse
            </button>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border-default)" }}>
            {insights.map((insight) => (
              <div key={insight.id} className="px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[7px] px-1 py-0.5 rounded-sm font-medium" style={{
                    background: `${INSIGHT_CATEGORY_COLORS[insight.category] || "#666"}20`,
                    color: INSIGHT_CATEGORY_COLORS[insight.category] || "#999",
                  }}>
                    {INSIGHT_CATEGORY_LABELS[insight.category] || insight.category}
                  </span>
                  {insight.is_positive ? (
                    <TrendingUp size={10} style={{ color: "var(--success)" }} />
                  ) : (
                    <AlertTriangle size={10} style={{ color: "var(--danger)" }} />
                  )}
                </div>
                <h4 className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{insight.title}</h4>
                <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{insight.description}</p>
                {insight.change_percent != null && (
                  <p className="text-[8px] mt-1 flex items-center gap-0.5" style={{ color: insight.is_positive ? "var(--success)" : "var(--danger)" }}>
                    {insight.is_positive ? "+" : ""}{insight.change_percent}%
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Feedback Loop Results */}
      {lastFeedback && (
        <div className="rounded-sm p-4" style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}>
          <h3 className="text-[11px] font-medium mb-3 flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
            <Brain size={12} /> Feedback Loop · {lastFeedback.period_start} → {lastFeedback.period_end}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top Performers */}
            <div className="rounded-sm p-3" style={{ border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.04)" }}>
              <h4 className="text-[10px] font-medium flex items-center gap-1 mb-2" style={{ color: "var(--success)" }}>
                <TrendingUp size={10} /> Top 20% · {(lastFeedback.top_avg_engagement ?? 0).toFixed(2)}% engagement
              </h4>
              {lastFeedback.top_performers.length > 0 ? (
                <div className="space-y-1.5">
                  {lastFeedback.top_performers.slice(0, 5).map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-[9px]">
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>
                        {p.platform} · {p.content_type}
                      </span>
                      <span style={{ color: "var(--success)" }}>{(p.engagement_rate ?? 0).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>Pas assez de données</p>
              )}
              {lastFeedback.top_common_tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {lastFeedback.top_common_tags.map((tag: string) => (
                    <span key={tag} className="text-[7px] px-1 py-0.5 rounded-sm" style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)" }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Performers */}
            <div className="rounded-sm p-3" style={{ border: "1px solid rgba(229,72,77,0.2)", background: "rgba(229,72,77,0.04)" }}>
              <h4 className="text-[10px] font-medium flex items-center gap-1 mb-2" style={{ color: "var(--danger)" }}>
                <TrendingDown size={10} /> Bottom 20% · {(lastFeedback.bottom_avg_engagement ?? 0).toFixed(2)}% engagement
              </h4>
              {lastFeedback.bottom_performers.length > 0 ? (
                <div className="space-y-1.5">
                  {lastFeedback.bottom_performers.slice(0, 5).map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-[9px]">
                      <span style={{ color: "rgba(255,255,255,0.6)" }}>
                        {p.platform} · {p.content_type}
                      </span>
                      <span style={{ color: "var(--danger)" }}>{(p.engagement_rate ?? 0).toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>Pas assez de données</p>
              )}
              {lastFeedback.bottom_common_tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {lastFeedback.bottom_common_tags.map((tag: string) => (
                    <span key={tag} className="text-[7px] px-1 py-0.5 rounded-sm" style={{ background: "rgba(229,72,77,0.1)", color: "var(--danger)" }}>{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Insights Generated */}
          {lastFeedback.insights_generated.length > 0 && (
            <div className="mt-3 space-y-1">
              {lastFeedback.insights_generated.map((insight: string, i: number) => (
                <p key={i} className="text-[9px] flex items-start gap-1.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Sparkles size={8} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                  {insight}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Previous analyses */}
      {feedbacks.length > 1 && (
        <details className="rounded-sm" style={{ border: "1px solid var(--border-default)" }}>
          <summary className="px-3 py-2 text-[10px] font-medium cursor-pointer flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Clock size={10} /> Analyses précédentes ({feedbacks.length - 1})
          </summary>
          <div className="divide-y" style={{ borderColor: "var(--border-default)" }}>
            {feedbacks.slice(1).map((fb) => (
              <div key={fb.id} className="px-3 py-2 flex items-center justify-between text-[9px]">
                <span style={{ color: "rgba(255,255,255,0.5)" }}>
                  {fb.period_start} → {fb.period_end}
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)" }}>
                  {(fb.top_avg_engagement ?? 0).toFixed(2)}% top · {(fb.bottom_avg_engagement ?? 0).toFixed(2)}% bottom
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// ─── A/B Tests Tab ───

function AbTestsTab() {
  const [tests, setTests] = useState<AbTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  async function fetchTests() {
    setLoading(true);
    try {
      const res = await fetch("/api/studio/insights/ab-tests");
      const data = await res.json();
      setTests(data.tests ?? []);
    } catch {} finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {tests.length} test{tests.length > 1 ? "s" : ""}
        </p>
        <button onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 px-3 py-1.5 text-[10px] rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "var(--accent)", color: "#FFF" }}>
          <Plus size={10} /> Nouveau test
        </button>
      </div>

      {showCreate && <CreateAbTestForm onClose={() => { setShowCreate(false); fetchTests(); }} />}

      {loading ? (
        <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
      ) : tests.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Beaker size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun test A/B</p>
          <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
            Crée ton premier test pour comparer deux versions d&apos;un contenu
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {tests.map((test) => (
            <AbTestCard key={test.id} test={test} onUpdate={fetchTests} />
          ))}
        </div>
      )}
    </div>
  );
}

function CreateAbTestForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [contentType, setContentType] = useState("post");
  const [variantAData, setVariantAData] = useState("");
  const [variantBData, setVariantBData] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/studio/insights/ab-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          platform,
          content_type: contentType,
          variant_a_data: { caption: variantAData },
          variant_b_data: { caption: variantBData },
        }),
      });
      onClose();
    } catch {} finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm p-4 space-y-3" style={{ border: "1px solid var(--accent-border)", background: "rgba(199,91,57,0.04)" }}>
      <h4 className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>Nouveau test A/B</h4>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom du test"
        className="w-full text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none"
        style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
      <div className="flex gap-2">
        <select value={platform} onChange={(e) => setPlatform(e.target.value)}
          className="flex-1 text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none"
          style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
          {["instagram","tiktok","youtube","twitter","threads","linkedin","bluesky"].map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select value={contentType} onChange={(e) => setContentType(e.target.value)}
          className="flex-1 text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none"
          style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
          {["post","story","reel","carousel","short","video"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <textarea value={variantAData} onChange={(e) => setVariantAData(e.target.value)} placeholder="Variante A — caption / description"
        rows={2} className="w-full text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none resize-none"
        style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
      <textarea value={variantBData} onChange={(e) => setVariantBData(e.target.value)} placeholder="Variante B — caption / description"
        rows={2} className="w-full text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none resize-none"
        style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }} />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onClose}
          className="px-3 py-1.5 text-[10px] rounded-sm transition-colors hover:bg-white/5"
          style={{ border: "1px solid var(--border-default)", color: "rgba(255,255,255,0.4)" }}>
          Annuler
        </button>
        <button type="submit" disabled={saving || !name.trim()}
          className="px-3 py-1.5 text-[10px] rounded-sm transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ background: "var(--accent)", color: "#FFF" }}>
          {saving ? "..." : "Créer le test"}
        </button>
      </div>
    </form>
  );
}

function AbTestCard({ test, onUpdate }: { test: AbTest; onUpdate: () => void }) {
  const statusColors: Record<string, string> = {
    draft: "rgba(255,255,255,0.3)",
    running: "#3B82F6",
    completed: "var(--success)",
    cancelled: "var(--danger)",
  };
  const winnerLabel = test.winner === "a" ? "A" : test.winner === "b" ? "B" : test.winner === "draw" ? "Égalité" : "—";

  return (
    <div className="rounded-sm p-3" style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{test.name}</h4>
        <span className="text-[8px] px-1.5 py-0.5 rounded-sm" style={{
          background: `${statusColors[test.status] || "#666"}20`,
          color: statusColors[test.status] || "#999",
        }}>
          {test.status}
        </span>
      </div>

      {test.description && (
        <p className="text-[9px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>{test.description}</p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="text-center p-2 rounded-sm" style={{ background: test.winner === "a" ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)" }}>
          <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Variante A</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-primary)" }}>{(test.variant_a_conversion ?? 0).toFixed(2)}%</p>
          <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>{test.variant_a_impressions} impressions</p>
        </div>
        <div className="text-center p-2 rounded-sm" style={{ background: test.winner === "b" ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)" }}>
          <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>Variante B</p>
          <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-primary)" }}>{(test.variant_b_conversion ?? 0).toFixed(2)}%</p>
          <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>{test.variant_b_impressions} impressions</p>
        </div>
      </div>

      {test.status === "completed" && test.winner && test.winner !== "pending" && (
        <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: "1px solid var(--border-default)" }}>
          <span className="text-[9px] flex items-center gap-1" style={{ color: "var(--success)" }}>
            <CheckCircle size={8} /> Gagnant : Variante {winnerLabel}
          </span>
          {test.confidence > 0 && (
            <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              Confiance : {test.confidence}%
            </span>
          )}
        </div>
      )}

      {test.insight_learned && (
        <p className="text-[8px] mt-1 flex items-start gap-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          <Lightbulb size={8} className="mt-0.5 shrink-0" />
          {test.insight_learned}
        </p>
      )}
    </div>
  );
}

// ─── Recommandations Tab ───

function RecommandationsTab() {
  const [loading, setLoading] = useState(true);
  const [coaching, setCoaching] = useState(false);
  const [comparison, setComparison] = useState<PeriodComparison | null>(null);
  const [insights, setInsights] = useState<AnalyticsInsight[]>([]);
  const [feedback, setFeedback] = useState<ContentFeedback | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/studio/insights?mode=dashboard");
        const data = await res.json();
        setComparison(data.comparison ?? null);
        setInsights(data.insights ?? []);
        setFeedback(data.feedback ?? null);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function runCoach() {
    setCoaching(true);
    try {
      const res = await fetch("/api/studio/insights/coach", { method: "POST" });
      const data = await res.json();
      setComparison(data.comparison ?? null);
      setInsights(data.insights ?? []);
    } catch {} finally {
      setCoaching(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>;
  }

  const recommendationInsights = insights.filter((i) => i.category === "recommendation" || i.category === "opportunity");
  const positiveInsights = insights.filter((i) => i.category === "pattern" || i.category === "trend");
  const warnings = insights.filter((i) => i.category === "warning");

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Coach CTA */}
      <div className="rounded-sm p-4 text-center" style={{ border: "1px solid var(--accent-border)", background: "rgba(199,91,57,0.04)" }}>
        <Sparkles size={20} className="mx-auto mb-2" style={{ color: "var(--accent)" }} />
        <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Analytics Coach</h3>
        <p className="text-[10px] mt-1 mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
          Analyse tes performances et reçois des recommandations personnalisées
        </p>
        <button onClick={runCoach} disabled={coaching}
          className="flex items-center gap-1.5 mx-auto px-4 py-2 text-[11px] rounded-sm transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ background: "var(--accent)", color: "#FFF" }}>
          {coaching ? <Loader size={10} className="animate-spin" /> : <Brain size={10} />}
          {coaching ? "Analyse en cours..." : "Lancer le coaching"}
        </button>
      </div>

      {/* Recommendations */}
      {recommendationInsights.length > 0 && (
        <div className="rounded-sm" style={{ border: "1px solid var(--border-default)" }}>
          <div className="px-3 py-2 text-[11px] font-medium" style={{ color: "var(--text-primary)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="flex items-center gap-1.5"><Target size={12} /> Recommandations</span>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--border-default)" }}>
            {recommendationInsights.map((r) => (
              <div key={r.id} className="px-3 py-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[7px] px-1 py-0.5 rounded-sm" style={{
                    background: `${INSIGHT_CATEGORY_COLORS["recommendation"]}20`,
                    color: INSIGHT_CATEGORY_COLORS["recommendation"],
                  }}>Recommandation</span>
                </div>
                <h4 className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{r.title}</h4>
                <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {positiveInsights.length > 0 && (
          <div className="rounded-sm p-3" style={{ border: "1px solid rgba(16,185,129,0.2)", background: "rgba(16,185,129,0.04)" }}>
            <h4 className="text-[10px] font-medium mb-2 flex items-center gap-1" style={{ color: "var(--success)" }}>
              <TrendingUp size={10} /> Patterns gagnants ({positiveInsights.length})
            </h4>
            <div className="space-y-1.5">
              {positiveInsights.slice(0, 3).map((p) => (
                <p key={p.id} className="text-[9px]" style={{ color: "rgba(255,255,255,0.5)" }}>• {p.title}</p>
              ))}
            </div>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="rounded-sm p-3" style={{ border: "1px solid rgba(229,72,77,0.2)", background: "rgba(229,72,77,0.04)" }}>
            <h4 className="text-[10px] font-medium mb-2 flex items-center gap-1" style={{ color: "var(--danger)" }}>
              <AlertTriangle size={10} /> Points d&apos;attention ({warnings.length})
            </h4>
            <div className="space-y-1.5">
              {warnings.slice(0, 3).map((w) => (
                <p key={w.id} className="text-[9px]" style={{ color: "rgba(255,255,255,0.5)" }}>• {w.description}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feedback DNA */}
      {feedback && (
        <div className="rounded-sm p-3" style={{ border: "1px solid var(--border-default)" }}>
          <h4 className="text-[10px] font-medium mb-1 flex items-center gap-1" style={{ color: "var(--text-primary)" }}>
            <Brain size={10} /> Mise à jour DNA suggérée
          </h4>
          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Dernière analyse : {feedback.analysis_date}
          </p>
          {feedback.insights_generated && feedback.insights_generated.length > 0 && (
            <div className="mt-2 space-y-1">
              {feedback.insights_generated.map((insight, i) => (
                <p key={i} className="text-[9px] flex items-start gap-1" style={{ color: "rgba(255,255,255,0.5)" }}>
                  <Sparkles size={8} className="mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                  {insight}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {insights.length === 0 && !feedback && (
        <div className="flex flex-col items-center py-16 text-center">
          <Sparkles size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>
            Lance le coaching pour obtenir des recommandations
          </p>
          <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
            L&apos;analytics coach analyse tes performances et te suggère des actions
          </p>
        </div>
      )}
    </div>
  );
}
