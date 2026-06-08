"use client";

import type { CalendarEvent } from "../types";
import { PLATFORM_COLORS, STATUS_COLORS, STATUS_LABELS } from "../types";

export function CalendarCard({
  event,
  compact = false,
  onClick,
}: {
  event: CalendarEvent;
  compact?: boolean;
  onClick?: () => void;
}) {
  const time = new Date(event.scheduled_at).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const platformColor = PLATFORM_COLORS[event.platform] ?? "#666";

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-[0px] p-1.5 border cursor-pointer transition-all hover:opacity-80 group"
      style={{
        backgroundColor: `${platformColor}0C`,
        borderLeftColor: platformColor,
        borderLeftWidth: 3,
        border: `1px solid ${platformColor}22`,
        borderLeft: `3px solid ${platformColor}`,
      }}
    >
      <div className="flex items-start gap-1.5">
        {!compact && (
          <span
            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
            style={{ backgroundColor: STATUS_COLORS[event.status] }}
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {!compact && (
              <span className="text-[10px] font-medium opacity-70">{time}</span>
            )}
            {compact && (
              <span className="text-[9px] font-medium opacity-60">{time}</span>
            )}
            {compact && (
              <span
                className="text-[8px] px-1 py-[1px] font-medium"
                style={{ color: STATUS_COLORS[event.status] }}
              >
                {STATUS_LABELS[event.status]}
              </span>
            )}
          </div>
          <p
            className={`font-medium leading-tight text-[var(--color-text-primary)] ${
              compact ? "text-[10px]" : "text-[11px]"
            }`}
            style={{
              display: "-webkit-box",
              WebkitLineClamp: compact ? 1 : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {event.content_preview}
          </p>
          {!compact && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[9px] opacity-50">{event.creator_name}</span>
              <span className="text-[9px] opacity-50">·</span>
              <span
                className="text-[9px] font-medium"
                style={{ color: STATUS_COLORS[event.status] }}
              >
                {STATUS_LABELS[event.status]}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
