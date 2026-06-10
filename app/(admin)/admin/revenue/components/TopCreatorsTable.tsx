"use client";

import { formatEuro } from "../../creators/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { CreatorRevenueRow } from "../types";

type Props = { rows: CreatorRevenueRow[] };

export function TopCreatorsTable({ rows }: Props) {
  const sorted = [...rows]
    .sort((a, b) => b.current_month - a.current_month)
    .slice(0, 10);

  return (
    <div className="p-5 card-accent" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
      <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "var(--text-primary)" }}>
        Top créateurs
      </p>
      <div className="space-y-2">
        {sorted.map((row) => (
          <div
            key={row.creator_id}
            className="flex items-center gap-3 py-2"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
          >
            <div className="w-7 h-7 flex items-center justify-center text-[10px] font-sans font-semibold shrink-0"
              style={{ background: "rgba(199,91,57,0.15)", color: "var(--accent)" }}>
              {row.creator_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans truncate" style={{ color: "#D0CCC6" }}>
                {row.creator_name}
              </p>
              <p className="text-[9px] font-sans" style={{ color: "var(--text-secondary)" }}>
                {row.department}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-sans font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                {formatEuro(row.current_month)}
              </p>
            </div>
            <div className="flex items-center gap-1 min-w-[60px] justify-end">
              {row.variation_pct >= 0 ? (
                <TrendingUp size={10} strokeWidth={1.5} style={{ color: "var(--success)" }} />
              ) : (
                <TrendingDown size={10} strokeWidth={1.5} style={{ color: "var(--danger)" }} />
              )}
              <span
                className="text-[10px] font-sans font-medium tabular-nums"
                style={{ color: row.variation_pct >= 0 ? "var(--success)" : "var(--danger)" }}
              >
                {row.variation_pct >= 0 ? "+" : ""}{row.variation_pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
