"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { INSIGHTS, type SDInsightType } from "@/lib/mock/studio-dashboard";
import { TrendingUp, Clock, Flame, Lightbulb, Globe, AlertTriangle } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const TYPE_ICON: Record<SDInsightType, React.ElementType> = {
  format: TrendingUp,
  time: Clock,
  topic: Flame,
  hook: Lightbulb,
  platform: Globe,
  risk: AlertTriangle,
};

// Category colors: Analytics=blue, Trend Hub=green, IA=purple, Risque=red
const CATEGORY_COLOR: Record<string, string> = {
  analytics: "#3B82F6",
  trends: "var(--success)",
  ai: "#8B5CF6",
  risk: "#DC2626",
};

function getCategory(type: SDInsightType): string {
  switch (type) {
    case "format": return "analytics";
    case "time": return "analytics";
    case "topic": return "trends";
    case "hook": return "ai";
    case "platform": return "trends";
    case "risk": return "risk";
  }
}

export function WhatWorksNow() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {t("studio_dashboard.insight.title", l)}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INSIGHTS.map((insight) => {
          const Icon = TYPE_ICON[insight.type];
          const category = getCategory(insight.type);
          const color = CATEGORY_COLOR[category];
          const isHighConfidence = insight.confidence >= 75;

          return (
            <div
              key={insight.id}
              className="p-3 transition-all duration-200 hover:translate-y-[-1px]"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Header: icon + source badge */}
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} style={{ color }} />
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
                  style={{ backgroundColor: `${color}18`, color }}
                >
                  {t(insight.sourceKey, l)}
                </span>
                {/* Confidence badge (replaces the bar) */}
                <span
                  className="text-[8px] px-1.5 py-0.5 rounded-sm ml-auto"
                  style={{
                    backgroundColor: isHighConfidence ? "var(--success-bg)" : "var(--warning-bg)",
                    color: isHighConfidence ? "var(--success)" : "var(--warning)",
                  }}
                >
                  {t(isHighConfidence ? "studio_dashboard.insight.confidence_badge.high" : "studio_dashboard.insight.confidence_badge.medium", l)}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xs font-medium mb-1" style={{ color: "var(--text-primary)" }}>
                {t(insight.titleKey, l)}
              </h3>
              <p className="text-[10px] leading-relaxed mb-2" style={{ color: "var(--text-secondary)" }}>
                {t(insight.descriptionKey, l)}
              </p>

              {/* Contextual CTA */}
              <Link
                href={insight.actionHref}
                className="text-[10px] font-medium transition-colors inline-flex items-center gap-1"
                style={{ color }}
              >
                {t(insight.actionLabelKey, l)}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
