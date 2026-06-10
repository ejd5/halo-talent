// ─── Shadow DOM Base — Halo Companion ───────────
// Base class for all overlays. Creates a custom element with an open
// shadow root and injected Halo Palette B styles. CSS is fully isolated
// from the host platform page.

import { HALO_STYLES } from "./styles";

/**
 * Base class for Halo overlay custom elements.
 * Every overlay inherits from this to get Shadow DOM CSS isolation.
 *
 * Usage:
 *   class HaloFanBadge extends HaloElement {
 *     connectedCallback() {
 *       this.render(`<div class="halo-pill">VIP</div>`);
 *     }
 *   }
 *   customElements.define("halo-fan-badge", HaloFanBadge);
 */
export abstract class HaloElement extends HTMLElement {
  shadow: ShadowRoot;
  private _sheet: CSSStyleSheet;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this._sheet = new CSSStyleSheet();
    this._sheet.replaceSync(HALO_STYLES);
    this.shadow.adoptedStyleSheets = [this._sheet];
  }

  /** Replace shadow DOM content with the given HTML string */
  protected render(html: string): void {
    this.shadow.innerHTML = html;
  }

  /** Append HTML to shadow DOM */
  protected appendHTML(html: string): void {
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    this.shadow.appendChild(tpl.content.cloneNode(true));
  }

  /** Query an element within the shadow DOM */
  protected $<T extends Element = Element>(selector: string): T | null {
    return this.shadow.querySelector<T>(selector);
  }

  /** Query all elements within the shadow DOM */
  protected $$<T extends Element = Element>(selector: string): NodeListOf<T> {
    return this.shadow.querySelectorAll<T>(selector);
  }

  /** Attach an event listener to a shadow element */
  protected on<K extends keyof HTMLElementEventMap>(
    selector: string,
    event: K,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void
  ): void {
    const el = this.$<HTMLElement>(selector);
    if (el) el.addEventListener(event, handler as EventListener);
  }

  /** Remove this element from the DOM */
  remove(): void {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
}

// ─── Registry ────────────────────────────────────────────

const DEFINED = new Set<string>();

/** Define a custom element if not already registered */
export function defineElement(name: string, ctor: CustomElementConstructor): void {
  if (!DEFINED.has(name)) {
    customElements.define(name, ctor);
    DEFINED.add(name);
  }
}

// ─── Utility: inject into host page ─────────────────────

/**
 * Create a Halo custom element and inject it at a position relative
 * to an anchor element in the host page.
 *
 * The element itself lives in the host DOM (light DOM), but its
 * Shadow DOM encapsulates all its internal styles and markup.
 */
export function injectHaloElement(
  tagName: string,
  anchorSelector: string,
  position: "before" | "after" | "append" | "prepend" = "after"
): HTMLElement | null {
  const anchor = document.querySelector(anchorSelector);
  if (!anchor) return null;

  const el = document.createElement(tagName);
  switch (position) {
    case "before":
      anchor.before(el);
      break;
    case "after":
      anchor.after(el);
      break;
    case "append":
      anchor.appendChild(el);
      break;
    case "prepend":
      anchor.prepend(el);
      break;
  }
  return el;
}

/**
 * Create a Halo custom element and inject it as a fixed-position
 * element directly into document.body.
 */
export function injectHaloFixed(tagName: string): HTMLElement {
  const el = document.createElement(tagName);
  document.body.appendChild(el);
  return el;
}
