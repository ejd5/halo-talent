"use client";
import { BarChart3, TrendingUp, Euro, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Analytics</h1>
        <p className="text-xs opacity-40 mt-1">Performances et statistiques détaillées</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Vues totales", value: "142K", icon: BarChart3, change: "+12%" },
          { label: "Engagement", value: "4.7%", icon: TrendingUp, change: "+5%" },
          { label: "Revenu/click", value: "0.42€", icon: Euro, change: "+8%" },
          { label: "Nouveaux abonnés", value: "1,240", icon: Users, change: "+22%" },
        ].map((s) => (
          <div key={s.label} className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="flex items-center gap-2 mb-1"><s.icon size={14} className="opacity-40" /><span className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{s.label}</span></div>
            <div className="text-lg font-semibold font-mono" style={{ fontFamily: "var(--font-display)" }}>{s.value}</div>
            <div className="text-[11px] text-[#7A9A65] mt-1">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="p-8 border border-[var(--color-border)] flex items-center justify-center" style={{ backgroundColor: "var(--color-card)", minHeight: 300 }}>
        <div className="text-center">
          <BarChart3 size={32} className="opacity-10 mx-auto mb-2" />
          <div className="text-xs opacity-20">Graphiques analytiques détaillés</div>
        </div>
      </div>
    </div>
  );
}
