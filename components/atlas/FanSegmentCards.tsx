"use client";

import { Zap, Sparkles, Clock, Flame, DollarSign, TrendingUp, AlertTriangle, ShieldAlert, Globe, MapPin, MessageCircle, ShieldCheck, UserX } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { FanSegment } from "@/lib/mock/atlas-fans";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface FanSegmentCardsProps {
  segments: FanSegment[];
  activeSegmentId: string | null;
  onSegmentClick: (segment: FanSegment) => void;
  onClearSegment: () => void;
}

const SEGMENT_ICONS: Record<string, React.ElementType> = {
  Zap, Sparkles, Clock, Flame, DollarSign, TrendingUp, AlertTriangle, ShieldAlert,
  Globe, MapPin, MessageCircle, ShieldCheck, UserX,
};

export function FanSegmentCards({
  segments,
  activeSegmentId,
  onSegmentClick,
  onClearSegment,
}: FanSegmentCardsProps) {
  const locale = useLocale();
  const l = norm(locale);

  // Show only the main 13 segments (exclude the dynamic lang/country/platform ones from the top-level view)
  const mainSegments = segments.filter((s) => !s.id.startsWith("seg-lang-") && !s.id.startsWith("seg-country-") && !s.id.startsWith("seg-platform-"));

  if (segments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertTriangle size={24} style={{ color: "rgba(255,255,255,0.08)" }} />
        <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          Aucun segment disponible
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Active segment chip */}
      {activeSegmentId && (
        <div className="flex items-center gap-2 px-3 py-1.5">
          <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            Filtre actif :
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-sm font-medium flex items-center gap-1 cursor-pointer"
            style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "var(--accent)" }}
            onClick={onClearSegment}
          >
            {segments.find((s) => s.id === activeSegmentId)?.name || "Segment"}
            <XIcon />
          </span>
        </div>
      )}

      {/* Fixed 13 main segments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-1">
        {mainSegments.map((segment) => {
          const Icon = SEGMENT_ICONS[segment.icon] || Users;
          const isActive = activeSegmentId === segment.id;
          const isBlocked = !!segment.blockedReason;

          return (
            <div
              key={segment.id}
              className="p-3 rounded-sm transition-all cursor-pointer"
              style={{
                backgroundColor: isActive ? "rgba(199,91,57,0.08)" : "rgba(255,255,255,0.025)",
                border: `1px solid ${isActive ? "rgba(199,91,57,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}
              onClick={() => onSegmentClick(segment)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color: isActive ? "var(--accent)" : "rgba(255,255,255,0.3)" }} />
                <span
                  className="text-[11px] font-medium truncate"
                  style={{ color: isActive ? "var(--accent)" : "rgba(255,255,255,0.7)" }}
                >
                  {segment.name}
                </span>
                <span
                  className="text-[10px] ml-auto px-1.5 py-0.5 rounded-sm font-medium shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
                >
                  {segment.fanIds.length}
                </span>
              </div>
              <p className="text-[10px] leading-relaxed mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>
                {segment.description}
              </p>

              {/* Campaign CTA */}
              {isBlocked ? (
                <div className="relative group">
                  <button
                    disabled
                    className="w-full text-[10px] px-2 py-1 rounded-sm font-medium uppercase tracking-wider cursor-not-allowed"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.15)",
                    }}
                  >
                    {t("fan_intel.campaign.create", l)}
                  </button>
                  {/* Tooltip */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-sm text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
                    style={{ backgroundColor: "rgba(229,72,77,0.9)", color: "#fff" }}
                  >
                    {t("fan_intel.campaign.blocked_tooltip", l)}
                  </div>
                </div>
              ) : (
                <button
                  className="w-full text-[10px] px-2 py-1 rounded-sm font-medium uppercase tracking-wider transition-opacity hover:opacity-80"
                  style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "var(--accent)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Campaign creation would go here
                  }}
                >
                  {t("fan_intel.campaign.create", l)}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Dynamic segments: Langue, Pays, Plateforme */}
      <div className="space-y-3 mt-4">
        <DynamicSegmentGroup
          title={t("fan_intel.segments.by_language", l)}
          segments={segments.filter((s) => s.id.startsWith("seg-lang-"))}
          activeSegmentId={activeSegmentId}
          onSegmentClick={onSegmentClick}
          l={l}
        />
        <DynamicSegmentGroup
          title={t("fan_intel.segments.by_country", l)}
          segments={segments.filter((s) => s.id.startsWith("seg-country-"))}
          activeSegmentId={activeSegmentId}
          onSegmentClick={onSegmentClick}
          l={l}
        />
        <DynamicSegmentGroup
          title={t("fan_intel.segments.by_platform", l)}
          segments={segments.filter((s) => s.id.startsWith("seg-platform-"))}
          activeSegmentId={activeSegmentId}
          onSegmentClick={onSegmentClick}
          l={l}
        />
      </div>
    </div>
  );
}

function DynamicSegmentGroup({
  title,
  segments,
  activeSegmentId,
  onSegmentClick,
  l,
}: {
  title: string;
  segments: FanSegment[];
  activeSegmentId: string | null;
  onSegmentClick: (s: FanSegment) => void;
  l: Locale;
}) {
  if (segments.length === 0) return null;

  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.12em] px-1 mb-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {segments.map((segment) => {
          const isActive = activeSegmentId === segment.id;
          return (
            <button
              key={segment.id}
              onClick={() => onSegmentClick(segment)}
              className="text-[10px] px-2 py-1 rounded-sm transition-all flex items-center gap-1"
              style={{
                backgroundColor: isActive ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
                color: isActive ? "var(--accent)" : "rgba(255,255,255,0.4)",
                border: `1px solid ${isActive ? "rgba(199,91,57,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              {segment.name}
              <span style={{ color: "rgba(255,255,255,0.15)" }}>{segment.fanIds.length}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const Users = ({ size, style }: { size?: number; style?: React.CSSProperties }) => (
  <svg width={size || 14} height={size || 14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
