// ─── Shadow DOM Styles — Halo Companion ───────────
// Compiled design tokens + component styles for injection into Shadow DOM.
// These are the ONLY styles injected into platform pages.
// Everything is scoped to :host so it never leaks to the host page.

export const HALO_STYLES = /* css */ `
  /* ── Design Tokens (Halo Palette B) ────────────── */
  :host {
    /* Backgrounds */
    --halo-bg-primary: #111110;
    --halo-bg-surface: #1A1918;
    --halo-bg-card: #242322;
    --halo-bg-elevated: #2D2C2B;

    /* Text */
    --halo-text-primary: #FAFAF8;
    --halo-text-secondary: #A8A8A6;
    --halo-text-tertiary: #706F6D;

    /* Accent */
    --halo-accent: var(--or, #D8A95B);
    --halo-accent-soft: rgba(249,115,22,0.12);
    --halo-accent-hover: #FB923C;

    /* Semantic */
    --halo-success: #22C55E;
    --halo-success-soft: rgba(34,197,94,0.12);
    --halo-warning: #F59E0B;
    --halo-warning-soft: rgba(245,158,11,0.12);
    --halo-danger: #EF4444;
    --halo-danger-soft: rgba(239,68,68,0.1);
    --halo-info: #3B82F6;
    --halo-info-soft: rgba(59,130,246,0.12);

    /* Borders */
    --halo-border-default: rgba(255,255,255,0.06);
    --halo-border-strong: rgba(255,255,255,0.1);

    /* Shadows */
    --halo-shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
    --halo-shadow-md: 0 4px 16px rgba(0,0,0,0.4);
    --halo-shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
    --halo-shadow-accent: 0 4px 16px rgba(249,115,22,0.3);

    /* Radii */
    --halo-radius-sm: 6px;
    --halo-radius-md: 10px;
    --halo-radius-lg: 14px;
    --halo-radius-xl: 18px;
    --halo-radius-full: 9999px;

    /* Typography */
    --halo-font-sans: "Inter", system-ui, -apple-system, sans-serif;
    --halo-font-mono: "JetBrains Mono", "Fira Code", monospace;

    /* Transitions */
    --halo-transition: 150ms ease;
    --halo-transition-slow: 250ms ease;

    /* Base */
    font-family: var(--halo-font-sans);
    font-size: 12px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ── Reset ────────────────────────────────────── */
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  /* ── Flex Layout ──────────────────────────────── */
  .halo-flex { display: flex; }
  .halo-inline-flex { display: inline-flex; }
  .halo-flex-col { flex-direction: column; }
  .halo-items-center { align-items: center; }
  .halo-items-start { align-items: flex-start; }
  .halo-justify-between { justify-content: space-between; }
  .halo-justify-center { justify-content: center; }
  .halo-gap-1 { gap: 4px; }
  .halo-gap-2 { gap: 6px; }
  .halo-gap-3 { gap: 8px; }
  .halo-gap-4 { gap: 12px; }
  .halo-flex-1 { flex: 1; }
  .halo-shrink-0 { flex-shrink: 0; }

  /* ── Spacing ──────────────────────────────────── */
  .halo-p-1 { padding: 4px; }
  .halo-p-2 { padding: 6px; }
  .halo-p-3 { padding: 10px; }
  .halo-p-4 { padding: 14px; }
  .halo-px-2 { padding-left: 6px; padding-right: 6px; }
  .halo-px-3 { padding-left: 10px; padding-right: 10px; }
  .halo-py-1 { padding-top: 3px; padding-bottom: 3px; }
  .halo-py-2 { padding-top: 5px; padding-bottom: 5px; }
  .halo-mb-1 { margin-bottom: 4px; }
  .halo-mb-2 { margin-bottom: 6px; }
  .halo-mb-3 { margin-bottom: 10px; }
  .halo-mt-1 { margin-top: 4px; }
  .halo-mt-2 { margin-top: 6px; }

  /* ── Typography ───────────────────────────────── */
  .halo-text-xs { font-size: 10px; }
  .halo-text-sm { font-size: 11px; }
  .halo-text-base { font-size: 12px; }
  .halo-text-lg { font-size: 14px; }
  .halo-font-medium { font-weight: 500; }
  .halo-font-semibold { font-weight: 600; }
  .halo-font-bold { font-weight: 700; }
  .halo-text-center { text-align: center; }
  .halo-text-left { text-align: left; }
  .halo-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .halo-leading-relaxed { line-height: 1.6; }
  .halo-font-mono { font-family: var(--halo-font-mono); }

  /* ── Colors ───────────────────────────────────── */
  .halo-text-primary { color: var(--halo-text-primary); }
  .halo-text-secondary { color: var(--halo-text-secondary); }
  .halo-text-tertiary { color: var(--halo-text-tertiary); }
  .halo-text-accent { color: var(--halo-accent); }
  .halo-text-success { color: var(--halo-success); }
  .halo-text-warning { color: var(--halo-warning); }
  .halo-text-danger { color: var(--halo-danger); }
  .halo-text-info { color: var(--halo-info); }

  /* ── Backgrounds ──────────────────────────────── */
  .halo-bg-primary { background: var(--halo-bg-primary); }
  .halo-bg-surface { background: var(--halo-bg-surface); }
  .halo-bg-card { background: var(--halo-bg-card); }
  .halo-bg-accent { background: var(--halo-accent); }
  .halo-bg-accent-soft { background: var(--halo-accent-soft); }
  .halo-bg-success-soft { background: var(--halo-success-soft); }
  .halo-bg-warning-soft { background: var(--halo-warning-soft); }
  .halo-bg-danger-soft { background: var(--halo-danger-soft); }

  /* ── Borders ──────────────────────────────────── */
  .halo-border { border: 1px solid var(--halo-border-default); }
  .halo-border-strong { border: 1px solid var(--halo-border-strong); }
  .halo-rounded-sm { border-radius: var(--halo-radius-sm); }
  .halo-rounded-md { border-radius: var(--halo-radius-md); }
  .halo-rounded-lg { border-radius: var(--halo-radius-lg); }
  .halo-rounded-xl { border-radius: var(--halo-radius-xl); }
  .halo-rounded-full { border-radius: var(--halo-radius-full); }

  /* ── Buttons ──────────────────────────────────── */
  .halo-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    border: none;
    cursor: pointer;
    font-family: var(--halo-font-sans);
    font-size: 10px;
    font-weight: 500;
    border-radius: var(--halo-radius-md);
    padding: 4px 10px;
    transition: opacity var(--halo-transition), transform var(--halo-transition);
    white-space: nowrap;
    user-select: none;
  }
  .halo-btn:hover { opacity: 0.85; }
  .halo-btn:active { transform: scale(0.97); }
  .halo-btn-accent { background: var(--halo-accent); color: #fff; }
  .halo-btn-ghost { background: transparent; color: var(--halo-text-secondary); }
  .halo-btn-ghost:hover { background: var(--halo-bg-surface); }
  .halo-btn-sm { padding: 2px 8px; font-size: 9px; }

  /* ── Pills / Badges ───────────────────────────── */
  .halo-pill {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px;
    border-radius: var(--halo-radius-full);
    font-size: 9px;
    font-weight: 600;
    white-space: nowrap;
  }
  .halo-pill-success { background: var(--halo-success-soft); color: var(--halo-success); }
  .halo-pill-warning { background: var(--halo-warning-soft); color: var(--halo-warning); }
  .halo-pill-danger { background: var(--halo-danger-soft); color: var(--halo-danger); }
  .halo-pill-info { background: var(--halo-info-soft); color: var(--halo-info); }
  .halo-pill-accent { background: var(--halo-accent-soft); color: var(--halo-accent); }
  .halo-pill-neutral { background: var(--halo-bg-surface); color: var(--halo-text-secondary); }

  /* ── Tooltip ──────────────────────────────────── */
  .halo-tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: var(--halo-bg-elevated);
    border: 1px solid var(--halo-border-strong);
    border-radius: var(--halo-radius-lg);
    padding: 10px 12px;
    min-width: 200px;
    box-shadow: var(--halo-shadow-lg);
    z-index: 9999999;
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--halo-transition);
  }
  .halo-tooltip.visible {
    opacity: 1;
    pointer-events: auto;
  }
  .halo-tooltip::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--halo-bg-elevated);
  }

  /* ── Card ─────────────────────────────────────── */
  .halo-card {
    background: var(--halo-bg-card);
    border: 1px solid var(--halo-border-default);
    border-radius: var(--halo-radius-lg);
    padding: 10px;
  }

  /* ── Input ────────────────────────────────────── */
  .halo-input {
    background: var(--halo-bg-surface);
    border: 1px solid var(--halo-border-default);
    border-radius: var(--halo-radius-sm);
    color: var(--halo-text-primary);
    font-family: var(--halo-font-sans);
    font-size: 11px;
    padding: 4px 8px;
    outline: none;
    width: 100%;
  }
  .halo-input:focus { border-color: var(--halo-accent); }

  /* ── Divider ──────────────────────────────────── */
  .halo-divider {
    height: 1px;
    background: var(--halo-border-default);
    border: none;
    margin: 6px 0;
  }

  /* ── Scrollbar ────────────────────────────────── */
  .halo-scroll::-webkit-scrollbar { width: 3px; }
  .halo-scroll::-webkit-scrollbar-track { background: transparent; }
  .halo-scroll::-webkit-scrollbar-thumb {
    background: var(--halo-border-strong);
    border-radius: 3px;
  }

  /* ── Animations ───────────────────────────────── */
  @keyframes halo-slide-up {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes halo-fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes halo-fade-out {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  @keyframes halo-slide-down {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .halo-animate-slide-up { animation: halo-slide-up 200ms ease forwards; }
  .halo-animate-fade-in { animation: halo-fade-in 150ms ease forwards; }
  .halo-animate-fade-out { animation: halo-fade-out 300ms ease forwards; }
  .halo-animate-slide-down { animation: halo-slide-down 200ms ease forwards; }

  /* ── Notification ─────────────────────────────── */
  .halo-notification {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 9999998;
    background: var(--halo-bg-elevated);
    border: 1px solid var(--halo-border-strong);
    border-radius: var(--halo-radius-lg);
    box-shadow: var(--halo-shadow-lg);
    max-width: 320px;
    animation: halo-slide-down 250ms ease forwards;
  }

  /* ── Assistance Bar ───────────────────────────── */
  .halo-assistance-bar {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 32px;
    padding: 0 8px;
    background: rgba(26,25,24,0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid var(--halo-border-default);
    border-radius: var(--halo-radius-md);
  }

  /* ── Suggestion Card ──────────────────────────── */
  .halo-suggestion-card {
    background: var(--halo-bg-card);
    border: 1px solid var(--halo-border-default);
    border-radius: var(--halo-radius-md);
    padding: 10px;
    transition: border-color var(--halo-transition);
  }
  .halo-suggestion-card:hover { border-color: var(--halo-accent); }

  /* ── Popup ────────────────────────────────────── */
  .halo-popup {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 0;
    background: var(--halo-bg-card);
    border: 1px solid var(--halo-border-strong);
    border-radius: var(--halo-radius-lg);
    box-shadow: var(--halo-shadow-lg);
    z-index: 9999997;
    animation: halo-slide-up 200ms ease forwards;
    max-height: 360px;
    overflow-y: auto;
  }

  /* ── Link ─────────────────────────────────────── */
  .halo-link {
    color: var(--halo-accent);
    text-decoration: none;
    cursor: pointer;
    font-size: 10px;
    font-weight: 500;
  }
  .halo-link:hover { text-decoration: underline; }

  /* ── Dot indicator ────────────────────────────── */
  .halo-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
    flex-shrink: 0;
  }
  .halo-dot-success { background: var(--halo-success); }
  .halo-dot-warning { background: var(--halo-warning); }
  .halo-dot-danger { background: var(--halo-danger); }
  .halo-dot-accent { background: var(--halo-accent); }
`;
