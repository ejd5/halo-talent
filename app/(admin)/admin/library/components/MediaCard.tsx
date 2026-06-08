"use client";

import { FileText, Play, Image as ImageIcon } from "lucide-react";
import type { MediaItem } from "../types";

const TYPE_ICONS = {
  image: ImageIcon,
  video: Play,
  document: FileText,
};

export function MediaCard({
  item,
  selected,
  onSelect,
}: {
  item: MediaItem;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const Icon = TYPE_ICONS[item.type];

  const formatSize = (bytes: number) => {
    if (bytes >= 1_000_000) return `${(bytes / 1_000_000).toFixed(1)} MB`;
    if (bytes >= 1_000) return `${(bytes / 1_000).toFixed(0)} KB`;
    return `${bytes} B`;
  };

  return (
    <button
      onClick={onSelect}
      className={`group relative border text-left w-full cursor-pointer transition-all ${
        selected
          ? "border-[var(--color-accent)]"
          : "border-[var(--color-border)] hover:border-[var(--color-accent)]"
      }`}
    >
      {/* Thumbnail */}
      <div
        className="aspect-[4/3] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        {item.type === "image" ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${item.url})` }}
          />
        ) : (
          <div className="flex flex-col items-center gap-1 opacity-40">
            <Icon size={24} />
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {item.type === "video" ? "Vidéo" : "Document"}
            </span>
          </div>
        )}

        {/* Type badge */}
        <span
          className="absolute top-2 left-2 text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5"
          style={{ backgroundColor: "var(--color-base)" }}
        >
          {item.type === "image" ? "IMG" : item.type === "video" ? "VID" : "PDF"}
        </span>

        {/* Selection indicator */}
        {selected && (
          <span className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center bg-[var(--color-accent)] text-white text-[10px] font-bold">
            ✓
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 space-y-1">
        <p className="text-xs font-medium leading-tight truncate text-[var(--color-text-primary)]">
          {item.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] opacity-40">{item.creator_name}</span>
          <span className="text-[9px] opacity-30">{formatSize(item.file_size)}</span>
        </div>
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {item.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="text-[8px] px-1 py-[1px] border border-[var(--color-border)] opacity-50"
              >
                {t}
              </span>
            ))}
            {item.tags.length > 2 && (
              <span className="text-[8px] opacity-30">+{item.tags.length - 2}</span>
            )}
          </div>
        )}
      </div>
    </button>
  );
}
