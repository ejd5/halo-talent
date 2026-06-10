"use client";

import { useState } from "react";
import { DollarSign, Send, FileText, Image, Plus } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { RevenueThread } from "@/lib/mock/atlas-revenue-inbox";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

function formatAmount(n: number): string {
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`;
  return `€${n}`;
}

interface RevenueAttributionPanelProps {
  thread: RevenueThread | null;
  onAddNote: (note: string) => void;
}

export function RevenueAttributionPanel({ thread, onAddNote }: RevenueAttributionPanelProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [noteInput, setNoteInput] = useState("");

  if (!thread) return null;

  const ppvMessages = thread.messages.filter((m) => m.isPPV);
  const ppvTotal = ppvMessages.reduce((sum, m) => sum + (m.ppvAmount || 0), 0);
  const offersSent = thread.messages.filter((m) => m.direction === "outbound" && m.isPPV).length;
  const conversionRate = offersSent > 0 ? Math.round((ppvMessages.length / offersSent) * 100) : 0;

  return (
    <div className="border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      {/* PPV Revenue Summary */}
      <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <h4
          className="flex items-center gap-1.5 text-[11px] font-medium mb-3"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <DollarSign size={12} />
          {t("revenue_inbox.ppv_revenue", l)}
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <span className="text-[10px] block" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("revenue_inbox.total_revenue", l)}
            </span>
            <span className="text-[13px] font-medium" style={{ color: "var(--color-accent, #C75B39)" }}>
              {formatAmount(ppvTotal)}
            </span>
          </div>
          <div>
            <span className="text-[10px] block" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("revenue_inbox.ppv_sent", l)}
            </span>
            <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
              {offersSent}
            </span>
          </div>
          <div>
            <span className="text-[10px] block" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("revenue_inbox.conversion", l)}
            </span>
            <span
              className="text-[13px] font-medium"
              style={{ color: conversionRate >= 50 ? "var(--success)" : "rgba(255,255,255,0.7)" }}
            >
              {conversionRate}%
            </span>
          </div>
        </div>
      </div>

      {/* Media sent */}
      <div className="p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <h4
          className="flex items-center gap-1.5 text-[11px] font-medium mb-2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <Image size={12} />
          {t("revenue_inbox.media_sent", l)}
        </h4>
        {thread.alreadySentMediaIds.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {thread.alreadySentMediaIds.map((id) => (
              <span
                key={id}
                className="text-[10px] px-1.5 py-0.5 rounded-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}
              >
                {id}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            {t("revenue_inbox.no_media", l)}
          </p>
        )}
      </div>

      {/* Internal notes */}
      <div className="p-4">
        <h4
          className="flex items-center gap-1.5 text-[11px] font-medium mb-2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <FileText size={12} />
          {t("revenue_inbox.internal_notes", l)}
        </h4>

        {thread.notes.map((note, i) => (
          <p
            key={i}
            className="text-[11px] mb-1.5 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            {note}
          </p>
        ))}

        <div className="flex items-center gap-2 mt-3">
          <input
            type="text"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder={t("revenue_inbox.add_note_placeholder", l)}
            className="flex-1 text-[11px] px-3 py-1.5 rounded-sm outline-none border"
            style={{
              backgroundColor: "rgba(255,255,255,0.04)",
              borderColor: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && noteInput.trim()) {
                onAddNote(noteInput.trim());
                setNoteInput("");
              }
            }}
          />
          <button
            onClick={() => {
              if (noteInput.trim()) {
                onAddNote(noteInput.trim());
                setNoteInput("");
              }
            }}
            disabled={!noteInput.trim()}
            className="p-1.5 rounded-sm transition-colors"
            style={{
              backgroundColor: noteInput.trim()
                ? "var(--color-accent, #C75B39)"
                : "rgba(255,255,255,0.06)",
              opacity: noteInput.trim() ? 1 : 0.3,
            }}
          >
            <Send size={13} style={{ color: noteInput.trim() ? "#fff" : "rgba(255,255,255,0.3)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
