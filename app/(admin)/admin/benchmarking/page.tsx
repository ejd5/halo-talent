"use client";

import { useState, useEffect, useMemo } from "react";
import {
  BarChart3, TrendingUp, TrendingDown, Users, Shield,
  ChevronRight, DollarSign, ArrowUp, ArrowDown, Target,
  Zap, Clock, Star, Lightbulb, Award, Activity, Layers,
  UserCheck, Search, X, RefreshCw, Download, FileText,
  Plus, MessageSquare, Share2, CheckCircle,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────

interface CreatorPerf {
  id: string; name: string; department: string; tier: string;
  revenue: number; prev_revenue: number; growth: number;
  active_fans: number; engagement_score: number; perf_score: number;
  revenue_per_fan: number; joined_at: string;
}

interface DepartmentData {
  name: string; creator_count: number; avg_revenue: number;
  avg_growth: number; churn_rate: number; total_revenue: number;
  revenue_series: { month: string; revenue: number }[];
  best_practices: string[];
}

interface TierData {
  name: string; count: number; avg_revenue: number;
  avg_growth: number; avg_months_in_tier: number;
  members: any[];
}

interface FlowData {
  from: string; to: string; up: number; down: number;
}

interface CohortData {
  cohort: string; size: number; retention_curve: number[]; months: string[];
}

interface CompareCreator {
  id: string; name: string; department: string;
  commission_tier: string; revenue: number; growth: number;
  active_fans: number; pending_drafts: number;
  ppv_unlock_rate: number; revenue_per_fan: number;
  revenue_history: number[]; months: string[];
}

// ─── Tabs ────────────────────────────────────────────────────

type Tab = "overview" | "departments" | "tiers" | "cohorts" | "insights";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
  { id: "departments", label: "Par département", icon: Users },
  { id: "tiers", label: "Par tier", icon: Shield },
  { id: "cohorts", label: "Par ancienneté", icon: Clock },
  { id: "insights", label: "Insights IA", icon: Lightbulb },
];

// ─── Mini bar chart ─────────────────────────────────────────

function MiniBar({ value, max, color }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full h-2" style={{ backgroundColor: "rgba(245,240,235,0.04)" }}>
      <div className="h-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color || "var(--accent)", opacity: 0.7 }} />
    </div>
  );
}

// ─── Simple bar chart for departments ───────────────────────

function DeptBarChart({ data, color }: { data: { label: string; value: number }[]; color?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-1.5">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[9px] w-20 text-right shrink-0" style={{ color: "rgba(245,240,235,0.3)" }}>{d.label}</span>
          <div className="flex-1 h-4" style={{ backgroundColor: "rgba(245,240,235,0.04)" }}>
            <div className="h-full transition-all" style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color || "var(--accent)", opacity: 0.7 }} />
          </div>
          <span className="text-[9px] w-16 shrink-0" style={{ color: "var(--text-primary)" }}>{d.value.toLocaleString()}€</span>
        </div>
      ))}
    </div>
  );
}

// ─── Line chart ─────────────────────────────────────────────

function MiniLineChart({ series, height = 80, color }: { series: number[]; height?: number; color?: string }) {
  const max = Math.max(...series, 1);
  const w = 100;
  const h = height;

  if (series.length < 2) return <div style={{ height }} />;

  const points = series.map((v, i) => {
    const x = (i / (series.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  });

  const pathD = `M${points.join(" L")}`;
  const areaD = `${pathD} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color?.replace("#", "") || "default"}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color || "var(--accent)"} stopOpacity={0.2} />
          <stop offset="100%" stopColor={color || "var(--accent)"} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#grad-${color?.replace("#", "") || "default"})`} />
      <path d={pathD} fill="none" stroke={color || "var(--accent)"} strokeWidth="1.5" />
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════
//  OVERVIEW TAB
// ═════════════════════════════════════════════════════════════

function OverviewTab() {
  const [data, setData] = useState<{
    top_performers: CreatorPerf[]; top_growth: CreatorPerf[];
    top_regression: CreatorPerf[]; top_efficiency: CreatorPerf[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/benchmarking/overview")
      .then((r) => r.json()).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{[1, 2, 3, 4].map((i) => <div key={i} className="h-16 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>;

  const SectionTable = ({ title, items, color, metric }: { title: string; items: CreatorPerf[]; color: string; metric: keyof CreatorPerf }) => (
    <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
      <h3 className="text-xs font-medium mb-2 flex items-center gap-1.5" style={{ color }}>
        {title === "Top Performers" ? <Award size={12} /> : title === "Plus forte progression" ? <ArrowUp size={12} /> : title === "Régression" ? <ArrowDown size={12} /> : <Target size={12} />}
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-[10px] py-4 text-center" style={{ color: "rgba(245,240,235,0.2)" }}>Aucune donnée</p>
      ) : (
        <div className="space-y-1">
          {items.slice(0, 10).map((c, i) => (
            <div key={c.id} className="flex items-center gap-2 py-1.5 text-[10px]" style={{ borderBottom: i < items.length - 1 ? "1px solid rgba(245,240,235,0.03)" : "none" }}>
              <span className="w-4 text-center font-medium" style={{ color: i < 3 ? "var(--accent)" : "rgba(245,240,235,0.2)" }}>{i + 1}</span>
              <div className="flex-1 min-w-0">
                <span className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{c.name}</span>
                <span className="ml-1.5" style={{ color: "rgba(245,240,235,0.2)" }}>{c.department}</span>
              </div>
              <span className="font-semibold w-20 text-right" style={{ color: metric === "growth" || metric === "perf_score" ? color : "var(--accent)" }}>
                {metric === "growth" ? `${c.growth > 0 ? "+" : ""}${c.growth}%` : metric === "revenue_per_fan" ? `${c.revenue_per_fan}€` : metric === "perf_score" ? String(c.perf_score) : `${c.revenue}€`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <SectionTable title="Top Performers" items={data?.top_performers || []} color="var(--accent)" metric="perf_score" />
      <SectionTable title="Plus forte progression" items={data?.top_growth || []} color="var(--success)" metric="growth" />
      <SectionTable title="Régression" items={data?.top_regression || []} color="var(--danger)" metric="growth" />
      <SectionTable title="Plus efficaces (rev/fan)" items={data?.top_efficiency || []} color="var(--accent)" metric="revenue_per_fan" />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  DEPARTMENTS TAB
// ═════════════════════════════════════════════════════════════

function DepartmentsTab() {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/benchmarking/departments")
      .then((r) => r.json()).then((d) => setDepartments(d.departments || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>;

  if (departments.length === 0) return <p className="text-xs py-8 text-center" style={{ color: "rgba(245,240,235,0.2)" }}>Aucune donnée département</p>;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-2">
        {departments.slice(0, 4).map((d) => (
          <div key={d.name} className="p-2.5" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
            <p className="text-[9px] font-medium" style={{ color: "var(--accent)" }}>{d.name}</p>
            <p className="text-lg font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{d.avg_revenue}€</p>
            <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>Moyen/créateur · {d.creator_count} créateurs</p>
            <div className="flex gap-2 mt-1 text-[8px]">
              <span style={{ color: d.avg_growth > 0 ? "var(--success)" : "var(--danger)" }}>{d.avg_growth > 0 ? "+" : ""}{d.avg_growth}%</span>
              <span style={{ color: "rgba(245,240,235,0.2)" }}>Churn: {d.churn_rate}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart: average revenue */}
      <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
        <p className="text-[9px] uppercase tracking-wider mb-3" style={{ color: "rgba(245,240,235,0.2)" }}>Revenus moyens par département</p>
        <DeptBarChart data={departments.map((d) => ({ label: d.name, value: d.avg_revenue }))} color="var(--accent)" />
      </div>

      {/* Line chart: monthly evolution */}
      <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
        <p className="text-[9px] uppercase tracking-wider mb-3" style={{ color: "rgba(245,240,235,0.2)" }}>Évolution mensuelle</p>
        <div className="grid grid-cols-2 gap-4">
          {departments.map((d, i) => (
            <div key={d.name} className="p-2" style={{ backgroundColor: "rgba(245,240,235,0.01)" }}>
              <p className="text-[9px] font-medium mb-1" style={{ color: "var(--accent)" }}>{d.name}</p>
              <MiniLineChart series={d.revenue_series.map((s) => s.revenue)} height={60} color={i === 0 ? "var(--accent)" : i === 1 ? "var(--success)" : i === 2 ? "var(--danger)" : "var(--text-primary)"} />
              <div className="flex justify-between text-[7px] mt-1" style={{ color: "rgba(245,240,235,0.15)" }}>
                <span>{d.revenue_series[0]?.month?.slice(0, 7) || ""}</span>
                <span>{d.revenue_series[d.revenue_series.length - 1]?.month?.slice(0, 7) || ""}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[10px]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              {["Département", "Créateurs", "Rev. moyen", "Croissance moy.", "Churn", "Rev. total"].map((h) => (
                <th key={h} className="text-left font-medium py-2 px-2" style={{ color: "rgba(245,240,235,0.2)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d.name}>
                <td className="py-2 px-2 font-medium" style={{ color: "var(--text-primary)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{d.name}</td>
                <td className="py-2 px-2" style={{ color: "rgba(245,240,235,0.5)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{d.creator_count}</td>
                <td className="py-2 px-2" style={{ color: "var(--accent)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{d.avg_revenue}€</td>
                <td className="py-2 px-2" style={{ color: d.avg_growth > 0 ? "var(--success)" : "var(--danger)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{d.avg_growth > 0 ? "+" : ""}{d.avg_growth}%</td>
                <td className="py-2 px-2" style={{ color: d.churn_rate > 10 ? "var(--danger)" : "rgba(245,240,235,0.5)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{d.churn_rate}%</td>
                <td className="py-2 px-2 font-semibold" style={{ color: "var(--text-primary)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{d.total_revenue}€</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  TIERS TAB
// ═════════════════════════════════════════════════════════════

function TiersTab() {
  const [tiers, setTiers] = useState<TierData[]>([]);
  const [flows, setFlows] = useState<FlowData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/benchmarking/tiers")
      .then((r) => r.json())
      .then((d) => { setTiers(d.tiers || []); setFlows(d.flows || []); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const colors = ["var(--accent)", "var(--success)", "var(--text-primary)", "var(--danger)", "var(--accent)"];

  if (loading) return <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-12 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>;

  return (
    <div className="space-y-4">
      {/* Tier distribution */}
      <div className="grid grid-cols-5 gap-2">
        {tiers.map((t, i) => (
          <div key={t.name} className="p-2.5 text-center" style={{ borderTop: `2px solid ${colors[i]}`, backgroundColor: "rgba(245,240,235,0.02)" }}>
            <p className="text-[9px] font-medium" style={{ color: colors[i] }}>{t.name}</p>
            <p className="text-xl font-semibold mt-1" style={{ color: "var(--text-primary)" }}>{t.count}</p>
            <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>créateurs</p>
            <p className="text-[9px] mt-1" style={{ color: "var(--accent)" }}>{t.avg_revenue}€</p>
            <p className="text-[7px]" style={{ color: "rgba(245,240,235,0.15)" }}>moyen</p>
            <p className="text-[9px] mt-1" style={{ color: t.avg_growth > 0 ? "var(--success)" : "var(--danger)" }}>{t.avg_growth > 0 ? "+" : ""}{t.avg_growth}%</p>
            <p className="text-[7px]" style={{ color: "rgba(245,240,235,0.15)" }}>croissance</p>
            <p className="text-[8px] mt-1" style={{ color: "rgba(245,240,235,0.2)" }}>~{t.avg_months_in_tier} mois</p>
          </div>
        ))}
      </div>

      {/* Flow (Sankey-like) */}
      {flows.length > 0 && (
        <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
          <p className="text-[9px] uppercase tracking-wider mb-3" style={{ color: "rgba(245,240,235,0.2)" }}>Flux entre tiers</p>
          <div className="space-y-2">
            {flows.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-[10px]">
                <span className="w-20 text-right font-medium" style={{ color: colors[i] }}>{f.from}</span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-3 flex" style={{ backgroundColor: "rgba(245,240,235,0.04)" }}>
                    <div className="h-full transition-all" style={{ width: `${Math.min(f.up * 10, 100)}%`, backgroundColor: "var(--success)", opacity: 0.7 }} title={`${f.up} montent`} />
                  </div>
                  <ChevronRight size={10} style={{ color: "rgba(245,240,235,0.2)" }} />
                  <span className="w-16 text-center" style={{ color: colors[i + 1] || "var(--text-primary)" }}>{f.to}</span>
                  <div className="flex-1 h-3 flex" style={{ backgroundColor: "rgba(245,240,235,0.04)" }}>
                    <div className="h-full transition-all" style={{ width: `${Math.min(f.down * 10, 100)}%`, backgroundColor: "var(--danger)", opacity: 0.7 }} title={`${f.down} descendent`} />
                  </div>
                </div>
                <div className="flex gap-2 w-24 text-[8px]">
                  <span style={{ color: "var(--success)" }}>↑ {f.up}</span>
                  <span style={{ color: "var(--danger)" }}>↓ {f.down}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tiers.length === 0 && <p className="text-xs py-8 text-center" style={{ color: "rgba(245,240,235,0.2)" }}>Aucune donnée de tiers</p>}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  COHORTS TAB
// ═════════════════════════════════════════════════════════════

function CohortsTab() {
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/benchmarking/cohorts")
      .then((r) => r.json()).then((d) => setCohorts(d.cohorts || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>;

  if (cohorts.length === 0) return <p className="text-xs py-8 text-center" style={{ color: "rgba(245,240,235,0.2)" }}>Aucune donnée de cohorte</p>;

  return (
    <div className="space-y-4">
      <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
        <p className="text-[9px] uppercase tracking-wider mb-3" style={{ color: "rgba(245,240,235,0.2)" }}>Retention curves — revenu moyen par créateur</p>
        <div className="space-y-3">
          {cohorts.slice(0, 6).map((c, i) => (
            <div key={c.cohort}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-medium" style={{ color: i === 0 ? "var(--accent)" : "rgba(245,240,235,0.5)" }}>
                  {c.cohort} <span style={{ color: "rgba(245,240,235,0.15)" }}>({c.size} créateurs)</span>
                </span>
                <span className="text-[8px]" style={{ color: "rgba(245,240,235,0.2)" }}>
                  M0: {c.retention_curve[0] || 0}€ · M{Math.min(c.retention_curve.length - 1, 0)}: {c.retention_curve[c.retention_curve.length - 1] || 0}€
                </span>
              </div>
              <MiniLineChart series={c.retention_curve} height={40} color={i === 0 ? "var(--accent)" : i === 1 ? "var(--success)" : i === 2 ? "var(--danger)" : "rgba(245,240,235,0.3)"} />
            </div>
          ))}
        </div>
      </div>

      {/* Month-by-month comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[9px]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <thead>
            <tr>
              <th className="text-left font-medium py-2 px-2" style={{ color: "rgba(245,240,235,0.2)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>Cohorte</th>
              <th className="text-left font-medium py-2 px-2" style={{ color: "rgba(245,240,235,0.2)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>Taille</th>
              {["M1", "M2", "M3", "M4", "M5", "M6"].map((m) => (
                <th key={m} className="text-right font-medium py-2 px-2" style={{ color: "rgba(245,240,235,0.2)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.slice(0, 8).map((c) => (
              <tr key={c.cohort}>
                <td className="py-2 px-2 font-medium" style={{ color: "var(--text-primary)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{c.cohort}</td>
                <td className="py-2 px-2" style={{ color: "rgba(245,240,235,0.5)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{c.size}</td>
                {c.retention_curve.slice(0, 6).map((v, i) => (
                  <td key={i} className="py-2 px-2 text-right" style={{ color: v > 0 ? "var(--accent)" : "rgba(245,240,235,0.15)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                    {v}€
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  INSIGHTS TAB
// ═════════════════════════════════════════════════════════════

function InsightsTab() {
  const [insights, setInsights] = useState<{ id: string; content: string; period_start: string; created_at: string }[]>([]);
  const [practices, setPractices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeInsight, setActiveInsight] = useState(0);
  const [showAddPractice, setShowAddPractice] = useState(false);
  const [practiceForm, setPracticeForm] = useState({ category: "", insight: "", applicable_to_dept: "" });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/benchmarking/best-practices").then((r) => r.json()),
    ]).then(([bp]) => {
      setPractices(bp.practices || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAddPractice = async () => {
    if (!practiceForm.category || !practiceForm.insight) return;
    await fetch("/api/admin/benchmarking/best-practices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(practiceForm),
    });
    setPracticeForm({ category: "", insight: "", applicable_to_dept: "" });
    setShowAddPractice(false);
    const r = await fetch("/api/admin/benchmarking/best-practices");
    const d = await r.json();
    setPractices(d.practices || []);
  };

  const toggleShare = async (id: string, shared: boolean) => {
    await fetch("/api/admin/benchmarking/best-practices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, shared_with_creators: !shared }),
    });
    setPractices((prev) => prev.map((p) => (p.id === id ? { ...p, shared_with_creators: !shared } : p)));
  };

  const insightsList = insights;

  if (loading) return <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-24 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>;

  return (
    <div className="space-y-4">
      {/* Weekly analysis */}
      <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.2)" }}>Analyse hebdomadaire IA</p>
          <span className="text-[8px]" style={{ color: "rgba(245,240,235,0.15)" }}>
            Généré chaque lundi via cron
          </span>
        </div>

        {insightsList.length === 0 ? (
          <div className="py-6 text-center">
            <Lightbulb size={24} style={{ color: "rgba(245,240,235,0.06)" }} />
            <p className="text-xs mt-2" style={{ color: "rgba(245,240,235,0.15)" }}>
              L&apos;analyse hebdomadaire sera disponible après le premier cron
            </p>
            <p className="text-[9px] mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>
              Configure CRON_SECRET et active le cron /api/cron/benchmarking/weekly-insights
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-1 mb-2">
              {insightsList.map((_, i) => (
                <button key={i} onClick={() => setActiveInsight(i)} className="h-1 flex-1 transition-all" style={{ backgroundColor: i === activeInsight ? "var(--accent)" : "rgba(245,240,235,0.06)" }} />
              ))}
            </div>
            <div className="p-3 text-[10px] leading-relaxed whitespace-pre-wrap" style={{ backgroundColor: "rgba(199,91,57,0.03)", color: "rgba(245,240,235,0.7)" }}>
              {insightsList[activeInsight]?.content}
            </div>
          </div>
        )}
      </div>

      {/* Best practices */}
      <div className="p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.2)" }}>Best practices extraites</p>
          <button
            onClick={() => setShowAddPractice(!showAddPractice)}
            className="flex items-center gap-1 text-[9px] py-1 px-2"
            style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
          >
            <Plus size={10} /> Ajouter
          </button>
        </div>

        {showAddPractice && (
          <div className="p-3 mb-3 space-y-2" style={{ backgroundColor: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <input placeholder="Catégorie (ex: Timing, IA, Cross-platform)" value={practiceForm.category} onChange={(e) => setPracticeForm((p) => ({ ...p, category: e.target.value }))}
              className="w-full p-2 text-[10px] bg-transparent" style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
            <textarea placeholder="Insight..." value={practiceForm.insight} onChange={(e) => setPracticeForm((p) => ({ ...p, insight: e.target.value }))}
              rows={2} className="w-full p-2 text-[10px] bg-transparent resize-none" style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
            <input placeholder="Département cible (optionnel)" value={practiceForm.applicable_to_dept} onChange={(e) => setPracticeForm((p) => ({ ...p, applicable_to_dept: e.target.value }))}
              className="w-full p-2 text-[10px] bg-transparent" style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.1)" }} />
            <button onClick={handleAddPractice} className="text-[10px] font-semibold py-1.5 px-3" style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}>
              Sauvegarder
            </button>
          </div>
        )}

        {practices.length === 0 ? (
          <p className="text-[10px] py-4 text-center" style={{ color: "rgba(245,240,235,0.2)" }}>Aucune best practice. Elles sont extraites automatiquement ou ajoutées manuellement.</p>
        ) : (
          <div className="space-y-1.5">
            {practices.map((p) => (
              <div key={p.id} className="p-2.5 flex items-start gap-2" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[8px] px-1 py-px font-medium" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}>{p.category}</span>
                    {p.applicable_to_dept && (
                      <span className="text-[7px]" style={{ color: "rgba(245,240,235,0.2)" }}>{p.applicable_to_dept}</span>
                    )}
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--text-primary)" }}>{p.insight}</p>
                  {p.evidence && Object.keys(p.evidence).length > 0 && (
                    <p className="text-[8px] mt-0.5" style={{ color: "rgba(245,240,235,0.15)" }}>Preuves: {JSON.stringify(p.evidence)}</p>
                  )}
                </div>
                <button
                  onClick={() => toggleShare(p.id, p.shared_with_creators)}
                  className="flex items-center gap-1 text-[8px] py-1 px-1.5 shrink-0"
                  style={{
                    backgroundColor: p.shared_with_creators ? "rgba(122,154,101,0.1)" : "rgba(245,240,235,0.04)",
                    color: p.shared_with_creators ? "var(--success)" : "rgba(245,240,235,0.3)",
                  }}
                >
                  <Share2 size={8} />
                  {p.shared_with_creators ? "Partagé" : "Partager"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════
//  MAIN PAGE
// ═════════════════════════════════════════════════════════════

export default function BenchmarkingPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<CompareCreator[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadCompare = async () => {
    if (compareIds.length < 2) return;
    setCompareLoading(true);
    try {
      const r = await fetch("/api/admin/benchmarking/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator_ids: compareIds }),
      });
      const d = await r.json();
      setCompareData(d.creators || []);
      setShowCompare(true);
    } catch {} finally {
      setCompareLoading(false);
    }
  };

  // Find significant differences (highlight in gold)
  const findDiff = (key: keyof CompareCreator) => {
    if (compareData.length < 2) return null;
    const values = compareData.map((c) => Number(c[key] || 0));
    const max = Math.max(...values);
    const min = Math.min(...values);
    if (max === 0) return null;
    return values.map((v) => ({ isMax: v === max, isMin: v === min }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Benchmarking
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.4)" }}>
            Comparaison de performance et insights actionnables
          </p>
        </div>

        {/* Compare creator IDs input */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="IDs créateurs (virgules)..."
            className="text-[10px] py-1.5 px-2 w-48 bg-transparent"
            style={{ color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.06)" }}
          />
          <button
            onClick={() => {
              const ids = searchTerm.split(",").map((s) => s.trim()).filter(Boolean);
              setCompareIds(ids);
              if (ids.length >= 2) loadCompare();
            }}
            disabled={compareLoading}
            className="flex items-center gap-1 text-[10px] py-1.5 px-2.5 disabled:opacity-30"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
          >
            <BarChart3 size={10} /> Comparer
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 text-[10px] font-medium py-2 px-3 transition-all whitespace-nowrap"
              style={{
                backgroundColor: active ? "rgba(199,91,57,0.1)" : "transparent",
                color: active ? "var(--accent)" : "rgba(245,240,235,0.3)",
                borderBottom: active ? "1px solid var(--accent)" : "1px solid transparent",
                marginBottom: "-1px",
              }}
            >
              <t.icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {tab === "overview" && <OverviewTab />}
      {tab === "departments" && <DepartmentsTab />}
      {tab === "tiers" && <TiersTab />}
      {tab === "cohorts" && <CohortsTab />}
      {tab === "insights" && <InsightsTab />}

      {/* ═══ Side-by-side comparison modal ═══ */}
      {showCompare && compareData.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowCompare(false)}>
          <div
            className="w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto border"
            style={{ backgroundColor: "var(--bg-primary)", borderColor: "rgba(245,240,235,0.06)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
              <h3 className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Comparaison</h3>
              <button onClick={() => setShowCompare(false)}><X size={14} style={{ color: "rgba(245,240,235,0.3)" }} /></button>
            </div>

            {/* Table */}
            <div className="p-4 overflow-x-auto">
              {compareLoading ? (
                <div className="space-y-2">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-8 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />)}</div>
              ) : (
                <>
                  <table className="w-full text-[10px]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                    <thead>
                      <tr>
                        <th className="text-left font-medium py-2 pr-4" style={{ color: "rgba(245,240,235,0.2)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>Métrique</th>
                        {compareData.map((c) => (
                          <th key={c.id} className="text-right font-medium py-2 px-2" style={{ color: "var(--accent)", borderBottom: "1px solid rgba(245,240,235,0.06)" }}>{c.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Revenus mois", key: "revenue", fmt: (v: number) => `${v}€` },
                        { label: "Croissance", key: "growth", fmt: (v: number) => `${v > 0 ? "+" : ""}${v}%` },
                        { label: "Fans actifs", key: "active_fans", fmt: (v: number) => String(v) },
                        { label: "Rev./fan", key: "revenue_per_fan", fmt: (v: number) => `${v}€` },
                        { label: "Drafts en attente", key: "pending_drafts", fmt: (v: number) => String(v) },
                        { label: "PPV unlock rate", key: "ppv_unlock_rate", fmt: (v: number) => `${v}%` },
                      ].map((row) => {
                        const diffs = findDiff(row.key as keyof CompareCreator);
                        return (
                          <tr key={row.label}>
                            <td className="py-2 pr-4 text-[9px]" style={{ color: "rgba(245,240,235,0.4)", borderBottom: "1px solid rgba(245,240,235,0.04)" }}>{row.label}</td>
                            {compareData.map((c, ci) => {
                              const val = Number(c[row.key as keyof CompareCreator] || 0);
                              const isHighlight = diffs?.[ci]?.isMax;
                              return (
                                <td key={c.id} className="py-2 px-2 text-right font-medium" style={{
                                  color: isHighlight ? "var(--accent)" : "var(--text-primary)",
                                  borderBottom: "1px solid rgba(245,240,235,0.04)",
                                  backgroundColor: isHighlight ? "rgba(199,91,57,0.06)" : "transparent",
                                }}>
                                  {row.fmt(val)}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* Revenue history overlay */}
                  <div className="mt-4 p-3" style={{ backgroundColor: "rgba(245,240,235,0.02)" }}>
                    <p className="text-[9px] mb-3" style={{ color: "rgba(245,240,235,0.2)" }}>Évolution des revenus (6 mois)</p>
                    <div className="space-y-2">
                      {compareData.map((c, i) => (
                        <div key={c.id}>
                          <div className="flex justify-between text-[8px] mb-0.5">
                            <span style={{ color: i === 0 ? "var(--accent)" : i === 1 ? "var(--success)" : "var(--text-primary)" }}>{c.name}</span>
                            <span style={{ color: "rgba(245,240,235,0.2)" }}>
                              {c.revenue_history[0] || 0}€ → {c.revenue_history[c.revenue_history.length - 1] || 0}€
                            </span>
                          </div>
                          <MiniLineChart series={c.revenue_history} height={30} color={i === 0 ? "var(--accent)" : i === 1 ? "var(--success)" : "var(--text-primary)"} />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
