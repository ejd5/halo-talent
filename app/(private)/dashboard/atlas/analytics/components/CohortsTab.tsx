"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line, Legend,
} from "recharts";
import { CalendarDays, Users } from "lucide-react";
import { Card, Spinner, EmptyState, eur, pct } from "./shared";

export default function CohortsTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/atlas/analytics/cohorts")
      .then((r) => r.json()).then(setData).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data || data.cohorts.length === 0)
    return <EmptyState icon={CalendarDays} title="Aucune cohorte" desc="Les cohortes apparaîtront quand tu auras des fans avec des dates d'acquisition" />;

  // Build retention matrix for display
  const cohorts = data.cohorts.slice(0, 6); // last 6 months
  const maxOffset = Math.max(...cohorts.flatMap((c: any) => c.retention.map((r: any) => r.offset)));

  // Retention chart data
  const retentionChartData = cohorts.map((c: any) => ({
    cohort: c.cohort,
    ...Object.fromEntries(c.retention.map((r: any) => [`m${r.offset}`, r.rate])),
  }));

  // LTV chart data
  const ltvChartData = cohorts.map((c: any) => ({
    cohort: c.cohort,
    ltv: c.retention.length > 0
      ? c.retention[c.retention.length - 1]?.revenue ?? 0
      : 0,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Retention Matrix */}
      <Card title="Matrice de rétention">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="px-3 py-2 text-left font-normal">Cohorte</th>
                <th className="px-3 py-2 text-left font-normal">Acquis</th>
                {Array.from({ length: Math.min(maxOffset + 1, 12) }, (_, i) => (
                  <th key={i} className="px-2 py-2 text-center font-normal">M{i}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cohorts.map((c: any) => (
                <tr key={c.cohort} className="table-row">
                  <td className="px-3 py-2 font-medium" style={{ color: "var(--text-primary)" }}>{c.cohort}</td>
                  <td className="px-3 py-2" style={{ color: "var(--color-ink-tertiary)" }}>{c.acquired}</td>
                  {Array.from({ length: Math.min(maxOffset + 1, 12) }, (_, i) => {
                    const r = c.retention.find((x: any) => x.offset === i);
                    const rate = r?.rate ?? null;
                    return (
                      <td
                        key={i}
                        className="px-2 py-2 text-center font-mono text-xs"
                        style={{
                          color: rate !== null
                            ? rate > 60 ? "var(--success)" : rate > 30 ? "var(--accent)" : "var(--danger)"
                            : "var(--color-ink-tertiary)",
                          backgroundColor: rate !== null
                            ? `rgba(199,91,57,${rate / 200})`
                            : "transparent",
                        }}
                      >
                        {rate !== null ? `${rate}%` : "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Retention rate chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Courbes de rétention par cohorte">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,235,0.04)" />
                <XAxis
                  dataKey="cohort"
                  tick={{ fontSize: 10, fill: "var(--color-ink-tertiary)" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }}
                  tickFormatter={(v: number) => `${v}%`}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.1)", borderRadius: 0 }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  formatter={(v: any) => [`${String(v)}%`, "Rétention M0"]}
                />
                <Legend />
                {Array.from({ length: Math.min(3, maxOffset + 1) }, (_, i) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={`m${i}`}
                    name={`M${i}`}
                    stroke={i === 0 ? "var(--accent)" : i === 1 ? "#5B8FA8" : "var(--success)"}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* LTV by cohort */}
        <Card title="LTV par cohorte">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ltvChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,235,0.04)" />
                <XAxis dataKey="cohort" tick={{ fontSize: 10, fill: "var(--color-ink-tertiary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} tickFormatter={(v: number) => `${v}€`} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.1)", borderRadius: 0 }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  formatter={(v: any) => [eur(Number(v)), "LTV moyen"]}
                />
                <Bar dataKey="ltv" fill="#5B8FA8" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs mt-2" style={{ color: "var(--color-ink-tertiary)" }}>
            LTV moyenne par fan acquis dans chaque cohorte
          </p>
        </Card>
      </div>
    </div>
  );
}
