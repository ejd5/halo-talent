"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Juil", revenue: 5200 },
  { month: "Août", revenue: 6100 },
  { month: "Sep", revenue: 5800 },
  { month: "Oct", revenue: 7200 },
  { month: "Nov", revenue: 8400 },
  { month: "Déc", revenue: 7800 },
  { month: "Jan", revenue: 8200 },
  { month: "Fév", revenue: 9100 },
  { month: "Mar", revenue: 10500 },
  { month: "Avr", revenue: 11200 },
  { month: "Mai", revenue: 12450 },
  { month: "Juin", revenue: 11800 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-base-alt border border-ink/10 px-4 py-3">
        <p className="text-xs text-ink-muted mb-1">{label}</p>
        <p className="font-mono text-sm text-accent">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          }).format(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function RevenueChart() {
  return (
    <div>
      <h2 className="font-display text-2xl text-ink mb-6">
        Revenus sur 12 mois
      </h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C75B39" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#C75B39" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,0,0,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#FFFFFF", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#FFFFFF", fontSize: 11 }}
              dx={-8}
              tickFormatter={(v) =>
                new Intl.NumberFormat("fr-FR", {
                  notation: "compact",
                  maximumFractionDigits: 0,
                }).format(v) + "€"
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#C75B39"
              strokeWidth={1.5}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
