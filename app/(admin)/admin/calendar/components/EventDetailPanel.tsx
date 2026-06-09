"use client";

import { X, Calendar, User, Globe, BarChart3, Clock, Edit3, Trash2, Send } from "lucide-react";
import type { CalendarEvent } from "../types";
import {
  PLATFORM_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  CONTENT_TYPE_LABELS,
  CONTENT_TYPE_ICONS,
} from "../types";
import { calendarEvents } from "../data";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventDetailPanel({
  eventId,
  onClose,
  onStatusChange,
}: {
  eventId: string | null;
  onClose: () => void;
  onStatusChange: (id: string, status: CalendarEvent["status"]) => void;
}) {
  const event = eventId ? calendarEvents.find((e) => e.id === eventId) ?? null : null;

  if (!event) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 z-50 h-full w-[600px] border-l border-[var(--color-border)] overflow-y-auto card-accent"
        style={{ backgroundColor: "var(--color-base)" }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]"
          style={{ backgroundColor: "var(--color-base)" }}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{CONTENT_TYPE_ICONS[event.content_type]}</span>
            <div>
              <h2 className="text-sm font-semibold">{event.content_preview}</h2>
              <span className="text-[11px] opacity-50">{event.id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--color-card)] transition-colors rounded-[0px]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status + actions */}
          <div className="flex items-center justify-between">
            <span
              className="text-xs font-medium px-3 py-1"
              style={{
                color: STATUS_COLORS[event.status],
                backgroundColor: `${STATUS_COLORS[event.status]}15`,
              }}
            >
              {STATUS_LABELS[event.status]}
            </span>
            <div className="flex items-center gap-2">
              {event.status === "planned" && (
                <button
                  onClick={() => onStatusChange(event.id, "published")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity rounded-[0px]"
                >
                  <Send size={12} />
                  Marquer publié
                </button>
              )}
              {event.status === "published" && (
                <button
                  onClick={() => onStatusChange(event.id, "planned")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors rounded-[0px]"
                >
                  <Edit3 size={12} />
                  Réouvrir
                </button>
              )}
              <button className="p-1.5 border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors rounded-[0px]">
                <Trash2 size={14} className="opacity-50" />
              </button>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4">
            <Field icon={<User size={14} />} label="Créateur" value={event.creator_name} />
            <Field
              icon={<Globe size={14} />}
              label="Plateforme"
              value={
                <span className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: PLATFORM_COLORS[event.platform] ?? "#666" }}
                  />
                  {event.platform}
                </span>
              }
            />
            <Field
              icon={<Calendar size={14} />}
              label="Type"
              value={CONTENT_TYPE_LABELS[event.content_type]}
            />
            <Field
              icon={<Clock size={14} />}
              label="Programmé le"
              value={formatDateTime(event.scheduled_at)}
            />
            {event.estimated_reach && (
              <Field
                icon={<BarChart3 size={14} />}
                label="Portée estimée"
                value={event.estimated_reach.toLocaleString("fr-FR")}
              />
            )}
            {event.estimated_engagement && (
              <Field
                icon={<BarChart3 size={14} />}
                label="Engagement estimé"
                value={event.estimated_engagement.toLocaleString("fr-FR")}
              />
            )}
          </div>

          {/* Caption */}
          {event.caption && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5">
                Légende
              </h4>
              <p className="text-sm opacity-80">{event.caption}</p>
            </div>
          )}

          {/* Hashtags */}
          {event.hashtags.length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-1.5">
                Hashtags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {event.hashtags.map((h) => (
                  <span
                    key={h}
                    className="text-xs px-2 py-0.5 border border-[var(--color-border)] opacity-70"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Creator's other events */}
          <OtherEvents currentEvent={event} />
        </div>
      </div>
    </>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 opacity-40">{icon}</span>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider opacity-40">
          {label}
        </div>
        <div className="text-sm font-medium mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function OtherEvents({ currentEvent }: { currentEvent: CalendarEvent }) {
  const others = calendarEvents.filter(
    (ev) =>
      ev.creator_id === currentEvent.creator_id && ev.id !== currentEvent.id
  );

  if (others.length === 0) return null;

  return (
    <div>
      <h4 className="text-[10px] font-semibold uppercase tracking-wider opacity-50 mb-2">
        Autres posts de {currentEvent.creator_name}
      </h4>
      <div className="space-y-1">
        {others.slice(0, 5).map((ev) => (
          <div
            key={ev.id}
            className="flex items-center gap-2 px-2 py-1.5 text-xs border border-[var(--color-border)]"
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: PLATFORM_COLORS[ev.platform] }}
            />
            <span className="truncate flex-1">{ev.content_preview}</span>
            <span
              className="shrink-0"
              style={{ color: STATUS_COLORS[ev.status] }}
            >
              {STATUS_LABELS[ev.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
