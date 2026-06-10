"use client";

import { useState } from "react";
import { X, Search } from "lucide-react";
import { STICKERS, STICKER_CATEGORIES } from "./template-data";
import type { StickerDef } from "./editor-types";

interface Props {
  onSelect: (sticker: StickerDef) => void;
  onClose: () => void;
}

export function StickerLibrary({ onSelect, onClose }: Props) {
  const [category, setCategory] = useState("emoji");
  const [search, setSearch] = useState("");

  const filtered = STICKERS.filter(
    (s) => s.category === category && (search === "" || s.label.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-[420px] max-h-[560px] flex flex-col rounded-sm"
        style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 className="text-sm" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Stickers</h3>
          <button onClick={onClose} className="p-1 transition-colors hover:bg-white/10 rounded-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={14} />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-sm" style={{ border: "1px solid var(--border-default)" }}>
            <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="flex-1 text-[11px] bg-transparent outline-none"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-1 px-4 pb-2 overflow-x-auto">
          {STICKER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="flex items-center gap-1 px-2.5 py-1 text-[10px] whitespace-nowrap rounded-sm transition-all"
              style={{
                background: category === cat.id ? "rgba(199,91,57,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${category === cat.id ? "rgba(199,91,57,0.2)" : "rgba(255,255,255,0.06)"}`,
                color: category === cat.id ? "var(--accent)" : "rgba(255,255,255,0.5)",
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-5 gap-2">
            {filtered.map((sticker) => (
              <button
                key={sticker.id}
                onClick={() => onSelect(sticker)}
                className="flex items-center justify-center aspect-square text-2xl rounded-sm transition-all hover:bg-white/10"
                style={{ border: "1px solid var(--border-default)" }}
                title={sticker.label}
              >
                {sticker.emoji}
              </button>
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="text-[10px] text-center py-8" style={{ color: "rgba(255,255,255,0.2)" }}>
              Aucun sticker trouvé
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
