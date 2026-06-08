"use client";

import { useState } from "react";
import { GripVertical, Eye, EyeOff, ChevronUp, ChevronDown } from "lucide-react";
import { rosterItems as initialItems } from "../../data";
import type { RosterItem } from "../../types";

export function RosterPage() {
  const [items, setItems] = useState(initialItems);

  const toggleVisible = (creatorId: string) => {
    setItems((prev) => prev.map((i) => i.creator_id === creatorId ? { ...i, visible: !i.visible } : i));
  };

  const moveItem = (creatorId: string, dir: "up" | "down") => {
    const idx = items.findIndex((i) => i.creator_id === creatorId);
    if (dir === "up" && idx === 0) return;
    if (dir === "down" && idx === items.length - 1) return;
    const next = [...items];
    const swap = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setItems(next.map((i, o) => ({ ...i, order: o })));
  };

  const updateItem = (creatorId: string, partial: Partial<RosterItem>) => {
    setItems((prev) => prev.map((i) => i.creator_id === creatorId ? { ...i, ...partial } : i));
  };

  const visibleCount = items.filter((i) => i.visible).length;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Talents</h1>
        <p className="text-xs opacity-40 mt-0.5">
          {items.length} talents · {visibleCount} affiché{visibleCount > 1 ? "s" : ""} publiquement
        </p>
      </div>

      <div className="border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
        {items.map((item, i) => (
          <div key={item.creator_id} className="px-4 py-3 hover:bg-[var(--color-card)] transition-colors">
            <div className="flex items-center gap-3">
              <GripVertical size={16} className="opacity-20 cursor-grab shrink-0" />

              {/* Avatar placeholder */}
              <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
                {item.creator_name.split(" ").map((n) => n[0]).join("")}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{item.creator_name}</div>
                <div className="text-[10px] opacity-40 truncate">
                  Ordre : #{item.order + 1} · Liens publics : {item.public_links.length}
                </div>
              </div>

              {/* Image URL */}
              <input
                type="text"
                value={item.image_url ?? ""}
                onChange={(e) => updateItem(item.creator_id, { image_url: e.target.value || null })}
                placeholder="URL image publique"
                className="w-40 px-2 py-1 text-[10px] border border-[var(--color-border)] bg-transparent rounded-[0px] hidden md:block"
              />

              {/* Move buttons */}
              <div className="flex items-center gap-0.5">
                <button onClick={() => moveItem(item.creator_id, "up")} disabled={i === 0} className="p-0.5 hover:opacity-60 disabled:opacity-10">
                  <ChevronUp size={14} />
                </button>
                <button onClick={() => moveItem(item.creator_id, "down")} disabled={i === items.length - 1} className="p-0.5 hover:opacity-60 disabled:opacity-10">
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Visibility toggle */}
              <button
                onClick={() => toggleVisible(item.creator_id)}
                className={`p-2 border transition-colors rounded-[0px] ${item.visible ? "border-[var(--color-accent)] text-[var(--color-accent)]" : "border-[var(--color-border)] opacity-40"}`}
                title={item.visible ? "Masquer" : "Afficher"}
              >
                {item.visible ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
            </div>

            {/* Bio fields */}
            {item.visible && (
              <div className="ml-[52px] mt-2 grid grid-cols-3 gap-2">
                {(["fr", "en", "es"] as const).map((lang) => (
                  <input
                    key={lang}
                    type="text"
                    value={item[`bio_${lang}` as keyof RosterItem] as string}
                    onChange={(e) => updateItem(item.creator_id, { [`bio_${lang}`]: e.target.value } as Partial<RosterItem>)}
                    placeholder={`Bio ${lang.toUpperCase()}...`}
                    className="w-full px-2 py-1 text-[10px] border border-[var(--color-border)] bg-transparent rounded-[0px]"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
