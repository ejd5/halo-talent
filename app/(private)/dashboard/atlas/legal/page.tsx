"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck, FileText, Search, AlertTriangle, BookOpen,
  Scale, Send, ChevronRight, Copy, Check,
  ExternalLink, Plus,
} from "lucide-react";
import { t, translatePlatform } from "@/lib/i18n/legal";
import { useLocale } from "@/lib/i18n/use-locale";

// ─── Types ────────────────────────────────────────────

interface Analysis {
  id: string;
  created_at: string;
  platform: string;
  total_score: number;
  risk_level: string;
  ai_diagnosis: string | null;
  clauses_checked: string[];
  clauses_details: { id: string; label: string; severity: number; category: string }[];
  agency_name: string | null;
  letter_generated: boolean;
  letters: { id: string; analysis_id: string; letter_type: string; created_at: string }[];
}

interface KnowledgeEntry {
  id: string;
  category: string;
  platform: string | null;
  jurisdiction: string;
  title: string;
  summary: string | null;
  content: string;
  source_name: string;
  severity_score: number;
  tags: string[];
  last_verified_at: string | null;
  created_at: string;
}

interface LegalUpdate {
  id: string;
  created_at: string;
  action: string;
  source: string;
  details: Record<string, string>;
  items_affected: number;
  reviewed_by_admin: boolean;
}

// ─── Helpers ──────────────────────────────────────────

const SEVERITY_COLORS: Record<number, string> = {
  1: "#22c55e",
  2: "#84cc16",
  3: "#eab308",
  4: "#f97316",
  5: "#ef4444",
};

const RISK_COLORS: Record<string, string> = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
};

const ACTION_LABELS: Record<string, string> = {
  cgu_scraped: "CGU mises à jour",
  clause_added: "Nouvelle clause suggérée",
  knowledge_updated: "Base juridique mise à jour",
  pattern_detected: "Motif détecté",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.round(h / 24);
  return `il y a ${d}j`;
}

const PLATFORM_OPTIONS = ["onlyfans", "fansly", "mym", "instagram", "tiktok", "youtube"];
const CATEGORY_OPTIONS = ["cgu_platform", "law", "jurisprudence", "best_practice"];
const JURISDICTION_OPTIONS = ["fr", "eu", "us", "uk", "international"];

// ─── Tab 1: Mon contrat ───────────────────────────

function MonContratTab({ locale }: { locale: string }) {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/legal/analyses");
        const d = await res.json();
        if (!cancelled) setAnalyses(d.analyses || []);
      } catch {} finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid rgba(199,91,57,0.2)", borderTopColor: "var(--accent)" }} />
      </div>
    );
  }

  if (!analyses.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Scale size={48} strokeWidth={1} className="mb-4" style={{ color: "var(--color-ink-tertiary)" }} />
        <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
          {t("atlas.no_analyses", locale)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {analyses.map((a) => (
        <div
          key={a.id}
          className="rounded-lg overflow-hidden"
          style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: RISK_COLORS[a.risk_level] || "#666" }}
              />
              <div>
                <span className="text-sm font-medium capitalize" style={{ color: "var(--text-primary)" }}>
                  {t("atlas.analysis_of", locale).replace("{platform}", translatePlatform(a.platform, locale))}
                </span>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-tertiary)" }}>
                  {formatDate(a.created_at)}
                  {a.agency_name && ` · ${a.agency_name}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Score badge */}
              <div
                className="text-xs font-semibold px-2.5 py-1 rounded"
                style={{
                  backgroundColor: `${RISK_COLORS[a.risk_level]}15`,
                  color: RISK_COLORS[a.risk_level],
                }}
              >
                {t("atlas.score_label", locale).replace("{value}", String(a.total_score))}
              </div>
              {a.letter_generated && (
                <div className="flex items-center gap-1 text-xs" style={{ color: "#22c55e" }}>
                  <FileText size={12} /> {t("atlas.letter_ready", locale)}
                </div>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-4">
            {/* Clauses */}
            <div className="flex flex-wrap gap-2">
              {a.clauses_details.map((c) => (
                <span
                  key={c.id}
                  className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded"
                  style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "var(--color-ink-secondary)" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: SEVERITY_COLORS[c.severity] || "#666" }}
                  />
                  {c.label}
                </span>
              ))}
            </div>

            {/* Diagnosis */}
            {a.ai_diagnosis && (
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                {a.ai_diagnosis.slice(0, 300)}
                {a.ai_diagnosis.length > 300 && "..."}
              </p>
            )}

            {/* Letters */}
            {a.letters.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--color-ink-tertiary)" }}>
                  {t("atlas.letters_generated", locale)}
                </p>
                {a.letters.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleCopy(l.letter_type, l.id)}
                    className="flex items-center justify-between w-full text-xs px-3 py-2 rounded transition-colors"
                    style={{ backgroundColor: "rgba(245,240,235,0.03)", color: "var(--color-ink-secondary)" }}
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={12} />
                      <span className="capitalize">{l.letter_type === "mise_en_demeure" ? t("result.letter_agency", locale) : t("result.letter_platform", locale)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ color: "var(--color-ink-tertiary)" }}>{timeAgo(l.created_at)}</span>
                      {copiedId === l.id ? (
                        <Check size={12} style={{ color: "#22c55e" }} />
                      ) : (
                        <Copy size={12} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 flex items-center gap-3" style={{ borderTop: "1px solid rgba(245,240,235,0.04)", backgroundColor: "rgba(0,0,0,0.1)" }}>
            <a
              href={`/protection?platform=${a.platform}`}
              className="flex items-center gap-1.5 text-xs font-medium transition-opacity hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              <ExternalLink size={12} /> {t("atlas.new_analysis_link", locale)}
            </a>
            {a.letter_generated && (
              <span className="text-xs" style={{ color: "var(--color-ink-tertiary)" }}>
                · {t("atlas.helper_copy", locale)}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab 2: Base juridique ─────────────────────────

function BaseJuridiqueTab({ locale }: { locale: string }) {
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
                  {/* Badges row */}
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

                  {/* Title & summary */}
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{e.title}</h3>
                  {e.summary && (
                    <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                      {isExpanded ? e.content : e.summary}
                    </p>
                  )}

                  {/* Tags */}
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

                  {/* Footer */}
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

// ─── Tab 3: Alertes juridiques ─────────────────────

function AlertesJuridiquesTab({ locale }: { locale: string }) {
  const [updates, setUpdates] = useState<LegalUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/legal/updates");
        const d = await res.json();
        setUpdates(d.updates || []);
      } catch {} finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid rgba(199,91,57,0.2)", borderTopColor: "var(--accent)" }} />
      </div>
    );
  }

  // Static content when no updates yet
  if (!updates.length) {
    return (
      <div className="space-y-4">
        <p className="text-xs" style={{ color: "var(--color-ink-secondary)" }}>
          Les alertes juridiques seront alimentées automatiquement par le second cerveau.
          Voici les sujets suivis pour le moment :
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: FileText,
              title: "CGU OnlyFans 2026",
              desc: "Mise à jour des conditions générales d'utilisation — section propriété du contenu",
              tag: "CGU",
              color: "var(--accent)",
            },
            {
              icon: Scale,
              title: "Loi française — Droits des créateurs",
              desc: "Proposition de loi visant à renforcer la protection des travailleurs de plateformes",
              tag: "Législation",
              color: "#3b82f6",
            },
            {
              icon: AlertTriangle,
              title: "Décision de justice — Clause de non-concurrence",
              desc: "Tribunal de commerce : clause de non-concurrence sans compensation annulée",
              tag: "Jurisprudence",
              color: "#eab308",
            },
            {
              icon: BookOpen,
              title: "Règlement européen — Transparence algorithmique",
              desc: "Nouvelles obligations pour les plateformes concernant la recommandation de contenu",
              tag: "UE",
              color: "#22c55e",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="rounded-lg p-4"
                style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${item.color}15` }}>
                    <Icon size={14} style={{ color: item.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                      <span
                        className="text-[9px] font-semibold px-1 py-px rounded"
                        style={{ backgroundColor: `${item.color}15`, color: item.color }}
                      >
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "var(--color-ink-secondary)" }}>{item.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {updates.map((u) => (
        <div
          key={u.id}
          className="rounded-lg p-4 flex items-start gap-3"
          style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}
        >
          <div className="w-8 h-8 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.1)" }}>
            {u.action === "clause_added" ? <Plus size={14} style={{ color: "var(--accent)" }} /> :
             u.action === "cgu_scraped" ? <FileText size={14} style={{ color: "#3b82f6" }} /> :
             <AlertTriangle size={14} style={{ color: "#eab308" }} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {ACTION_LABELS[u.action] || u.action}
              </span>
              <span className="text-[10px]" style={{ color: "var(--color-ink-tertiary)" }}>
                {timeAgo(u.created_at)}
              </span>
              {!u.reviewed_by_admin && (
                <span
                  className="text-[9px] font-semibold px-1 py-px rounded"
                  style={{ backgroundColor: "rgba(234,179,8,0.12)", color: "#eab308" }}
                >
                  {t("atlas.pending", locale)}
                </span>
              )}
            </div>
            {u.details?.clause_label && (
              <p className="text-xs mt-1" style={{ color: "var(--color-ink-secondary)" }}>
                {u.details.clause_label}
                {u.details.platform && <span className="opacity-60"> — {u.details.platform}</span>}
              </p>
            )}
            {u.details?.clause_description && (
              <p className="text-xs mt-0.5 opacity-60" style={{ color: "var(--color-ink-secondary)" }}>
                {u.details.clause_description}
              </p>
            )}
            <p className="text-[10px] mt-1.5" style={{ color: "var(--color-ink-tertiary)" }}>
              {u.items_affected > 0 && `${u.items_affected} élément(s) affecté(s) · `}
              {t("atlas.source", locale).replace("{source}", u.source)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────

export default function AtlasLegalPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<string>("contrat");

  const TABS = [
    { id: "contrat", label: t("atlas.tab_contract", locale), icon: FileText },
    { id: "juridique", label: t("atlas.tab_knowledge", locale), icon: BookOpen },
    { id: "alertes", label: t("atlas.tab_alerts", locale), icon: AlertTriangle },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <ShieldCheck size={28} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
          <div>
            <h1 className="text-[2.2rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              {t("hero.badge", locale)}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-ink-secondary)" }}>
              {t("atlas.description", locale)}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all whitespace-nowrap"
              style={{
                color: isActive ? "var(--accent)" : "var(--color-ink-tertiary)",
                borderBottom: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                marginBottom: -1,
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="animate-slide-up">
        {activeTab === "contrat" && <MonContratTab locale={locale} />}
        {activeTab === "juridique" && <BaseJuridiqueTab locale={locale} />}
        {activeTab === "alertes" && <AlertesJuridiquesTab locale={locale} />}
      </div>
    </div>
  );
}
