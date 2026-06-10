"use client";

import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { ChatRevenueDay } from "@/lib/mock/chat-analytics";

function formatCurrency(value: number): string {
  return `${value.toLocaleString()} €`;
}

function calculateTotals(days: ChatRevenueDay[]) {
  const ppv = days.reduce((s, d) => s + d.ppv, 0);
  const tips = days.reduce((s, d) => s + d.tips, 0);
  const resubs = days.reduce((s, d) => s + d.resubs, 0);
  return { ppv, tips, resubs, total: ppv + tips + resubs };
}

export function ChatRevenueChart({ data }: { data: ChatRevenueDay[] }) {
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const totals = calculateTotals(data);
  const total = totals.total;

  const toggleSeries = (key: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Revenus via chat (30 jours)
          </h3>
          <p className="text-[22px] font-bold mt-1" style={{ color: "var(--text-primary)" }}>
            {formatCurrency(total)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[10px]" style={{ color: "var(--success)" }}>
            <TrendingUp size={12} />
            <span>+18.7% vs période préc.</span>
          </div>
        </div>
      </div>

      {/* Legend toggle */}
      <div className="flex items-center gap-4 mb-3">
        {[
          { key: "ppv", label: "PPV", color: "var(--accent)" },
          { key: "tips", label: "Tips", color: "var(--success)" },
          { key: "resubs", label: "Réabonnements", color: "#5B8FC4" },
        ].map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleSeries(key)}
            className="flex items-center gap-1.5 text-[10px] font-medium transition-opacity"
            style={{
              color: hiddenSeries.has(key) ? "var(--text-tertiary)" : "var(--text-secondary)",
              opacity: hiddenSeries.has(key) ? 0.5 : 1,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: hiddenSeries.has(key) ? "var(--border-default)" : color }}
            />
            {label}
            <span className="ml-0.5" style={{ color: "var(--text-tertiary)" }}>
              {formatCurrency(totals[key as keyof typeof totals])}
            </span>
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="w-full h-[180px] sm:h-[280px]">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-default)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: "var(--text-tertiary)" }}
              tickFormatter={(v: string) => v.slice(5)}
              stroke="var(--border-default)"
            />
            <YAxis
              tick={{ fontSize: 9, fill: "var(--text-tertiary)" }}
              tickFormatter={(v: number) => `${v}€`}
              stroke="var(--border-default)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                borderRadius: "6px",
                fontSize: "11px",
                color: "var(--text-primary)",
              }}
              formatter={(value: any) => [formatCurrency(value), ""]}
              labelFormatter={(label: any) => new Date(label).toLocaleDateString("fr-FR")}
            />
            {!hiddenSeries.has("ppv") && (
              <Line type="monotone" dataKey="ppv" stroke="var(--accent)" strokeWidth={2} dot={false} name="PPV" />
            )}
            {!hiddenSeries.has("tips") && (
              <Line type="monotone" dataKey="tips" stroke="var(--success)" strokeWidth={2} dot={false} name="Tips" />
            )}
            {!hiddenSeries.has("resubs") && (
              <Line type="monotone" dataKey="resubs" stroke="#5B8FC4" strokeWidth={2} dot={false} name="Réabonnements" />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
