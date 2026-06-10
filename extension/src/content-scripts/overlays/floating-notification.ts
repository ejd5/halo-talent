// ─── Floating Notification System — Halo Companion ───────────
// Injects floating notifications in the top-right corner of platform pages.
// Shows important events: VIP online, fan at risk, PPV unopened, etc.
// Auto-dismisses after 8 seconds. Max 2 stacked at a time.
// CSS is fully isolated via Shadow DOM.

import { HaloElement, defineElement, injectHaloFixed } from "./shadow-dom";

export interface NotificationData {
  id: string;
  icon: "whale" | "risk" | "ppv" | "info";
  title: string;
  message: string;
  detailLine?: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

const TAG_NAME = "halo-notification";
let notificationSeq = 0;
const activeNotifications: HaloNotification[] = [];
const MAX_VISIBLE = 2;
const AUTO_DISMISS_MS = 8000;

const ICON_MAP: Record<string, string> = {
  whale: "🐋",
  risk: "🔴",
  ppv: "📦",
  info: "💡",
};

export function defineNotification(): void {
  defineElement(TAG_NAME, HaloNotification);
}

/** Show a notification. Returns the notification element. */
export function showNotification(data: Omit<NotificationData, "id">): HaloNotification {
  // Enforce max 2 visible
  while (activeNotifications.length >= MAX_VISIBLE) {
    const oldest = activeNotifications.shift();
    oldest?.dismiss(false);
  }

  const id = `halo-notif-${++notificationSeq}`;
  const el = injectHaloFixed(TAG_NAME) as HaloNotification;
  el.setData({ ...data, id });
  activeNotifications.push(el);

  // Auto-dismiss
  setTimeout(() => el.dismiss(true), AUTO_DISMISS_MS);

  return el;
}

/** Dismiss all active notifications */
export function dismissAll(): void {
  for (const n of [...activeNotifications]) {
    n.dismiss(false);
  }
}

export class HaloNotification extends HaloElement {
  private _data: NotificationData | null = null;
  private _dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  setData(data: NotificationData): void {
    this._data = data;
    this._render();
  }

  dismiss(animated: boolean): void {
    const idx = activeNotifications.indexOf(this);
    if (idx >= 0) activeNotifications.splice(idx, 1);

    if (this._dismissTimeout) {
      clearTimeout(this._dismissTimeout);
      this._dismissTimeout = null;
    }

    if (animated) {
      this.style.animation = "halo-fade-out 300ms ease forwards";
      setTimeout(() => this.remove(), 300);
    } else {
      this.remove();
    }
  }

  private _render(): void {
    const d = this._data;
    if (!d) return;

    const icon = ICON_MAP[d.icon] ?? ICON_MAP.info;

    this.render(/* html */ `
      <div class="halo-notification halo-animate-slide-down" role="alert">
        <div class="halo-p-3">
          <div class="halo-flex halo-items-start halo-gap-3">
            <span style="font-size:16px;line-height:1;">${icon}</span>
            <div class="halo-flex-1">
              <p class="halo-text-sm halo-font-semibold halo-text-primary halo-mb-1">${d.title}</p>
              <p class="halo-text-xs halo-text-secondary">${d.message}</p>
              ${d.detailLine ? `<p class="halo-text-xs halo-text-tertiary halo-mt-1 halo-font-mono">${d.detailLine}</p>` : ""}
              <div class="halo-flex halo-gap-2 halo-mt-2">
                ${d.primaryAction ? `
                  <button class="halo-btn halo-btn-accent halo-btn-sm js-primary">
                    ${d.primaryAction.label}
                  </button>
                ` : ""}
                ${d.secondaryAction ? `
                  <button class="halo-btn halo-btn-ghost halo-btn-sm js-secondary">
                    ${d.secondaryAction.label}
                  </button>
                ` : ""}
                <button class="halo-btn halo-btn-ghost halo-btn-sm js-dismiss">
                  Ignorer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `);

    this.on(".js-dismiss", "click", () => this.dismiss(true));
    if (d.primaryAction) {
      this.on(".js-primary", "click", () => {
        d.primaryAction!.onClick();
        this.dismiss(false);
      });
    }
    if (d.secondaryAction) {
      this.on(".js-secondary", "click", () => {
        d.secondaryAction!.onClick();
        this.dismiss(false);
      });
    }
  }
}
