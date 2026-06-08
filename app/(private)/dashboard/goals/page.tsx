"use client";
import { Target, TrendingUp, Euro } from "lucide-react";

const goals = [
  { label: "Revenu mensuel", current: 12450, target: 15000, unit: "€" },
  { label: "Followers Instagram", current: 14200, target: 20000, unit: "" },
  { label: "Taux d'engagement", current: 4.7, target: 6.0, unit: "%" },
  { label: "Publications / semaine", current: 3, target: 5, unit: "" },
];

export default function GoalsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Mes objectifs</h1>
        <p className="text-xs opacity-40 mt-1">Suivez votre progression vers vos objectifs</p>
      </div>
      {goals.map((g) => {
        const pct = Math.min(Math.round((g.current / g.target) * 100), 100);
        return (
          <div key={g.label} className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium">{g.label}</div>
              <div className="text-xs font-mono opacity-40">{g.current}{g.unit} / {g.target}{g.unit}</div>
            </div>
            <div className="h-2 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
              <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: pct >= 100 ? "#7A9A65" : "var(--color-accent)" }} />
            </div>
            <div className="text-[11px] mt-1" style={{ color: pct >= 100 ? "#7A9A65" : "var(--color-accent)" }}>{pct}% atteint</div>
          </div>
        );
      })}
    </div>
  );
}
