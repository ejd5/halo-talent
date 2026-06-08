"use client";

import { useState, useMemo } from "react";
import { Upload } from "lucide-react";
import { mediaItems as allMedia } from "../data";
import type { MediaItem, MediaType } from "../types";
import { MediaGrid } from "./MediaGrid";
import { LibraryFilters, type LibraryFiltersState } from "./LibraryFilters";
import { MediaUploadModal } from "./MediaUploadModal";

export function LibraryPage() {
  const [items, setItems] = useState(allMedia);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState<LibraryFiltersState>({
    search: "",
    type: "all",
    creator: "",
    tag: "",
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.type !== "all" && item.type !== filters.type) return false;
      if (filters.creator && item.creator_name !== filters.creator) return false;
      if (filters.tag && !item.tags.includes(filters.tag)) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.creator_name.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [items, filters]);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUpload = (data: {
    title: string;
    type: MediaType;
    creator_name: string;
    tags: string[];
  }) => {
    const newItem: MediaItem = {
      id: `med-${Date.now()}`,
      title: data.title,
      url: "/mock/upload-placeholder.jpg",
      type: data.type,
      creator_id: "unknown",
      creator_name: data.creator_name,
      tags: data.tags,
      created_at: new Date().toISOString(),
      file_size: 0,
      width: null,
      height: null,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            Bibliothèque média
          </h1>
          <p className="text-xs opacity-40 mt-0.5">
            {filteredItems.length} média{filteredItems.length > 1 ? "s" : ""}
            {selectedIds.size > 0 && ` · ${selectedIds.size} sélectionné${selectedIds.size > 1 ? "s" : ""}`}
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity rounded-[0px]"
        >
          <Upload size={14} />
          Importer
        </button>
      </div>

      {/* Filters */}
      <LibraryFilters filters={filters} onChange={setFilters} />

      {/* Grid */}
      <MediaGrid
        items={filteredItems}
        selectedIds={selectedIds}
        onSelect={handleSelect}
      />

      {/* Upload modal */}
      {showUpload && (
        <MediaUploadModal
          onClose={() => setShowUpload(false)}
          onUploaded={handleUpload}
        />
      )}
    </div>
  );
}
