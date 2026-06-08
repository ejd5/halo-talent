"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "../types";
import { PLATFORM_COLORS, STATUS_COLORS, STATUS_LABELS } from "../types";

const DAY_HEADERS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8h -> 20h

function getWeekDays(date: Date) {
  const start = new Date(date);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function WeekView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  const weekDays = useMemo(() => getWeekDays(currentDate), [currentDate]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const key = new Date(ev.scheduled_at).toDateString();
      const existing = map.get(key) ?? [];
      existing.push(ev);
      map.set(key, existing);
    }
    return map;
  }, [events]);

  const today = new Date();

  return (
    <div className="border border-[var(--color-border)] overflow-auto">
      {/* Header row */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-[var(--color-border)]">
        <div className="p-2" />
        {weekDays.map((d, i) => {
          const isToday =
            d.getDate() === today.getDate() &&
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
          return (
            <div key={i} className="px-2 py-2 text-center">
              <div className="text-[10px] font-semibold uppercase opacity-40">
                {DAY_HEADERS[i]}
              </div>
              <div
                className={`text-sm font-bold mt-0.5 ${
                  isToday
                    ? "bg-[var(--color-accent)] text-white w-7 h-7 flex items-center justify-center mx-auto"
                    : ""
                }`}
              >
                {d.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hour rows */}
      <div className="relative">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-[var(--color-border)]"
            style={{ minHeight: 56 }}
          >
            <div className="px-2 py-1 text-[10px] font-medium opacity-40">
              {hour.toString().padStart(2, "0")}h
            </div>
            {weekDays.map((d, di) => {
              const dayKey = d.toDateString();
              const dayEvents = eventsByDay.get(dayKey) ?? [];
              const hourEvents = dayEvents.filter((ev) => {
                const evHour = new Date(ev.scheduled_at).getHours();
                return evHour === hour;
              });
              return (
                <div key={di} className="px-0.5 py-0.5 relative border-r border-[var(--color-border)]">
                  {hourEvents.map((ev) => (
                    <button
                      key={ev.id}
                      onClick={() => onEventClick(ev)}
                      className="w-full text-left p-1 text-[10px] cursor-pointer transition-all hover:opacity-80 mb-0.5"
                      style={{
                        backgroundColor: `${PLATFORM_COLORS[ev.platform] ?? "#666"}15`,
                        borderLeft: `2px solid ${PLATFORM_COLORS[ev.platform] ?? "#666"}`,
                      }}
                    >
                      <div className="font-medium truncate text-[var(--color-text-primary)]">
                        {ev.content_preview}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="opacity-50">{ev.creator_name}</span>
                        <span style={{ color: STATUS_COLORS[ev.status] }}>
                          {STATUS_LABELS[ev.status]}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
