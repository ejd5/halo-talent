"use client";

import { Globe, Smartphone, Monitor, Tablet, Clock, Eye, Users, TrendingUp, TrendingDown } from "lucide-react";
import { analyticsData } from "../data";
import { StatCard, SimpleBarChart } from "./SharedCharts";

const TREND_ICONS: Record<string, React.ReactNode> = {
  up: <TrendingUp size={10} className="text-[var(--success)]" />,
  down: <TrendingDown size={10} className="text-[var(--danger)]" />,
  stable: <span className="w-2 h-0.5 bg-[var(--text-secondary)] inline-block" />,
};

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  Mobile: <Smartphone size={12} />,
  Desktop: <Monitor size={12} />,
  Tablette: <Tablet size={12} />,
};

export function WebTab() {
  const totalVisits = analyticsData.trafficSources.reduce((a, s) => a + s.visits, 0);
  const totalViews = analyticsData.webTraffic.reduce((a, p) => a + p.views, 0);

  return (
    <div className="space-y-6 card-accent">
      {/* KPI */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Visites (30j)" value={totalVisits.toLocaleString("fr-FR")} icon={<Users size={14} />} />
        <StatCard title="Pages vues" value={totalViews.toLocaleString("fr-FR")} icon={<Eye size={14} />} />
        <StatCard title="Taux de conversion" value="3.8%" subtitle="Visite → Candidature" trend="up" trendValue="0.5%" />
        <StatCard title="Temps moyen" value="2m 18s" subtitle="Sur l'ensemble du site" icon={<Clock size={14} />} />
      </div>

      {/* Sources de trafic */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Sources de trafic</h4>
          <div className="space-y-2">
            {analyticsData.trafficSources.map((src) => (
              <div key={src.source} className="flex items-center gap-3">
                <span className="text-xs flex-1">{src.source}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-24 h-2 border border-[var(--color-border)]">
                    <div
                      className="h-full transition-all"
                      style={{ width: `${src.percentage}%`, backgroundColor: "var(--accent)" }}
                    />
                  </div>
                  <span className="text-[11px] font-medium w-12 text-right">{src.percentage}%</span>
                  <span className="w-4 flex justify-center">{TREND_ICONS[src.trend]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Appareils</h4>
          <div className="space-y-3">
            {analyticsData.devices.map((d) => (
              <div key={d.device} className="flex items-center gap-3">
                <span className="opacity-40">{DEVICE_ICONS[d.device]}</span>
                <span className="text-xs flex-1">{d.device}</span>
                <div className="w-32 h-3 border border-[var(--color-border)]">
                  <div className="h-full transition-all" style={{ width: `${d.percentage}%`, backgroundColor: d.device === "Mobile" ? "var(--accent)" : d.device === "Desktop" ? "var(--success)" : "var(--text-secondary)" }} />
                </div>
                <span className="text-[11px] font-medium w-10 text-right">{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pages les plus visitées */}
      <div className="border border-[var(--color-border)]">
        <div className="px-5 py-3 border-b border-[var(--color-border)]">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40">Pages les plus visitées</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-5 py-2 font-medium opacity-40">Page</th>
                <th className="text-right px-5 py-2 font-medium opacity-40">Vues</th>
                <th className="text-right px-5 py-2 font-medium opacity-40">Visiteurs uniques</th>
                <th className="text-right px-5 py-2 font-medium opacity-40">Temps moyen</th>
                <th className="text-right px-5 py-2 font-medium opacity-40">Bounce rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.webTraffic.map((p) => (
                <tr key={p.page} className="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-card)]">
                  <td className="px-5 py-2.5 font-medium">{p.page}</td>
                  <td className="px-5 py-2.5 text-right">{p.views.toLocaleString("fr-FR")}</td>
                  <td className="px-5 py-2.5 text-right opacity-60">{p.unique_visitors.toLocaleString("fr-FR")}</td>
                  <td className="px-5 py-2.5 text-right opacity-60">{Math.floor(p.avg_time_seconds / 60)}m {p.avg_time_seconds % 60}s</td>
                  <td className="px-5 py-2.5 text-right">
                    <span style={{ color: p.bounce_rate > 30 ? "var(--danger)" : "var(--success)" }}>{p.bounce_rate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
