"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { SDMission, SDImpact, SDDifficulty } from "@/lib/mock/studio-dashboard";
import { X } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface DailyMissionCardProps {
  mission: SDMission;
  onComplete: () => void;
}

export function DailyMissionCard({ mission, onComplete }: DailyMissionCardProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [dismissed, setDismissed] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    onComplete();
  };

  if (dismissed) return null;

  const impactColors: Record<SDImpact, string> = {
    high: "var(--success)",
    medium: "var(--warning)",
    low: "var(--info)",
  };

  const difficultyLabels: Record<SDDifficulty, string> = {
    easy: "studio_dashboard.mission.difficulty.easy",
    medium: "studio_dashboard.mission.difficulty.medium",
    hard: "studio_dashboard.mission.difficulty.hard",
  };

  const impactLabels: Record<SDImpact, string> = {
    high: "studio_dashboard.mission.impact.high",
    medium: "studio_dashboard.mission.impact.medium",
    low: "studio_dashboard.mission.impact.low",
  };

  return (
    <div
      className="relative flex items-center gap-4 p-4 lg:p-5 transition-all duration-200"
      style={{
        backgroundColor: completed ? "var(--success-bg)" : "var(--accent-soft)",
        border: `1px solid ${completed ? "var(--success)" : "var(--accent-border)"}`,
        opacity: completed ? 0.6 : 1,
      }}
    >
      {/* Reward emoji */}
      <div
        className="w-10 h-10 flex items-center justify-center text-lg shrink-0 rounded-md"
        style={{ backgroundColor: completed ? "var(--success-bg)" : "var(--accent-soft)" }}
      >
        {mission.rewardEmoji}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
            {t("studio_dashboard.mission.title", l)}
          </span>
          {completed && (
            <span className="text-[9px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: "var(--success-bg)", color: "var(--success)" }}>
              {t("studio_dashboard.mission.completed", l)}
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium mb-1" style={{ color: completed ? "var(--text-tertiary)" : "var(--text-primary)" }}>
          {t(mission.titleKey, l)}
        </h3>
        <p className="text-xs leading-relaxed mb-3" style={{ color: completed ? "var(--text-tertiary)" : "var(--text-secondary)" }}>
          {t(mission.descriptionKey, l)}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
            style={{ backgroundColor: `${impactColors[mission.impact]}20`, color: impactColors[mission.impact] }}
          >
            {t(impactLabels[mission.impact], l)}
          </span>
          <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
            {t("studio_dashboard.mission.duration", l).replace("{n}", String(mission.durationMin))}
          </span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-sm"
            style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-secondary)" }}
          >
            {t(difficultyLabels[mission.difficulty], l)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {!completed && (
          <Link
            href={mission.ctaHref}
            className="text-[11px] font-medium px-4 py-2 transition-colors rounded-md"
            style={{
              backgroundColor: "var(--accent)",
              color: "var(--accent-text)",
            }}
          >
            {t(mission.ctaLabelKey, l)}
          </Link>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="p-1.5 transition-colors rounded-md"
          style={{ color: "var(--text-tertiary)" }}
          aria-label="Ignorer"
          title="Ignorer"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
