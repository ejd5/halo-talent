// ─── Assistance Bar Overlay — Halo Companion ───────────
// Injects a thin toolbar (32px) below the chat input area.
// Contains: AI Suggestion, Scripts, Vault, Translate, Tone Guard.
// Each button opens an inline popup directly below the bar.
// CSS is fully isolated via Shadow DOM.

import { HaloElement, defineElement } from "./shadow-dom";
import { defineAISuggestions, type SuggestionData } from "./ai-suggestion-popup";

const TAG_NAME = "halo-assistance-bar";

interface ScriptItem {
  id: string;
  title: string;
  content: string;
  category: string;
}

interface VaultItem {
  id: string;
  title: string;
  type: "image" | "video";
  sentToFan: boolean;
  purchased: boolean;
  price?: number;
}

export function defineAssistanceBar(): void {
  defineAISuggestions(); // dependency
  defineElement(TAG_NAME, HaloAssistanceBar);
}

export class HaloAssistanceBar extends HaloElement {
  private _fanName = "";
  private _toneOk = true;
  private _activePopup: "ai" | "scripts" | "vault" | "translate" | null = null;

  // Data sources — set by overlay manager
  private _scripts: ScriptItem[] = [];
  private _vaultItems: VaultItem[] = [];
  private _suggestions: SuggestionData[] = [];
  private _onInsertText: ((text: string) => void) | null = null;
  private _onOpenSidepanel: (() => void) | null = null;
  private _translatedText = "";

  configure(opts: {
    fanName: string;
    scripts?: ScriptItem[];
    vaultItems?: VaultItem[];
    suggestions?: SuggestionData[];
    toneOk?: boolean;
    onInsertText: (text: string) => void;
    onOpenSidepanel: () => void;
  }): void {
    this._fanName = opts.fanName;
    this._scripts = opts.scripts ?? [];
    this._vaultItems = opts.vaultItems ?? [];
    this._suggestions = opts.suggestions ?? [];
    this._toneOk = opts.toneOk ?? true;
    this._onInsertText = opts.onInsertText;
    this._onOpenSidepanel = opts.onOpenSidepanel;
    this._render();
  }

  setToneGuard(ok: boolean): void {
    this._toneOk = ok;
    const badge = this.$(".js-tone-badge");
    if (badge) {
      badge.className = ok
        ? "halo-pill halo-pill-success"
        : "halo-pill halo-pill-warning";
      badge.textContent = ok ? "🛡️ Tone Guard ✅" : "🛡️ Tone Guard ⚠️";
    }
  }

  private _render(): void {
    const toneClass = this._toneOk ? "halo-pill-success" : "halo-pill-warning";
    const toneText = this._toneOk ? "🛡️ Tone Guard ✅" : "🛡️ Tone Guard ⚠️";

    this.render(/* html */ `
      <div style="position:relative;" class="halo-animate-slide-up">
        <div class="halo-assistance-bar">
          <button class="halo-btn halo-btn-accent halo-btn-sm js-btn-ai">
            ✨ Suggestion IA
          </button>
          <button class="halo-btn halo-btn-ghost halo-btn-sm js-btn-scripts">
            📝 Scripts
          </button>
          <button class="halo-btn halo-btn-ghost halo-btn-sm js-btn-vault">
            🔍 Vault
          </button>
          <button class="halo-btn halo-btn-ghost halo-btn-sm js-btn-translate">
            🌐 Traduire
          </button>
          <div style="margin-left:auto;">
            <span class="halo-pill ${toneClass} js-tone-badge"
              style="cursor:default;">${toneText}</span>
          </div>
        </div>
        <div class="js-popup-container"></div>
      </div>
    `);

    this._bindBarButtons();
  }

  private _bindBarButtons(): void {
    this.on(".js-btn-ai", "click", () => this._togglePopup("ai"));
    this.on(".js-btn-scripts", "click", () => this._togglePopup("scripts"));
    this.on(".js-btn-vault", "click", () => this._togglePopup("vault"));
    this.on(".js-btn-translate", "click", () => this._togglePopup("translate"));
  }

  private _togglePopup(type: typeof this._activePopup): void {
    if (this._activePopup === type) {
      this._closePopup();
      return;
    }
    this._activePopup = type;
    this._renderPopup();
  }

  private _closePopup(): void {
    this._activePopup = null;
    const container = this.$(".js-popup-container");
    if (container) container.innerHTML = "";
  }

  private _renderPopup(): void {
    const container = this.$(".js-popup-container");
    if (!container) return;

    switch (this._activePopup) {
      case "ai":
        container.innerHTML = this._renderAIPopup();
        this._bindAIPopup();
        break;
      case "scripts":
        container.innerHTML = this._renderScriptsPopup();
        this._bindScriptsPopup();
        break;
      case "vault":
        container.innerHTML = this._renderVaultPopup();
        break;
      case "translate":
        container.innerHTML = this._renderTranslatePopup();
        break;
    }
  }

  // ── AI Popup ─────────────────────────────────────

  private _renderAIPopup(): string {
    if (this._suggestions.length === 0) {
      return /* html */ `
        <div class="halo-popup" style="width:280px;padding:10px;">
          <p class="halo-text-xs halo-text-center halo-text-tertiary halo-py-2">
            Chargement des suggestions...
          </p>
        </div>`;
    }
    return /* html */ `
      <div class="halo-popup halo-scroll" style="width:300px;max-height:360px;padding:10px;">
        <p class="halo-text-xs halo-text-secondary halo-mb-2">
          ✨ Suggestions pour <span class="halo-text-primary halo-font-semibold">${this._fanName}</span>
        </p>
        <div class="halo-flex halo-flex-col halo-gap-2">
          ${this._suggestions.map((s) => /* html */ `
            <div class="halo-suggestion-card">
              <p class="halo-text-xs halo-text-secondary halo-leading-relaxed halo-mb-2">${s.text}</p>
              <div class="halo-flex halo-items-center halo-justify-between">
                <span class="halo-pill halo-pill-accent">${s.tone}</span>
                <button class="halo-btn halo-btn-accent halo-btn-sm js-insert-suggestion" data-text="${this._escapeAttr(s.text)}">
                  Insérer ↵
                </button>
              </div>
            </div>
          `).join("")}
        </div>
        <button class="halo-btn halo-btn-ghost halo-btn-sm js-regenerate halo-mt-2" style="width:100%;">
          🔄 Régénérer
        </button>
      </div>`;
  }

  private _bindAIPopup(): void {
    this.shadow.querySelectorAll(".js-insert-suggestion").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = (btn as HTMLElement).dataset.text;
        if (text) {
          this._onInsertText?.(text);
          this._closePopup();
        }
      });
    });
    this.on(".js-regenerate", "click", () => {
      // Trigger regenerate via overlay manager callback
      this.dispatchEvent(new CustomEvent("halo-regenerate-suggestions", { bubbles: true, composed: true }));
    });
  }

  // ── Scripts Popup ────────────────────────────────

  private _renderScriptsPopup(): string {
    if (this._scripts.length === 0) {
      return /* html */ `
        <div class="halo-popup" style="width:260px;padding:10px;">
          <p class="halo-text-xs halo-text-center halo-text-tertiary halo-py-2">
            Aucun script disponible
          </p>
        </div>`;
    }
    return /* html */ `
      <div class="halo-popup halo-scroll" style="width:280px;max-height:320px;padding:10px;">
        <p class="halo-text-xs halo-text-secondary halo-mb-2">📝 Scripts les plus utilisés</p>
        <div class="halo-flex halo-flex-col halo-gap-2">
          ${this._scripts.map((s) => /* html */ `
            <div class="halo-suggestion-card">
              <p class="halo-text-xs halo-font-semibold halo-text-primary halo-mb-1">${s.title}</p>
              <p class="halo-text-xs halo-text-tertiary halo-leading-relaxed halo-mb-2 halo-truncate"
                style="max-width:240px;">${s.content.replace(/\{fan_name\}/g, this._fanName)}</p>
              <button class="halo-btn halo-btn-accent halo-btn-sm js-insert-script"
                data-content="${this._escapeAttr(s.content)}">
                Insérer ↵
              </button>
            </div>
          `).join("")}
        </div>
        <button class="halo-btn halo-btn-ghost halo-btn-sm js-open-scripts halo-mt-2" style="width:100%;">
          📝 Tous les scripts →
        </button>
      </div>`;
  }

  private _bindScriptsPopup(): void {
    this.shadow.querySelectorAll(".js-insert-script").forEach((btn) => {
      btn.addEventListener("click", () => {
        const content = (btn as HTMLElement).dataset.content;
        if (content) {
          const text = content.replace(/\{fan_name\}/g, this._fanName);
          this._onInsertText?.(text);
          this._closePopup();
        }
      });
    });
    this.on(".js-open-scripts", "click", () => {
      this._onOpenSidepanel?.();
      this._closePopup();
    });
  }

  // ── Vault Popup ──────────────────────────────────

  private _renderVaultPopup(): string {
    const unsent = this._vaultItems.filter((v) => !v.sentToFan);
    if (unsent.length === 0) {
      return /* html */ `
        <div class="halo-popup" style="width:260px;padding:10px;">
          <p class="halo-text-xs halo-text-center halo-text-tertiary halo-py-2">
            Aucun contenu non envoyé
          </p>
        </div>`;
    }
    return /* html */ `
      <div class="halo-popup halo-scroll" style="width:280px;max-height:320px;padding:10px;">
        <p class="halo-text-xs halo-text-secondary halo-mb-2">🔍 Contenus non envoyés à ${this._fanName}</p>
        <div class="halo-flex halo-flex-col halo-gap-2">
          ${unsent.map((v) => /* html */ `
            <div class="halo-suggestion-card halo-flex halo-items-center halo-gap-2">
              <span style="font-size:18px;">${v.type === "video" ? "🎬" : "🖼️"}</span>
              <div class="halo-flex-1">
                <p class="halo-text-xs halo-font-medium halo-text-primary halo-truncate" style="max-width:160px;">${v.title}</p>
                ${v.price ? `<p class="halo-text-xs halo-text-accent halo-font-mono">~${v.price}€ suggéré</p>` : ""}
              </div>
              <button class="halo-btn halo-btn-accent halo-btn-sm js-send-ppv" data-title="${v.title}">
                Envoyer
              </button>
            </div>
          `).join("")}
        </div>
        <button class="halo-btn halo-btn-ghost halo-btn-sm js-open-vault halo-mt-2" style="width:100%;">
          🔍 Ouvrir le Vault →
        </button>
      </div>`;
  }

  // ── Translate Popup ──────────────────────────────

  private _renderTranslatePopup(): string {
    return /* html */ `
      <div class="halo-popup" style="width:280px;padding:10px;">
        <p class="halo-text-xs halo-text-secondary halo-mb-2">🌐 Traduction du dernier message</p>
        <p class="halo-text-xs halo-text-tertiary halo-mb-2">
          ${this._translatedText || "Cliquez sur Traduire pour détecter la langue et traduire le dernier message du fan."}
        </p>
        <button class="halo-btn halo-btn-accent halo-btn-sm js-translate-msg" style="width:100%;">
          🌐 Traduire
        </button>
      </div>`;
  }

  // ── Helpers ──────────────────────────────────────

  private _escapeAttr(s: string): string {
    return s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}
