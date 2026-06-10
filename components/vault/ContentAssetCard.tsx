"use client";

import { Image, Video, FileAudio, FileText, Package, AlertTriangle } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  type ContentAsset,
  type ContentType,
  type SmartLabel,
  computeSmartLabels,
  CONTENT_TYPE_COLORS,
  PREMIUM_LEVEL_LABELS,
} from "@/lib/mock/content-vault";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const TYPE_ICONS: Record<ContentType, React.ElementType> = {
  image: Image,
  video: Video,
  audio: FileAudio,
  text: FileText,
  bundle: Package,
};

const LABEL_COLORS: Record<string, { bg: string; text: string }> = {
  already_sent: { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
  already_sold: { bg: "rgba(16,185,129,0.15)", text: "var(--success)" },
  fatigue_risk: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
  reactivation_candidate: { bg: "rgba(139,92,246,0.15)", text: "#8B5CF6" },
  vip_candidate: { bg: "rgba(199,91,57,0.15)", text: "var(--accent)" },
  rights_issue: { bg: "rgba(229,72,77,0.15)", text: "var(--danger)" },
  sensitive: { bg: "rgba(229,72,77,0.15)", text: "var(--danger)" },
};

interface ContentAssetCardProps {
  asset: ContentAsset;
  onSelect: () => void;
}

export function ContentAssetCard({ asset, onSelect }: ContentAssetCardProps) {
  const locale = useLocale();
  const l = norm(locale);
  const TypeIcon = TYPE_ICONS[asset.type];
  const color = CONTENT_TYPE_COLORS[asset.type];
  const labels = computeSmartLabels(asset);
  const hasRestrictions = asset.restrictions.some((r) => r.isActive);

  return (
    <button
      onClick={onSelect}
      className="w-full text-left p-2.5 rounded-sm transition-colors"
      style={{
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)")}
    >
      {/* Thumbnail placeholder */}
      <div
        className="w-full aspect-[16/9] rounded-sm mb-2 flex items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: `${color}12` }}
      >
        <span className="text-xl">{asset.thumbnail}</span>
        <TypeIcon size={16} className="absolute bottom-1.5 left-1.5 opacity-40" style={{ color }} />
        {asset.duration && (
          <span
            className="absolute bottom-1.5 right-1.5 text-[8px] px-1 py-px rounded-sm font-mono"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.7)" }}
          >
            {Math.floor(asset.duration / 60)}:{(asset.duration % 60).toString().padStart(2, "0")}
          </span>
        )}
        {hasRestrictions && (
          <AlertTriangle size={12} className="absolute top-1.5 right-1.5" style={{ color: "#F59E0B" }} />
        )}
      </div>

      {/* Smart labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1.5">
          {labels.slice(0, 3).map((label) => {
            const colors = LABEL_COLORS[label.type] || LABEL_COLORS.already_sent;
            return (
              <span
                key={label.type}
                className="text-[7px] px-1 py-px rounded-sm uppercase tracking-wider font-medium"
                style={{ backgroundColor: colors.bg, color: colors.text }}
              >
                {t(label.labelKey, l)}
              </span>
            );
          })}
          {labels.length > 3 && (
            <span className="text-[7px] px-1 py-px rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.25)" }}>
              +{labels.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <p className="text-[11px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
        {asset.title}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[8px] uppercase px-1 py-px rounded-sm font-medium"
            style={{ backgroundColor: `${color}15`, color }}
          >
            {PREMIUM_LEVEL_LABELS[asset.premiumLevel]}
          </span>
          <span className="text-[8px] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
            {asset.language}
          </span>
        </div>
        <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>
          {asset.sentToFansCount > 0
            ? `${asset.sentToFansCount} ${t("content_vault.card.sent", l)}`
            : `${asset.revenueGenerated}€`}
        </span>
      </div>

      {/* Performance bar */}
      <div className="mt-2 h-1 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
        <div
          className="h-full rounded-sm transition-all duration-300"
          style={{
            width: `${Math.max(2, asset.performanceScore)}%`,
            backgroundColor: asset.performanceScore >= 70 ? "var(--success)" : asset.performanceScore >= 40 ? "#F59E0B" : "rgba(255,255,255,0.15)",
          }}
        />
      </div>
    </button>
  );
}
