"use client";

import { useState, useEffect } from "react";
import {
  Scale, FileText, ExternalLink, Copy, Check,
} from "lucide-react";
import { t, translatePlatform } from "@/lib/i18n/legal";
import type { Analysis } from "./types";
import { SEVERITY_COLORS, RISK_COLORS, formatDate, timeAgo } from "./helpers";

export function MonContratTab({ locale }: { locale: string }) {
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

            {a.ai_diagnosis && (
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                {a.ai_diagnosis.slice(0, 300)}
                {a.ai_diagnosis.length > 300 && "..."}
              </p>
            )}

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
