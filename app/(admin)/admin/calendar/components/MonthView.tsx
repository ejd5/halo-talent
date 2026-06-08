"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "../types";
import { CalendarCard } from "./CalendarCard";

const DAY_HEADERS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function getMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startDay = (first.getDay() + 6) % 7; // Monday=0
  const daysInMonth = last.getDate();
  const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;

  return Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return dayNum;
  });
}

export function MonthView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<number, CalendarEvent[]>();
    for (const ev of events) {
      const day = new Date(ev.scheduled_at).getDate();
      const existing = map.get(day) ?? [];
      existing.push(ev);
      map.set(day, existing);
    }
    return map;
  }, [events]);

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  return (
    <div className="border border-[var(--color-border)]">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
        {DAY_HEADERS.map((d) => (
          <div
            key={d}
            className="px-2 py-2 text-[10px] font-semibold uppercase tracking-wider opacity-40 text-center"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid cells */}
      <div className="grid grid-cols-7">
        {grid.map((dayNum, i) => {
          const dayEvents = dayNum ? eventsByDay.get(dayNum) ?? [] : [];
          const isToday =
            dayNum === todayDate && month === todayMonth && year === todayYear;
          const isCurrentMonth = dayNum !== null;

          return (
            <div
              key={i}
              className={`min-h-[110px] border-b border-r border-[var(--color-border)] p-1 ${
                !isCurrentMonth ? "opacity-20" : ""
              }`}
            >
              {dayNum && (
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[11px] font-medium ${
                      isToday
                        ? "bg-[var(--color-accent)] text-white w-5 h-5 flex items-center justify-center"
                        : "opacity-50"
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayEvents.length > 3 && (
                    <span className="text-[9px] opacity-40">
                      +{dayEvents.length - 3}
                    </span>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-0.5">
                {dayEvents.slice(0, 3).map((ev) => (
                  <CalendarCard
                    key={ev.id}
                    event={ev}
                    compact
                    onClick={() => onEventClick(ev)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
