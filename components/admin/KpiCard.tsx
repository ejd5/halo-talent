"use client";

import Link from "next/link";
import type { AdminMetric } from "@/lib/mock/admin-dashboard";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function Sparkline({ data }: { data: number[] }) {
  if (!data || data.length < 2) return null;

  const width = 80;
  const height = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });

  const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${p}`).join(" ");
  const isUp = data[data.length - 1] >= data[0];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0">
      <path d={d} fill="none" stroke={isUp ? "var(--success)" : "var(--danger)"} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface KpiCardProps {
  metric: AdminMetric;
}

export function KpiCard({ metric }: KpiCardProps) {
  const isPositive = metric.variation >= 0;
  const displayValue = metric.prefix
    ? `${metric.prefix}${metric.value.toLocaleString()}`
    : `${metric.value}${metric.suffix ?? ""}`;

  return (
    <Link
      href={metric.href}
      className="p-3 transition-all duration-200 hover:translate-y-[-1px] flex flex-col gap-1.5"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border-default)",
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium" style={{ color: "var(--text-secondary)" }}>
          {metric.labelKey}
        </span>
        {metric.sparkline && <Sparkline data={metric.sparkline} />}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-lg font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
          {displayValue}
        </span>
        <span
          className="text-[9px] font-medium flex items-center gap-0.5 tabular-nums"
          style={{ color: isPositive ? "var(--success)" : "var(--danger)" }}
        >
          {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
          {Math.abs(metric.variation)}%
        </span>
      </div>

      {/* Hover tooltip */}
      <div className="text-[8px]" style={{ color: "var(--text-tertiary)" }}>
        Période précédente: {displayValue}
      </div>
    </Link>
  );
}
