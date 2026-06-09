"use client";

import { useMemo, useState } from "react";
import { creators } from "../../creators/data";
import {
  aggregateMonthlyRevenue,
  computeRevenueSummary,
  computePlatformSummaries,
  buildCreatorRevenueRows,
  buildFinancialAlerts,
} from "../utils";
import type { FinancialAlert } from "../types";
import { RevenueTabBar } from "./RevenueTabBar";
import { PeriodSelector } from "./PeriodSelector";
import { KpiCards } from "./KpiCards";
import { RevenueStackedChart } from "./RevenueStackedChart";
import { PlatformDonutChart } from "./PlatformDonutChart";
import { TopCreatorsTable } from "./TopCreatorsTable";
import { AlertCards } from "./AlertCards";
import { ByCreatorTab } from "./ByCreatorTab";
import { ByPlatformTab } from "./ByPlatformTab";
import { ForecastTab } from "./ForecastTab";
import { ExportTab } from "./ExportTab";

const TABS = [
  { id: "overview", label: "Vue d'ensemble" },
  { id: "by_creator", label: "Par créateur" },
  { id: "by_platform", label: "Par plateforme" },
  { id: "forecast", label: "Prévisions" },
  { id: "export", label: "Export" },
];

export function RevenuePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [periodMonths, setPeriodMonths] = useState(12);
  const [alerts] = useState<FinancialAlert[]>(() =>
    buildFinancialAlerts(creators, "Juin 2026")
  );

  const aggregated = useMemo(
    () => aggregateMonthlyRevenue(creators, periodMonths),
    [periodMonths]
  );

  const previousPeriod = useMemo(
    () =>
      aggregateMonthlyRevenue(creators, periodMonths * 2).slice(
        0,
        periodMonths
      ),
    [periodMonths]
  );

  const summary = useMemo(
    () => computeRevenueSummary(aggregated, previousPeriod),
    [aggregated, previousPeriod]
  );

  const platformSummaries = useMemo(
    () => computePlatformSummaries(aggregated, creators),
    [aggregated]
  );

  const creatorRows = useMemo(() => buildCreatorRevenueRows(creators), []);

  return (
    <div className="card-accent" style={{ background: "#0A0908" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-sans mt-1" style={{ color: "#F5F0EB" }}>
            Analyse financière & prévisions
          </p>
        </div>
        <PeriodSelector value={periodMonths} onChange={setPeriodMonths} />
      </div>

      <RevenueTabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <KpiCards summary={summary} />
            <RevenueStackedChart data={aggregated} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlatformDonutChart data={platformSummaries} />
              <TopCreatorsTable rows={creatorRows} />
            </div>
            <AlertCards alerts={alerts} />
          </div>
        )}
        {activeTab === "by_creator" && <ByCreatorTab rows={creatorRows} />}
        {activeTab === "by_platform" && <ByPlatformTab summaries={platformSummaries} />}
        {activeTab === "forecast" && <ForecastTab />}
        {activeTab === "export" && <ExportTab />}
      </div>
    </div>
  );
}
