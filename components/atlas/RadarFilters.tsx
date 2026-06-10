"use client";

import { X } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export interface RadarFilterState {
  segment: string;
  platform: string;
  opportunityType: string;
  timing: string;
}

const SEGMENTS = ["whale", "tipper", "regular", "nouveau", "a-risque"];
const PLATFORMS = ["onlyfans", "fansly", "mym", "fanvue", "instagram", "tiktok"];
const TYPES = ["ppv", "tip", "reabonnement", "upsell"];
const TIMINGS = ["maintenant", "ce_soir", "cette_semaine"];

export function RadarFilters({
  filters,
  onFiltersChange,
}: {
  filters: RadarFilterState;
  onFiltersChange: (f: RadarFilterState) => void;
}) {
  const locale = useLocale();
  const l = norm(locale);

  const set = (key: keyof RadarFilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value === "all" ? "" : value });
  };

  const hasFilters = filters.segment || filters.platform || filters.opportunityType || filters.timing;

  const selectStyle: React.CSSProperties = {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-default)",
    color: "var(--text-primary)",
    borderRadius: "6px",
    fontSize: "10px",
    padding: "4px 20px 4px 6px",
    appearance: "none",
    outline: "none",
    cursor: "pointer",
    minWidth: 0,
    maxWidth: 120,
  };

  return (
    <div className="flex items-center gap-2 px-4 py-1.5 flex-wrap">
      {/* Segment */}
      <select
        style={selectStyle}
        value={filters.segment || "all"}
        onChange={(e) => set("segment", e.target.value)}
      >
        <option value="all">{t("revenue_radar.filter_segment", l)}</option>
        {SEGMENTS.map((s) => (
          <option key={s} value={s}>{t(`revenue_radar.segment_${s}`, l)}</option>
        ))}
      </select>

      {/* Platform */}
      <select
        style={selectStyle}
        value={filters.platform || "all"}
        onChange={(e) => set("platform", e.target.value)}
      >
        <option value="all">{t("revenue_radar.filter_platform", l)}</option>
        {PLATFORMS.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>

      {/* Type */}
      <select
        style={selectStyle}
        value={filters.opportunityType || "all"}
        onChange={(e) => set("opportunityType", e.target.value)}
      >
        <option value="all">{t("revenue_radar.filter_type", l)}</option>
        {TYPES.map((tp) => (
          <option key={tp} value={tp}>{t(`revenue_radar.type_${tp}`, l)}</option>
        ))}
      </select>

      {/* Timing */}
      <select
        style={selectStyle}
        value={filters.timing || "all"}
        onChange={(e) => set("timing", e.target.value)}
      >
        <option value="all">{t("revenue_radar.filter_timing", l)}</option>
        {TIMINGS.map((tm) => (
          <option key={tm} value={tm}>{t(`revenue_radar.timing_${tm}`, l)}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={() => onFiltersChange({ segment: "", platform: "", opportunityType: "", timing: "" })}
          className="flex items-center gap-1 px-1.5 py-1 text-[10px] transition-opacity"
          style={{ color: "var(--text-tertiary)" }}
        >
          <X size={10} />
          {t("revenue_radar.filter_clear", l)}
        </button>
      )}
    </div>
  );
}
