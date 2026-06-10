"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { SDDraft } from "@/lib/mock/studio-dashboard";
import { Image, Video, FileText, Play } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const TYPE_ICON: Record<string, React.ElementType> = {
  image: Image,
  video: Video,
  text: FileText,
};

const PLATFORM_COLORS: Record<string, string> = {
  OF: "var(--accent)",
  TT: "#3B82F6",
  IG: "#EC4899",
  Fansly: "#8B5CF6",
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: "var(--bg-hover)", text: "var(--text-tertiary)" },
  ready: { bg: "var(--success-bg)", text: "var(--success)" },
  review: { bg: "var(--warning-bg)", text: "var(--warning)" },
};

interface DraftCardProps {
  drafts: SDDraft[];
}

export function DraftCard({ drafts }: DraftCardProps) {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {t("studio_dashboard.drafts.title", l)}
      </h2>
      {drafts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FileText size={24} style={{ color: "var(--text-tertiary)" }} />
          <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
            {t("studio_dashboard.drafts.empty", l)}
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            {t("studio_dashboard.drafts.empty_desc", l)}
          </p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
          {drafts.map((draft) => {
            const TypeIcon = TYPE_ICON[draft.type] || FileText;
            const statusStyle = STATUS_COLORS[draft.status];
            const platformColor = PLATFORM_COLORS[draft.platform] || "var(--text-tertiary)";
            const dnaColor = draft.dnaScore >= 80 ? "var(--success)" : draft.dnaScore >= 60 ? "var(--warning)" : "var(--danger)";

            return (
              <Link
                key={draft.id}
                href="/studio/composer"
                className="shrink-0 w-[180px] transition-all duration-200 hover:translate-y-[-1px] group"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                }}
              >
                {/* Thumbnail placeholder */}
                <div
                  className="h-24 flex items-center justify-center relative"
                  style={{ backgroundColor: "var(--bg-hover)" }}
                >
                  <TypeIcon size={20} style={{ color: "var(--text-tertiary)" }} />
                  {/* Platform badge */}
                  <span
                    className="absolute top-1.5 left-1.5 text-[7px] px-1 py-0.5 font-medium rounded-sm"
                    style={{ backgroundColor: platformColor, color: "var(--accent-text)" }}
                  >
                    {draft.platform}
                  </span>
                </div>

                {/* Info */}
                <div className="p-2 space-y-1.5">
                  <p className="text-[10px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                    {draft.title}
                  </p>

                  {/* DNA Score with tooltip */}
                  <div className="relative group/dna">
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: "var(--bg-hover)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${draft.dnaScore}%`, backgroundColor: dnaColor }}
                        />
                      </div>
                      <span className="text-[7px] tabular-nums" style={{ color: "var(--text-tertiary)" }}>
                        {t("studio_dashboard.drafts.dna", l).replace("{score}", String(draft.dnaScore))}
                      </span>
                    </div>
                    {/* Tooltip */}
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-md text-[8px] whitespace-nowrap z-50 pointer-events-none opacity-0 group-hover/dna:opacity-100 transition-opacity"
                      style={{
                        backgroundColor: "var(--text-primary)",
                        color: "var(--bg-primary)",
                      }}
                    >
                      {t("studio_dashboard.drafts.dna_tooltip", l)}
                    </div>
                  </div>

                  {/* Status + continue */}
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[7px] px-1 py-0.5 rounded-sm"
                      style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                    >
                      {t(`studio_dashboard.drafts.status.${draft.status}`, l)}
                    </span>
                    <span className="text-[7px] flex items-center gap-0.5" style={{ color: "var(--accent)" }}>
                      <Play size={6} fill="var(--accent)" />
                      {t("studio_dashboard.drafts.continue", l)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
