"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { MINI_STATS } from "@/lib/mock/studio-dashboard";
import { TrendingUp, Users, Heart, FileText } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Users, Heart, FileText,
};

export function StatsRow() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {MINI_STATS.map((stat) => {
        const Icon = ICON_MAP[stat.icon] || TrendingUp;
        const isPositive = stat.variation >= 0;
        const variationColor = isPositive ? "var(--success)" : "var(--danger)";
        const variationSign = stat.variation > 0 ? "+" : "";

        return (
          <div
            key={stat.id}
            className="p-4 transition-all duration-200 hover:translate-y-[-1px]"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-medium" style={{ color: "var(--text-secondary)" }}>
                {t(stat.labelKey, l)}
              </span>
              <Icon size={14} style={{ color: "var(--text-tertiary)" }} />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-xl font-semibold tabular-nums"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
              >
                {stat.value}
              </span>
              <span
                className="text-[10px] font-medium tabular-nums"
                style={{ color: variationColor }}
              >
                {stat.prefix}{variationSign}{stat.variation}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
