"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "../types";
import {
  PLATFORM_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  CONTENT_TYPE_LABELS,
} from "../types";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TimelineView({
  events,
  onEventClick,
}: {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = new Date(ev.scheduled_at).toDateString();
      const existing = map.get(key) ?? [];
      existing.push(ev);
      map.set(key, existing);
    }
    // Sort by date
    const sorted = [...map.entries()].sort(
      ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
    );
    // Sort events within each day by time
    for (const [, evts] of sorted) {
      evts.sort(
        (a, b) =>
          new Date(a.scheduled_at).getTime() -
          new Date(b.scheduled_at).getTime()
      );
    }
    return sorted;
  }, [events]);

  const today = new Date();

  if (events.length === 0) {
    return (
      <div className="border border-[var(--color-border)] p-12 text-center">
        <p className="text-sm opacity-40">Aucun événement trouvé</p>
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)] divide-y divide-[var(--color-border)]">
      {grouped.map(([dateKey, dayEvents]) => {
        const d = new Date(dateKey);
        const isToday =
          d.getDate() === today.getDate() &&
          d.getMonth() === today.getMonth() &&
          d.getFullYear() === today.getFullYear();

        return (
          <div key={dateKey}>
            {/* Date header */}
            <div
              className={`sticky top-0 z-10 px-4 py-2 text-xs font-semibold uppercase tracking-wider ${
                isToday
                  ? "text-[var(--color-accent)]"
                  : "opacity-50"
              }`}
              style={{
                backgroundColor: "var(--color-base)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {formatDate(dateKey)}
            </div>

            {/* Events */}
            {dayEvents.map((ev) => (
              <button
                key={ev.id}
                onClick={() => onEventClick(ev)}
                className="flex items-center gap-4 px-4 py-3 w-full text-left hover:bg-[var(--color-card)] transition-colors cursor-pointer border-b border-[var(--color-border)] last:border-b-0"
              >
                {/* Time */}
                <div className="w-14 shrink-0 text-[11px] font-medium opacity-50 tabular-nums">
                  {formatTime(ev.scheduled_at)}
                </div>

                {/* Platform indicator */}
                <div
                  className="w-1 h-8 rounded-full shrink-0"
                  style={{ backgroundColor: PLATFORM_COLORS[ev.platform] ?? "#666" }}
                />

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate text-[var(--color-text-primary)]">
                    {ev.content_preview}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] opacity-50">{ev.creator_name}</span>
                    <span className="text-[11px] opacity-30">·</span>
                    <span className="text-[11px] opacity-50">{ev.platform}</span>
                    <span className="text-[11px] opacity-30">·</span>
                    <span className="text-[11px] opacity-50">
                      {CONTENT_TYPE_LABELS[ev.content_type]}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                {ev.estimated_reach && (
                  <div className="hidden md:block text-right">
                    <div className="text-[10px] opacity-40">Reach</div>
                    <div className="text-[11px] font-medium">
                      {ev.estimated_reach.toLocaleString("fr-FR")}
                    </div>
                  </div>
                )}
                {ev.estimated_engagement && (
                  <div className="hidden md:block text-right">
                    <div className="text-[10px] opacity-40">Eng.</div>
                    <div className="text-[11px] font-medium">
                      {ev.estimated_engagement.toLocaleString("fr-FR")}
                    </div>
                  </div>
                )}

                {/* Status */}
                <span
                  className="text-[10px] font-medium px-2 py-0.5 shrink-0"
                  style={{
                    color: STATUS_COLORS[ev.status],
                    backgroundColor: `${STATUS_COLORS[ev.status]}15`,
                  }}
                >
                  {STATUS_LABELS[ev.status]}
                </span>
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
}
