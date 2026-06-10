"use client";

import { KanbanColumn } from "./KanbanColumn";
import type { RadarOpportunity, RadarKanbanStatus } from "@/lib/mock/atlas-revenue-radar";

export function RadarKanbanBoard({
  columns,
  onOpenConversation,
  onPreparePPV,
  onSchedule21h,
  onIgnore,
}: {
  columns: Record<RadarKanbanStatus, RadarOpportunity[]>;
  onOpenConversation: (opp: RadarOpportunity) => void;
  onPreparePPV: (opp: RadarOpportunity) => void;
  onSchedule21h: (opp: RadarOpportunity) => void;
  onIgnore: (opp: RadarOpportunity) => void;
}) {
  const statuses: RadarKanbanStatus[] = ["identifie", "prepare", "envoye", "converti"];

  return (
    <div className="flex-1 overflow-x-auto custom-scrollbar px-4 py-2">
      <div className="flex gap-3 min-w-[960px] h-full">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            opportunities={columns[status]}
            onOpenConversation={onOpenConversation}
            onPreparePPV={onPreparePPV}
            onSchedule21h={onSchedule21h}
            onIgnore={onIgnore}
          />
        ))}
      </div>
    </div>
  );
}
