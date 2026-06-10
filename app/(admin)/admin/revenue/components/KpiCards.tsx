"use client";

import { formatEuro } from "../../creators/utils";
import type { RevenueSummary } from "../types";

type Props = { summary: RevenueSummary };

export function KpiCards({ summary }: Props) {
  const cards = [
    {
      label: "Revenus bruts",
      value: formatEuro(summary.total_gross),
      sub: `${Math.round(summary.avg_margin)}% de marge`,
      color: "var(--accent)",
    },
    {
      label: "Commission agence",
      value: formatEuro(summary.total_commission),
      sub: `+${Math.round(summary.margin_variation * 10) / 10}% vs période préc.`,
      color: "var(--accent)",
    },
    {
      label: "Net créateurs",
      value: formatEuro(summary.total_net),
      sub: `-${Math.round((summary.total_platform_fees / summary.total_gross) * 100)}% de frais`,
      color: "var(--text-primary)",
    },
    {
      label: "Marge moyenne",
      value: `${Math.round(summary.avg_margin)}%`,
      sub: `${Math.round(summary.total_commission / 1000)}k€ commission`,
      color: "var(--success)",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 card-accent">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-5"
          style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}
        >
          <p
            className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em] mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {card.label}
          </p>
          <p
            className="font-display text-2xl md:text-[28px] font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {card.value}
          </p>
          <p className="text-[10px] font-sans mt-1.5" style={{ color: "var(--text-secondary)" }}>
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
