"use client";

import { Loader } from "lucide-react";

// ─── Types ───

export interface OverviewData {
  totalFans: number;
  activeFans: number;
  totalRevenue: number;
  totalCost: number;
  roiPercent: number;
  avgLtv: number;
  newFans30d: number;
  churnRate: number;
  revenue12m: { month: string; revenue: number }[];
  aiInsight: string | null;
}

export interface RevenueData {
  totalMonth: number;
  byChannel: { channel: string; revenue: number }[];
  campaigns: any[];
  funnels: any[];
  pushCampaigns: any[];
}

export interface ROI {
  revenueBySource: Record<string, number>;
  costBreakdown: Record<string, number>;
}

// ─── Shared Components ───

export function eur(n: number): string {
  return (n ?? 0).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

export function pct(n: number): string {
  return (n ?? 0).toFixed(1) + "%";
}

export function kebab(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-");
}

export function KpiCard({ label, value, sub, accent }: {
  label: string; value: string; sub?: string; accent?: boolean;
}) {
  return (
    <div
      className="p-4 animate-scale-fade"
      style={{
        backgroundColor: "#2A2420",
        border: accent ? "1px solid rgba(199,91,57,0.25)" : "1px solid rgba(245,240,235,0.06)",
      }}
    >
      <span className="font-sans text-[0.6rem] uppercase tracking-[0.1em]" style={{ color: "var(--color-ink-tertiary)" }}>
        {label}
      </span>
      <p
        className="text-[1.8rem] font-bold leading-none mt-2"
        style={{ fontFamily: "var(--font-display)", color: accent ? "#C75B39" : "#F5F0EB" }}
      >
        {value}
      </p>
      {sub && <p className="text-xs mt-1" style={{ color: "var(--color-ink-tertiary)" }}>{sub}</p>}
    </div>
  );
}

export function Card({ title, children, className = "" }: {
  title?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className} style={{ border: "1px solid rgba(245,240,235,0.06)" }}>
      {title && (
        <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
          <h3 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>{title}</h3>
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <Loader size={16} className="animate-spin" style={{ color: "rgba(245,240,235,0.2)" }} />
    </div>
  );
}

export function EmptyState({ icon: Icon, title, desc }: {
  icon: any; title: string; desc: string;
}) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <Icon size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
      <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>{desc}</p>
    </div>
  );
}

export function Table({ headers, rows }: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="table-header">
            {headers.map((h, i) => <th key={i} className="px-3 py-2 text-left font-normal">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="table-row">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2" style={{ color: "#F5F0EB" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
