"use client";

import { useMemo } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { generateRevenueData, REVENUE_EVENTS } from "@/lib/mock/admin-dashboard";
import { DemoBadge } from "./DemoBadge";
import { PeriodSelector } from "./PeriodSelector";
import { KpiRow } from "./KpiRow";
import { QuickActions } from "./QuickActions";
import { RevenueChart } from "./RevenueChart";
import { ActivityFeed } from "./ActivityFeed";
import { TopCreatorsRanking } from "./TopCreatorsRanking";
import { AlertsPanel } from "./AlertsPanel";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function CommandCenter() {
  const locale = useLocale();
  const l = norm(locale);

  const revenueData = useMemo(() => generateRevenueData(), []);

  const dateStr = useMemo(() => {
    return new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-8 stagger-children">
        {/* ROW 1 — Header + PeriodSelector + DemoBadge */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1
              className="text-[1.8rem] md:text-[2.2rem] font-semibold mb-1"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              {t("admin_dashboard.header.title", l)}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {t("admin_dashboard.header.date", l).replace("{date}", dateStr)}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <DemoBadge />
            <PeriodSelector />
          </div>
        </div>

        {/* ROW 2 — 5 KPI cards with sparklines */}
        <KpiRow />

        {/* ROW 3 — Hierarchical quick actions */}
        <QuickActions />

        {/* ROW 4 — RevenueChart (65%) + ActivityFeed (35%) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <RevenueChart data={revenueData} events={REVENUE_EVENTS} />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>

        {/* ROW 5 — TopCreatorsRanking (50%) + AlertsPanel (50%) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopCreatorsRanking />
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}
