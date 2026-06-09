"use client";
import { BarChart3, TrendingUp, Euro, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Analytics</h1>
        <p className="text-base mt-1" style={{ color: "#FFFFFF" }}>Performances et statistiques détaillées</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Vues totales", value: "142K", icon: BarChart3, change: "+12%" },
          { label: "Engagement", value: "4.7%", icon: TrendingUp, change: "+5%" },
          { label: "Revenu/click", value: "0.42€", icon: Euro, change: "+8%" },
          { label: "Nouveaux abonnés", value: "1,240", icon: Users, change: "+22%" },
        ].map((s) => (
          <div key={s.label} className="p-5 border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="flex items-center gap-2 mb-2"><s.icon size={16} style={{ color: "#FFFFFF" }} /><span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#FFFFFF" }}>{s.label}</span></div>
            <div className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>{s.value}</div>
            <div className="text-base text-[#A8D08D] mt-1.5">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="p-8 border border-[var(--color-border)] flex items-center justify-center" style={{ backgroundColor: "var(--color-card)", minHeight: 320 }}>
        <div className="text-center">
          <BarChart3 size={32} className="mx-auto mb-2" style={{ color: "#FFFFFF" }} />
          <div className="text-base" style={{ color: "#FFFFFF" }}>Graphiques analytiques détaillés</div>
        </div>
      </div>
    </div>
  );
}
