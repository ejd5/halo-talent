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
      color: "#C75B39",
    },
    {
      label: "Commission agence",
      value: formatEuro(summary.total_commission),
      sub: `+${Math.round(summary.margin_variation * 10) / 10}% vs période préc.`,
      color: "#C75B39",
    },
    {
      label: "Net créateurs",
      value: formatEuro(summary.total_net),
      sub: `-${Math.round((summary.total_platform_fees / summary.total_gross) * 100)}% de frais`,
      color: "#F5F0EB",
    },
    {
      label: "Marge moyenne",
      value: `${Math.round(summary.avg_margin)}%`,
      sub: `${Math.round(summary.total_commission / 1000)}k€ commission`,
      color: "#7A9A65",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 card-accent">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-5"
          style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}
        >
          <p
            className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em] mb-2"
            style={{ color: "#F5F0EB" }}
          >
            {card.label}
          </p>
          <p
            className="font-display text-2xl md:text-[28px] font-bold"
            style={{ color: "#F5F0EB" }}
          >
            {card.value}
          </p>
          <p className="text-[10px] font-sans mt-1.5" style={{ color: "#E0D8D0" }}>
            {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
}
