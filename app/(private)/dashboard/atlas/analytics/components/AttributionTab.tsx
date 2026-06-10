"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
} from "recharts";
import {
  GitBranch, Users, MousePointerClick, DollarSign, Timeline,
} from "lucide-react";
import { Card, Spinner, EmptyState, eur, pct } from "./shared";

const MODELS = [
  { id: "first_touch", label: "First touch", desc: "Crédit au premier point de contact" },
  { id: "last_touch", label: "Last touch", desc: "Crédit au dernier point avant achat" },
  { id: "linear", label: "Linear", desc: "Crédit réparti sur tous les points" },
  { id: "time_decay", label: "Time decay", desc: "Plus de crédit aux points proches de l'achat" },
  { id: "custom", label: "Custom", desc: "Poids personnalisés" },
];

export default function AttributionTab() {
  const [model, setModel] = useState("last_touch");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fanId, setFanId] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ model });
    if (fanId) params.set("fan_id", fanId);
    fetch(`/api/atlas/analytics/attribution?${params}`)
      .then((r) => r.json()).then(setData).catch(() => {})
      .finally(() => setLoading(false));
  }, [model, fanId]);

  const hasConversions = (data?.conversions?.length ?? 0) > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Model selector */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        {MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => setModel(m.id)}
            className="text-left p-3 transition-colors text-xs"
            style={{
              backgroundColor: model === m.id ? "rgba(199,91,57,0.12)" : "#2A2420",
              border: model === m.id ? "1px solid var(--accent)" : "1px solid rgba(245,240,235,0.06)",
              color: model === m.id ? "var(--accent)" : "var(--text-primary)",
            }}
          >
            <span className="font-semibold">{m.label}</span>
            <p className="mt-1" style={{ color: "var(--color-ink-tertiary)", fontWeight: 400 }}>{m.desc}</p>
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : !hasConversions ? (
        <EmptyState icon={GitBranch} title="Aucune attribution" desc="Les attributions apparaîtront quand des conversions seront trackées" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversions list */}
          <Card title={`Conversions (modèle: ${MODELS.find((m) => m.id === model)?.label})`}>
            <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
              {data.conversions.map((c: any) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3 text-sm"
                  style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}
                >
                  <div>
                    <p style={{ color: "var(--text-primary)" }}>{c.fan_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>
                        {c.channel}
                      </span>
                      <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
                        {new Date(c.converted_at).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>
                  <span className="font-semibold" style={{ color: "var(--success)" }}>{eur(c.revenue)}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue attribution by channel */}
          <Card title="Répartition par canal">
            {(() => {
              const channelMap: Record<string, number> = {};
              data.conversions.forEach((c: any) => {
                channelMap[c.channel] = (channelMap[c.channel] || 0) + Number(c.revenue);
              });
              const chartData = Object.entries(channelMap).map(([k, v]) => ({ channel: k, revenue: v }));
              return (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(245,240,235,0.04)" />
                      <XAxis dataKey="channel" tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--color-ink-tertiary)" }} tickFormatter={(v: number) => `${v}€`} />
                      <Tooltip
                        contentStyle={{ background: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.1)", borderRadius: 0 }}
                        labelStyle={{ color: "var(--text-primary)" }}
                        formatter={(v: any) => [eur(Number(v)), "Revenu attribué"]}
                      />
                      <Bar dataKey="revenue" fill="var(--accent)" radius={0} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              );
            })()}
          </Card>
        </div>
      )}

      {/* Fan journey — if a fan is selected */}
      {(data?.fanJourney?.length ?? 0) > 0 && (
        <Card title="Parcours du fan">
          <div className="space-y-0">
            {(data.fanJourney as any[]).map((step: any, i: number) => (
              <div key={i} className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
                <div className="flex flex-col items-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: step.type === "conversion" ? "var(--success)" : "var(--color-ink-tertiary)",
                    }}
                  />
                  {i < data.fanJourney.length - 1 && (
                    <div className="w-px h-full mt-1" style={{ backgroundColor: "rgba(245,240,235,0.06)" }} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                      {step.type === "conversion" ? "💰 Conversion" : `📧 ${step.channel}`}
                    </p>
                    <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
                      {new Date(step.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  {step.type === "conversion" && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--success)" }}>
                      {eur(step.revenue)} (poids: {step.weight})
                    </p>
                  )}
                  {step.content && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: "var(--color-ink-tertiary)" }}>
                      {step.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
