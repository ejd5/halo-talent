"use client";

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ReactNode } from "react";

export function StatCard({ title, value, subtitle, trend, trendValue, icon }: {
  title: string; value: string; subtitle?: string;
  trend?: "up" | "down"; trendValue?: string; icon?: ReactNode;
}) {
  return (
    <div className="border border-[var(--color-border)] p-4 card-accent">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-40">{title}</span>
        {icon && <span className="opacity-30">{icon}</span>}
      </div>
      <div className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>{value}</div>
      {subtitle && <div className="text-[10px] opacity-40 mt-0.5">{subtitle}</div>}
      {trend && (
        <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium ${trend === "up" ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
          {trend === "up" ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trendValue} {trend === "up" ? "hausse" : "baisse"}
        </div>
      )}
    </div>
  );
}

export function SimpleAreaChart({ data, xKey, series, height = 200 }: {
  data: Record<string, unknown>[]; xKey: string;
  series: { key: string; color: string; name: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.3} />
        <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: "var(--color-text-secondary)" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 9, fill: "var(--color-text-secondary)" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 0, fontSize: 11 }} />
        {series.map((s) => (
          <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} fill={`url(#grad-${s.key})`} strokeWidth={2} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({ data, xKey, barKey, color, height = 200 }: {
  data: Record<string, unknown>[]; xKey: string; barKey: string; color: string; height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.3} />
        <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: "var(--color-text-secondary)" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 9, fill: "var(--color-text-secondary)" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 0, fontSize: 11 }} />
        <Bar dataKey={barKey} fill={color} radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SimpleLineChart({ data, xKey, series, height = 200 }: {
  data: Record<string, unknown>[]; xKey: string;
  series: { key: string; color: string; name: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" strokeOpacity={0.3} />
        <XAxis dataKey={xKey} tick={{ fontSize: 9, fill: "var(--color-text-secondary)" }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fontSize: 9, fill: "var(--color-text-secondary)" }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 0, fontSize: 11 }} />
        {series.map((s) => <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={false} />)}
      </LineChart>
    </ResponsiveContainer>
  );
}
