"use client";

import type { MediaItem } from "../types";
import { MediaCard } from "./MediaCard";

export function MediaGrid({
  items,
  selectedIds,
  onSelect,
}: {
  items: MediaItem[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <div className="border border-[var(--color-border)] p-12 text-center">
        <p className="text-sm opacity-40">Aucun média trouvé</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {items.map((item) => (
        <MediaCard
          key={item.id}
          item={item}
          selected={selectedIds.has(item.id)}
          onSelect={() => onSelect(item.id)}
        />
      ))}
    </div>
  );
}
