/* ─── Notifications — Types ─── */

export type NotifPriority = "urgent" | "important" | "info";

export type NotifCategory =
  | "message"
  | "churn"
  | "tone_guard"
  | "revenue"
  | "tos"
  | "application"
  | "contract"
  | "goal"
  | "trend"
  | "relaunch"
  | "daily_summary"
  | "template"
  | "update"
  | "tip";

export const PRIORITY_LABELS: Record<NotifPriority, string> = {
  urgent: "Urgente",
  important: "Importante",
  info: "Informative",
};

export const PRIORITY_ORDER: NotifPriority[] = ["urgent", "important", "info"];

export interface AppNotification {
  id: string;
  priority: NotifPriority;
  category: NotifCategory;
  title: string;
  message: string;
  timestamp: number; // epoch ms
  read: boolean;
  actionUrl?: string;
  actionable: boolean;
  metadata?: Record<string, unknown>;
}

export interface NotifChannels {
  urgent: ("in-app" | "email" | "push")[];
  important: ("in-app" | "email" | "push")[];
  info: ("in-app" | "email")[];
}

export interface QuietHours {
  enabled: boolean;
  start: string; // "HH:mm"
  end: string;
}

export interface Thresholds {
  churnScore: number; // default 60
}

export interface DailySummary {
  enabled: boolean;
  time: string; // "HH:mm"
}

export interface NotifSettings {
  enabled: boolean;
  channels: NotifChannels;
  quietHours: QuietHours;
  thresholds: Thresholds;
  dailySummary: DailySummary;
}

export const DEFAULT_NOTIF_SETTINGS: NotifSettings = {
  enabled: true,
  channels: {
    urgent: ["in-app", "email", "push"],
    important: ["in-app", "email"],
    info: ["in-app"],
  },
  quietHours: { enabled: false, start: "22:00", end: "08:00" },
  thresholds: { churnScore: 60 },
  dailySummary: { enabled: true, time: "08:00" },
};

export type NotifFilter = "all" | NotifPriority;
