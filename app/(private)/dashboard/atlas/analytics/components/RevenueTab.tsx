"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { DollarSign, TrendingUp } from "lucide-react";
import { RevenueData, KpiCard, Card, Spinner, EmptyState, Table, eur } from "./shared";

const CHANNEL_COLORS = ["#C75B39", "#5B8FA8", "#7A9A65", "#B0A89E", "#C44536"];
const CHANNEL_LABELS: Record<string, string> = {
  email: "Email", sms: "SMS", push: "Push", funnel: "Funnels", dm: "Messages directs",
};

export default function RevenueTab() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/atlas/analytics/revenue")
      .then((r) => r.json()).then(setData).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <EmptyState icon={DollarSign} title="Aucun revenu tracké" desc="Les revenus apparaîtront quand des conversions seront attribuées" />;

  const totalSms = data.byChannel.find((c) => c.channel === "sms")?.revenue ?? 0;
  const totalFunnel = data.byChannel.find((c) => c.channel === "funnel")?.revenue ?? 0;
  const totalPush = data.byChannel.find((c) => c.channel === "push")?.revenue ?? 0;
  const totalEmail = data.byChannel.find((c) => c.channel === "email")?.revenue ?? 0;
  const totalDm = data.byChannel.find((c) => c.channel === "dm")?.revenue ?? 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <KpiCard label="Total du mois" value={eur(data.totalMonth)} accent />
        <KpiCard label="Email" value={eur(totalEmail)} />
        <KpiCard label="SMS" value={eur(totalSms)} />
        <KpiCard label="Funnels" value={eur(totalFunnel)} />
        <KpiCard label="Push" value={eur(totalPush)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart — breakdown by source */}
        <Card title="Décomposition par source">
          {(data.byChannel?.length ?? 0) > 0 ? (
            <div className="h-64 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.byChannel}
                    dataKey="revenue"
                    nameKey="channel"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {data.byChannel.map((_, i) => (
                      <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#2A2420", border: "1px solid rgba(245,240,235,0.1)", borderRadius: 0 }}
                    labelStyle={{ color: "#F5F0EB" }}
                    formatter={(v: any, name: any) => [eur(Number(v)), CHANNEL_LABELS[String(name)] ?? String(name)]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm py-8 text-center" style={{ color: "var(--color-ink-tertiary)" }}>Aucune donnée</p>
          )}
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-2">
            {data.byChannel.map((c, i) => (
              <div key={c.channel} className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
                <span className="w-2 h-2" style={{ backgroundColor: CHANNEL_COLORS[i % CHANNEL_COLORS.length] }} />
                {CHANNEL_LABELS[c.channel] ?? c.channel}: {eur(c.revenue)}
              </div>
            ))}
          </div>
        </Card>

        {/* Bar chart — campaign detail */}
        <Card title="Détail par campagne">
          {(data.campaigns?.length ?? 0) > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.campaigns.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,235,0.04)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-ink-tertiary)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} tickFormatter={(v: number) => `${v}€`} />
                  <Tooltip
                    contentStyle={{ background: "#2A2420", border: "1px solid rgba(245,240,235,0.1)", borderRadius: 0 }}
                    labelStyle={{ color: "#F5F0EB" }}
                    formatter={(v: any) => [eur(Number(v)), "Revenu"]}
                  />
                  <Bar dataKey="revenue" fill="#C75B39" radius={0} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm py-8 text-center" style={{ color: "var(--color-ink-tertiary)" }}>
              Aucune campagne envoyée
            </p>
          )}
        </Card>
      </div>

      {/* Campaign detail table */}
      {(data.campaigns?.length ?? 0) > 0 && (
        <Card title="Campagnes">
          <Table
            headers={["Campagne", "Canal", "Envoyés", "Ouverts", "Clics", "Conversions", "Revenu"]}
            rows={data.campaigns.map((c: any) => [
              <span key="name" className="text-sm">{c.name}</span>,
              <span key="ch" className="text-xs uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>{c.channel}</span>,
              c.sent?.toLocaleString() ?? "-",
              c.opened?.toLocaleString() ?? "-",
              c.clicked?.toLocaleString() ?? "-",
              c.converted_count ?? "-",
              <span key="rev" style={{ color: "#7A9A65", fontWeight: 600 }}>{eur(c.revenue)}</span>,
            ])}
          />
        </Card>
      )}

      {/* Funnels */}
      {(data.funnels?.length ?? 0) > 0 && (
        <Card title="Funnels">
          <Table
            headers={["Nom", "Entrées", "Conversions", "Taux", "Revenu"]}
            rows={data.funnels.map((f: any) => [
              f.name,
              f.entry_count?.toLocaleString() ?? "-",
              f.conversion_count?.toLocaleString() ?? "-",
              f.entry_count > 0
                ? ((f.conversion_count / f.entry_count) * 100).toFixed(1) + "%"
                : "-",
              <span key="rev" style={{ color: "#7A9A65", fontWeight: 600 }}>{eur(f.revenue)}</span>,
            ])}
          />
        </Card>
      )}
    </div>
  );
}
