"use client";

import { Bell, X, Settings, ChevronRight } from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { NotifList } from "./NotifList";
import { NotifSettings } from "./NotifSettings";
import { mockNotifications } from "@/lib/mock/notifications";
import type { AppNotification, NotifSettings as NotifSettingsType } from "@/lib/notifications/types";
import { DEFAULT_NOTIF_SETTINGS } from "@/lib/notifications/types";

/* ─── Hook: manage notification state ─── */

function useNotifState() {
  const [notifs, setNotifs] = useState<AppNotification[]>(mockNotifications);
  const [settings, setSettings] = useState<NotifSettingsType>(DEFAULT_NOTIF_SETTINGS);
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = useMemo(() => notifs.filter((n) => !n.read).length, [notifs]);
  const urgentCount = useMemo(() => notifs.filter((n) => n.priority === "urgent" && !n.read).length, [notifs]);

  const markRead = useCallback((id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const ignoreNotif = useCallback((id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const togglePanel = useCallback(() => {
    setOpen((v) => !v);
    setShowSettings(false);
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    setShowSettings(false);
  }, []);

  return {
    notifs,
    settings,
    setSettings,
    open,
    setOpen: togglePanel,
    closePanel,
    unreadCount,
    urgentCount,
    markRead,
    markAllRead,
    ignoreNotif,
    showSettings,
    setShowSettings,
  };
}

/* ─── Context to share state ─── */

let _globalState: ReturnType<typeof useNotifState> | null = null;

export function getNotifState() {
  return _globalState;
}

/* ─── Bell Button ─── */

export function NotifBell() {
  const state = useNotifState();
  _globalState = state;

  return (
    <>
      {/* Bell button */}
      <button
        onClick={state.setOpen}
        className="relative p-1.5 rounded-lg transition-colors"
        style={{ color: "var(--text-secondary)" }}
        title="Notifications"
      >
        <Bell size={16} />
        {state.unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center px-1 text-[9px] font-bold rounded-full"
            style={{
              backgroundColor: state.urgentCount > 0 ? "#EF4444" : "var(--accent)",
              color: "#fff",
            }}
          >
            {state.unreadCount > 9 ? "9+" : state.unreadCount}
          </span>
        )}
      </button>

      {/* Sliding panel */}
      <NotifPanel
        open={state.open}
        onClose={state.closePanel}
        notifs={state.notifs}
        onMarkRead={state.markRead}
        onMarkAllRead={state.markAllRead}
        onIgnore={state.ignoreNotif}
        showSettings={state.showSettings}
        onToggleSettings={() => state.setShowSettings((v: boolean) => !v)}
        settings={state.settings}
        onUpdateSettings={state.setSettings}
      />
    </>
  );
}

/* ─── Sliding Panel ─── */

function NotifPanel({
  open,
  onClose,
  notifs,
  onMarkRead,
  onMarkAllRead,
  onIgnore,
  showSettings,
  onToggleSettings,
  settings,
  onUpdateSettings,
}: {
  open: boolean;
  onClose: () => void;
  notifs: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onIgnore: (id: string) => void;
  showSettings: boolean;
  onToggleSettings: () => void;
  settings: NotifSettingsType;
  onUpdateSettings: (s: NotifSettingsType) => void;
}) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 transition-opacity"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[420px] z-50 flex flex-col transition-transform duration-300 ease-out"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderLeft: "1px solid var(--border-default)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          boxShadow: open ? "-8px 0 32px rgba(0,0,0,0.12)" : "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between shrink-0 px-4 py-3"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          <h2
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {showSettings ? "Paramètres" : "Notifications"}
          </h2>
          <div className="flex items-center gap-1">
            {!showSettings && (
              <button
                onClick={onToggleSettings}
                className="p-1.5 rounded-lg transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                <Settings size={14} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
              style={{ color: "var(--text-tertiary)" }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">
          {showSettings ? (
            <NotifSettings settings={settings} onChange={onUpdateSettings} />
          ) : (
            <NotifList
              notifications={notifs}
              onMarkRead={onMarkRead}
              onMarkAllRead={onMarkAllRead}
              onIgnore={onIgnore}
              onOpenSettings={onToggleSettings}
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="shrink-0 px-4 py-2.5"
          style={{ borderTop: "1px solid var(--border-default)" }}
        >
          <a
            href="/dashboard/notifications"
            className="flex items-center justify-between text-[11px] font-medium transition-colors"
            style={{ color: "var(--text-tertiary)" }}
            onClick={onClose}
          >
            Voir toutes les notifications
            <ChevronRight size={14} />
          </a>
        </div>
      </div>
    </>
  );
}
