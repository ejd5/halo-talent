"use client";

import { useState, useEffect } from "react";
import {
  Search, BookOpen, Plus, Send, Check, ChevronRight,
} from "lucide-react";
import { t } from "@/lib/i18n/legal";
import type { KnowledgeEntry } from "./types";
import {
  SEVERITY_COLORS, PLATFORM_OPTIONS, CATEGORY_OPTIONS, JURISDICTION_OPTIONS,
} from "./helpers";

export function BaseJuridiqueTab({ locale }: { locale: string }) {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [category, setCategory] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [suggestLabel, setSuggestLabel] = useState("");
  const [suggestDesc, setSuggestDesc] = useState("");
  const [suggestPlatform, setSuggestPlatform] = useState("");
  const [suggestSent, setSuggestSent] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (platform) params.set("platform", platform);
        if (jurisdiction) params.set("jurisdiction", jurisdiction);
        if (category) params.set("category", category);
        const res = await fetch(`/api/legal/knowledge?${params}`);
        const d = await res.json();
        if (!cancelled) setEntries(d.entries || []);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [search, platform, jurisdiction, category]);

  const handleSuggest = async () => {
    if (!suggestLabel.trim()) return;
    setSending(true);
    try {
      await fetch("/api/legal/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clause_label: suggestLabel,
          clause_description: suggestDesc,
          platform: suggestPlatform || null,
        }),
      });
      setSuggestSent(true);
      setTimeout(() => { setSuggestOpen(false); setSuggestSent(false); }, 1500);
    } catch {} finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-ink-tertiary)" }} />
          <input
            type="text"
            placeholder={t("atlas.knowledge_search", locale)}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded outline-none transition-colors"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid rgba(245,240,235,0.08)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="text-xs px-3 py-2.5 rounded outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid rgba(245,240,235,0.08)",
              color: platform ? "var(--text-primary)" : "var(--color-ink-tertiary)",
            }}
          >
            <option value="">Plateforme</option>
            {PLATFORM_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs px-3 py-2.5 rounded outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid rgba(245,240,235,0.08)",
              color: category ? "var(--text-primary)" : "var(--color-ink-tertiary)",
            }}
          >
            <option value="">Catégorie</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
            ))}
          </select>
          <select
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            className="text-xs px-3 py-2.5 rounded outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid rgba(245,240,235,0.08)",
              color: jurisdiction ? "var(--text-primary)" : "var(--color-ink-tertiary)",
            }}
          >
            <option value="">Juridiction</option>
            {JURISDICTION_OPTIONS.map((j) => (
              <option key={j} value={j}>{j.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid rgba(199,91,57,0.2)", borderTopColor: "var(--accent)" }} />
        </div>
      ) : entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <BookOpen size={40} strokeWidth={1} className="mb-3" style={{ color: "var(--color-ink-tertiary)" }} />
          <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>{t("atlas.no_results", locale)}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {entries.map((e) => {
            const isExpanded = expandedId === e.id;
            return (
              <div
                key={e.id}
                className="rounded-lg overflow-hidden transition-opacity"
                style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
                    >
                      {e.category.replace(/_/g, " ")}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--color-ink-tertiary)" }}
                    >
                      {e.jurisdiction.toUpperCase()}
                    </span>
                    {e.platform && (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "var(--color-ink-secondary)" }}
                      >
                        {e.platform}
                      </span>
                    )}
                    <span
                      className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      style={{
                        backgroundColor: `${SEVERITY_COLORS[e.severity_score]}15`,
                        color: SEVERITY_COLORS[e.severity_score],
                      }}
                    >
                      {t("result.severity", locale).replace("{score}", String(e.severity_score))}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{e.title}</h3>
                  {e.summary && (
                    <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                      {isExpanded ? e.content : e.summary}
                    </p>
                  )}

                  {e.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {e.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.5 rounded cursor-pointer hover:opacity-70 transition-opacity"
                          style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "var(--color-ink-tertiary)" }}
                          onClick={() => setSearch(t)}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(245,240,235,0.04)" }}>
                    <span className="text-[10px]" style={{ color: "var(--color-ink-tertiary)" }}>
                      {e.source_name}
                    </span>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : e.id)}
                      className="flex items-center gap-1 text-[10px] font-medium transition-opacity hover:opacity-70"
                      style={{ color: "var(--accent)" }}
                    >
                      {isExpanded ? t("atlas.collapse", locale) : t("atlas.read_more", locale)}
                      <ChevronRight size={10} style={{ transform: isExpanded ? "rotate(90deg)" : "none" }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Suggest new clause */}
      <div className="mt-8" style={{ borderTop: "1px solid rgba(245,240,235,0.06)" }}>
        {suggestOpen ? (
          <div className="mt-6 p-5 rounded-lg" style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
              {t("atlas.suggest_title", locale)}
            </h4>
            <div className="space-y-3">
              <input
                type="text"
                placeholder={t("atlas.suggest_name", locale)}
                value={suggestLabel}
                onChange={(e) => setSuggestLabel(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded outline-none"
                style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
              />
              <textarea
                placeholder={t("atlas.suggest_desc_placeholder", locale)}
                value={suggestDesc}
                onChange={(e) => setSuggestDesc(e.target.value)}
                rows={3}
                className="w-full text-xs px-3 py-2.5 rounded outline-none resize-none"
                style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
              />
              <select
                value={suggestPlatform}
                onChange={(e) => setSuggestPlatform(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded outline-none"
                style={{ backgroundColor: "var(--bg-primary)", border: "1px solid rgba(245,240,235,0.08)", color: suggestPlatform ? "var(--text-primary)" : "var(--color-ink-tertiary)" }}
              >
                <option value="">{t("atlas.suggest_platform", locale)}</option>
                {PLATFORM_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  onClick={handleSuggest}
                  disabled={sending || !suggestLabel.trim()}
                  className="flex items-center gap-1.5 text-xs font-medium px-4 py-2 transition-opacity hover:opacity-70 disabled:opacity-40"
                  style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
                >
                  {sending ? t("atlas.sending", locale) : suggestSent ? t("atlas.sent", locale) : t("atlas.send", locale)}
                  {suggestSent ? <Check size={12} /> : <Send size={12} />}
                </button>
                <button
                  onClick={() => { setSuggestOpen(false); setSuggestSent(false); }}
                  className="text-xs px-4 py-2 transition-opacity hover:opacity-70"
                  style={{ color: "var(--color-ink-secondary)", border: "1px solid rgba(245,240,235,0.08)" }}
                >
                  {t("atlas.cancel", locale)}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setSuggestOpen(true)}
            className="flex items-center gap-2 text-xs font-medium mt-6 px-4 py-2.5 transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)", border: "1px solid var(--accent-border)" }}
          >
            <Plus size={14} /> {t("atlas.knowledge_suggest", locale)}
          </button>
        )}
      </div>
    </div>
  );
}
