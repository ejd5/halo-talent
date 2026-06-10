"use client";

import { useState, useMemo, useCallback } from "react";
import { Bell, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NotifCard } from "@/components/notifications/NotifCard";
import { NotifSettings } from "@/components/notifications/NotifSettings";
import { mockNotifications } from "@/lib/mock/notifications";
import type { AppNotification, NotifFilter, NotifSettings as NotifSettingsType } from "@/lib/notifications/types";
import { PRIORITY_LABELS, PRIORITY_ORDER, DEFAULT_NOTIF_SETTINGS } from "@/lib/notifications/types";

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<AppNotification[]>(mockNotifications);
  const [filter, setFilter] = useState<NotifFilter>("all");
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<NotifSettingsType>(DEFAULT_NOTIF_SETTINGS);

  const filtered = useMemo(() => {
    if (filter === "all") return notifs;
    return notifs.filter((n) => n.priority === filter);
  }, [notifs, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => b.timestamp - a.timestamp);
  }, [filtered]);

  const unreadCount = useMemo(() => notifs.filter((n) => !n.read).length, [notifs]);

  const markRead = useCallback((id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const ignoreNotif = useCallback((id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }, []);

  if (showSettings) {
    return (
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div
          className="flex items-center gap-3 px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          <button
            onClick={() => setShowSettings(false)}
            className="p-1 rounded-lg transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={16} />
          </button>
          <h1
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Paramètres de notification
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar max-w-xl mx-auto w-full">
          <NotifSettings settings={settings} onChange={setSettings} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between px-6 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1 rounded-lg transition-colors md:hidden"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1
              className="text-base font-semibold"
              style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
            >
              <Bell size={16} className="inline mr-2" />
              Toutes les notifications
            </h1>
            <p className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              {unreadCount} non lue{unreadCount !== 1 ? "s" : ""} · {notifs.length} total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded-lg transition-colors"
              style={{
                backgroundColor: "var(--accent-soft)",
                color: "var(--accent)",
              }}
            >
              <Check size={10} />
              Tout marquer comme lu
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="px-3 py-1.5 text-[10px] font-medium rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-default)",
            }}
          >
            Paramètres
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="flex items-center gap-1.5 px-6 py-2 shrink-0"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        {(["all", ...PRIORITY_ORDER] as const).map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all"
              style={{
                backgroundColor: active ? "var(--accent-soft)" : "transparent",
                color: active ? "var(--accent)" : "var(--text-tertiary)",
              }}
            >
              {f === "all" ? "Toutes" : PRIORITY_LABELS[f]}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-2xl mx-auto space-y-2">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-3xl mb-3" style={{ color: "var(--text-tertiary)" }}>🔔</div>
              <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
                Aucune notification
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
                Vous êtes à jour !
              </p>
            </div>
          ) : (
            sorted.map((notif) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                onMarkRead={markRead}
                onIgnore={ignoreNotif}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
