"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatEuro } from "../../creators/utils";
import type { AggregatedMonthlyRevenue } from "../types";

type Props = { data: AggregatedMonthlyRevenue[] };

const COLORS = {
  commission: "var(--accent)",
  net: "var(--text-secondary)",
  fees: "var(--text-secondary)",
};

export function RevenueStackedChart({ data }: Props) {
  const chartData = data.map((m) => ({
    month: m.month,
    Commission: m.total_commission,
    "Net créateurs": m.total_net,
    "Frais plateformes": m.platform_fees,
  }));

  return (
    <div className="card-accent" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <div>
          <h2 className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
            Répartition des revenus
          </h2>
          <p className="text-xs font-sans mt-0.5" style={{ color: "var(--text-primary)" }}>
            Commission · Net créateurs · Frais plateformes
          </p>
        </div>
        <div className="flex items-center gap-4">
          {[
            { label: "Commission", color: COLORS.commission },
            { label: "Net créateurs", color: COLORS.net },
            { label: "Frais", color: COLORS.fees },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5" style={{ background: item.color }} />
              <span className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-primary)" }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="p-4" style={{ minHeight: 320 }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="gradCommission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.commission} stopOpacity={0.2} />
                <stop offset="100%" stopColor={COLORS.commission} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.net} stopOpacity={0.15} />
                <stop offset="100%" stopColor={COLORS.net} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradFees" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.fees} stopOpacity={0.1} />
                <stop offset="100%" stopColor={COLORS.fees} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-primary)", fontSize: 11, fontFamily: "Plus Jakarta Sans" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-primary)", fontSize: 11, fontFamily: "Plus Jakarta Sans" }}
              tickFormatter={formatEuro}
            />
            <Tooltip
              contentStyle={{
                background: "#0F0D0B",
                border: "1px solid var(--border-default)",
                borderRadius: 0,
                fontSize: 12,
                fontFamily: "Plus Jakarta Sans",
              }}
              labelStyle={{ color: "var(--text-primary)", marginBottom: 4 }}
              formatter={(value) => formatEuro(Number(value) || 0)}
            />
            <Area
              type="monotone"
              dataKey="Commission"
              stackId="1"
              stroke={COLORS.commission}
              strokeWidth={1.5}
              fill="url(#gradCommission)"
              dot={false}
              activeDot={{ r: 3, stroke: COLORS.commission, strokeWidth: 1.5, fill: "#0F0D0B" }}
            />
            <Area
              type="monotone"
              dataKey="Net créateurs"
              stackId="1"
              stroke={COLORS.net}
              strokeWidth={1.5}
              fill="url(#gradNet)"
              dot={false}
              activeDot={{ r: 3, stroke: COLORS.net, strokeWidth: 1.5, fill: "#0F0D0B" }}
            />
            <Area
              type="monotone"
              dataKey="Frais plateformes"
              stackId="1"
              stroke={COLORS.fees}
              strokeWidth={1.5}
              fill="url(#gradFees)"
              dot={false}
              activeDot={{ r: 3, stroke: COLORS.fees, strokeWidth: 1.5, fill: "#0F0D0B" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
