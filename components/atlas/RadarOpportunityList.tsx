"use client";

import { EmptyState } from "@/components/ui/EmptyState";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { RadarOpportunityCard } from "./RadarOpportunityCard";
import type { RadarOpportunity } from "@/lib/mock/atlas-revenue-radar";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function RadarOpportunityList({
  opportunities,
  onOpenConversation,
  onPreparePPV,
  onSchedule21h,
  onIgnore,
}: {
  opportunities: RadarOpportunity[];
  onOpenConversation: (opp: RadarOpportunity) => void;
  onPreparePPV: (opp: RadarOpportunity) => void;
  onSchedule21h: (opp: RadarOpportunity) => void;
  onIgnore: (opp: RadarOpportunity) => void;
}) {
  const locale = useLocale();
  const l = norm(locale);

  if (opportunities.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <EmptyState
          variant="default"
          title={t("revenue_radar.empty_title", l)}
          description={t("revenue_radar.empty_desc", l)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2 space-y-2">
      {opportunities.map((opp) => (
        <RadarOpportunityCard
          key={opp.id}
          opportunity={opp}
          variant="list"
          onOpenConversation={() => onOpenConversation(opp)}
          onPreparePPV={() => onPreparePPV(opp)}
          onSchedule21h={() => onSchedule21h(opp)}
          onIgnore={() => onIgnore(opp)}
        />
      ))}
    </div>
  );
}
