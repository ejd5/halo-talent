"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { AdminMetric } from "@/lib/mock/admin-dashboard";
import { TrendingUp, TrendingDown } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface AdminMetricGridProps {
  metrics: AdminMetric[];
}

export function AdminMetricGrid({ metrics }: AdminMetricGridProps) {
  const locale = useLocale();
  const l = norm(locale);

  if (metrics.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("admin_dashboard.metrics.empty", l)}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {metrics.map((metric) => {
        const isPositive = metric.variation >= 0;
        const displayValue = metric.prefix
          ? `${metric.prefix}${metric.value.toLocaleString()}`
          : `${metric.value.toLocaleString()}${metric.suffix || ""}`;

        return (
          <Link
            key={metric.id}
            href={metric.href}
            className="p-3 transition-all duration-200 hover:-translate-y-px"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <p className="text-[8px] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
              {t(metric.labelKey, l)}
            </p>
            <p className="text-[22px] md:text-[26px] font-bold leading-tight mb-1" style={{ color: "var(--text-primary)" }}>
              {displayValue}
            </p>
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp size={10} style={{ color: "var(--success)" }} />
              ) : (
                <TrendingDown size={10} style={{ color: "var(--danger)" }} />
              )}
              <span
                className="text-[9px] font-medium"
                style={{ color: isPositive ? "var(--success)" : "var(--danger)" }}
              >
                {isPositive ? "+" : ""}{metric.variation}%
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
