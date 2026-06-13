"use client";

import { useState, useEffect } from "react";
import {
  Loader2, X, Eye, BarChart3, Globe, TrendingUp,
  AlertTriangle, ListChecks, Gauge, Funnel,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart as RePie, Pie, Cell, LineChart, Line, CartesianGrid,
} from "recharts";

type Analysis = {
  id: string;
  created_at: string;
  platform: string;
  total_score: number;
  risk_level: string;
  clauses_checked: string[];
  agency_name: string | null;
  letter_generated: boolean;
  is_anonymous: boolean;
  user_id: string | null;
};

type AnalysisDetail = Analysis & {
  clauses_details: { id: string; label: string; category: string; severity: number }[];
  letters: { id: string; letter_type: string; created_at: string }[];
};

type Stats = {
  platform_breakdown: Record<string, number>;
  risk_breakdown: Record<string, number>;
  daily_counts: Record<string, number>;
  top_other_clauses: { text: string; count: number }[];
  average_score: number;
  max_possible_score: number;
  top_clauses_checked: { id: string; label: string; severity: number; count: number }[];
  funnel: {
    total_analyses: number;
    with_letters: number;
    converted_to_lead: number;
    converted_to_member: number;
  };
};

const RISK_COLORS: Record<string, string> = {
  low: "var(--success)",
  moderate: "#D4A24C",
  high: "var(--danger)",
  critical: "#8B0000",
};

const PLATFORM_COLORS = ["var(--accent)", "#D4A24C", "var(--success)", "#4A7C9B", "#8B5CF6", "#EC4899", "#6366F1"];

const BAR_COLORS = ["var(--accent)", "var(--accent)", "var(--accent)", "var(--accent)", "var(--accent)", "#B84E2E", "#A84324", "#93371A", "#7D2B10", "#671F06"];

const TOOLTIP_STYLE = {
  background: "var(--bg-card)",
  border: "1px solid var(--border-default)",
  borderRadius: 0,
  fontSize: 12,
  color: "var(--text-primary)",
};

function ChartCard({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 h-full flex flex-col" style={{ border: "1px solid var(--border-default)", background: "transparent" }}>
      <div className="flex items-center gap-2 mb-3 shrink-0">
        <Icon size={14} style={{ color: "var(--text-secondary)" }} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>{title}</span>
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}

export default function LegalAnalysesPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterPlat, setFilterPlat] = useState("");
  const [filterRisk, setFilterRisk] = useState("");
  const [detail, setDetail] = useState<AnalysisDetail | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const params = new URLSearchParams();
        if (filterPlat) params.set("platform", filterPlat);
        if (filterRisk) params.set("risk_level", filterRisk);
        const res = await fetch(`/api/admin/legal/analyses?${params}`);
        const data = await res.json();
        if (!cancelled) {
          setAnalyses(data.analyses || []);
          setStats(data.stats || null);
        }
      } catch (e) { console.error(e); }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [filterPlat, filterRisk]);

  const openDetail = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/legal/analyses?id=${id}`);
      const data = await res.json();
      setDetail(data.analysis || null);
    } catch (e) { console.error(e); }
  };

  // Derived data for charts
  const platformData = stats
    ? Object.entries(stats.platform_breakdown).map(([name, value]) => ({ name, value }))
    : [];

  const dailyData = stats
    ? Object.entries(stats.daily_counts)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-30)
        .map(([date, count]) => ({ date: date.slice(5), count }))
    : [];

  const topClauses = stats?.top_clauses_checked || [];

  // Gauge data
  const avgScore = stats?.average_score ?? 0;
  const maxScore = stats?.max_possible_score ?? 100;
  const gaugePct = maxScore > 0 ? Math.min((avgScore / maxScore) * 100, 100) : 0;

  // Funnel data
  const funnel = stats?.funnel;
  const funnelMax = funnel?.total_analyses ?? 1;
  const funnelStages = funnel
    ? [
        { label: "Analyses", value: funnel.total_analyses, pct: 100, color: "var(--accent)" },
        { label: "Lettre générée", value: funnel.with_letters, pct: (funnel.with_letters / funnelMax) * 100, color: "#D4A24C" },
        { label: "Lead", value: funnel.converted_to_lead, pct: (funnel.converted_to_lead / funnelMax) * 100, color: "var(--success)" },
        { label: "Membre", value: funnel.converted_to_member, pct: (funnel.converted_to_member / funnelMax) * 100, color: "#4A7C9B" },
      ]
    : [];

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <BarChart3 size={24} style={{ color: "var(--accent)" }} />
            <h1 className="text-2xl font-display font-semibold" style={{ color: "var(--text-primary)" }}>
              Analyses contrats
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {analyses.length} analyses, Détection des clauses abusives dans les contrats créateurs
          </p>
        </div>
      </div>

      {/* ───── 5 Charts Grid ───── */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 1. Line chart, daily trend (col-span-2) */}
          <div className="col-span-2">
            <ChartCard icon={TrendingUp} title="Analyses par jour (30j)">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* 2. Pie chart, platform breakdown (col-span-1) */}
          <div className="col-span-1">
            <ChartCard icon={Globe} title="Par plateforme">
              <ResponsiveContainer width="100%" height={200}>
                <RePie>
                  <Pie data={platformData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                    {platformData.map((entry, i) => (
                      <Cell key={entry.name} fill={PLATFORM_COLORS[i % PLATFORM_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </RePie>
              </ResponsiveContainer>
              <div className="flex justify-center gap-3 mt-1 flex-wrap">
                {platformData.map((entry, i) => (
                  <div key={entry.name} className="flex items-center gap-1">
                    <div className="w-2 h-2 shrink-0" style={{ background: PLATFORM_COLORS[i % PLATFORM_COLORS.length] }} />
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>{entry.name}: {entry.value}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>

          {/* 3. Horizontal bar chart, top 10 clauses (col-span-2) */}
          <div className="col-span-2">
            <ChartCard icon={ListChecks} title="Top 10 clauses les plus cochées">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={topClauses.slice(0, 10)} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.4)" }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={140}
                    tick={{ fontSize: 9, fill: "rgba(255,255,255,0.6)" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val: string) => val.length > 22 ? val.slice(0, 21) + "…" : val}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(value) => [`${value} fois`, "Fréquence"]}
                  />
                  <Bar dataKey="count" radius={[0, 2, 2, 0]} barSize={14}>
                    {topClauses.slice(0, 10).map((_, i) => (
                      <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* 4. Gauge chart, average danger score (col-span-1) */}
          <div className="col-span-1">
            <ChartCard icon={Gauge} title="Score moyen de dangerosité">
              <div className="flex flex-col items-center justify-center h-full pt-2">
                <ResponsiveContainer width="100%" height={160}>
                  <RePie>
                    <Pie
                      data={[
                        { name: "score", value: gaugePct },
                        { name: "remain", value: 100 - gaugePct },
                      ]}
                      dataKey="value"
                      startAngle={180}
                      endAngle={0}
                      innerRadius={55}
                      outerRadius={75}
                      cx="50%"
                      cy="65%"
                      stroke="none"
                    >
                      <Cell fill="var(--accent)" />
                      <Cell fill="rgba(255,255,255,0.06)" />
                    </Pie>
                  </RePie>
                </ResponsiveContainer>
                <div className="text-center -mt-8">
                  <span className="text-2xl font-bold font-display" style={{ color: "var(--text-primary)" }}>
                    {avgScore}
                  </span>
                  <span className="text-xs ml-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                    / {maxScore}
                  </span>
                  <div className="w-full h-1 mt-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="h-full" style={{ width: `${gaugePct}%`, background: "var(--accent)" }} />
                  </div>
                </div>
              </div>
            </ChartCard>
          </div>

          {/* 5. Funnel chart, conversion pipeline (col-span-3) */}
          <div className="col-span-3">
            <ChartCard icon={Funnel} title="Entonnoir de conversion">
              <div className="flex items-end justify-center gap-6 pt-2 pb-1">
                {funnelStages.map((stage) => (
                  <div key={stage.label} className="flex flex-col items-center gap-2">
                    <span className="text-lg font-bold font-display" style={{ color: "var(--text-primary)" }}>{stage.value}</span>
                    <div
                      className="w-full transition-all duration-500"
                      style={{
                        width: `${Math.max(stage.pct, 8)}%`,
                        minWidth: 48,
                        height: 48,
                        background: stage.color,
                        opacity: 0.85,
                      }}
                    />
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>{stage.label}</span>
                      <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{Math.round(stage.pct)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* Patterns détectés */}
      {stats && stats.top_other_clauses.length > 0 && (
        <div className="mb-8 p-4" style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} style={{ color: "#D4A24C" }} />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>Autres clauses fréquentes détectées</span>
          </div>
          <div className="space-y-2">
            {stats.top_other_clauses.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5" style={{ borderBottom: "1px solid var(--border-default)" }}>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{item.text}</span>
                <span className="text-xs font-medium px-2 py-0.5" style={{ background: "rgba(212,162,76,0.12)", color: "#D4A24C" }}>
                  ×{item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <select value={filterPlat} onChange={(e) => setFilterPlat(e.target.value)} className="text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
          <option value="">Toutes plateformes</option>
          {[...new Set(analyses.map((a) => a.platform))].sort().map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)} className="text-sm px-3 py-2 outline-none" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}>
          <option value="">Tous risques</option>
          {["low", "moderate", "high", "critical"].map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          {analyses.length} résultat{analyses.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
        </div>
      ) : (
        <div style={{ border: "1px solid var(--border-default)" }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "var(--bg-card)" }}>
                {["Date", "Plateforme", "Score", "Risque", "Agence", "Clauses", "Lettre", "Anonyme", ""].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider px-4 py-3" style={{ color: "var(--text-secondary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analyses.map((a) => (
                <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {a.created_at ? new Date(a.created_at).toLocaleDateString("fr-FR") : ", "}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-primary)" }}>{a.platform}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--text-primary)" }}>{a.total_score ?? ", "}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-0.5" style={{ background: `${RISK_COLORS[a.risk_level] || "#666"}20`, color: RISK_COLORS[a.risk_level] || "#666" }}>
                      {a.risk_level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--text-secondary)" }}>{a.agency_name || ", "}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {a.clauses_checked?.length ?? 0} clauses
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-1.5 py-0.5 font-medium" style={{ background: a.letter_generated ? "rgba(122,154,101,0.12)" : "rgba(255,255,255,0.04)", color: a.letter_generated ? "var(--success)" : "rgba(255,255,255,0.3)" }}>
                      {a.letter_generated ? "oui" : "non"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px]" style={{ color: a.is_anonymous ? "rgba(255,255,255,0.3)" : "var(--success)" }}>
                      {a.is_anonymous ? "oui" : "non"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => openDetail(a.id)} className="p-1.5 transition-colors hover:bg-white/5" style={{ color: "var(--accent)" }}>
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {analyses.length === 0 && (
                <tr><td colSpan={9} className="text-center py-12 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucune analyse</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                Analyse {detail.platform}
              </h2>
              <button onClick={() => setDetail(null)} style={{ color: "var(--text-secondary)" }}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Date</span>
                  <p style={{ color: "var(--text-primary)" }}>{new Date(detail.created_at).toLocaleDateString("fr-FR", { dateStyle: "long" })}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Plateforme</span>
                  <p style={{ color: "var(--text-primary)" }}>{detail.platform}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Score</span>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{detail.total_score ?? ", "}/100</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Risque</span>
                  <span className="text-xs font-medium px-2 py-0.5" style={{ background: `${RISK_COLORS[detail.risk_level] || "#666"}20`, color: RISK_COLORS[detail.risk_level] || "#666" }}>
                    {detail.risk_level}
                  </span>
                </div>
                {detail.agency_name && (
                  <div>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Agence</span>
                    <p style={{ color: "var(--text-primary)" }}>{detail.agency_name}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Lettre générée</span>
                  <p style={{ color: detail.letter_generated ? "var(--success)" : "rgba(255,255,255,0.3)" }}>
                    {detail.letter_generated ? "Oui" : "Non"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Clauses vérifiées ({detail.clauses_details.length})</h3>
                <div className="space-y-2">
                  {detail.clauses_details.map((clause) => (
                    <div key={clause.id} className="flex items-center justify-between p-3" style={{ border: "1px solid var(--border-default)" }}>
                      <div>
                        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{clause.label}</span>
                        <span className="text-xs ml-2" style={{ color: "rgba(255,255,255,0.3)" }}>{clause.category}</span>
                      </div>
                      <span className="text-xs font-medium px-2 py-0.5" style={{ background: `${RISK_COLORS[clause.severity <= 2 ? "low" : clause.severity <= 4 ? "moderate" : "high"]}20`, color: RISK_COLORS[clause.severity <= 2 ? "low" : clause.severity <= 4 ? "moderate" : "high"] }}>
                        sévérité {clause.severity}
                      </span>
                    </div>
                  ))}
                  {detail.clauses_details.length === 0 && (
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>Aucune clause spécifique</p>
                  )}
                </div>
              </div>

              {detail.letters.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>Lettres générées</h3>
                  <div className="space-y-1">
                    {detail.letters.map((l) => (
                      <div key={l.id} className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {l.letter_type}, {new Date(l.created_at).toLocaleDateString("fr-FR")}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
