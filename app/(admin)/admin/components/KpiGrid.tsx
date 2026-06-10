"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Kpi = {
  label: string;
  value: string;
  variation: number;
  prefix?: string;
  href: string;
};

const kpis: Kpi[] = [
  {
    label: "Revenus générés",
    value: "284 340",
    prefix: "€",
    variation: 12.5,
    href: "/admin/revenue",
  },
  {
    label: "Commission agence",
    value: "41 230",
    prefix: "€",
    variation: 8.3,
    href: "/admin/commissions",
  },
  {
    label: "Créateurs actifs",
    value: "18 / 24",
    variation: 2,
    href: "/admin/creators",
  },
  {
    label: "Candidatures",
    value: "12",
    variation: -5,
    href: "/admin/applications",
  },
  {
    label: "Taux de rétention",
    value: "94",
    prefix: "%",
    variation: 1.2,
    href: "/admin/analytics",
  },
];

export function KpiGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-[1px] card-accent">
      {kpis.map((kpi) => {
        const isPositive = kpi.variation >= 0;
        return (
          <Link
            key={kpi.label}
            href={kpi.href}
            className="group p-5 transition-colors hover:bg-white/[0.03]"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <p
              className="text-[11px] font-sans font-semibold uppercase tracking-[0.12em] mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              {kpi.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span
                className="font-display text-[40px] font-bold leading-none"
                style={{ color: "var(--accent)" }}
              >
                {kpi.value}
              </span>
              {kpi.prefix && (
                <span
                  className="font-display text-xl font-bold"
                  style={{ color: "var(--accent)" }}
                >
                  {kpi.prefix}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 mt-2">
              {isPositive ? (
                <TrendingUp size={12} strokeWidth={2} style={{ color: "var(--success)" }} />
              ) : (
                <TrendingDown size={12} strokeWidth={2} style={{ color: "var(--danger)" }} />
              )}
              <span
                className="text-[11px] font-sans font-medium"
                style={{
                  color: isPositive ? "var(--success)" : "var(--danger)",
                }}
              >
                {isPositive ? "+" : ""}
                {kpi.variation}%
              </span>
              <span
                className="text-[10px] font-sans ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                vs période préc.
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
