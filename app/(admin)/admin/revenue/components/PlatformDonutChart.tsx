"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { PlatformRevenueSummary } from "../types";
import { PLATFORM_COLORS } from "../types";
import { formatEuro } from "../../creators/utils";

type Props = { data: PlatformRevenueSummary[] };

export function PlatformDonutChart({ data }: Props) {
  const chartData = data.map((p) => ({
    name: p.name,
    value: p.total_revenue,
    share: p.share_pct,
    color: PLATFORM_COLORS[p.name] || "var(--text-secondary)",
  }));

  return (
    <div className="p-5 card-accent" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
      <p className="text-[11px] font-sans font-semibold uppercase tracking-[0.1em] mb-4" style={{ color: "var(--text-primary)" }}>
        Répartition par plateforme
      </p>
      <div className="flex items-center gap-4">
        <div style={{ width: 160, height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={72}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#0F0D0B",
                  border: "1px solid var(--border-default)",
                  borderRadius: 0,
                  fontSize: 12,
                  fontFamily: "Plus Jakarta Sans",
                }}
                formatter={function (_v: unknown, _n: unknown, entry: unknown) {
                  const p = entry as { payload?: { share?: number } };
                  return p?.payload?.share ? `${p.payload.share.toFixed(1)}%` : "";
                } as any}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2" style={{ background: entry.color }} />
                <span className="text-[11px] font-sans" style={{ color: "var(--text-secondary)" }}>
                  {entry.name}
                </span>
              </div>
              <span className="text-[11px] font-sans font-medium tabular-nums" style={{ color: "#D0CCC6" }}>
                {entry.share.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
