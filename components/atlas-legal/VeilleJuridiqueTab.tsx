"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Eye, ExternalLink, Check,
} from "lucide-react";
import { t, translatePlatform } from "@/lib/i18n/legal";
import type { ChangeEvent } from "./types";
import { IMPACT_COLORS, formatDate } from "./helpers";

export function VeilleJuridiqueTab({ locale }: { locale: string }) {
  const [events, setEvents] = useState<ChangeEvent[]>([]);
  const [snapshotUrls, setSnapshotUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [validatingId, setValidatingId] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/legal/change-events?limit=100");
      const d = await res.json();
      setEvents(d.events || []);
      setSnapshotUrls(d.snapshot_urls || {});
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleValidate = async (id: string) => {
    setValidatingId(id);
    try {
      const res = await fetch(`/api/legal/change-events/${id}/validate`, { method: "POST" });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === id ? { ...e, human_reviewed: true, published: true } : e
          )
        );
      }
    } catch {} finally {
      setValidatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-6 h-6 rounded-full animate-spin" style={{ border: "2px solid rgba(199,91,57,0.2)", borderTopColor: "var(--accent)" }} />
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Eye size={48} strokeWidth={1} className="mb-4" style={{ color: "var(--color-ink-tertiary)" }} />
        <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
          {t("atlas.no_events", locale)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const impactColor = IMPACT_COLORS[event.impact_level] || "var(--color-ink-tertiary)";
        const impactKey = `atlas.impact_${event.impact_level}`;
        const snapshotUrl = event.new_snapshot_id ? snapshotUrls[event.new_snapshot_id] : null;

        return (
          <div
            key={event.id}
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(245,240,235,0.06)", backgroundColor: "var(--bg-card)" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid rgba(245,240,235,0.04)" }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: impactColor }} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium capitalize" style={{ color: "var(--text-primary)" }}>
                      {translatePlatform(event.platform, locale)}
                    </span>
                    <span
                      className="text-[9px] font-semibold px-1.5 py-px rounded"
                      style={{ backgroundColor: `${impactColor}18`, color: impactColor }}
                    >
                      {t(impactKey, locale)}
                    </span>
                    <span
                      className="text-[9px] font-semibold px-1.5 py-px rounded"
                      style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "var(--color-ink-tertiary)" }}
                    >
                      {event.doc_type.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--color-ink-tertiary)" }}>
                    {formatDate(event.created_at)}
                  </p>
                </div>
              </div>

              {/* Admin validation button */}
              {!event.human_reviewed ? (
                <button
                  onClick={() => handleValidate(event.id)}
                  disabled={validatingId === event.id}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 transition-opacity hover:opacity-70 disabled:opacity-40 shrink-0"
                  style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
                >
                  {validatingId === event.id ? (
                    <div className="w-3 h-3 rounded-full animate-spin" style={{ border: "1px solid rgba(255,255,255,0.3)", borderTopColor: "white" }} />
                  ) : (
                    <Check size={12} />
                  )}
                  {t("atlas.validate", locale)}
                </button>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "var(--color-success)" }}>
                  <Check size={12} />
                  {t("atlas.validated_by", locale)}
                </span>
              )}
            </div>

            {/* Body */}
            <div className="px-5 py-4 space-y-3">
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-ink-secondary)" }}>
                {event.summary}
              </p>

              {event.affected_articles && event.affected_articles.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {event.affected_articles.map((article, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "var(--color-ink-tertiary)", border: "1px solid rgba(245,240,235,0.06)" }}
                    >
                      {article}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                {snapshotUrl && (
                  <a
                    href={snapshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[10px] font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--accent)" }}
                  >
                    <ExternalLink size={10} /> Voir la source
                  </a>
                )}
                <a
                  href={`/lex/changements?platform=${event.platform}`}
                  className="flex items-center gap-1 text-[10px] font-medium transition-opacity hover:opacity-70"
                  style={{ color: "var(--accent)" }}
                >
                  <Eye size={10} /> Voir dans le hub
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
