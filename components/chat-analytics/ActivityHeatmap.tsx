"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { ActivityCell } from "@/lib/mock/chat-analytics";

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => `${i}h`);

function getIntensityColor(count: number, max: number): string {
  if (count === 0) return "var(--bg-surface)";
  const ratio = count / max;
  if (ratio < 0.2) return "rgba(199, 91, 57, 0.12)";
  if (ratio < 0.4) return "rgba(199, 91, 57, 0.25)";
  if (ratio < 0.6) return "rgba(199, 91, 57, 0.40)";
  if (ratio < 0.8) return "rgba(199, 91, 57, 0.60)";
  return "rgba(199, 91, 57, 0.80)";
}

export function ActivityHeatmap({ data, onCellClick }: {
  data: ActivityCell[];
  onCellClick?: (day: number, hour: number) => void;
}) {
  const [viewMode, setViewMode] = useState<"messages" | "revenue">("messages");
  const maxCount = Math.max(...data.map((c) => (viewMode === "messages" ? c.count : c.revenue)), 1);
  const [tooltip, setTooltip] = useState<{ day: number; hour: number; count: number; revenue: number; x: number; y: number } | null>(null);

  // Group cells by day
  const grid: ActivityCell[][] = DAY_LABELS.map((_, dayIdx) =>
    data.filter((c) => c.day === dayIdx),
  );

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} style={{ color: "var(--text-secondary)" }} />
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Heatmap d'activité
            </h3>
            <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Messages envoyés par créneau horaire (7 derniers jours)
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setViewMode("messages")}
            className="px-2 py-1 text-[9px] font-medium rounded transition-colors"
            style={{
              backgroundColor: viewMode === "messages" ? "var(--accent-soft)" : "transparent",
              color: viewMode === "messages" ? "var(--accent)" : "var(--text-tertiary)",
              border: "1px solid",
              borderColor: viewMode === "messages" ? "var(--accent-border)" : "var(--border-default)",
            }}
          >
            Messages
          </button>
          <button
            onClick={() => setViewMode("revenue")}
            className="px-2 py-1 text-[9px] font-medium rounded transition-colors"
            style={{
              backgroundColor: viewMode === "revenue" ? "var(--accent-soft)" : "transparent",
              color: viewMode === "revenue" ? "var(--accent)" : "var(--text-tertiary)",
              border: "1px solid",
              borderColor: viewMode === "revenue" ? "var(--accent-border)" : "var(--border-default)",
            }}
          >
            Revenus
          </button>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="relative">
        {/* Column headers (hours) */}
        <div className="flex ml-8 mb-1">
          {HOUR_LABELS.filter((_, i) => i % 3 === 0).map((label) => (
            <div
              key={label}
              className="text-[7px] font-medium text-center"
              style={{ color: "var(--text-tertiary)", width: `${100 / 24 * 3}%` }}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="flex gap-0">
          {/* Day labels column */}
          <div className="flex flex-col gap-[2px] mr-1.5">
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-[8px] font-medium text-right leading-none flex items-center justify-end"
                style={{ color: "var(--text-tertiary)", height: 18 }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1">
            {grid.map((row, dayIdx) => (
              <div key={dayIdx} className="flex gap-[2px] mb-[2px]">
                {row.map((cell) => {
                  const value = viewMode === "messages" ? cell.count : cell.revenue;
                  return (
                    <button
                      key={cell.hour}
                      onClick={() => onCellClick?.(cell.day, cell.hour)}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          day: cell.day,
                          hour: cell.hour,
                          count: cell.count,
                          revenue: cell.revenue,
                          x: rect.left + rect.width / 2,
                          y: rect.top - 4,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                      className="flex-1 rounded-sm transition-opacity hover:opacity-80"
                      style={{
                        height: 18,
                        backgroundColor: getIntensityColor(value, maxCount),
                        minWidth: 0,
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-50 pointer-events-none px-2 py-1 text-[9px] rounded shadow-lg"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              color: "var(--text-primary)",
              left: "50%",
              top: -30,
              transform: "translateX(-50%)",
              whiteSpace: "nowrap",
            }}
          >
            {DAY_LABELS[tooltip.day]} {tooltip.hour}h, {tooltip.count} messages · {tooltip.revenue} €
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-[8px]" style={{ color: "var(--text-tertiary)" }}>Faible</span>
        {[0.12, 0.25, 0.40, 0.60, 0.80].map((opacity) => (
          <span
            key={opacity}
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: `rgba(199, 91, 57, ${opacity})` }}
          />
        ))}
        <span className="text-[8px]" style={{ color: "var(--text-tertiary)" }}>Élevé</span>
      </div>
    </div>
  );
}
