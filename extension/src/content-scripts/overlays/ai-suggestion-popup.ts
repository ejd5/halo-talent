// ─── AI Suggestion Popup — Halo Companion ───────────
// Opens above the chat input when the creator clicks "Suggestion IA"
// in the assistance bar. Shows 3 AI-generated message drafts with
// Insert/Modify buttons. Regenerate fetches new suggestions.
// CSS is fully isolated via Shadow DOM.

import { HaloElement, defineElement } from "./shadow-dom";

export interface SuggestionData {
  id: string;
  text: string;
  tone: string;
}

const TAG_NAME = "halo-ai-suggestions";

export function defineAISuggestions(): void {
  defineElement(TAG_NAME, HaloAISuggestions);
}

export class HaloAISuggestions extends HaloElement {
  private _suggestions: SuggestionData[] = [];
  private _fanName = "";
  private _onInsert: ((text: string) => void) | null = null;
  private _onModify: ((text: string) => void) | null = null;
  private _onRegenerate: (() => void) | null = null;
  private _onOpenCopilot: (() => void) | null = null;
  private _editingId: string | null = null;

  configure(opts: {
    fanName: string;
    suggestions: SuggestionData[];
    onInsert: (text: string) => void;
    onModify: (text: string) => void;
    onRegenerate: () => void;
    onOpenCopilot: () => void;
  }): void {
    this._fanName = opts.fanName;
    this._suggestions = opts.suggestions;
    this._onInsert = opts.onInsert;
    this._onModify = opts.onModify;
    this._onRegenerate = opts.onRegenerate;
    this._onOpenCopilot = opts.onOpenCopilot;
    this._editingId = null;
    this._render();
  }

  setSuggestions(suggestions: SuggestionData[]): void {
    this._suggestions = suggestions;
    this._editingId = null;
    this._render();
  }

  private _render(): void {
    this.render(/* html */ `
      <div class="halo-popup halo-animate-slide-up halo-scroll"
        style="width:300px; max-height:400px; padding:10px;">
        <p class="halo-text-xs halo-text-secondary halo-mb-2">
          ✨ Suggestions pour <span class="halo-text-primary halo-font-semibold">${this._fanName}</span>
        </p>
        <div class="halo-flex halo-flex-col halo-gap-2">
          ${this._suggestions.map((s) => this._renderCard(s)).join("")}
        </div>
        <div class="halo-flex halo-gap-2 halo-mt-3">
          <button class="halo-btn halo-btn-ghost halo-btn-sm js-regenerate">
            🔄 Régénérer
          </button>
          <button class="halo-btn halo-btn-accent halo-btn-sm js-open-copilot" style="margin-left:auto;">
            Ouvrir le Chat Copilot ↗
          </button>
        </div>
      </div>
    `);

    this._bindEvents();
  }

  private _renderCard(s: SuggestionData): string {
    const isEditing = this._editingId === s.id;
    return /* html */ `
      <div class="halo-suggestion-card" data-id="${s.id}">
        ${isEditing ? `
          <textarea class="halo-input js-edit-textarea halo-mb-2" rows="3"
            style="resize:none; font-size:10px;">${s.text}</textarea>
          <div class="halo-flex halo-gap-2">
            <button class="halo-btn halo-btn-accent halo-btn-sm js-save-edit">Enregistrer</button>
            <button class="halo-btn halo-btn-ghost halo-btn-sm js-cancel-edit">Annuler</button>
          </div>
        ` : `
          <p class="halo-text-xs halo-text-secondary halo-leading-relaxed halo-mb-2">${s.text}</p>
          <div class="halo-flex halo-items-center halo-justify-between">
            <span class="halo-pill halo-pill-accent">${s.tone}</span>
            <div class="halo-flex halo-gap-1">
              <button class="halo-btn halo-btn-accent halo-btn-sm js-insert" data-id="${s.id}">
                Insérer ↵
              </button>
              <button class="halo-btn halo-btn-ghost halo-btn-sm js-modify" data-id="${s.id}">
                Modifier ✏️
              </button>
            </div>
          </div>
        `}
      </div>
    `;
  }

  private _bindEvents(): void {
    // Insert button
    this.shadow.querySelectorAll(".js-insert").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = (btn as HTMLElement).dataset.id;
        const s = this._suggestions.find((x) => x.id === id);
        if (s) this._onInsert?.(s.text);
      });
    });

    // Modify button
    this.shadow.querySelectorAll(".js-modify").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = (btn as HTMLElement).dataset.id;
        if (id) { this._editingId = id; this._render(); }
      });
    });

    // Cancel edit
    this.shadow.querySelectorAll(".js-cancel-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        this._editingId = null;
        this._render();
      });
    });

    // Save edit
    this.shadow.querySelectorAll(".js-save-edit").forEach((btn) => {
      btn.addEventListener("click", () => {
        const textarea = this.shadow.querySelector(".js-edit-textarea") as HTMLTextAreaElement;
        if (textarea) {
          this._onModify?.(textarea.value);
          this._editingId = null;
          this._render();
        }
      });
    });

    // Regenerate
    this.on(".js-regenerate", "click", () => this._onRegenerate?.());

    // Open Copilot
    this.on(".js-open-copilot", "click", () => this._onOpenCopilot?.());
  }
}
