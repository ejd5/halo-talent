// ─── Overlay Manager — Halo Companion ───────────
// Orchestrates all Halo overlays injected into platform pages.
// Uses Shadow DOM for complete CSS isolation.
// Lifecycle: define → inject → update → remove.

import type { PlatformType } from "@/src/types/platform";
import { logEvent } from "@/src/lib/audit-logger";
import { getAdapter, debugLog } from "./adapters/base-adapter";
import { onDOMEvent, type DOMEvent } from "./dom-observer";
import {
  defineFanBadge,
  defineAssistanceBar,
  defineNotification,
  type HaloFanBadge,
  type HaloAssistanceBar,
  type HaloNotification,
  type FanBadgeData,
} from "./overlays";

// ─── State ───────────────────────────────────────────────

let platform: PlatformType | null = null;
let initialized = false;
let fanBadge: HaloFanBadge | null = null;
let assistanceBar: HaloAssistanceBar | null = null;
let currentFanName = "";
let unsubscribers: (() => void)[] = [];

// ─── Public API ──────────────────────────────────────────

/** Initialize overlay manager for a platform. Called once from injector.ts. */
export function initializeOverlayManager(p: PlatformType): void {
  if (initialized) return;

  platform = p;
  initialized = true;

  debugLog("OverlayManager", `Initializing for ${p}`);

  // Define all custom elements
  defineFanBadge();
  defineAssistanceBar();
  defineNotification();

  // Listen for page changes
  const unsub1 = onDOMEvent("page_changed", handlePageChanged);
  const unsub2 = onDOMEvent("conversation_opened", handleConversationOpened);
  unsubscribers.push(unsub1, unsub2);

  debugLog("OverlayManager", "Ready — listening for DOM events");
}

/** Remove all overlays and listeners */
export function removeAllOverlays(): void {
  unsubscribers.forEach((fn) => fn());
  unsubscribers = [];

  fanBadge?.remove();
  fanBadge = null;

  assistanceBar?.remove();
  assistanceBar = null;

  initialized = false;
  debugLog("OverlayManager", "All overlays removed");
}

// ─── Event Handlers ──────────────────────────────────────

function handlePageChanged(event: DOMEvent): void {
  if (event.type !== "page_changed") return;

  const adapter = getActiveAdapter();
  if (!adapter) return;

  const pageType = adapter.detectPageType();

  // Clean up conversation overlays when leaving chat
  if (pageType !== "chat") {
    removeConversationOverlays();
    return;
  }

  // Entering a chat page — inject overlays
  injectConversationOverlays();
}

function handleConversationOpened(event: DOMEvent): void {
  if (event.type !== "conversation_opened") return;

  // New conversation opened — refresh overlays
  removeConversationOverlays();
  setTimeout(() => injectConversationOverlays(), 500); // Wait for DOM to settle
}

// ─── Injection ───────────────────────────────────────────

function getActiveAdapter() {
  return platform ? getAdapter(platform) : null;
}

async function injectConversationOverlays(): Promise<void> {
  if (!platform) return;

  const adapter = getActiveAdapter();
  if (!adapter) return;

  const pageType = adapter.detectPageType();
  if (pageType !== "chat") return;

  debugLog("OverlayManager", "Injecting conversation overlays");

  // 1. Fan context → Fan Badge
  const fan = adapter.getCurrentFanContext();
  if (fan) {
    currentFanName = fan.displayName || fan.username;

    const anchors = adapter.getOverlayAnchors();
    const badgeAnchor = document.querySelector(anchors.fanBadgeAnchor);

    if (badgeAnchor) {
      fanBadge = document.createElement("halo-fan-badge") as HaloFanBadge;
      badgeAnchor.after(fanBadge);

      const persona = classifyPersona(fan);
      const badgeData: FanBadgeData = {
        persona,
        personaLabel: PERSONA_LABELS[persona],
        ltv: fan.totalSpent,
        lastActivity: fan.lastActivity || "Inconnue",
        fanId: fan.platformId,
        fanUrl: adapter.getFanPageUrl(fan.platformId),
      };
      fanBadge.setData(badgeData);
    }
  }

  // 2. Assistance Bar — inject below chat input
  await injectAssistanceBar();

  // 3. Start watching the chat input for Tone Guard
  startToneGuardWatch();

  logEvent({
    action: "overlay_opened",
    platform,
    details: { overlays: ["fan_badge", "assistance_bar"] },
    success: true,
  });
}

async function injectAssistanceBar(): Promise<void> {
  if (!platform) return;

  const adapter = getActiveAdapter();
  if (!adapter) return;

  const anchors = adapter.getOverlayAnchors();
  const chatAnchor = document.querySelector(anchors.aiAssistantAnchor);

  if (!chatAnchor) {
    debugLog("OverlayManager", "Chat anchor not found for assistance bar");
    return;
  }

  // Fetch data from background
  const [scripts, vaultItems, suggestions] = await Promise.all([
    fetchScripts(),
    fetchVaultItems(currentFanName),
    fetchAISuggestions(currentFanName),
  ]);

  assistanceBar = document.createElement("halo-assistance-bar") as HaloAssistanceBar;
  chatAnchor.after(assistanceBar);

  assistanceBar.configure({
    fanName: currentFanName,
    scripts,
    vaultItems,
    suggestions,
    toneOk: true,
    onInsertText: (text: string) => {
      adapter.insertTextInInput(text);
    },
    onOpenSidepanel: () => {
      chrome.runtime.sendMessage({
        type: "OPEN_SIDE_PANEL",
        payload: { platform },
        source: "content-script",
        timestamp: Date.now(),
      });
    },
  });

  // Listen for regenerate event
  assistanceBar.addEventListener("halo-regenerate-suggestions", async () => {
    const newSuggestions = await fetchAISuggestions(currentFanName);
    assistanceBar?.configure({
      fanName: currentFanName,
      scripts,
      vaultItems,
      suggestions: newSuggestions,
      toneOk: true,
      onInsertText: (text: string) => adapter.insertTextInInput(text),
      onOpenSidepanel: () => chrome.runtime.sendMessage({
        type: "OPEN_SIDE_PANEL",
        payload: { platform },
        source: "content-script",
        timestamp: Date.now(),
      }),
    });
  });
}

function removeConversationOverlays(): void {
  fanBadge?.remove();
  fanBadge = null;

  assistanceBar?.remove();
  assistanceBar = null;

  currentFanName = "";
}

// ─── Tone Guard ──────────────────────────────────────────

let toneWatchInterval: ReturnType<typeof setInterval> | null = null;

function startToneGuardWatch(): void {
  if (toneWatchInterval) clearInterval(toneWatchInterval);

  toneWatchInterval = setInterval(() => {
    if (!assistanceBar) {
      if (toneWatchInterval) clearInterval(toneWatchInterval);
      return;
    }
    const adapter = getActiveAdapter();
    if (!adapter) return;

    const input = findChatInput(adapter);
    if (!input) return;

    const text = input instanceof HTMLTextAreaElement || input instanceof HTMLInputElement
      ? input.value
      : (input as HTMLElement).textContent ?? "";

    if (text.trim()) {
      // Simple heuristic: check for compliance flags
      const ok = !COMPLIANCE_FLAGS.some((flag) => text.toLowerCase().includes(flag));
      assistanceBar.setToneGuard(ok);
    }
  }, 2000);
}

function findChatInput(adapter: ReturnType<typeof getActiveAdapter>): HTMLElement | null {
  if (!adapter) return null;
  const sel = adapter.getOverlayAnchors();
  // The aiAssistantAnchor is near the input — look for contenteditables/textareas nearby
  const anchor = document.querySelector(sel.aiAssistantAnchor);
  if (!anchor) return null;

  const input = anchor.querySelector<HTMLElement>(
    'div[contenteditable="true"], textarea, [role="textbox"], [contenteditable]'
  );
  return input;
}

// Off-brand / aggressive language that Tone Guard flags
const COMPLIANCE_FLAGS = [
  "fuck", "shit", "scam", "fraud", "screenshot", "screen shot",
  "paypal", "cashapp", "venmo", "outside", "whatsapp", "telegram",
  "my number", "call me", "meet up", "meetup", "in person",
];

// ─── Data Fetching (Background Service Worker) ───────────

async function fetchScripts(): Promise<
  { id: string; title: string; content: string; category: string }[]
> {
  try {
    const resp = await chrome.runtime.sendMessage({
      type: "GET_SCRIPTS_OVERLAY",
      payload: {},
      source: "content-script",
      timestamp: Date.now(),
    });
    if (resp?.payload?.scripts) return resp.payload.scripts;
  } catch {
    // Background may not handle this yet — use defaults
  }
  return [
    { id: "1", title: "Message de bienvenue", content: "Hey ! Bienvenue dans mon univers 💕 N'hésite pas si tu as des questions !", category: "welcome" },
    { id: "2", title: "Demande de tips", content: "Si tu aimes mon contenu, n'hésite pas à me soutenir avec un petit tip 💸", category: "tip_ask" },
    { id: "3", title: "Upsell PPV", content: "J'ai préparé un contenu exclusif pour toi 🔥 Dispo maintenant !", category: "ppv_promo" },
    { id: "4", title: "Relance", content: "Ça fait un moment dis donc ! Tu m'as manqué 💕", category: "comeback" },
  ];
}

async function fetchVaultItems(_fanName: string): Promise<
  { id: string; title: string; type: "image" | "video"; sentToFan: boolean; purchased: boolean; price?: number }[]
> {
  try {
    const resp = await chrome.runtime.sendMessage({
      type: "SEARCH_VAULT",
      payload: { query: "*" },
      source: "content-script",
      timestamp: Date.now(),
    });
    if (resp?.payload?.results) {
      return resp.payload.results.map((r: { item: { id: string; title: string; type: string; price?: number } }) => ({
        id: r.item.id,
        title: r.item.title,
        type: r.item.type as "image" | "video",
        sentToFan: false, // Will be determined by API
        purchased: false,
        price: r.item.price ?? 15,
      }));
    }
  } catch {
    // Fallback
  }
  return [
    { id: "v1", title: "Photo exclusive 🔥", type: "image", sentToFan: false, purchased: false, price: 15 },
    { id: "v2", title: "Vidéo PPV 12min", type: "video", sentToFan: false, purchased: false, price: 25 },
    { id: "v3", title: "Selfie du jour", type: "image", sentToFan: true, purchased: true },
    { id: "v4", title: "Backstage tournage", type: "video", sentToFan: false, purchased: false, price: 20 },
  ];
}

async function fetchAISuggestions(fanName: string): Promise<
  { id: string; text: string; tone: string }[]
> {
  try {
    const resp = await chrome.runtime.sendMessage({
      type: "GET_AI_DRAFTS_OVERLAY",
      payload: { fanName, count: 3 },
      source: "content-script",
      timestamp: Date.now(),
    });
    if (resp?.payload?.drafts) return resp.payload.drafts;
  } catch {
    // Fallback — generate simple templates
  }
  return [
    {
      id: `sug-${Date.now()}-1`,
      text: `Hey ${fanName} ! Ton dernier message m'a fait sourire 💕 J'ai quelque chose de spécial pour toi...`,
      tone: "💋 Flirty",
    },
    {
      id: `sug-${Date.now()}-2`,
      text: `Hmmm tu me manquais 😏 Tu veux un aperçu de ce que je prépare ?`,
      tone: "🔮 Mystérieux",
    },
    {
      id: `sug-${Date.now()}-3`,
      text: `Merci pour ta fidélité 💖 Ça mérite bien une surprise, non ?`,
      tone: "🙏 Reconnaissant",
    },
  ];
}

// ─── Fan Persona Classification ──────────────────────────

type PersonaTier = "vip" | "loyal" | "regular" | "new" | "at_risk";

const PERSONA_LABELS: Record<PersonaTier, string> = {
  vip: "VIP",
  loyal: "Loyal",
  regular: "Regular",
  new: "Nouveau",
  at_risk: "À risque",
};

function classifyPersona(fan: { totalSpent: number; subscriptionMonths: number; lastActivity?: string }): PersonaTier {
  // At-risk: inactive for >30 days
  if (fan.lastActivity) {
    const lastDate = new Date(fan.lastActivity);
    const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 30) return "at_risk";
  }

  // VIP: high spenders
  if (fan.totalSpent > 500) return "vip";

  // Loyal: long subscribers
  if (fan.subscriptionMonths > 6) return "loyal";

  // New: recent subscribers
  if (fan.subscriptionMonths <= 1) return "new";

  return "regular";
}

// ─── Notification Helpers ────────────────────────────────

/** Show a VIP whale online notification */
export function notifyVIPOnline(fan: { username: string; displayName: string; ltv: number; lastActivity: string }): HaloNotification | null {
  const { showNotification } = require("./overlays/floating-notification");
  return showNotification({
    icon: "whale",
    title: "Fan VIP en ligne !",
    message: `${fan.displayName} est connectée`,
    detailLine: `LTV: ${fan.ltv}€ · Dernière activité: ${fan.lastActivity}`,
    primaryAction: {
      label: "Ouvrir la conversation",
      onClick: () => {
        const adapter = getActiveAdapter();
        if (adapter) {
          window.location.href = adapter.getFanPageUrl(fan.username);
        }
      },
    },
  });
}

/** Show an at-risk fan notification */
export function notifyFanAtRisk(fan: { username: string; displayName: string; lastActivity: string }): HaloNotification | null {
  const { showNotification } = require("./overlays/floating-notification");
  return showNotification({
    icon: "risk",
    title: "Fan à risque détecté",
    message: `${fan.displayName} est inactif depuis ${fan.lastActivity}`,
    primaryAction: {
      label: "Envoyer un message",
      onClick: () => {
        const adapter = getActiveAdapter();
        if (adapter) {
          window.location.href = adapter.getFanPageUrl(fan.username);
        }
      },
    },
  });
}
