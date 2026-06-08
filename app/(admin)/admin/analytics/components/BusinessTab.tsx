"use client";

import { useState } from "react";
import { RefreshCw, TrendingUp, DollarSign, Users, Clock, FileText, Euro } from "lucide-react";
import { analyticsData } from "../data";
import { StatCard, SimpleAreaChart, SimpleBarChart, SimpleLineChart } from "./SharedCharts";

export function BusinessTab() {
  const [summary, setSummary] = useState(analyticsData.executiveSummary);
  const [regenerating, setRegenerating] = useState(false);

  const revenue24 = analyticsData.monthlyRevenue.map((m) => ({ ...m, month: m.month.slice(0, 7) }));
  const momG = analyticsData.momGrowth.map((m) => ({ ...m, month: m.month.slice(0, 7) }));
  const ret = analyticsData.retention.map((m) => ({ ...m, month: m.month.slice(0, 7) }));
  const latest = analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 1];
  const prev = analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 2];
  const revenueGrowth = prev ? Math.round(((latest.brut - prev.brut) / prev.brut) * 100) : 0;

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => {
      setSummary({
        ...summary,
        text: `[Mise à jour] ${analyticsData.executiveSummary.text}`,
        generated_at: new Date().toISOString(),
      });
      setRegenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <FileText size={14} className="opacity-40" />
            <h3 className="text-[11px] font-semibold uppercase tracking-wider opacity-60">Résumé exécutif IA</h3>
            <span className="text-[9px] opacity-30">({summary.period})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] opacity-30">
              Généré le {new Date(summary.generated_at).toLocaleDateString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium border border-[var(--color-border)] hover:bg-[var(--color-base)] transition-colors disabled:opacity-30"
            >
              <RefreshCw size={10} className={regenerating ? "animate-spin" : ""} />
              Régénérer
            </button>
          </div>
        </div>
        <div className="p-5 text-sm leading-relaxed opacity-80">
          {summary.text}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-3">
        <StatCard title="Revenus brut (mois)" value={`${(latest.brut / 1000).toFixed(1)}k€`} subtitle={`${latest.creators_count} créateurs`} trend={revenueGrowth >= 0 ? "up" : "down"} trendValue={`${Math.abs(revenueGrowth)}%`} icon={<Euro size={14} />} />
        <StatCard title="Commission" value={`${(latest.commission / 1000).toFixed(1)}k€`} subtitle={`${(latest.commission / latest.brut * 100).toFixed(1)}% effectif`} />
        <StatCard title="Net agence" value={`${(latest.net / 1000).toFixed(1)}k€`} subtitle="Après commission" />
        <StatCard title="LTV Moyen" value={`${analyticsData.ltv[3].average_ltv.toLocaleString("fr-FR")}€`} subtitle="À 12 mois" trend="up" trendValue="12%" icon={<TrendingUp size={14} />} />
        <StatCard title="CAC Moyen" value={`${Math.round(analyticsData.cac.reduce((a, c) => a + c.cac, 0) / analyticsData.cac.length)}€`} subtitle="Toutes sources" trend="down" trendValue="8%" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 24-month revenue */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Revenus cumulés (24 mois)</h4>
          <SimpleAreaChart
            data={revenue24}
            xKey="month"
            series={[
              { key: "brut", color: "#C75B39", name: "Brut" },
              { key: "net", color: "#7A9A65", name: "Net" },
              { key: "commission", color: "#9A9590", name: "Commission" },
            ]}
            height={220}
          />
        </div>

        {/* MoM Growth */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Croissance MoM (%)</h4>
          <SimpleBarChart
            data={momG.slice(-12)}
            xKey="month"
            barKey="growth_pct"
            color="#C75B39"
            height={220}
          />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-3 gap-4">
        {/* Retention */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Rétention créateurs</h4>
          <SimpleLineChart
            data={ret}
            xKey="month"
            series={[{ key: "retention_pct", color: "#7A9A65", name: "Rétention" }]}
            height={180}
          />
        </div>

        {/* LTV */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">LTV Moyenne</h4>
          <SimpleBarChart
            data={analyticsData.ltv.map((l) => ({ ...l, label: `${l.months}m` }))}
            xKey="label"
            barKey="average_ltv"
            color="#C75B39"
            height={180}
          />
        </div>

        {/* CAC by source */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">CAC par source</h4>
          <SimpleBarChart
            data={analyticsData.cac.map((c) => ({ ...c, source: c.source.slice(0, 6) }))}
            xKey="source"
            barKey="cac"
            color="#9A9590"
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
