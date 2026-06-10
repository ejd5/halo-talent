"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  SENSITIVE_WORDS,
  type SensitiveWord,
  type SensitiveCategory,
  SENSITIVE_CATEGORY_LABELS,
  SENSITIVE_CATEGORY_COLORS,
} from "@/lib/mock/atlas-compliance";
import { Search, Plus, X } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const CATEGORIES: (SensitiveCategory | "all")[] = ["all", "spam", "sexual", "violence", "hate", "custom"];

interface SensitiveWordsPanelProps {
  words?: SensitiveWord[];
}

export function SensitiveWordsPanel({ words = SENSITIVE_WORDS }: SensitiveWordsPanelProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<SensitiveCategory | "all">("all");
  const [wordList, setWordList] = useState(words);
  const [newWord, setNewWord] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = wordList.filter((w) => {
    const matchesSearch = w.word.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || w.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const toggleWord = (id: string) => {
    setWordList((prev) => prev.map((w) => (w.id === id ? { ...w, blocked: !w.blocked } : w)));
  };

  const addWord = () => {
    if (!newWord.trim()) return;
    const sw: SensitiveWord = {
      id: `sw${Date.now()}`,
      word: newWord.trim().toLowerCase(),
      category: "custom",
      severity: 2 as 1 | 2 | 3 | 4 | 5,
      blocked: true,
      blockCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setWordList((prev) => [sw, ...prev]);
    setNewWord("");
    setShowAdd(false);
  };

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("compliance.words.title", l)}
      </h2>
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        {/* Search + Add */}
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.2)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("compliance.words.search", l)}
              className="w-full py-1.5 pl-7 pr-2 text-[10px]"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-default)", color: "var(--text-primary)", outline: "none" }}
            />
          </div>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-1 px-2 py-1.5 text-[9px] transition-colors"
            style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
          >
            <Plus size={10} />
            {t("compliance.words.add", l)}
          </button>
        </div>

        {/* Add word inline */}
        {showAdd && (
          <div className="flex items-center gap-2 mb-3 p-2" style={{ background: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)" }}>
            <input
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder={t("compliance.words.add_placeholder", l)}
              className="flex-1 py-1 px-2 text-[10px]"
              style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)", color: "var(--text-primary)", outline: "none" }}
              onKeyDown={(e) => e.key === "Enter" && addWord()}
            />
            <button onClick={addWord} className="text-[9px] px-2 py-1" style={{ background: "var(--accent)", color: "var(--text-primary)" }}>
              OK
            </button>
            <button onClick={() => { setShowAdd(false); setNewWord(""); }} style={{ color: "rgba(255,255,255,0.3)" }}>
              <X size={12} />
            </button>
          </div>
        )}

        {/* Category filters */}
        <div className="flex gap-1.5 mb-3 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="text-[8px] px-2 py-0.5 transition-colors"
              style={{
                background: categoryFilter === cat ? "rgba(199,91,57,0.15)" : "rgba(255,255,255,0.03)",
                color: categoryFilter === cat ? "var(--accent)" : "rgba(255,255,255,0.3)",
              }}
            >
              {cat === "all" ? t("compliance.words.category_all", l) : t(`compliance.words.category_${cat}`, l)}
            </button>
          ))}
        </div>

        {/* Words list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("compliance.words.no_words", l)}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((w) => {
              const catColor = SENSITIVE_CATEGORY_COLORS[w.category];
              return (
                <div
                  key={w.id}
                  className="flex items-center gap-2 px-2 py-1.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                >
                  {/* Word */}
                  <span className="text-[10px] font-medium w-24 truncate" style={{ color: "var(--text-primary)" }}>{w.word}</span>

                  {/* Category badge */}
                  <span
                    className="text-[7px] px-1 py-0.5 w-16 text-center"
                    style={{ background: `${catColor}15`, color: catColor }}
                  >
                    {SENSITIVE_CATEGORY_LABELS[w.category]}
                  </span>

                  {/* Severity stars */}
                  <div className="flex gap-0.5 w-10">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 h-1 rounded-full"
                        style={{ background: i < w.severity ? catColor : "rgba(255,255,255,0.06)" }}
                      />
                    ))}
                  </div>

                  {/* Block count */}
                  <span className="text-[8px] w-10 text-right" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {w.blockCount > 0 ? w.blockCount : "-"}
                  </span>

                  {/* Toggle */}
                  <button
                    onClick={() => toggleWord(w.id)}
                    className="ml-auto text-[8px] px-1.5 py-0.5 transition-colors"
                    style={{
                      background: w.blocked ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.03)",
                      color: w.blocked ? "var(--success)" : "rgba(255,255,255,0.3)",
                    }}
                  >
                    {w.blocked ? t("compliance.words.enabled", l) : t("compliance.words.disabled", l)}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
