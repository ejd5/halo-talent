"use client";

import { RadarOpportunityCard } from "./RadarOpportunityCard";
import type { RadarOpportunity, RadarKanbanStatus } from "@/lib/mock/atlas-revenue-radar";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const COLUMN_COLORS: Record<RadarKanbanStatus, string> = {
  identifie: "var(--accent)",
  prepare: "#8B5CF6",
  envoye: "#3B82F6",
  converti: "var(--success)",
};

const COLUMN_ICONS: Record<RadarKanbanStatus, string> = {
  identifie: "🔍",
  prepare: "📋",
  envoye: "📤",
  converti: "✅",
};

export function KanbanColumn({
  status,
  opportunities,
  onOpenConversation,
  onPreparePPV,
  onSchedule21h,
  onIgnore,
}: {
  status: RadarKanbanStatus;
  opportunities: RadarOpportunity[];
  onOpenConversation: (opp: RadarOpportunity) => void;
  onPreparePPV: (opp: RadarOpportunity) => void;
  onSchedule21h: (opp: RadarOpportunity) => void;
  onIgnore: (opp: RadarOpportunity) => void;
}) {
  const locale = useLocale();
  const l = norm(locale);
  const color = COLUMN_COLORS[status];
  const label = t(`revenue_radar.kanban_${status}`, l);

  return (
    <div
      className="flex flex-col rounded-lg min-w-[240px] max-w-[280px] flex-1"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-t-lg"
        style={{ borderBottom: `2px solid ${color}` }}
      >
        <span className="text-[13px]">{COLUMN_ICONS[status]}</span>
        <span className="text-[11px] font-semibold" style={{ color: "var(--text-primary)" }}>
          {label}
        </span>
        <span
          className="text-[10px] font-medium px-1.5 py-0.5 rounded ml-auto"
          style={{ backgroundColor: `${color}15`, color }}
        >
          {opportunities.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2" style={{ minHeight: 100 }}>
        {opportunities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[10px]" style={{ color: "var(--text-tertiary)" }}>
            , 
          </div>
        ) : (
          opportunities.map((opp) => (
            <RadarOpportunityCard
              key={opp.id}
              opportunity={opp}
              variant="kanban"
              onOpenConversation={() => onOpenConversation(opp)}
              onPreparePPV={() => onPreparePPV(opp)}
              onSchedule21h={() => onSchedule21h(opp)}
              onIgnore={() => onIgnore(opp)}
            />
          ))
        )}
      </div>
    </div>
  );
}
