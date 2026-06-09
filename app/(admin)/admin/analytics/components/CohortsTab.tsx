"use client";

import { Users, Calendar } from "lucide-react";
import { analyticsData } from "../data";
import { StatCard } from "./SharedCharts";

export function CohortsTab() {
  const cohorts = analyticsData.cohorts;
  const allMonths = [...new Set(cohorts.flatMap((c) => c.months))].sort((a, b) => a - b);

  // Best and worst cohorts
  const lastCohort = cohorts[cohorts.length - 1];
  const lastRetention = lastCohort.retention[lastCohort.retention.length - 1] ?? 0;

  return (
    <div className="space-y-6 card-accent" style={{ background: "#0A0908" }}>
      {/* KPI */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Cohortes analysées" value={cohorts.length.toString()} subtitle="Depuis juillet 2024" icon={<Calendar size={14} />} />
        <StatCard title="Rétention globale" value={`${Math.round(cohorts.reduce((a, c) => a + (c.retention[c.retention.length - 1] ?? 0), 0) / cohorts.length)}%`} subtitle="Moyenne toutes cohortes" />
        <StatCard title="Meilleure rétention" value={`${lastRetention}%`} subtitle={`Cohorte ${lastCohort.cohort}`} trend="up" trendValue="2.3%" />
        <StatCard title="Taille moyenne" value={`${Math.round(cohorts.reduce((a, c) => a + c.sizes[0], 0) / cohorts.length)}`} subtitle="Nouveaux créateurs/cohorte" icon={<Users size={14} />} />
      </div>

      {/* Cohort retention table */}
      <div className="border border-[var(--color-border)] overflow-x-auto">
        <div className="px-5 py-3 border-b border-[var(--color-border)]">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40">Rétention par cohorte</h4>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left px-5 py-2 font-medium opacity-40">Cohorte</th>
              <th className="text-right px-4 py-2 font-medium opacity-40">Taille</th>
              {allMonths.map((m) => (
                <th key={m} className="text-right px-4 py-2 font-medium opacity-40">{m} mois</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr key={c.cohort} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)]">
                <td className="px-5 py-2.5 font-medium">{c.cohort}</td>
                <td className="px-4 py-2.5 text-right">{c.sizes[0]}</td>
                {allMonths.map((m) => {
                  const idx = c.months.indexOf(m);
                  const val = idx >= 0 ? c.retention[idx] : null;
                  return (
                    <td key={m} className="px-4 py-2.5 text-right">
                      {val !== null ? (
                        <span
                          className="font-medium"
                          style={{
                            color: val >= 80 ? "#7A9A65" : val >= 60 ? "#C75B39" : "#C44536",
                          }}
                        >
                          {val}%
                        </span>
                      ) : (
                        <span className="opacity-10">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insights */}
      <div className="border border-[var(--color-border)] p-4">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Insights cohortes</h4>
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-[#7A9A65] mt-0.5">📈</span>
            <p className="opacity-70">Les cohortes récentes (2026) montrent une rétention à 3 mois de <strong>{lastCohort.retention[lastCohort.months.indexOf(3)] ?? "N/A"}%</strong>, en amélioration constante depuis 2024.</p>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-[#C75B39] mt-0.5">💡</span>
            <p className="opacity-70">La cohorte 2025-07 est la plus performante avec <strong>{cohorts.find((c) => c.cohort === "2025-07")?.retention.slice(-1)[0]}%</strong> de rétention à 12 mois. Facteurs clés : onboarding structuré + suivi hebdomadaire.</p>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-[#C44536] mt-0.5">⚠️</span>
            <p className="opacity-70">La première cohorte (2024-07) a la rétention la plus basse : <strong>{cohorts[0].retention.slice(-1)[0]}%</strong>. Les premiers mois étaient expérimentaux, le processus d&apos;onboarding n&apos;était pas encore rodé.</p>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <span className="text-[#E0D8D0] mt-0.5">📊</span>
            <p className="opacity-70">Tendance générale : le taux de rétention s&apos;améliore de <strong>~5% par cohorte</strong> grâce aux processus mis en place et à la sélection plus rigoureuse des candidatures.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
