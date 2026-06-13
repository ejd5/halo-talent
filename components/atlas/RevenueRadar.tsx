"use client";

import { useState, useMemo, useCallback } from "react";
import { RadarStatsHeader } from "./RadarStatsHeader";
import { RadarViewToggle } from "./RadarViewToggle";
import { RadarFilters, type RadarFilterState } from "./RadarFilters";
import { RadarOpportunityList } from "./RadarOpportunityList";
import { RadarKanbanBoard } from "./RadarKanbanBoard";
import { PPVOptimizerModal, type OptimizerResult } from "./PPVOptimizerModal";
import { mockRadarOpportunities, mockRadarStats, computeRadarStats } from "@/lib/mock/atlas-revenue-radar";
import type { RadarOpportunity, RadarKanbanStatus } from "@/lib/mock/atlas-revenue-radar";

export function RevenueRadar() {
  const [opportunities, setOpportunities] = useState<RadarOpportunity[]>(mockRadarOpportunities);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [filters, setFilters] = useState<RadarFilterState>({
    segment: "",
    platform: "",
    opportunityType: "",
    timing: "",
  });
  const [optimizerOpp, setOptimizerOpp] = useState<RadarOpportunity | null>(null);
  const [optimizerOpen, setOptimizerOpen] = useState(false);

  // Filtered opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      if (opp.ignored) return false;
      if (filters.segment && opp.segment !== filters.segment) return false;
      if (filters.platform && opp.platform !== filters.platform) return false;
      if (filters.opportunityType && opp.opportunityType !== filters.opportunityType) return false;
      if (filters.timing && opp.timing !== filters.timing) return false;
      return true;
    });
  }, [opportunities, filters]);

  // Kanban columns
  const kanbanColumns = useMemo(() => {
    const cols: Record<RadarKanbanStatus, RadarOpportunity[]> = {
      identifie: [],
      prepare: [],
      envoye: [],
      converti: [],
    };
    filteredOpportunities.forEach((opp) => {
      cols[opp.kanbanStatus].push(opp);
    });
    return cols;
  }, [filteredOpportunities]);

  // Stats
  const stats = useMemo(() => computeRadarStats(opportunities), [opportunities]);

  // Handlers
  const handleOpenConversation = useCallback((opp: RadarOpportunity) => {
    // Placeholder, would navigate to Chat Copilot with this fan
  }, []);

  const handlePreparePPV = useCallback((opp: RadarOpportunity) => {
    setOptimizerOpp(opp);
    setOptimizerOpen(true);
  }, []);

  const handleSchedule21h = useCallback((opp: RadarOpportunity) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opp.id ? { ...o, timing: "ce_soir" as const } : o)),
    );
  }, []);

  const handleIgnore = useCallback((opp: RadarOpportunity) => {
    setOpportunities((prev) =>
      prev.map((o) => (o.id === opp.id ? { ...o, ignored: true } : o)),
    );
  }, []);

  const handleValidateOptimizer = useCallback((_result: OptimizerResult) => {
    setOptimizerOpen(false);
    setOptimizerOpp(null);
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "var(--bg-surface)" }}>
      {/* Stats header */}
      <RadarStatsHeader stats={stats} />

      {/* Controls row */}
      <div className="flex items-center justify-between px-4 py-1">
        <RadarFilters filters={filters} onFiltersChange={setFilters} />
        <RadarViewToggle view={view} onViewChange={setView} />
      </div>

      {/* Content area */}
      {view === "list" ? (
        <RadarOpportunityList
          opportunities={filteredOpportunities}
          onOpenConversation={handleOpenConversation}
          onPreparePPV={handlePreparePPV}
          onSchedule21h={handleSchedule21h}
          onIgnore={handleIgnore}
        />
      ) : (
        <RadarKanbanBoard
          columns={kanbanColumns}
          onOpenConversation={handleOpenConversation}
          onPreparePPV={handlePreparePPV}
          onSchedule21h={handleSchedule21h}
          onIgnore={handleIgnore}
        />
      )}

      {/* PPV Optimizer Modal */}
      <PPVOptimizerModal
        open={optimizerOpen}
        opportunity={optimizerOpp}
        onClose={() => {
          setOptimizerOpen(false);
          setOptimizerOpp(null);
        }}
        onValidate={handleValidateOptimizer}
      />
    </div>
  );
}
