"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { UrgentAction } from "@/lib/mock/admin-dashboard";
import { PRIORITY_ORDER } from "@/lib/mock/admin-dashboard";
import { AlertTriangle, ArrowRight } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const PRIORITY_COLORS: Record<string, string> = {
  critical: "var(--danger)",
  high: "#F59E0B",
  medium: "#3B82F6",
  low: "rgba(255,255,255,0.2)",
};

interface UrgentActionsPanelProps {
  actions: UrgentAction[];
}

export function UrgentActionsPanel({ actions }: UrgentActionsPanelProps) {
  const locale = useLocale();
  const l = norm(locale);

  const sorted = [...actions].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={13} style={{ color: "var(--danger)" }} />
        <h2 className="text-[13px] font-display font-bold" style={{ color: "var(--text-primary)" }}>
          {t("admin_dashboard.urgent.title", l)}
        </h2>
        {actions.filter((a) => a.priority === "critical").length > 0 && (
          <span className="text-[8px] px-1.5 py-0.5" style={{ background: "rgba(229,72,77,0.15)", color: "var(--danger)" }}>
            {actions.filter((a) => a.priority === "critical").length} {t("admin_dashboard.urgent.critical_count", l)}
          </span>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
        {sorted.map((action) => {
          const pColor = PRIORITY_COLORS[action.priority];
          return (
            <div
              key={action.id}
              className="shrink-0 w-[220px] relative overflow-hidden"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Priority bar */}
              <div
                className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: pColor }}
              />

              <div className="p-3">
                {/* Label + priority */}
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-medium truncate pr-2" style={{ color: "var(--text-primary)" }}>
                    {t(action.labelKey, l)}
                  </p>
                  <span
                    className="shrink-0 text-[7px] px-1 py-0.5"
                    style={{
                      background: action.priority === "critical" ? "rgba(229,72,77,0.15)" : "rgba(255,255,255,0.04)",
                      color: pColor,
                    }}
                  >
                    {t(`admin_dashboard.urgent.priority.${action.priority}`, l)}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[8px] mb-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {t(action.descriptionKey, l)}
                </p>

                {/* Owner + Deadline */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {action.owner}
                  </span>
                  <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>•</span>
                  <span className="text-[7px]" style={{ color: action.priority === "critical" ? "var(--danger)" : "rgba(255,255,255,0.3)" }}>
                    {t(action.deadline, l)}
                  </span>
                </div>

                {/* Impact + CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {t(action.impactKey, l)}
                  </span>
                  <Link
                    href={action.ctaHref}
                    className="flex items-center gap-0.5 text-[7px] transition-colors"
                    style={{ color: "var(--accent)" }}
                  >
                    {t(action.ctaLabelKey, l)}
                    <ArrowRight size={7} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
