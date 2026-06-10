"use client";

import { useState, useMemo } from "react";
import { NotifCard } from "./NotifCard";
import type { AppNotification, NotifFilter } from "@/lib/notifications/types";
import { PRIORITY_LABELS, PRIORITY_ORDER } from "@/lib/notifications/types";
import { Check, SlidersHorizontal } from "lucide-react";

export function NotifList({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onIgnore,
  onOpenSettings,
}: {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onIgnore: (id: string) => void;
  onOpenSettings: () => void;
}) {
  const [filter, setFilter] = useState<NotifFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n) => n.priority === filter);
  }, [notifications, filter]);

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="flex flex-col h-full">
      {/* Filter tabs */}
      <div className="flex items-center gap-1.5 px-4 py-2 shrink-0">
        <div className="flex gap-1 flex-1 flex-wrap">
          {(["all", ...PRIORITY_ORDER] as const).map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-2.5 py-1.5 min-h-[36px] text-[10px] font-medium rounded-lg transition-all"
                style={{
                  backgroundColor: active ? "var(--accent-soft)" : "transparent",
                  color: active ? "var(--accent)" : "var(--text-tertiary)",
                }}
              >
                {f === "all" ? "Tout" : PRIORITY_LABELS[f]}
              </button>
            );
          })}
        </div>
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--text-tertiary)" }}
          title="Paramètres"
        >
          <SlidersHorizontal size={14} />
        </button>
      </div>

      {/* Count + mark all read */}
      <div className="flex items-center justify-between px-4 py-1 shrink-0">
        <span
          className="text-[10px] font-medium"
          style={{ color: "var(--text-tertiary)" }}
        >
          {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
        </span>
        {hasUnread && (
          <button
            onClick={onMarkAllRead}
            className="flex items-center gap-1 text-[10px] font-medium transition-colors"
            style={{ color: "var(--accent)" }}
          >
            <Check size={10} />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-1.5">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div
              className="text-2xl mb-2 opacity-50"
              style={{ color: "var(--text-tertiary)" }}
            >
              🔔
            </div>
            <p
              className="text-xs font-medium"
              style={{ color: "var(--text-tertiary)" }}
            >
              Aucune notification
            </p>
          </div>
        ) : (
          filtered
            .sort((a, b) => b.timestamp - a.timestamp)
            .map((notif) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                onMarkRead={onMarkRead}
                onIgnore={onIgnore}
              />
            ))
        )}
      </div>
    </div>
  );
}
