"use client";

import { AlertTriangle, TrendingUp, Flame, BarChart3, Users, Activity } from "lucide-react";
import { analyticsData } from "../data";
import { StatCard, SimpleBarChart } from "./SharedCharts";

const ALERT_COLORS: Record<string, string> = {
  disengaged: "#C75B39",
  upsell: "#7A9A65",
  burnout: "#C44536",
};
const ALERT_ICONS: Record<string, React.ReactNode> = {
  disengaged: <TrendingUp size={12} />,
  upsell: <TrendingUp size={12} />,
  burnout: <Flame size={12} />,
};

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function CreatorsTab() {
  const heatData = analyticsData.activityHeatMap;
  const maxVal = Math.max(...heatData.map((h) => h.value), 1);

  return (
    <div className="space-y-6">
      {/* KPI summary */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard title="Total créateurs" value={`${analyticsData.departmentDist.reduce((a, d) => a + d.count, 0)}`} icon={<Users size={14} />} />
        <StatCard title="Revenu moyen" value={`${Math.round(analyticsData.monthlyRevenue[analyticsData.monthlyRevenue.length - 1].brut / (analyticsData.departmentDist.reduce((a, d) => a + d.count, 0))).toLocaleString("fr-FR")}€`} subtitle="Par créateur/mois" />
        <StatCard title="Commission moyenne" value={`15.2%`} subtitle="Taux effectif moyen" />
        <StatCard title="Départements" value={`${analyticsData.departmentDist.length}`} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-2 gap-4">
        {/* Revenue distribution */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Distribution des revenus</h4>
          <SimpleBarChart
            data={analyticsData.revenueDistribution.map((r) => ({ ...r }))}
            xKey="range"
            barKey="count"
            color="#C75B39"
            height={200}
          />
        </div>

        {/* Commission tiers */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Distribution par palier</h4>
          <SimpleBarChart
            data={analyticsData.commissionTiers.map((t) => ({ ...t, count: t.count }))}
            xKey="tier"
            barKey="count"
            color="#7A9A65"
            height={200}
          />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-2 gap-4">
        {/* By department */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Par département</h4>
          <SimpleBarChart
            data={analyticsData.departmentDist.map((d) => ({ ...d }))}
            xKey="department"
            barKey="count"
            color="#9A9590"
            height={200}
          />
        </div>

        {/* By seniority */}
        <div className="border border-[var(--color-border)] p-4">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3">Par ancienneté</h4>
          <SimpleBarChart
            data={analyticsData.seniorityDist.map((s) => ({ ...s }))}
            xKey="range"
            barKey="count"
            color="#C75B39"
            height={200}
          />
        </div>
      </div>

      {/* Activity heat map */}
      <div className="border border-[var(--color-border)] p-4">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3 flex items-center gap-1.5">
          <Activity size={12} /> Heat map d'activité
        </h4>
        <div className="grid grid-cols-[50px_repeat(7,1fr)] gap-0.5">
          <div />
          {DAYS.map((d) => (
            <div key={d} className="text-[8px] font-semibold uppercase tracking-wider opacity-30 text-center py-1">{d}</div>
          ))}
          {Array.from({ length: 12 }, (_, hi) => {
            const hour = hi + 8;
            return (
              <>
                <div key={`h-${hour}`} className="text-[8px] opacity-20 text-right pr-1 py-1">{hour}h</div>
                {DAYS.map((day) => {
                  const cell = heatData.find((h) => h.day === day && h.hour === hour);
                  const v = cell?.value ?? 0;
                  const intensity = Math.round((v / maxVal) * 100);
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className="h-3 rounded-sm"
                      style={{ backgroundColor: `rgba(199, 91, 57, ${intensity / 100})` }}
                      title={`${day} ${hour}h: ${v} activités`}
                    />
                  );
                })}
              </>
            );
          })}
        </div>
      </div>

      {/* AI Alerts */}
      <div>
        <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-40 mb-3 flex items-center gap-1.5">
          <AlertTriangle size={12} /> Alertes IA
        </h4>
        <div className="space-y-2">
          {analyticsData.alerts.map((alert, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 border border-[var(--color-border)]"
              style={{ borderLeftColor: ALERT_COLORS[alert.type], borderLeftWidth: 3 }}
            >
              <span style={{ color: ALERT_COLORS[alert.type] }}>{ALERT_ICONS[alert.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{alert.creator_name}</span>
                  <span
                    className="text-[9px] font-medium px-1.5 py-[1px]"
                    style={{
                      backgroundColor: `${ALERT_COLORS[alert.type]}20`,
                      color: ALERT_COLORS[alert.type],
                    }}
                  >
                    {alert.type === "disengaged" ? "Désengagement" : alert.type === "upsell" ? "Upsell" : "Burnout"}
                  </span>
                  <span
                    className="text-[9px] px-1.5 py-[1px]"
                    style={{
                      backgroundColor: alert.severity === "high" ? "#C4453620" : alert.severity === "medium" ? "#C75B3920" : "#9A959020",
                      color: alert.severity === "high" ? "#C44536" : alert.severity === "medium" ? "#C75B39" : "#9A9590",
                    }}
                  >
                    {alert.severity === "high" ? "Haute" : alert.severity === "medium" ? "Moyenne" : "Basse"}
                  </span>
                </div>
                <p className="text-xs opacity-60 mt-1">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
