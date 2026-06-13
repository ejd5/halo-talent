"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { generateCalendar } from "@/lib/mock/studio-dashboard";
import { useMemo } from "react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const DAY_NAMES_FR = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const PLATFORM_COLORS: Record<string, string> = {
  OF: "var(--accent)",
  Fansly: "#8B5CF6",
  IG: "#EC4899",
  TT: "#3B82F6",
};

const STATUS_LABELS: Record<string, string> = {
  posted: "studio_dashboard.calendar.posted",
  scheduled: "studio_dashboard.calendar.scheduled",
  draft: "studio_dashboard.calendar.draft",
};

export function ContentCalendarPreview() {
  const locale = useLocale();
  const l = norm(locale);

  const events = useMemo(() => generateCalendar(), []);
  const today = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          {t("studio_dashboard.calendar.title", l)}
        </h2>
        <Link
          href="/studio/scheduled"
          className="text-[10px] font-medium transition-colors"
          style={{ color: "var(--accent)" }}
        >
          {t("studio_dashboard.calendar.view_full", l)}
        </Link>
      </div>

      <div
        className="grid grid-cols-7 gap-1.5 p-3"
        style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        {events.map((event, i) => {
          const d = new Date(today);
          d.setDate(d.getDate() + i);
          const dayName = DAY_NAMES_FR[d.getDay()];
          const isToday = i === 0;

          return (
            <div
              key={i}
              className="min-h-[80px] p-1.5 flex flex-col"
              style={{
                backgroundColor: isToday ? "var(--accent-soft)" : "transparent",
                borderRadius: isToday ? "4px" : "0",
              }}
            >
              {/* Day header */}
              <div className="flex items-center gap-1 mb-1">
                <span
                  className="text-[9px] font-medium"
                  style={{ color: isToday ? "var(--accent)" : "var(--text-tertiary)" }}
                >
                  {dayName}
                </span>
                <span
                  className="text-[8px]"
                  style={{ color: isToday ? "var(--accent)" : "var(--text-tertiary)" }}
                >
                  {event.day}
                </span>
              </div>

              {/* Posts */}
              <div className="flex-1 space-y-0.5">
                {event.posts.map((post, pi) => (
                  <div
                    key={pi}
                    className="text-[7px] px-1 py-0.5 truncate rounded-sm"
                    style={{
                      backgroundColor: `${PLATFORM_COLORS[post.platform] || "var(--text-tertiary)"}15`,
                      color: "var(--text-secondary)",
                    }}
                    title={`${post.platform} · ${post.time}, ${t(STATUS_LABELS[post.status], l)}`}
                  >
                    {post.platform} {post.time}
                  </div>
                ))}
                {event.posts.length === 0 && (
                  <div className="text-[7px]" style={{ color: "var(--text-tertiary)" }}>
                    , 
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
