"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Upload, Search, X, SlidersHorizontal, Heart, Grid3X3, LayoutList, Clock, Sparkles, Download } from "lucide-react";
import { mediaItems as allMedia } from "@/lib/library/mock";
import { DEFAULT_FILTERS } from "@/lib/library/types";
import type { LibraryFilters, MediaItem, MediaType } from "@/lib/library/types";
import { MEDIA_TYPE_LABELS, PLATFORM_COLORS, PLATFORM_LABELS, MOOD_OPTIONS } from "@/lib/library/constants";
import { cn } from "@/lib/utils";
import { LibraryFiltersBar } from "./components/LibraryFilters";
import { UploadModal } from "./components/UploadModal";
import { MediaPreview } from "./components/MediaPreview";

const CREATORS = [...new Set(allMedia.map((m) => m.creator_name))].sort();
const ALL_TAGS = [...new Set(allMedia.flatMap((m) => [...m.tags, ...m.ai_tags]))].sort();

export default function LibraryPage() {
  const [items, setItems] = useState<MediaItem[]>(allMedia);
  const [filters, setFilters] = useState<LibraryFilters>({ ...DEFAULT_FILTERS, creator: "all" });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.type !== "all" && item.type !== filters.type) return false;
      if (filters.creator !== "all" && item.creator_name !== filters.creator) return false;
      if (filters.favoritesOnly && !item.is_favorite) return false;
      if (filters.moderationStatus !== "all") {
        if (filters.moderationStatus === "safe" && !item.moderation_safe) return false;
        if (filters.moderationStatus === "concerns" && item.moderation_safe) return false;
        if (filters.moderationStatus === "unchecked" && item.moderation_checked) return false;
      }
      if (filters.platform && !item.ai_suitable_platforms.includes(filters.platform) && !item.used_on_platforms.includes(filters.platform)) return false;
      if (filters.mood && item.ai_mood !== filters.mood) return false;
      if (filters.tag && !item.tags.includes(filters.tag) && !item.ai_tags.includes(filters.tag)) return false;
      if (filters.dateFrom && new Date(item.created_at) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(item.created_at) > new Date(filters.dateTo)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.tags.some((t) => t.includes(q)) ||
          item.ai_tags.some((t) => t.includes(q)) ||
          (item.ai_description ?? "").toLowerCase().includes(q) ||
          item.creator_name.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, filters]);

  const handleUploadComplete = useCallback((newItems: MediaItem[]) => {
    setItems((prev) => [...newItems, ...prev]);
    setShowUpload(false);
  }, []);

  const handleToggleFavorite = (id: string) => {
    setItems((prev) => prev.map((item) =>
      item.id === id ? { ...item, is_favorite: !item.is_favorite } : item
    ));
    if (previewItem?.id === id) {
      setPreviewItem((prev) => prev ? { ...prev, is_favorite: !prev.is_favorite } : null);
    }
  };

  const handleAnalyzeAll = async () => {
    setIsAnalyzing(true);
    const unanalyzed = items.filter((i) => !i.ai_analyzed);
    for (const item of unanalyzed) {
      try {
        const res = await fetch("/api/library/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mediaId: item.id, mediaUrl: item.url }),
        });
        if (res.ok) {
          const analysis = await res.json();
          setItems((prev) => prev.map((i) =>
            i.id === item.id ? {
              ...i,
              ai_description: analysis.description,
              ai_tags: analysis.tags,
              ai_colors: analysis.dominant_colors,
              ai_mood: analysis.mood,
              ai_suitable_platforms: analysis.suitable_for,
              moderation_safe: analysis.moderation_check.safe,
              moderation_concerns: analysis.moderation_check.concerns,
              moderation_checked: true,
              ai_analyzed: true,
              ai_analysis_date: new Date().toISOString(),
            } : i
          ));
        }
      } catch {}
    }
    setIsAnalyzing(false);
  };

  const countByType = useMemo(() => {
    const counts: Record<string, number> = { all: items.length };
    for (const t of ["image", "video", "audio", "document"] as MediaType[]) {
      counts[t] = items.filter((i) => i.type === t).length;
    }
    counts["favorites"] = items.filter((i) => i.is_favorite).length;
    return counts;
  }, [items]);

  const hasActiveFilters = filters.search || filters.type !== "all" || filters.creator !== "all" ||
    filters.tag || filters.platform || filters.mood || filters.moderationStatus !== "all" ||
    filters.favoritesOnly || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Bibliothèque média
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            {filteredItems.length} média{filteredItems.length !== 1 ? "s" : ""}
            {hasActiveFilters && ` (filtré${filteredItems.length !== 1 ? "s" : ""})`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* AI Analyze button */}
          {items.some((i) => !i.ai_analyzed) && (
            <button
              onClick={handleAnalyzeAll}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium border border-[#10B981]/30 text-[var(--success)] hover:bg-[var(--success)]/10 transition-all disabled:opacity-40"
            >
              <Sparkles size={11} />
              {isAnalyzing ? "Analyse..." : "Analyser avec IA"}
            </button>
          )}
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
          >
            <Upload size={11} /> Upload
          </button>
        </div>
      </div>

      {/* Category quick filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: "all", label: "Tous", count: countByType.all },
          { key: "image" as MediaType, label: "Images", count: countByType.image },
          { key: "video" as MediaType, label: "Vidéos", count: countByType.video },
          { key: "audio" as MediaType, label: "Audio", count: countByType.audio },
          { key: "document" as MediaType, label: "Documents", count: countByType.document },
          { key: "favorites", label: "Favoris ♡", count: countByType.favorites },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilters((f) => ({ ...f, type: cat.key === "favorites" ? f.type : (cat.key as MediaType | "all"), favoritesOnly: cat.key === "favorites" }))}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium border transition-all whitespace-nowrap",
              (cat.key === "favorites" ? filters.favoritesOnly : filters.type === cat.key)
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-[var(--color-border)] text-[#FFFFFF80] hover:border-[#FFFFFF30]"
            )}
          >
            {cat.label}
            <span className="text-[8px] opacity-60">({cat.count})</span>
          </button>
        ))}
      </div>

      {/* Search + view toggles */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255, 255, 255, 0.19)" }} />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Rechercher par titre, tags, description IA..."
            className="w-full bg-transparent border border-[var(--color-border)] py-2 pl-9 pr-3 text-sm placeholder:opacity-30 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            style={{ color: "var(--text-primary)" }}
          />
          {filters.search && (
            <button onClick={() => setFilters((f) => ({ ...f, search: "" }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100">
              <X size={12} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 text-[10px] uppercase tracking-wider font-medium border transition-all",
            showFilters ? "border-[var(--accent)] bg-[var(--accent)]/10" : "border-[var(--color-border)] hover:border-[#FFFFFF30]"
          )}
          style={{ color: "var(--text-primary)" }}
        >
          <SlidersHorizontal size={11} />
          Filtres
        </button>
        <div className="flex border border-[var(--color-border)]">
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-2 transition-all", viewMode === "grid" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[#FFFFFF60] hover:text-[var(--text-primary)]")}
          ><Grid3X3 size={13} /></button>
          <button
            onClick={() => setViewMode("list")}
            className={cn("p-2 transition-all", viewMode === "list" ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-[#FFFFFF60] hover:text-[var(--text-primary)]")}
          ><LayoutList size={13} /></button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <LibraryFiltersBar
          filters={filters}
          onChange={setFilters}
          creators={CREATORS}
          allTags={ALL_TAGS}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Content */}
      {filteredItems.length === 0 ? (
        <div className="border border-[var(--color-border)] p-16 flex flex-col items-center justify-center text-center" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="text-3xl mb-3 opacity-30">📁</div>
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Aucun média trouvé</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
            {hasActiveFilters ? "Essaie de modifier tes filtres" : "Upload ton premier média avec le bouton +"}
          </p>
          {hasActiveFilters && (
            <button onClick={() => setFilters({ ...DEFAULT_FILTERS, creator: "all" })}
              className="mt-3 text-[10px] uppercase tracking-wider text-[var(--accent)] underline underline-offset-4">
              Effacer les filtres
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <MasonryGrid items={filteredItems} onSelect={setPreviewItem} onToggleFavorite={handleToggleFavorite} />
      ) : (
        <ListView items={filteredItems} onSelect={setPreviewItem} onToggleFavorite={handleToggleFavorite} />
      )}

      {/* Upload modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onComplete={handleUploadComplete}
        />
      )}

      {/* Preview */}
      {previewItem && (
        <MediaPreview
          item={previewItem}
          onClose={() => setPreviewItem(null)}
          onToggleFavorite={() => handleToggleFavorite(previewItem.id)}
          onDelete={(id) => {
            setItems((prev) => prev.filter((i) => i.id !== id));
            setPreviewItem(null);
          }}
        />
      )}
    </div>
  );
}

// ─── Masonry Grid ────────────────────────────────────

function MasonryGrid({ items, onSelect, onToggleFavorite }: {
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
  onToggleFavorite: (id: string) => void;
}) {
  // Distribute items into columns for masonry effect
  const cols = 4;
  const columns: MediaItem[][] = Array.from({ length: cols }, () => []);
  items.forEach((item, i) => {
    columns[i % cols].push(item);
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <MediaCardList items={items} onSelect={onSelect} onToggleFavorite={onToggleFavorite} />
    </div>
  );
}

function MediaCardList({ items, onSelect, onToggleFavorite }: {
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
  onToggleFavorite: (id: string) => void;
}) {
  return items.map((item) => (
    <MediaCard key={item.id} item={item} onSelect={() => onSelect(item)} onToggleFavorite={() => onToggleFavorite(item.id)} />
  ));
}

// ─── Media Card ──────────────────────────────────────

function MediaCard({ item, onSelect, onToggleFavorite }: {
  item: MediaItem;
  onSelect: () => void;
  onToggleFavorite: () => void;
}) {
  const formatSize = (bytes: number) => {
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  const isWide = item.width && item.height && item.width / item.height > 1.3;
  const isTall = item.width && item.height && item.height / item.width > 1.3;

  return (
    <div
      className={cn(
        "group relative border border-[var(--color-border)] cursor-pointer transition-all overflow-hidden",
        "hover:border-[var(--color-accent)] hover:shadow-lg hover:shadow-[var(--color-accent)]/5",
        isWide ? "row-span-1" : undefined,
        isTall ? "row-span-2" : undefined,
      )}
      style={{ backgroundColor: "var(--color-card)" }}
      onClick={onSelect}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          "relative overflow-hidden",
          item.type === "image" ? "aspect-[4/3]" : "aspect-[4/3]"
        )}
        style={{ backgroundColor: "var(--color-base)" }}
      >
        {item.type === "image" ? (
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${item.url})` }}
          />
        ) : item.type === "video" ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-40">
            <div className="flex items-center justify-center w-10 h-10 border-2 border-[var(--color-border)]">
              <span className="text-lg">▶</span>
            </div>
            {item.duration && (
              <span className="text-[9px] font-mono">{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, "0")}</span>
            )}
          </div>
        ) : item.type === "audio" ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-40">
            <span className="text-2xl">🎵</span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 opacity-40">
            <span className="text-2xl">📄</span>
          </div>
        )}

        {/* Type badge */}
        <span className="absolute top-2 left-2 text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 border border-[var(--color-border)]"
          style={{ backgroundColor: "var(--color-base)" }}>
          {item.type === "image" ? "IMG" : item.type === "video" ? "VID" : item.type === "audio" ? "AUD" : "DOC"}
        </span>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={cn(
            "absolute top-2 right-2 p-1.5 transition-all opacity-0 group-hover:opacity-100",
            item.is_favorite && "opacity-100"
          )}
          style={{ backgroundColor: "var(--color-base)" }}
        >
          <Heart size={10} className={item.is_favorite ? "fill-[var(--danger)] text-[var(--danger)]" : ""} />
        </button>

        {/* Moderation warning */}
        {!item.moderation_safe && item.moderation_checked && (
          <div className="absolute bottom-0 left-0 right-0 px-1.5 py-0.5 text-[7px] font-medium text-[var(--danger)] bg-[var(--danger)]/20">
            ⚠ Attention
          </div>
        )}

        {/* AI analyzed indicator */}
        {item.ai_analyzed && (
          <div className="absolute top-2 left-8 text-[7px] px-1 py-0.5 text-[var(--success)] bg-[var(--success)]/15 border border-[#10B981]/30"
            style={{ display: item.ai_analyzed ? "block" : "none" }}>
            AI
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1">
        <p className="text-[11px] font-medium leading-tight truncate" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[9px]" style={{ color: "rgba(255, 255, 255, 0.375)" }}>{item.creator_name}</span>
          <span className="text-[8px]" style={{ color: "rgba(255, 255, 255, 0.25)" }}>{formatSize(item.file_size)}</span>
        </div>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-0.5 pt-0.5">
            {(item.tags.length > 0 ? item.tags : item.ai_tags).slice(0, 2).map((t) => (
              <span key={t} className="text-[7px] px-1 py-[1px] border border-[var(--color-border)]" style={{ color: "rgba(255, 255, 255, 0.31)" }}>
                {t}
              </span>
            ))}
            {(item.tags.length > 2 || item.ai_tags.length > 2) && (
              <span className="text-[7px]" style={{ color: "rgba(255, 255, 255, 0.19)" }}>+{Math.max(item.tags.length, item.ai_tags.length) - 2}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── List View ────────────────────────────────────────

function ListView({ items, onSelect, onToggleFavorite }: {
  items: MediaItem[];
  onSelect: (item: MediaItem) => void;
  onToggleFavorite: (id: string) => void;
}) {
  return (
    <>
      {/* Desktop/Tablet: grid table, hidden on mobile */}
      <div className="hidden sm:block overflow-x-auto">
        <div className="border border-[var(--color-border)] overflow-hidden" style={{ backgroundColor: "var(--color-card)" }}>
          {/* Header row */}
          <div className="grid grid-cols-[40px_1fr_100px_100px_80px_80px_40px] gap-2 px-3 py-2 text-[9px] uppercase tracking-wider font-medium border-b border-[var(--color-border)]" style={{ color: "var(--text-tertiary)" }}>
            <div></div>
            <div>Nom</div>
            <div>Type</div>
            <div>Taille</div>
            <div>Mood IA</div>
            <div>Date</div>
            <div></div>
          </div>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className="grid grid-cols-[40px_1fr_100px_100px_80px_80px_40px] gap-2 px-3 py-2 items-center text-xs border-b border-[var(--color-border)] last:border-0 cursor-pointer hover:bg-[var(--color-base)] transition-colors"
            >
              {/* Thumb */}
              <div className="w-8 h-8 border border-[var(--color-border)] overflow-hidden" style={{ backgroundColor: "var(--color-base)" }}>
                {item.type === "image" ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.url})` }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                    {item.type === "video" ? "▶" : item.type === "audio" ? "♪" : "📄"}
                  </div>
                )}
              </div>
              {/* Name */}
              <div className="truncate" style={{ color: "var(--text-primary)" }}>
                {item.title}
                {!item.moderation_safe && item.moderation_checked && (
                  <span className="ml-1.5 text-[var(--danger)]">⚠</span>
                )}
              </div>
              {/* Type */}
              <div style={{ color: "var(--text-secondary)" }}>{MEDIA_TYPE_LABELS[item.type]}</div>
              {/* Size */}
              <div style={{ color: "var(--text-tertiary)" }} className="text-[10px]">
                {item.file_size >= 1_000_000 ? `${(item.file_size / 1_000_000).toFixed(1)} MB` : `${(item.file_size / 1_000).toFixed(0)} KB`}
              </div>
              {/* Mood */}
              <div style={{ color: "var(--text-tertiary)" }} className="text-[10px]">
                {item.ai_mood ?? ", "}
              </div>
              {/* Date */}
              <div style={{ color: "var(--text-tertiary)" }} className="text-[10px]">
                {new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </div>
              {/* Favorite */}
              <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }} className="min-touch">
                <Heart size={10} className={item.is_favorite ? "fill-[var(--danger)] text-[var(--danger)]" : ""} style={{ color: "var(--text-tertiary)" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stacked cards */}
      <div className="block sm:hidden space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            className="p-4 rounded-xl cursor-pointer transition-colors"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 shrink-0 border border-[var(--color-border)] overflow-hidden" style={{ backgroundColor: "var(--color-base)" }}>
                {item.type === "image" ? (
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${item.url})` }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "var(--text-tertiary)" }}>
                    {item.type === "video" ? "▶" : item.type === "audio" ? "♪" : "📄"}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </p>
                  {!item.moderation_safe && item.moderation_checked && (
                    <span className="text-[var(--danger)] shrink-0">⚠</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  <span>{MEDIA_TYPE_LABELS[item.type]}</span>
                  <span>
                    {item.file_size >= 1_000_000 ? `${(item.file_size / 1_000_000).toFixed(1)} MB` : `${(item.file_size / 1_000).toFixed(0)} KB`}
                  </span>
                  {item.ai_mood && <span>{item.ai_mood}</span>}
                  <span>{new Date(item.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                </div>
              </div>
              <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }} className="min-touch shrink-0">
                <Heart size={14} className={item.is_favorite ? "fill-[var(--danger)] text-[var(--danger)]" : ""} style={{ color: "var(--text-tertiary)" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
