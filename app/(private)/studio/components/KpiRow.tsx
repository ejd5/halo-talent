"use client";

type Kpi = {
  label: string;
  value: string;
  trend: string;
  positive: boolean;
};

const KPIS: Kpi[] = [
  { label: "Contenus créés ce mois", value: "24", trend: "+12% vs mois dernier", positive: true },
  { label: "Crédits IA restants", value: "2 450", trend: "sur 5 000", positive: true },
  { label: "Publications planifiées", value: "8", trend: "Cette semaine", positive: true },
  { label: "Engagement moyen", value: "4.7%", trend: "+0.8% vs dernier post", positive: true },
];

export function KpiRow() {
  const trendColor = (positive: boolean) => positive ? "var(--color-ink-secondary)" : "var(--color-ink-tertiary)";

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {KPIS.map((kpi) => (
        <div
          key={kpi.label}
          className="card-accent p-4"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <p className="font-sans text-[0.6rem] uppercase tracking-[0.1em] mb-2" style={{ color: "var(--color-ink-tertiary)" }}>
            {kpi.label}
          </p>
          <p className="text-[2rem] font-bold leading-none" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            {kpi.value}
          </p>
          <p className="text-[0.7rem] mt-2" style={{ color: trendColor(kpi.positive) }}>
            {kpi.trend}
          </p>
        </div>
      ))}
    </div>
  );
}
