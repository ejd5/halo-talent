"use client";

import { useState } from "react";
import { ClipboardList, Send } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { timeAgo } from "@/lib/mock/atlas-fans";
import type { FanIntelNote } from "@/lib/mock/atlas-fans";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface FanNotesProps {
  notes: FanIntelNote[];
  onAddNote: (content: string) => void;
}

export function FanNotes({ notes, onAddNote }: FanNotesProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [value, setValue] = useState("");

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddNote(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Input */}
      <div className="flex gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("fan_intel.notes.placeholder", l)}
          rows={2}
          className="flex-1 text-[11px] bg-transparent px-3 py-2 resize-none outline-none rounded-sm transition-colors"
          style={{
            color: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "var(--color-accent, var(--or, #D8A95B))";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        />
        <button
          onClick={handleAdd}
          disabled={!value.trim()}
          className="shrink-0 px-3 rounded-sm transition-opacity flex items-center justify-center"
          style={{
            backgroundColor: value.trim() ? "var(--color-accent, var(--or, #D8A95B))" : "rgba(255,255,255,0.06)",
            opacity: value.trim() ? 1 : 0.4,
          }}
        >
          <Send size={13} style={{ color: "#fff" }} />
        </button>
      </div>

      {/* Notes list */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ClipboardList size={24} style={{ color: "rgba(255,255,255,0.08)" }} />
          <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
            {t("fan_intel.notes.no_notes", l)}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {[...notes]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map((note, idx) => (
              <div
                key={idx}
                className="px-3 py-2.5 rounded-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)" }}
              >
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  {note.content}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {note.author}
                  </span>
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>
                    {timeAgo(note.timestamp)}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
