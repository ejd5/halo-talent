"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { TOP_CREATORS } from "@/lib/mock/admin-dashboard";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function TopCreatorsRanking() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {t("admin_dashboard.ranking.title", l)}
      </h2>
      <div
        className="divide-y"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-default)",
        }}
      >
        {TOP_CREATORS.map((creator, index) => {
          const isPositive = creator.variation >= 0;

          return (
            <Link
              key={creator.id}
              href={creator.href}
              className="flex items-center gap-3 p-3 transition-colors hover:translate-y-[-1px]"
            >
              {/* Rank */}
              <span
                className="text-[9px] font-bold w-4 text-center tabular-nums"
                style={{ color: index < 3 ? "var(--accent)" : "var(--text-tertiary)" }}
              >
                {index + 1}
              </span>

              {/* Avatar */}
              <div
                className="w-7 h-7 flex items-center justify-center rounded-sm text-[8px] font-bold shrink-0"
                style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {creator.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {creator.name}
                </p>
                <p className="text-[8px]" style={{ color: "var(--text-tertiary)" }}>
                  {t("admin_dashboard.ranking.revenue", l)}: €{creator.revenue.toLocaleString()}
                </p>
              </div>

              {/* Variation */}
              <span
                className="text-[9px] font-medium flex items-center gap-0.5 tabular-nums"
                style={{ color: isPositive ? "var(--success)" : "var(--danger)" }}
              >
                {isPositive ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                {Math.abs(creator.variation)}%
              </span>

              <ChevronRight size={10} style={{ color: "var(--text-tertiary)" }} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
