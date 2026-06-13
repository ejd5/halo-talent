"use client";

import { ChevronLeft, ChevronRight, Filter, Lightbulb, Plus } from "lucide-react";
import type { CalendarView } from "../types";
import { calendarEvents } from "../data";

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const VIEWS: { key: CalendarView; label: string }[] = [
  { key: "month", label: "Mois" },
  { key: "week", label: "Semaine" },
  { key: "day", label: "Jour" },
  { key: "list", label: "Liste" },
];

const ALL_CREATORS = [...new Set(calendarEvents.map((e) => e.creator_name))].sort();
const ALL_PLATFORMS = [...new Set(calendarEvents.map((e) => e.platform))].sort();
const ALL_STATUSES = ["draft", "planned", "published", "failed"] as const;
const ALL_CONTENT_TYPES = ["post", "story", "reel", "video", "live"] as const;

export type CalendarFilters = {
  creator_ids: string[];
  platforms: string[];
  statuses: string[];
  content_types: string[];
};

export function CalendarToolbar({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  view,
  onViewChange,
  filters,
  onFiltersChange,
  onNewPost,
  showInsights,
  onToggleInsights,
  showFilters,
  onToggleFilters,
}: {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  view: CalendarView;
  onViewChange: (v: CalendarView) => void;
  filters: CalendarFilters;
  onFiltersChange: (f: CalendarFilters) => void;
  onNewPost: () => void;
  showInsights: boolean;
  onToggleInsights: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}) {
  const month = MONTHS_FR[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  return (
    <div className="flex flex-col gap-3">
      {/* Top row: navigation + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button onClick={onPrevMonth} className="p-1.5 hover:bg-[var(--color-card)] rounded-[0px] transition-colors">
              <ChevronLeft size={16} />
            </button>
            <h2 className="text-lg font-semibold min-w-[180px] text-center" style={{ fontFamily: "var(--font-display)" }}>
              {month} {year}
            </h2>
            <button onClick={onNextMonth} className="p-1.5 hover:bg-[var(--color-card)] rounded-[0px] transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <button
            onClick={onToday}
            className="px-3 py-1 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors rounded-[0px]"
          >
            Aujourd'hui
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex border border-[var(--color-border)] divide-x divide-[var(--color-border)]">
            {VIEWS.map((v) => (
              <button
                key={v.key}
                onClick={() => onViewChange(v.key)}
                className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  view === v.key
                    ? "bg-[var(--color-accent)] text-white"
                    : "hover:bg-[var(--color-card)]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <button
            onClick={onToggleFilters}
            className={`p-2 border transition-colors rounded-[0px] ${
              showFilters
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] hover:bg-[var(--color-card)]"
            }`}
          >
            <Filter size={14} />
          </button>

          <button
            onClick={onToggleInsights}
            className={`p-2 border transition-colors rounded-[0px] ${
              showInsights
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] hover:bg-[var(--color-card)]"
            }`}
          >
            <Lightbulb size={14} />
          </button>

          <button
            onClick={onNewPost}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity rounded-[0px]"
          >
            <Plus size={14} />
            Nouveau post
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="p-4 border border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="grid grid-cols-4 gap-6">
            {/* Creators */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-2">Créateurs</h4>
              <div className="flex flex-col gap-1 max-h-[160px] overflow-y-auto">
                {ALL_CREATORS.map((name) => (
                  <label key={name} className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={
                        filters.creator_ids.length === 0 ||
                        filters.creator_ids.includes(name)
                      }
                      onChange={() =>
                        onFiltersChange({
                          ...filters,
                          creator_ids: filters.creator_ids.includes(name)
                            ? filters.creator_ids.filter((c) => c !== name)
                            : [...filters.creator_ids, name],
                        })
                      }
                      className="accent-[var(--color-accent)]"
                    />
                    {name}
                  </label>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-2">Plateformes</h4>
              <div className="flex flex-col gap-1">
                {ALL_PLATFORMS.map((p) => (
                  <label key={p} className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={filters.platforms.length === 0 || filters.platforms.includes(p)}
                      onChange={() =>
                        onFiltersChange({
                          ...filters,
                          platforms: toggleArray(filters.platforms, p),
                        })
                      }
                      className="accent-[var(--color-accent)]"
                    />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            {/* Statuses */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-2">Statut</h4>
              <div className="flex flex-col gap-1">
                {ALL_STATUSES.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={filters.statuses.length === 0 || filters.statuses.includes(s)}
                      onChange={() =>
                        onFiltersChange({
                          ...filters,
                          statuses: toggleArray(filters.statuses, s),
                        })
                      }
                      className="accent-[var(--color-accent)]"
                    />
                    {s === "draft" ? "Brouillon" : s === "planned" ? "Planifié" : s === "published" ? "Publié" : "Échec"}
                  </label>
                ))}
              </div>
            </div>

            {/* Content types */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-2">Type</h4>
              <div className="flex flex-col gap-1">
                {ALL_CONTENT_TYPES.map((ct) => (
                  <label key={ct} className="flex items-center gap-2 text-xs cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={filters.content_types.length === 0 || filters.content_types.includes(ct)}
                      onChange={() =>
                        onFiltersChange({
                          ...filters,
                          content_types: toggleArray(filters.content_types, ct),
                        })
                      }
                      className="accent-[var(--color-accent)]"
                    />
                    {ct === "post" ? "Post" : ct === "story" ? "Story" : ct === "reel" ? "Reel" : ct === "video" ? "Vidéo" : "Live"}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {(filters.creator_ids.length > 0 || filters.platforms.length > 0 || filters.statuses.length > 0 || filters.content_types.length > 0) && (
            <button
              onClick={() =>
                onFiltersChange({
                  creator_ids: [],
                  platforms: [],
                  statuses: [],
                  content_types: [],
                })
              }
              className="mt-3 text-[11px] text-[var(--color-accent)] hover:underline"
            >
              Effacer tous les filtres
            </button>
          )}
        </div>
      )}
    </div>
  );
}
