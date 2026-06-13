"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import {
  Mail, MessageCircle, Bell, Funnel, TrendingUp, Trophy,
} from "lucide-react";
import { Card, Spinner, EmptyState, KpiCard, Table, eur, pct } from "./shared";

const CHANNEL_ICONS: Record<string, any> = {
  email: Mail, sms: MessageCircle, push: Bell, funnel: Funnel,
};

export default function ChannelsTab() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/atlas/analytics/channels")
      .then((r) => r.json()).then(setData).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!data || data.channels.length === 0)
    return <EmptyState icon={TrendingUp} title="Aucune donnée canal" desc="Les données apparaîtront après l'envoi de campagnes" />;

  const best = data.bestChannel;
  const channels = data.channels as any[];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Best channel highlight */}
      {best && (
        <div className="p-4" style={{ border: "1px solid var(--accent-border)", backgroundColor: "rgba(199,91,57,0.04)" }}>
          <div className="flex items-center gap-3">
            <Trophy size={20} style={{ color: "var(--accent)" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Meilleur canal : <span style={{ color: "var(--accent)" }}>{best.name}</span>
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>
                {eur(best.revenue)} de revenus générés ce mois, ROI estimé {best.roi}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Channel cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((ch: any) => {
          const Icon = CHANNEL_ICONS[ch.id] ?? TrendingUp;
          return (
            <div key={ch.id} className="p-4" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={16} style={{ color: "var(--accent)" }} />
                <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{ch.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>Envoyés</span>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{ch.sent.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>Ouverts</span>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                    {ch.opens?.toLocaleString() ?? "-"}
                    {ch.sent > 0 && ch.opens > 0 && (
                      <span className="text-xs ml-1" style={{ color: "var(--color-ink-tertiary)" }}>
                        ({((ch.opens / ch.sent) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>Clics</span>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{ch.clicks?.toLocaleString() ?? "-"}</p>
                </div>
                <div>
                  <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>Conversions</span>
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{ch.conversions?.toLocaleString() ?? "-"}</p>
                </div>
              </div>
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid rgba(245,240,235,0.04)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>Revenus</span>
                  <span className="font-semibold" style={{ color: "var(--success)" }}>{eur(ch.revenue)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Channel comparison chart */}
      <Card title="Comparaison des canaux">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={channels}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,235,0.04)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} tickFormatter={(v: number) => `${v}€`} />
              <Tooltip
                contentStyle={{ background: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.1)", borderRadius: 0 }}
                labelStyle={{ color: "var(--text-primary)" }}
                formatter={(v: any) => [eur(Number(v)), "Revenus"]}
              />
              <Bar dataKey="revenue" fill="var(--accent)" radius={0} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
