"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { ADMIN_METRICS } from "@/lib/mock/admin-dashboard";
import { KpiCard } from "./KpiCard";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function KpiRow() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {t("admin_dashboard.metrics.title", l)}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ADMIN_METRICS.map((metric) => (
          <KpiCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
