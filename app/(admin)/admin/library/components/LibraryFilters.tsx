"use client";

import { Search, X } from "lucide-react";
import { mediaItems } from "../data";
import type { MediaType } from "../types";

const ALL_TYPES: { key: MediaType | "all"; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "image", label: "Images" },
  { key: "video", label: "Vidéos" },
  { key: "document", label: "Documents" },
];

const ALL_CREATORS = [...new Set(mediaItems.map((m) => m.creator_name))].sort();
const ALL_TAGS = [...new Set(mediaItems.flatMap((m) => m.tags))].sort();

export type LibraryFiltersState = {
  search: string;
  type: MediaType | "all";
  creator: string;
  tag: string;
};

export function LibraryFilters({
  filters,
  onChange,
}: {
  filters: LibraryFiltersState;
  onChange: (f: LibraryFiltersState) => void;
}) {
  const hasFilters =
    filters.search || filters.type !== "all" || filters.creator || filters.tag;

  return (
    <div className="flex flex-col gap-3">
      {/* Search + type pills */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40"
          />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Rechercher un média..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none focus:border-[var(--color-accent)]"
          />
        </div>

        {/* Type pills */}
        <div className="flex border border-[var(--color-border)] divide-x divide-[var(--color-border)]">
          {ALL_TYPES.map((t) => (
            <button
              key={t.key}
              onClick={() => onChange({ ...filters, type: t.key })}
              className={`px-3 py-1.5 text-[11px] font-medium transition-colors ${
                filters.type === t.key
                  ? "bg-[var(--color-accent)] text-white"
                  : "hover:bg-[var(--color-card)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary filters */}
      <div className="flex items-center gap-2">
        {/* Creator filter */}
        <select
          value={filters.creator}
          onChange={(e) => onChange({ ...filters, creator: e.target.value })}
          className="px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none"
        >
          <option value="">Tous les créateurs</option>
          {ALL_CREATORS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Tag filter */}
        <select
          value={filters.tag}
          onChange={(e) => onChange({ ...filters, tag: e.target.value })}
          className="px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none"
        >
          <option value="">Tous les tags</option>
          {ALL_TAGS.map((t) => (
            <option key={t} value={t}>#{t}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() =>
              onChange({
                search: "",
                type: "all",
                creator: "",
                tag: "",
              })
            }
            className="flex items-center gap-1 text-[11px] text-[var(--color-accent)] hover:underline ml-2"
          >
            <X size={12} />
            Effacer
          </button>
        )}
      </div>
    </div>
  );
}
