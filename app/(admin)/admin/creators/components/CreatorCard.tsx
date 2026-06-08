"use client";

import type { Creator } from "../types";
import { tierConfig } from "../data";
import { formatEuro, sparklinePath } from "../utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Props = {
  creator: Creator;
  onClick: () => void;
};

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Actif", color: "#7A9A65" },
  pause: { label: "Pause", color: "#C75B39" },
  alert: { label: "Alerte", color: "#C44536" },
};

export function CreatorCard({ creator, onClick }: Props) {
  const tier = tierConfig[creator.tier];
  const status = statusConfig[creator.status];
  const revenues = creator.monthly_revenue.map((m) => m.total_gross);
  const trend = sparklinePath(revenues);

  return (
    <button
      onClick={onClick}
      className="group text-left w-full transition-all duration-200 hover:-translate-y-1"
      style={{
        background: "#1A1614",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Avatar placeholder */}
      <div
        className="w-full aspect-square flex items-center justify-center relative overflow-hidden"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <span
          className="font-display text-7xl font-bold transition-transform duration-300 group-hover:scale-110"
          style={{ color: "rgba(199,91,57,0.2)" }}
        >
          {creator.full_name.charAt(0)}
        </span>

        {/* Status indicator */}
        <span
          className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full"
          style={{ background: status.color, boxShadow: `0 0 6px ${status.color}` }}
        />

        {/* Tier badge */}
        <span
          className="absolute bottom-2 left-2 text-[9px] font-sans font-semibold uppercase tracking-[0.1em] px-2 py-1"
          style={{
            background: `linear-gradient(135deg, ${tier.color}22, ${tier.color}11)`,
            color: tier.color,
            border: `1px solid ${tier.color}33`,
          }}
        >
          {tier.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-4 space-y-3">
        {/* Name + Department */}
        <div>
          <h3 className="font-display text-base font-bold" style={{ color: "#F5F0EB" }}>
            {creator.full_name}
          </h3>
          <p className="text-[11px] font-sans mt-0.5" style={{ color: "#7A736B" }}>
            {creator.department}
          </p>
        </div>

        {/* Revenue + Sparkline */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "#5A544C" }}>
              Revenus du mois
            </p>
            <p className="font-display text-lg font-bold mt-0.5" style={{ color: "#C75B39" }}>
              {formatEuro(creator.current_month_revenue)}
            </p>
          </div>
          <svg width={80} height={28} className="shrink-0">
            <path d={trend} fill="none" stroke="rgba(199,91,57,0.4)" strokeWidth={1.5} />
          </svg>
        </div>

        {/* Growth indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {creator.growth_rate > 0 ? (
              <TrendingUp size={12} strokeWidth={2} style={{ color: "#7A9A65" }} />
            ) : creator.growth_rate < 0 ? (
              <TrendingDown size={12} strokeWidth={2} style={{ color: "#C44536" }} />
            ) : (
              <Minus size={12} strokeWidth={2} style={{ color: "#9A9590" }} />
            )}
            <span
              className="text-[11px] font-sans font-semibold"
              style={{
                color: creator.growth_rate > 0 ? "#7A9A65" : creator.growth_rate < 0 ? "#C44536" : "#9A9590",
              }}
            >
              {creator.growth_rate > 0 ? "+" : ""}
              {creator.growth_rate}%
            </span>
          </div>

          {/* Manager */}
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 flex items-center justify-center text-[8px] font-sans font-semibold"
              style={{ background: "rgba(255,255,255,0.06)", color: "#7A736B" }}
            >
              {creator.manager_name.charAt(0)}
            </div>
            <span className="text-[10px] font-sans" style={{ color: "#5A544C" }}>
              {creator.manager_name}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
