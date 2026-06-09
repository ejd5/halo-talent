"use client";

import { Users, TrendingUp, ArrowDown, ArrowUp } from "lucide-react";
import { analyticsData } from "../data";
import { StatCard } from "./SharedCharts";

export function AcquisitionTab() {
  const funnel = analyticsData.funnel;
  const totalApps = funnel[funnel.length - 1].count;
  const totalVisits = funnel[0].count;
  const overallConversion = ((totalApps / totalVisits) * 100);

  return (
    <div className="space-y-6 card-accent" style={{ background: "#0A0908" }}>
      {/* KPI */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Visites / mois" value={totalVisits.toLocaleString("fr-FR")} icon={<Users size={14} />} />
        <StatCard title="Candidatures" value={totalApps.toString()} subtitle="Au dernier mois" />
        <StatCard title="Taux conversion" value={`${overallConversion.toFixed(1)}%`} subtitle="Visite → Premier revenu" trend="up" trendValue="0.8%" />
        <StatCard title="Temps moyen" value="18 jours" subtitle="Visite → Signature" />
      </div>

      {/* Sources */}
      <div className="border border-[var(--color-border)] p-4">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Sources des candidatures</h4>
        <div className="grid grid-cols-5 gap-3">
          {analyticsData.cac.map((c) => (
            <div key={c.source} className="text-center p-3 border border-[var(--color-border)]">
              <div className="text-lg font-bold text-[var(--color-accent)]" style={{ fontFamily: "var(--font-display)" }}>
                {c.conversions}
              </div>
              <div className="text-[10px] font-medium opacity-50 mt-1">{c.source}</div>
              <div className="text-[9px] opacity-30">{c.cac}€ CAC</div>
            </div>
          ))}
        </div>
      </div>

      {/* Funnel */}
      <div className="border border-[var(--color-border)] p-4">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-4">Funnel de conversion</h4>
        <div className="space-y-0">
          {funnel.map((stage, i) => {
            const width = (stage.count / funnel[0].count) * 100;
            return (
              <div key={stage.stage} className="flex items-center gap-3 py-2">
                {/* Stage name */}
                <div className="w-40 text-xs text-right shrink-0">
                  <span className="opacity-70">{stage.stage}</span>
                </div>

                {/* Funnel bar */}
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-8 border border-[var(--color-border)] transition-all flex items-center relative" style={{ width: `${Math.max(width, 3)}%`, backgroundColor: `rgba(199, 91, 57, ${0.3 + (i / funnel.length) * 0.5})` }}>
                    <span className="text-[11px] font-semibold px-2 text-white">{stage.count.toLocaleString("fr-FR")}</span>
                  </div>
                </div>

                {/* Conversion */}
                <div className="w-24 text-[11px]">
                  {i > 0 && (
                    <span className={stage.conversion_pct > 50 ? "text-[#7A9A65]" : "text-[#C44536]"}>
                      {stage.conversion_pct}%
                    </span>
                  )}
                  {i > 0 && (
                    <span className="text-[9px] opacity-30 ml-1">↓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drop-off analysis */}
      <div className="border border-[var(--color-border)] p-4">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Analyse des abandons</h4>
        <div className="grid grid-cols-3 gap-4">
          {funnel.slice(0, 3).map((stage, i) => {
            const next = funnel[i + 1];
            if (!next) return null;
            const drop = stage.count - next.count;
            return (
              <div key={stage.stage} className="p-3 border border-[var(--color-border)]">
                <div className="flex items-center gap-1.5 text-[#C44536] mb-1">
                  <ArrowDown size={12} />
                  <span className="text-[10px] font-semibold">{drop} abandons</span>
                </div>
                <div className="text-[11px] opacity-60">{stage.stage} → {next.stage}</div>
                <div className="text-[9px] opacity-30">Taux perte : {((drop / stage.count) * 100).toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
