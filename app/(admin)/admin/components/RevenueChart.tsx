"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const months = [
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Jun",
];

const data = months.map((month, i) => ({
  month,
  brut: 14000 + Math.sin(i * 0.8) * 5000 + Math.random() * 3000,
  commission: 2000 + Math.sin(i * 0.8) * 800 + Math.random() * 500,
  net: 12000 + Math.sin(i * 0.8) * 4200 + Math.random() * 2500,
}));

function formatEuro(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
  }).format(value);
}

export function RevenueChart() {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  return (
    <div
      className="card-accent"
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--border-default)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{
          borderBottom: "1px solid var(--border-default)",
        }}
      >
        <div>
          <h2
            className="font-display text-lg font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Revenus — 12 mois
          </h2>
          <p className="text-xs font-sans mt-0.5" style={{ color: "var(--text-primary)" }}>
            Bruts · Commission · Net créateurs
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent)" }} />
            <span className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-primary)" }}>Brut</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--text-secondary)" }} />
            <span className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-primary)" }}>Commission</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--text-primary)" }} />
            <span className="text-[10px] font-sans uppercase tracking-[0.08em]" style={{ color: "var(--text-primary)" }}>Net</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4" style={{ minHeight: 320 }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={320}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gradientBrut" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientCommission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--text-secondary)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--text-secondary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradientNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--text-primary)" stopOpacity={0.1} />
                <stop offset="100%" stopColor="var(--text-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="2 2"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
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
              dataKey="brut"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#gradientBrut)"
              dot={false}
              activeDot={{ r: 4, stroke: "var(--accent)", strokeWidth: 2, fill: "#0F0D0B" }}
            />
            <Area
              type="monotone"
              dataKey="commission"
              stroke="var(--text-secondary)"
              strokeWidth={1.5}
              fill="url(#gradientCommission)"
              dot={false}
              activeDot={{ r: 3, stroke: "var(--text-secondary)", strokeWidth: 1.5, fill: "#0F0D0B" }}
            />
            <Area
              type="monotone"
              dataKey="net"
              stroke="var(--text-primary)"
              strokeWidth={1.5}
              fill="url(#gradientNet)"
              dot={false}
              activeDot={{ r: 3, stroke: "var(--text-primary)", strokeWidth: 1.5, fill: "#0F0D0B" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
