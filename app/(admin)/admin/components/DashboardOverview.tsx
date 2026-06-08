"use client";

import { useMemo } from "react";
import { KpiGrid } from "./KpiGrid";
import { RevenueChart } from "./RevenueChart";
import { ActivityFeed } from "./ActivityFeed";
import { InsightsWidget } from "./InsightsWidget";

type Props = {
  userName?: string;
};

export function DashboardOverview({ userName }: Props) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bonjour";
    if (hour < 18) return "Bon après-midi";
    return "Bonsoir";
  }, []);

  const dateStr = useMemo(() => {
    return new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div className="max-w-[1400px]">
      {/* Greeting */}
      <div className="mb-8">
        <h1
          className="font-display text-[32px] md:text-[36px] font-bold leading-tight"
          style={{ color: "#F5F0EB" }}
        >
          {greeting}. Voici votre maison en ce{" "}
          <span style={{ color: "#C75B39" }}>{dateStr}</span>.
        </h1>
      </div>

      {/* KPI Grid */}
      <div className="mb-8">
        <KpiGrid />
      </div>

      {/* Chart + Activity */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 min-w-0">
          <RevenueChart />
        </div>
        <div className="w-full lg:w-[340px] shrink-0">
          <ActivityFeed />
        </div>
      </div>

      {/* 2x2 Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InsightsWidget title="Top 5 créateurs ce mois" type="top-creators" />
        <InsightsWidget title="Créateurs à surveiller" type="at-risk" />
        <InsightsWidget title="Échéances proches" type="deadlines" />
        <InsightsWidget title="Suggestions de l'IA" type="ai-suggestions" />
      </div>
    </div>
  );
}
