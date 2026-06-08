"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "../types";
import { PLATFORM_COLORS, STATUS_COLORS, STATUS_LABELS, CONTENT_TYPE_LABELS } from "../types";

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6h -> 23h

export function DayView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  const dayEvents = useMemo(() => {
    const dateStr = currentDate.toDateString();
    return events.filter(
      (ev) => new Date(ev.scheduled_at).toDateString() === dateStr
    );
  }, [events, currentDate]);

  const eventsByHour = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const ev of dayEvents) {
      const hour = new Date(ev.scheduled_at).getHours();
      const existing = map.get(hour) ?? [];
      existing.push(ev);
      map.set(hour, existing);
    }
    return map;
  }, [dayEvents]);

  const today = new Date();
  const isToday =
    currentDate.getDate() === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const dateStr = currentDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="border border-[var(--color-border)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <h3
          className={`text-base font-semibold capitalize ${isToday ? "text-[var(--color-accent)]" : ""}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {dateStr}
        </h3>
      </div>

      {/* Timeline */}
      <div className="overflow-auto max-h-[calc(100vh-280px)]">
        {HOURS.map((hour) => {
          const hourEvents = eventsByHour.get(hour) ?? [];
          const isEmpty = hourEvents.length === 0;

          return (
            <div
              key={hour}
              className="flex border-b border-[var(--color-border)] min-h-[60px]"
            >
              <div className="w-16 shrink-0 px-3 py-2 text-[10px] font-medium opacity-40 border-r border-[var(--color-border)]">
                {hour.toString().padStart(2, "0")}h
              </div>
              <div className="flex-1 p-1">
                {isEmpty ? (
                  <div className="h-full min-h-[44px]" />
                ) : (
                  <div className="flex flex-col gap-1">
                    {hourEvents.map((ev) => {
                      const min = new Date(ev.scheduled_at).getMinutes();
                      return (
                        <button
                          key={ev.id}
                          onClick={() => onEventClick(ev)}
                          className="flex items-start gap-3 p-2 text-left w-full cursor-pointer transition-all hover:opacity-80"
                          style={{
                            backgroundColor: `${PLATFORM_COLORS[ev.platform] ?? "#666"}0C`,
                            borderLeft: `3px solid ${PLATFORM_COLORS[ev.platform] ?? "#666"}`,
                          }}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="text-[11px] font-medium opacity-60 w-8 shrink-0">
                              {min > 0 ? `${hour.toString().padStart(2, "0")}h${min.toString().padStart(2, "0")}` : ""}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium truncate text-[var(--color-text-primary)]">
                                {ev.content_preview}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] opacity-50">{ev.creator_name}</span>
                                <span className="text-[11px] opacity-30">·</span>
                                <span className="text-[11px] opacity-50">{ev.platform}</span>
                                <span className="text-[11px] opacity-30">·</span>
                                <span className="text-[11px] opacity-50">{CONTENT_TYPE_LABELS[ev.content_type]}</span>
                              </div>
                            </div>
                            <span
                              className="text-[10px] font-medium shrink-0"
                              style={{ color: STATUS_COLORS[ev.status] }}
                            >
                              {STATUS_LABELS[ev.status]}
                            </span>
                          </div>
                        </button>
                      );
                    })}
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
