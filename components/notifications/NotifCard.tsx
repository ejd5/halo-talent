"use client";

import {
  MessageCircle, AlertTriangle, Shield, TrendingUp, FileText,
  UserPlus, FileSignature, Target, Send, BarChart3,
  Layout, RefreshCw, Gift, Check, EyeOff, ExternalLink,
} from "lucide-react";
import type { AppNotification } from "@/lib/notifications/types";

/* ─── Category icon ─── */

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  message: MessageCircle,
  churn: AlertTriangle,
  tone_guard: Shield,
  revenue: TrendingUp,
  tos: FileText,
  application: UserPlus,
  contract: FileSignature,
  goal: Target,
  trend: TrendingUp,
  relaunch: Send,
  daily_summary: BarChart3,
  template: Layout,
  update: RefreshCw,
  tip: Gift,
};

/* ─── Priority styles ─── */

const PRIORITY_STYLES: Record<string, { bg: string; border: string; dot: string; label: string }> = {
  urgent: {
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.2)",
    dot: "#EF4444",
    label: "Urgente",
  },
  important: {
    bg: "rgba(245,158,11,0.06)",
    border: "rgba(245,158,11,0.2)",
    dot: "#F59E0B",
    label: "Importante",
  },
  info: {
    bg: "transparent",
    border: "var(--border-default)",
    dot: "#6B7280",
    label: "Info",
  },
};

/* ─── Date formatting ─── */

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const time = `${hh}:${mm}`;

  if (diffDays === 0) return time;
  if (diffDays === 1) return `Hier ${time}`;

  const months = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

/* ─── Component ─── */

export function NotifCard({
  notif,
  onMarkRead,
  onIgnore,
}: {
  notif: AppNotification;
  onMarkRead: (id: string) => void;
  onIgnore: (id: string) => void;
}) {
  const Icon = CATEGORY_ICONS[notif.category] ?? Bell;
  const style = PRIORITY_STYLES[notif.priority];

  return (
    <div
      className="relative rounded-xl p-3.5 transition-colors"
      style={{
        backgroundColor: notif.read ? "transparent" : style.bg,
        border: `1px solid ${notif.read ? "var(--border-default)" : style.border}`,
        opacity: notif.read ? 0.7 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className="relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            backgroundColor: notif.priority === "urgent" ? "rgba(239,68,68,0.1)" : "var(--bg-surface)",
          }}
        >
          <Icon
            size={14}
            style={{ color: notif.priority === "urgent" ? "#EF4444" : "var(--text-secondary)" }}
          />
          {/* Pulsating dot for unread urgent */}
          {notif.priority === "urgent" && !notif.read && (
            <span
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: "#EF4444" }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p
              className="text-[11px] font-semibold truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {notif.title}
            </p>
            <span
              className="text-[9px] shrink-0"
              style={{ color: "var(--text-tertiary)" }}
            >
              {formatTime(notif.timestamp)}
            </span>
          </div>
          <p
            className="text-[10px] leading-relaxed line-clamp-2 mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {notif.message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {notif.actionUrl && (
              <a
                href={notif.actionUrl}
                className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent)",
                }}
              >
                <ExternalLink size={10} />
                Ouvrir
              </a>
            )}
            {notif.actionable && !notif.read && (
              <button
                onClick={() => onMarkRead(notif.id)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-medium rounded-lg transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                <Check size={10} />
                Lu
              </button>
            )}
            {notif.actionable && !notif.read && (
              <button
                onClick={() => onIgnore(notif.id)}
                className="inline-flex items-center gap-1 px-2 py-1 text-[9px] font-medium rounded-lg transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                <EyeOff size={10} />
                Ignorer
              </button>
            )}
          </div>
        </div>

        {/* Priority indicator */}
        <div
          className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
          style={{ backgroundColor: style.dot }}
        />
      </div>
    </div>
  );
}

function Bell(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
