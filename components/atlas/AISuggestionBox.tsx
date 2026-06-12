"use client";

import { Sparkles, Lightbulb, Loader, Edit3, Check, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface AISuggestionBoxProps {
  suggestion: string;
  reasoning?: string;
  onApprove: () => void;
  onEdit: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

export function AISuggestionBox({
  suggestion,
  reasoning,
  onApprove,
  onEdit,
  onReject,
  isLoading,
}: AISuggestionBoxProps) {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div
      className="border-l-2 px-4 py-3 my-3"
      style={{ borderLeftColor: "var(--color-accent, var(--or, #D8A95B))", backgroundColor: "rgba(199,91,57,0.04)" }}
    >
      {/* Watermark */}
      <p
        className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-3"
        style={{ color: "rgba(199,91,57,0.7)" }}
      >
        <Sparkles size={11} />
        {t("revenue_inbox.ai_watermark", l)}
      </p>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center gap-2 py-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          <Loader size={16} className="animate-spin" />
          <span className="text-xs">{t("revenue_inbox.ai_loading", l)}</span>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !suggestion && (
        <p className="text-xs py-2" style={{ color: "rgba(255,255,255,0.25)" }}>
          {t("revenue_inbox.ai_no_suggestion", l)}
        </p>
      )}

      {/* Suggestion */}
      {!isLoading && suggestion && (
        <>
          <div
            className="p-3 rounded-sm text-[13px] leading-relaxed mb-3"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.85)" }}
          >
            {suggestion}
          </div>

          {/* Reasoning */}
          {reasoning && (
            <details className="mb-3">
              <summary
                className="flex items-center gap-1.5 text-[11px] cursor-pointer"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                <Lightbulb size={12} />
                {t("revenue_inbox.ai_reasoning", l)}
              </summary>
              <p
                className="mt-2 text-[11px] leading-relaxed pl-5"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {reasoning}
              </p>
            </details>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] transition-colors"
              style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)" }}
            >
              <Edit3 size={12} />
              {t("revenue_inbox.btn_edit", l)}
            </button>
            <button
              onClick={onApprove}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-[11px] font-medium transition-colors"
              style={{ backgroundColor: "var(--color-accent, var(--or, #D8A95B))", color: "#fff" }}
            >
              <Check size={12} />
              {t("revenue_inbox.btn_approve", l)}
            </button>
            <button
              onClick={onReject}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-sm text-[11px] transition-colors ml-auto"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              <X size={12} />
              {t("revenue_inbox.btn_reject", l)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
