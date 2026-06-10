"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Area, AreaChart,
} from "recharts";
import {
  Users, DollarSign, TrendingUp, Activity, UserPlus, Sparkles, BarChart3,
} from "lucide-react";
import { OverviewData, KpiCard, Card, Spinner, EmptyState, eur, pct } from "./shared";

export default function OverviewTab() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/atlas/analytics/overview")
      .then((r) => r.json()).then(setData).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <EmptyState icon={BarChart3} title="Aucune donnée" desc="Les données apparaîtront quand tu auras de l'activité Atlas" />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Band — 7 cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        <KpiCard label="Fans actifs" value={data.activeFans.toLocaleString()} />
        <KpiCard label="Revenus Atlas" value={eur(data.totalRevenue)} accent />
        <KpiCard label="Coût Atlas" value={eur(data.totalCost)} sub="abonnement + API + Twilio" />
        <KpiCard label="ROI" value={pct(data.roiPercent)} accent sub="(revenus - coût) / coût" />
        <KpiCard label="LTV moyen" value={eur(data.avgLtv)} />
        <KpiCard label="Nouveaux fans" value={`+${data.newFans30d}`} sub="ce mois" />
        <KpiCard label="Churn" value={pct(data.churnRate)} sub="taux de perte" />
      </div>

      {/* Revenue Chart — 12 months */}
      <Card title="Évolution des revenus attribués à Atlas">
        {(data.revenue12m?.length ?? 0) > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue12m}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,235,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} tickFormatter={(v: number) => `${v}€`} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.1)", borderRadius: 0 }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  formatter={(v: any) => [eur(Number(v)), "Revenus Atlas"]}
                />
                <Area type="monotone" dataKey="revenue" stroke="var(--accent)" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm py-8 text-center" style={{ color: "var(--color-ink-tertiary)" }}>
            Pas assez de données pour afficher le graphique
          </p>
        )}
      </Card>

      {/* AI Insight */}
      <div className="p-4" style={{ border: "1px solid rgba(199,91,57,0.1)", backgroundColor: "rgba(199,91,57,0.04)" }}>
        <div className="flex items-start gap-3">
          <Sparkles size={16} style={{ color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Insight IA</p>
            {data.aiInsight ? (
              <p className="text-sm mt-1" style={{ color: "var(--text-primary)" }}>{data.aiInsight}</p>
            ) : (
              <p className="text-sm mt-1" style={{ color: "var(--color-ink-tertiary)" }}>
                {data.totalRevenue > 0
                  ? `Atlas a généré ${eur(data.totalRevenue)} au total. ${data.roiPercent > 0 ? `ROI de ${pct(data.roiPercent)}.` : ""} Continue à développer tes campagnes pour débloquer plus d'insights.`
                  : "Connecte tes canaux et lance des campagnes pour voir tes premiers insights."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
