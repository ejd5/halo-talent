"use client";

import { DollarSign, Clock, Target, TrendingUp } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { RadarStats } from "@/lib/mock/atlas-revenue-radar";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

function formatEUR(amount: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(amount);
}

export function RadarStatsHeader({ stats }: { stats: RadarStats }) {
  const locale = useLocale();
  const l = norm(locale);

  const items = [
    {
      icon: DollarSign,
      label: t("revenue_radar.stats_potential", l),
      value: formatEUR(stats.potentialRevenueToday),
      color: "var(--accent)",
    },
    {
      icon: Target,
      label: t("revenue_radar.stats_pending", l),
      value: String(stats.pendingOpportunities),
      color: "var(--info-text)",
    },
    {
      icon: TrendingUp,
      label: t("revenue_radar.stats_conversion", l),
      value: `${stats.conversionRate}%`,
      color: "var(--success)",
    },
    {
      icon: Clock,
      label: t("revenue_radar.stats_best_time", l),
      value: stats.bestTimeSlot,
      color: "var(--warning-text)",
    },
  ];

  return (
    <div className="flex gap-3 px-4 pt-4 pb-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-lg min-w-0"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center rounded-md shrink-0"
            style={{ backgroundColor: `${item.color}18` }}
          >
            <item.icon size={14} style={{ color: item.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-[17px] font-bold leading-tight truncate" style={{ color: "var(--text-primary)" }}>
              {item.value}
            </p>
            <p className="text-[10px] leading-tight mt-0.5 truncate" style={{ color: "var(--text-tertiary)" }}>
              {item.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
