"use client";

import { useState, useMemo } from "react";
import { GLOSSARY } from "@/lib/blog/data";
import { Search } from "lucide-react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const results = useMemo(() => {
    let filtered = GLOSSARY;
    if (activeLetter) {
      filtered = filtered.filter((e) => e.letter === activeLetter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (e) => e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [search, activeLetter]);

  const displayLetter = activeLetter || "Tout";

  return (
    <div className="mx-auto" style={{ maxWidth: "720px" }}>
      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--text-tertiary)" }}
        />
        <input
          type="text"
          placeholder="Rechercher un terme..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveLetter(null);
          }}
          className="w-full text-sm py-2.5 pl-9 pr-3 rounded-xl outline-none"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            color: "var(--text-primary)",
          }}
        />
      </div>

      {/* Letter nav */}
      <div className="flex flex-wrap gap-1 mb-8">
        {LETTERS.map((letter) => {
          const hasEntries = GLOSSARY.some((e) => e.letter === letter);
          const isActive = activeLetter === letter;
          return (
            <button
              key={letter}
              disabled={!hasEntries}
              onClick={() => setActiveLetter(isActive ? null : letter)}
              className="w-7 h-7 text-[10px] font-semibold rounded-md transition-all"
              style={{
                backgroundColor: isActive ? "var(--accent)" : hasEntries ? "var(--bg-card)" : "transparent",
                color: isActive ? "var(--accent-text, #fff)" : hasEntries ? "var(--text-primary)" : "var(--text-tertiary)",
                border: isActive ? "none" : hasEntries ? "1px solid var(--border-default)" : "none",
                opacity: hasEntries ? 1 : 0.3,
                cursor: hasEntries ? "pointer" : "default",
              }}
            >
              {letter}
            </button>
          );
        })}
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-2">
          {results.map((entry) => (
            <div
              key={entry.term}
              className="p-4 rounded-xl"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-bold uppercase w-5 h-5 flex items-center justify-center rounded"
                  style={{
                    backgroundColor: "color-mix(in srgb, var(--accent) 10%, transparent)",
                    color: "var(--accent)",
                  }}
                >
                  {entry.letter}
                </span>
                <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                  {entry.term}
                </h3>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {entry.definition}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-center py-12" style={{ color: "var(--text-tertiary)" }}>
          Aucun résultat pour &quot;{search || displayLetter}&quot;
        </p>
      )}
    </div>
  );
}
