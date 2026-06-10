"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, LineChart, Line, Legend,
} from "recharts";
import { DollarSign, Calculator, TrendingUp, PiggyBank } from "lucide-react";
import { Card, Spinner, EmptyState, KpiCard, Table, eur, pct } from "./shared";

const COST_LABELS: Record<string, string> = {
  subscription: "Abonnement Atlas",
  ai_api: "API IA (Claude)",
  twilio: "Twilio SMS",
  resend: "Resend Email",
  other: "Autres",
};

export default function ROITab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/atlas/analytics/roi")
      .then((r) => r.json()).then(setData).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <EmptyState icon={Calculator} title="Pas de données ROI" desc="Ajoute des coûts et des conversions pour voir ton ROI" />;

  const month = data.currentMonth;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI band */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <KpiCard label="Revenus du mois" value={eur(month.totalRevenue)} accent />
        <KpiCard label="Coûts du mois" value={eur(month.totalCost)} sub="abonnement + API + Twilio + Resend" />
        <KpiCard label="ROI" value={pct(month.roiPercent)} accent sub={`(revenus - coûts) / coûts × 100`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue breakdown */}
        <Card title="Revenus générés via Atlas">
          {Object.keys(month.revenueBySource).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(month.revenueBySource).map(([source, rev]) => (
                <div key={source} className="flex items-center justify-between py-2 text-sm" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                  <span style={{ color: "var(--text-primary)" }}>{source}</span>
                  <span className="font-semibold" style={{ color: "var(--success)" }}>{eur(rev as number)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                <span>TOTAL</span>
                <span style={{ color: "var(--success)" }}>{eur(month.totalRevenue)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm py-4 text-center" style={{ color: "var(--color-ink-tertiary)" }}>
              Aucun revenu attribué ce mois
            </p>
          )}
        </Card>

        {/* Cost breakdown */}
        <Card title="Coûts Atlas">
          {Object.keys(month.costBreakdown).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(month.costBreakdown).map(([key, cost]) => (
                <div key={key} className="flex items-center justify-between py-2 text-sm" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                  <span style={{ color: "var(--text-primary)" }}>{COST_LABELS[key] ?? key}</span>
                  <span className="font-semibold" style={{ color: "var(--danger)" }}>{eur(cost as number)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                <span>TOTAL</span>
                <span style={{ color: "var(--danger)" }}>{eur(month.totalCost)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm py-4 text-center" style={{ color: "var(--color-ink-tertiary)" }}>
              Aucun coût enregistré. Ajoute tes coûts dans la table atlas_analytics_costs.
            </p>
          )}
        </Card>
      </div>

      {/* ROI evolution chart */}
      {(data.months?.length ?? 0) > 0 && (
        <Card title="Évolution du ROI (12 mois)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.months}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,235,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} tickFormatter={(v: number) => `${v}%`} />
                <Tooltip
                  contentStyle={{ background: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.1)", borderRadius: 0 }}
                  labelStyle={{ color: "var(--text-primary)" }}
                  formatter={(v: any) => [pct(Number(v)), "ROI"]}
                />
                <Legend />
                <Line type="monotone" dataKey="roi" name="ROI %" stroke="var(--accent)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="revenue" name="Revenus (€)" stroke="var(--success)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="cost" name="Coûts (€)" stroke="var(--danger)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Historical cost entries */}
      {(data.costEntries?.length ?? 0) > 0 && (
        <Card title="Historique des coûts">
          <Table
            headers={["Mois", "Abonnement", "IA API", "Twilio", "Resend", "Autres", "Total"]}
            rows={data.costEntries.map((c: any) => [
              <span key="month" style={{ color: "var(--text-primary)" }}>{c.month?.slice(0, 7)}</span>,
              eur(c.subscription ?? 0),
              eur(c.ai_api_costs ?? 0),
              eur(c.twilio_sms ?? 0),
              eur(c.resend_email ?? 0),
              eur(c.other_costs ?? 0),
              <span key="total" className="font-semibold" style={{ color: "var(--danger)" }}>{eur(c.total)}</span>,
            ])}
          />
        </Card>
      )}
    </div>
  );
}
