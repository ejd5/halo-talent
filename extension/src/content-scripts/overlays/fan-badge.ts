// ─── Fan Badge Overlay — Halo Companion ───────────
// Injects a pill-shaped badge next to the fan's name in chat.
// Shows persona tier (VIP/Regular/At-Risk) with spending data.
// On hover: tooltip with LTV, last activity, "Voir dans Halo" button.
// CSS is fully isolated via Shadow DOM.

import { HaloElement, defineElement } from "./shadow-dom";

type PersonaTier = "vip" | "loyal" | "regular" | "new" | "at_risk";

export interface FanBadgeData {
  persona: PersonaTier;
  personaLabel: string;
  ltv: number;
  lastActivity: string;
  fanId: string;
  fanUrl: string;
}

const TIER_CONFIG: Record<PersonaTier, { color: string; dot: string; label: string }> = {
  vip: { color: "var(--halo-success)", dot: "halo-dot-success", label: "VIP" },
  loyal: { color: "var(--halo-info)", dot: "halo-dot-info", label: "Loyal" },
  regular: { color: "var(--halo-text-tertiary)", dot: "", label: "Regular" },
  new: { color: "var(--halo-warning)", dot: "halo-dot-warning", label: "Nouveau" },
  at_risk: { color: "var(--halo-danger)", dot: "halo-dot-danger", label: "À risque" },
};

const TAG_NAME = "halo-fan-badge";

export function defineFanBadge(): void {
  defineElement(TAG_NAME, HaloFanBadge);
}

export class HaloFanBadge extends HaloElement {
  private _data: FanBadgeData | null = null;

  setData(data: FanBadgeData): void {
    this._data = data;
    this._render();
  }

  private _render(): void {
    const d = this._data;
    if (!d) {
      this.render("");
      return;
    }

    const cfg = TIER_CONFIG[d.persona];
    const dotHtml = cfg.dot ? `<span class="halo-dot ${cfg.dot}"></span>` : "";
    const ltvFormatted = d.ltv > 0 ? ` · ${d.ltv}€` : "";

    this.render(/* html */ `
      <span class="halo-pill"
        style="color:${cfg.color}; cursor:pointer; position:relative;"
        data-persona="${d.persona}">
        ${dotHtml}
        ${cfg.label}${ltvFormatted}
        <div class="halo-tooltip">
          <div class="halo-flex halo-flex-col halo-gap-1">
            <div class="halo-flex halo-items-center halo-justify-between">
              <span class="halo-text-xs halo-text-tertiary">LTV</span>
              <span class="halo-text-sm halo-font-semibold halo-text-primary halo-font-mono">${d.ltv}€</span>
            </div>
            <div class="halo-flex halo-items-center halo-justify-between">
              <span class="halo-text-xs halo-text-tertiary">Dernière activité</span>
              <span class="halo-text-xs halo-text-secondary">${d.lastActivity}</span>
            </div>
            <hr class="halo-divider" />
            <a class="halo-link halo-text-xs"
              href="${d.fanUrl}"
              target="_blank"
              rel="noopener noreferrer">
              Voir dans Halo ↗
            </a>
          </div>
        </div>
      </span>
    `);

    this._bindTooltip();
  }

  private _bindTooltip(): void {
    const pill = this.$(".halo-pill");
    const tooltip = this.$(".halo-tooltip");
    if (!pill || !tooltip) return;

    pill.addEventListener("mouseenter", () => {
      tooltip.classList.add("visible");
    });

    pill.addEventListener("mouseleave", () => {
      tooltip.classList.remove("visible");
    });
  }
}
