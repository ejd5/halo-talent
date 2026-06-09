"use client";

import { X } from "lucide-react";
import type { LibraryFilters, MediaType } from "@/lib/library/types";
import { PLATFORM_LABELS, MOOD_OPTIONS, ALL_PLATFORMS } from "@/lib/library/constants";

const TYPE_OPTIONS: { key: MediaType | "all"; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "image", label: "Images" },
  { key: "video", label: "Vidéos" },
  { key: "audio", label: "Audio" },
  { key: "document", label: "Documents" },
];

const MODERATION_OPTIONS = [
  { key: "all" as const, label: "Tous" },
  { key: "safe" as const, label: "✓ Safe" },
  { key: "concerns" as const, label: "⚠ Alertes" },
  { key: "unchecked" as const, label: "? Non vérifié" },
];

export function LibraryFiltersBar({
  filters,
  onChange,
  creators,
  allTags,
  onClose,
}: {
  filters: LibraryFilters;
  onChange: (f: LibraryFilters) => void;
  creators: string[];
  allTags: string[];
  onClose: () => void;
}) {
  const set = (patch: Partial<LibraryFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="border border-[var(--color-border)] p-4 space-y-4" style={{ backgroundColor: "var(--color-card)" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#FFFFFF" }}>Filtres avancés</h3>
        <button onClick={onClose} className="opacity-40 hover:opacity-100 transition-opacity">
          <X size={12} />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Type */}
        <div>
          <label className="text-[9px] uppercase tracking-wider font-medium block mb-1.5" style={{ color: "#FFFFFF60" }}>Type</label>
          <div className="flex flex-wrap gap-1">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => set({ type: opt.key })}
                className={`px-2 py-1 text-[9px] font-medium border transition-all ${
                  filters.type === opt.key
                    ? "border-[#C75B39] bg-[#C75B39]/10 text-[#C75B39]"
                    : "border-[var(--color-border)] text-[#FFFFFF80] hover:border-[#FFFFFF30]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Creator */}
        <div>
          <label className="text-[9px] uppercase tracking-wider font-medium block mb-1.5" style={{ color: "#FFFFFF60" }}>Créateur</label>
          <select
            value={filters.creator}
            onChange={(e) => set({ creator: e.target.value })}
            className="w-full p-1.5 text-[10px] border border-[var(--color-border)] bg-transparent focus:outline-none"
            style={{ color: "#FFFFFF" }}
          >
            <option value="all">Tous les créateurs</option>
            {creators.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Platform */}
        <div>
          <label className="text-[9px] uppercase tracking-wider font-medium block mb-1.5" style={{ color: "#FFFFFF60" }}>Plateforme cible</label>
          <select
            value={filters.platform}
            onChange={(e) => set({ platform: e.target.value })}
            className="w-full p-1.5 text-[10px] border border-[var(--color-border)] bg-transparent focus:outline-none"
            style={{ color: "#FFFFFF" }}
          >
            <option value="">Toutes les plateformes</option>
            {ALL_PLATFORMS.map((p) => (
              <option key={p} value={p}>{PLATFORM_LABELS[p] ?? p}</option>
            ))}
          </select>
        </div>

        {/* Mood */}
        <div>
          <label className="text-[9px] uppercase tracking-wider font-medium block mb-1.5" style={{ color: "#FFFFFF60" }}>Mood IA</label>
          <select
            value={filters.mood}
            onChange={(e) => set({ mood: e.target.value })}
            className="w-full p-1.5 text-[10px] border border-[var(--color-border)] bg-transparent focus:outline-none"
            style={{ color: "#FFFFFF" }}
          >
            <option value="">Tous les moods</option>
            {MOOD_OPTIONS.map((m) => (
              <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>
            ))}
          </select>
        </div>

        {/* Tag */}
        <div>
          <label className="text-[9px] uppercase tracking-wider font-medium block mb-1.5" style={{ color: "#FFFFFF60" }}>Tag</label>
          <select
            value={filters.tag}
            onChange={(e) => set({ tag: e.target.value })}
            className="w-full p-1.5 text-[10px] border border-[var(--color-border)] bg-transparent focus:outline-none"
            style={{ color: "#FFFFFF" }}
          >
            <option value="">Tous les tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>#{t}</option>
            ))}
          </select>
        </div>

        {/* Moderation */}
        <div>
          <label className="text-[9px] uppercase tracking-wider font-medium block mb-1.5" style={{ color: "#FFFFFF60" }}>Modération</label>
          <div className="flex flex-wrap gap-1">
            {MODERATION_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => set({ moderationStatus: opt.key })}
                className={`px-2 py-1 text-[9px] font-medium border transition-all ${
                  filters.moderationStatus === opt.key
                    ? "border-[#C75B39] bg-[#C75B39]/10 text-[#C75B39]"
                    : "border-[var(--color-border)] text-[#FFFFFF80] hover:border-[#FFFFFF30]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date range */}
        <div>
          <label className="text-[9px] uppercase tracking-wider font-medium block mb-1.5" style={{ color: "#FFFFFF60" }}>Du</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set({ dateFrom: e.target.value })}
            className="w-full p-1.5 text-[10px] border border-[var(--color-border)] bg-transparent focus:outline-none"
            style={{ color: "#FFFFFF" }}
          />
        </div>
        <div>
          <label className="text-[9px] uppercase tracking-wider font-medium block mb-1.5" style={{ color: "#FFFFFF60" }}>Au</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set({ dateTo: e.target.value })}
            className="w-full p-1.5 text-[10px] border border-[var(--color-border)] bg-transparent focus:outline-none"
            style={{ color: "#FFFFFF" }}
          />
        </div>
      </div>

      {/* Clear all */}
      <div className="flex justify-end pt-1">
        <button
          onClick={() => onChange({
            type: "all", creator: "all", tag: "", platform: "", mood: "",
            dateFrom: "", dateTo: "", moderationStatus: "all", favoritesOnly: false,
            search: "",
          })}
          className="text-[9px] uppercase tracking-wider text-[#C75B39] underline underline-offset-4 hover:opacity-70 transition-opacity"
        >
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
}
