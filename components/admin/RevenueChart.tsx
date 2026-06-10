"use client";

import { useState, useMemo } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import type { RevenueDataPoint, RevenueEvent } from "@/lib/mock/admin-dashboard";

const CREATOR_COLORS = ["var(--accent)", "var(--success)", "#3B82F6", "#8B5CF6", "#F59E0B"];
const CREATOR_NAMES = ["Clara W.", "Camille N.", "Marc T.", "Manon R.", "Jade L."];

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

type ViewMode = "overview" | "platform" | "region" | "creator";

const PLATFORM_KEYS: { key: "of" | "fansly" | "ig" | "tt"; color: string }[] = [
  { key: "of", color: "var(--accent)" },
  { key: "fansly", color: "#8B5CF6" },
  { key: "ig", color: "#EC4899" },
  { key: "tt", color: "#3B82F6" },
];

const REGION_KEYS: { key: "fr" | "br" | "us" | "other"; color: string }[] = [
  { key: "fr", color: "var(--accent)" },
  { key: "br", color: "var(--success)" },
  { key: "us", color: "#3B82F6" },
  { key: "other", color: "#8B5CF6" },
];

interface RevenueChartProps {
  data: RevenueDataPoint[];
  events: RevenueEvent[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }} className="p-2 text-[10px]">
      <p style={{ color: "var(--text-primary)" }} className="font-medium mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: €{entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
};

export function RevenueChart({ data, events }: RevenueChartProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [viewMode, setViewMode] = useState<ViewMode>("overview");

  // Generate per-creator data for the "creator" view
  const creatorData = useMemo(() => {
    if (viewMode !== "creator") return [];
    return data.map((d, i) => {
      const rec: Record<string, number | string> = { month: d.month };
      CREATOR_NAMES.forEach((name, ci) => {
        rec[name] = Math.round((800 + Math.sin(i * 0.4 + ci * 1.2) * 400 + Math.random() * 200) * 100) / 100;
      });
      return rec;
    });
  }, [data, viewMode]);

  const views: { key: ViewMode; labelKey: string }[] = [
    { key: "overview", labelKey: "admin_dashboard.chart.view.overview" },
    { key: "platform", labelKey: "admin_dashboard.chart.view.platform" },
    { key: "region", labelKey: "admin_dashboard.chart.view.region" },
    { key: "creator", labelKey: "admin_dashboard.chart.view_by_creator" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[13px] font-display font-bold" style={{ color: "var(--text-primary)" }}>
          {t("admin_dashboard.chart.title", l)}
        </h2>
        <div className="flex gap-1">
          {views.map((v) => (
            <button
              key={v.key}
              onClick={() => setViewMode(v.key)}
              className="text-[8px] px-2 py-1 transition-colors"
              style={{
                background: viewMode === v.key ? "rgba(199,91,57,0.15)" : "rgba(255,255,255,0.03)",
                color: viewMode === v.key ? "var(--accent)" : "rgba(255,255,255,0.3)",
              }}
            >
              {t(v.labelKey, l)}
            </button>
          ))}
        </div>
      </div>

      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === "overview" ? (
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradBrut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--success)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="brut" stroke="var(--accent)" fill="url(#gradBrut)" strokeWidth={1.5} name="Brut" />
                <Area type="monotone" dataKey="net" stroke="var(--success)" fill="url(#gradNet)" strokeWidth={1.5} name="Net" />
                <Area type="monotone" dataKey="commission" stroke="#F59E0B" strokeWidth={1} name="Commission" strokeDasharray="4 2" fill="none" />
                {events.map((ev, i) => (
                  <ReferenceLine
                    key={i}
                    x={ev.date}
                    stroke="rgba(255,255,255,0.1)"
                    strokeDasharray="2 2"
                    label={{
                      value: t(ev.label, l),
                      fontSize: 7,
                      fill: "rgba(255,255,255,0.3)",
                      position: "top",
                    }}
                  />
                ))}
              </AreaChart>
            ) : viewMode === "platform" ? (
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                {PLATFORM_KEYS.map((p) => (
                  <Area key={p.key} type="monotone" dataKey={`byPlatform.${p.key}`} stroke={p.color} fill="none" strokeWidth={1.5} name={p.key.toUpperCase()} />
                ))}
              </AreaChart>
            ) : viewMode === "creator" ? (
              <AreaChart data={creatorData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                {CREATOR_NAMES.map((name, ci) => (
                  <Area key={name} type="monotone" dataKey={name} stroke={CREATOR_COLORS[ci]} fill="none" strokeWidth={1.5} name={name} />
                ))}
              </AreaChart>
            ) : (
              <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                {REGION_KEYS.map((r) => (
                  <Area key={r.key} type="monotone" dataKey={`byRegion.${r.key}`} stroke={r.color} fill="none" strokeWidth={1.5} name={r.key.toUpperCase()} />
                ))}
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2">
          {(viewMode === "overview" ? [
            { label: t("admin_dashboard.chart.legend.brut", l), color: "var(--accent)" },
            { label: t("admin_dashboard.chart.legend.net", l), color: "var(--success)" },
            { label: t("admin_dashboard.chart.legend.commission", l), color: "#F59E0B" },
          ] : viewMode === "platform" ? PLATFORM_KEYS.map((p) => ({
            label: p.key.toUpperCase(),
            color: p.color,
          })) : viewMode === "creator" ? CREATOR_NAMES.map((name, ci) => ({
            label: name,
            color: CREATOR_COLORS[ci],
          })) : REGION_KEYS.map((r) => ({
            label: r.key.toUpperCase(),
            color: r.color,
          }))).map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-2 h-[2px]" style={{ background: item.color }} />
              <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
