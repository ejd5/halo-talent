"use client";

import { useState } from "react";
import {
  TrendingUp, TrendingDown, AlertTriangle, Shield, Users,
  DollarSign, Activity, ChevronRight, Star, Zap, BarChart3,
} from "lucide-react";

// ── Mock data ────────────────────────────────────────────
const globalStats = [
  { label: "LTV moyenne", value: "€1 240", trend: "+8%", positive: true, icon: DollarSign },
  { label: "Churn ce mois", value: "3.2%", trend: "-0.4%", positive: true, icon: TrendingDown },
  { label: "Fans à risque", value: "18", trend: "+2", positive: false, icon: AlertTriangle },
  { label: "Fans fidèles", value: "142", trend: "+11", positive: true, icon: Shield },
];

const fanPredictions = [
  { id: "f1", name: "Sophie M.", ltv: 2840, churnRisk: 8, tier: "Whale", trend: "up", lastActivity: "il y a 2h", avatar: "SM" },
  { id: "f2", name: "Lucas R.", ltv: 1620, churnRisk: 22, tier: "VIP", trend: "stable", lastActivity: "il y a 1j", avatar: "LR" },
  { id: "f3", name: "Emma K.", ltv: 980, churnRisk: 61, tier: "Standard", trend: "down", lastActivity: "il y a 5j", avatar: "EK" },
  { id: "f4", name: "Hugo T.", ltv: 3100, churnRisk: 5, tier: "Whale", trend: "up", lastActivity: "il y a 30min", avatar: "HT" },
  { id: "f5", name: "Chloé D.", ltv: 450, churnRisk: 78, tier: "Standard", trend: "down", lastActivity: "il y a 12j", avatar: "CD" },
  { id: "f6", name: "Nathan V.", ltv: 1890, churnRisk: 15, tier: "VIP", trend: "up", lastActivity: "il y a 4h", avatar: "NV" },
  { id: "f7", name: "Laura B.", ltv: 720, churnRisk: 45, tier: "Standard", trend: "stable", lastActivity: "il y a 3j", avatar: "LB" },
  { id: "f8", name: "Max F.", ltv: 2200, churnRisk: 11, tier: "VIP", trend: "up", lastActivity: "il y a 1h", avatar: "MF" },
];

const retentionActions = [
  { id: "a1", label: "Envoyer un DM personnalisé à Emma K.", urgency: "haute", fans: 1 },
  { id: "a2", label: "Créer une offre PPV exclusive pour fans à risque", urgency: "moyenne", fans: 18 },
  { id: "a3", label: "Reengager les fans inactifs +7 jours", urgency: "haute", fans: 5 },
  { id: "a4", label: "Récompenser vos Whales avec un contenu VIP", urgency: "basse", fans: 4 },
];

const churnRiskColor = (risk: number) => {
  if (risk < 20) return "#A8D08D";
  if (risk < 50) return "#F5C842";
  return "#E05C5C";
};

const tierColor: Record<string, string> = {
  Whale: "var(--accent)",
  VIP: "#4A90D9",
  Standard: "rgba(245,240,235,0.35)",
};

// ── Components ────────────────────────────────────────────
function StatCard({
  label, value, trend, positive, icon: Icon,
}: { label: string; value: string; trend: string; positive: boolean; icon: React.ElementType }) {
  return (
    <div className="p-5 border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-surface)" }}>
          <Icon size={16} style={{ color: "var(--color-accent)" }} />
        </div>
        <div
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: positive ? "#A8D08D" : "#E05C5C" }}
        >
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {trend}
        </div>
      </div>
      <div className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}>{value}</div>
      <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>{label}</div>
    </div>
  );
}

function RiskBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "rgba(245,240,235,0.08)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: churnRiskColor(value) }}
        />
      </div>
      <span className="text-xs font-mono w-8 text-right" style={{ color: churnRiskColor(value) }}>{value}%</span>
    </div>
  );
}

export default function PredictionsPage() {
  const [filter, setFilter] = useState<"all" | "at-risk" | "whale">("all");

  const filtered = fanPredictions.filter((f) => {
    if (filter === "at-risk") return f.churnRisk >= 40;
    if (filter === "whale") return f.tier === "Whale";
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            LTV &amp; Churn
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
            Prédictions de valeur à vie et analyse du risque de désabonnement
          </p>
        </div>
        <span className="text-[10px] px-2 py-1 border" style={{ color: "rgba(245,240,235,0.25)", borderColor: "rgba(245,240,235,0.06)" }}>
          données de démonstration
        </span>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {globalStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fan Table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>Prédictions par fan</h2>
            <div className="flex items-center gap-1">
              {(["all", "at-risk", "whale"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all border"
                  style={{
                    borderColor: filter === f ? "var(--color-accent)" : "rgba(245,240,235,0.1)",
                    color: filter === f ? "var(--color-accent)" : "rgba(245,240,235,0.4)",
                    backgroundColor: filter === f ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  {f === "all" ? "Tous" : f === "at-risk" ? "À risque" : "Whales"}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 border-b border-[var(--color-border)]">
              {["Fan", "LTV", "Risque churn", "Tier", "Activité", ""].map((h, i) => (
                <div
                  key={i}
                  className={`text-[9px] font-semibold uppercase tracking-wider ${
                    i === 0 ? "col-span-3" : i === 1 ? "col-span-2" : i === 2 ? "col-span-3" : i === 3 ? "col-span-2" : i === 4 ? "col-span-1" : "col-span-1"
                  }`}
                  style={{ color: "rgba(245,240,235,0.3)" }}
                >
                  {h}
                </div>
              ))}
            </div>
            {/* Rows */}
            <div className="divide-y divide-[var(--color-border)]">
              {filtered.map((fan) => (
                <div
                  key={fan.id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-[var(--color-surface)]/50 transition-colors"
                >
                  {/* Fan */}
                  <div className="col-span-3 flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{ backgroundColor: "var(--accent-soft)", color: "var(--color-accent)", border: "1px solid rgba(199,91,57,0.2)" }}
                    >
                      {fan.avatar}
                    </div>
                    <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{fan.name}</span>
                  </div>
                  {/* LTV */}
                  <div className="col-span-2 text-xs font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)" }}>
                    €{fan.ltv.toLocaleString()}
                  </div>
                  {/* Churn risk */}
                  <div className="col-span-3">
                    <RiskBar value={fan.churnRisk} />
                  </div>
                  {/* Tier */}
                  <div className="col-span-2">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5" style={{ color: tierColor[fan.tier], border: `1px solid ${tierColor[fan.tier]}30` }}>
                      {fan.tier}
                    </span>
                  </div>
                  {/* Activity */}
                  <div className="col-span-1 text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                    {fan.lastActivity}
                  </div>
                  {/* Action */}
                  <div className="col-span-1 flex justify-end">
                    <button className="p-1 transition-opacity opacity-30 hover:opacity-100">
                      <ChevronRight size={12} style={{ color: "var(--text-primary)" }} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Retention actions */}
          <div className="border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center gap-2">
              <Zap size={14} style={{ color: "var(--color-accent)" }} />
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                Actions de rétention IA
              </h3>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {retentionActions.map((a) => (
                <button
                  key={a.id}
                  className="w-full px-4 py-3 text-left flex items-start gap-3 hover:bg-[var(--color-surface)]/50 transition-colors"
                >
                  <div
                    className="mt-0.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: a.urgency === "haute" ? "#E05C5C" : a.urgency === "moyenne" ? "#F5C842" : "#A8D08D", marginTop: 5 }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs leading-snug font-medium" style={{ color: "var(--text-primary)" }}>{a.label}</div>
                    <div className="text-[10px] mt-1" style={{ color: "rgba(245,240,235,0.3)" }}>
                      {a.fans} fan{a.fans > 1 ? "s" : ""} concerné{a.fans > 1 ? "s" : ""}
                    </div>
                  </div>
                  <ChevronRight size={12} className="shrink-0 mt-1 opacity-30" />
                </button>
              ))}
            </div>
          </div>

          {/* LTV distribution */}
          <div className="border border-[var(--color-border)] p-4" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={14} style={{ color: "var(--color-accent)" }} />
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-primary)" }}>
                Distribution LTV
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { label: "Whales (+€2000)", count: 2, pct: 68, color: "var(--color-accent)" },
                { label: "VIP (€1000–2000)", count: 3, pct: 42, color: "#4A90D9" },
                { label: "Standard (<€1000)", count: 3, pct: 25, color: "rgba(245,240,235,0.3)" },
              ].map((d) => (
                <div key={d.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.5)" }}>{d.label}</span>
                    <span className="text-[10px] font-mono" style={{ color: "var(--text-primary)" }}>{d.count}</span>
                  </div>
                  <div className="h-1 rounded-full" style={{ backgroundColor: "rgba(245,240,235,0.06)" }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Score global */}
          <div className="border border-[var(--color-border)] p-4 text-center" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.3)" }}>Score de rétention global</div>
            <div className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#A8D08D" }}>87</div>
            <div className="text-[10px] mt-1" style={{ color: "rgba(245,240,235,0.3)" }}>sur 100 · Excellent</div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} fill={i < 4 ? "#A8D08D" : "none"} style={{ color: i < 4 ? "#A8D08D" : "rgba(245,240,235,0.15)" }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
