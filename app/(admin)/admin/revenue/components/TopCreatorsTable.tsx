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
    <div className="p-5 card-accent" style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.04)" }}>
      <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "#F5F0EB" }}>
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
              style={{ background: "rgba(199,91,57,0.15)", color: "#C75B39" }}>
              {row.creator_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans truncate" style={{ color: "#D0CCC6" }}>
                {row.creator_name}
              </p>
              <p className="text-[9px] font-sans" style={{ color: "#E0D8D0" }}>
                {row.department}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-sans font-semibold tabular-nums" style={{ color: "#F5F0EB" }}>
                {formatEuro(row.current_month)}
              </p>
            </div>
            <div className="flex items-center gap-1 min-w-[60px] justify-end">
              {row.variation_pct >= 0 ? (
                <TrendingUp size={10} strokeWidth={1.5} style={{ color: "#7A9A65" }} />
              ) : (
                <TrendingDown size={10} strokeWidth={1.5} style={{ color: "#C44536" }} />
              )}
              <span
                className="text-[10px] font-sans font-medium tabular-nums"
                style={{ color: row.variation_pct >= 0 ? "#7A9A65" : "#C44536" }}
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
