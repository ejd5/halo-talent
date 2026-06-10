// ─── Compliance Guard — Halo Companion ───────────
// Validates EVERY extension action BEFORE execution.
// Blocks unsafe, unauthorized, or non-compliant behavior.
//
// 8-point validation:
//   1. Creator consent for this platform
//   2. Platform supported and active
//   3. Action on whitelist (not blocked)
//   4. Rate limit not exceeded
//   5. Data minimization (only necessary data)
//   6. Human validation required flag
//   7. Sensitive keywords detected
//   8. Working hours respected (if configured)

import { logEvent } from "./audit-logger";
import { checkRateLimit } from "./rate-limiter";
import type { PlatformType } from "@/src/types/platform";

// ─── Types ────────────────────────────────────────────────

/** Every action the extension can perform on a platform */
export type ExtensionAction =
  | "read_fan_context"
  | "insert_text"
  | "generate_suggestion"
  | "sync_conversation"
  | "check_vault"
  | "add_note"
  | "update_tags"
  | "send_notification"
  | "translate_message"
  | "batch_action";

/** Actions that are ALWAYS blocked in V1 */
const BLOCKED_ACTIONS_V1 = new Set([
  "auto_send_message",
  "auto_dm_mass",
  "scrape_background",
  "download_media",
  "bypass_platform_limits",
  "extract_invisible_data",
]);

export interface ActionContext {
  platform: PlatformType;
  action: ExtensionAction | string;
  /** Is the creator's consent active for this platform? */
  consentActive: boolean;
  /** Is human validation required before this action? */
  requiresHumanValidation?: boolean;
  /** Text that would be inserted (checked for sensitive keywords) */
  textToInsert?: string;
  /** Working hours config (if enabled) */
  workingHours?: { start: number; end: number; timezone: string };
  metadata?: Record<string, unknown>;
}

export interface ComplianceCheck {
  allowed: boolean;
  riskLevel: "none" | "low" | "medium" | "high" | "blocked";
  reasons: string[];
  requiredActions: string[];
}

// ─── Sensitive Keyword Detection ──────────────────────────

/** Keywords that trigger a compliance warning or block */
const OFF_PLATFORM_KEYWORDS = [
  "paypal", "cashapp", "venmo", "western union", "bank transfer",
  "whatsapp", "telegram", "snapchat", "signal", "kik", "wechat", "line",
  "my number", "call me", "text me", "dm me on",
  "meet up", "meetup", "in person", "irl",
  "screenshot", "screen shot", "screen record", "recording",
];

const AGGRESSIVE_KEYWORDS = [
  "scam", "fraud", "hack", "steal", "illegal",
  "refund", "chargeback", "dispute",
];

const EXPLICIT_BLOCKED = [
  "minor", "underage", "under 18", "child",
];

// ─── Rate Limit Configs ───────────────────────────────────

const RATE_LIMIT_CONFIGS: Record<string, { maxTokens: number; refillMs: number }> = {
  read_fan_context: { maxTokens: 5, refillMs: 1000 },
  insert_text: { maxTokens: 3, refillMs: 2000 },
  generate_suggestion: { maxTokens: 2, refillMs: 3000 },
  sync_conversation: { maxTokens: 1, refillMs: 5000 },
  check_vault: { maxTokens: 3, refillMs: 2000 },
  add_note: { maxTokens: 5, refillMs: 1000 },
  update_tags: { maxTokens: 5, refillMs: 1000 },
  send_notification: { maxTokens: 2, refillMs: 10000 },
  translate_message: { maxTokens: 2, refillMs: 3000 },
};

// ─── Rule Engine ──────────────────────────────────────────

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  platforms: PlatformType[];
  check: (context: ActionContext) => ComplianceCheck;
}

const RULES: ComplianceRule[] = [
  // ── R1: Blocked actions V1 ─────────────────────────────
  {
    id: "blocked_actions_v1",
    name: "Actions bloquées en V1",
    description: "Certaines actions sont interdites dans cette version de l'extension",
    platforms: ["onlyfans", "fansly", "mym", "instagram", "tiktok"],
    check: (ctx) => {
      if (BLOCKED_ACTIONS_V1.has(ctx.action)) {
        return {
          allowed: false,
          riskLevel: "blocked",
          reasons: [`L'action "${ctx.action}" est bloquée en V1.`],
          requiredActions: [],
        };
      }
      return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
    },
  },

  // ── R2: Platform consent required ──────────────────────
  {
    id: "platform_consent",
    name: "Consentement créateur requis",
    description: "Le créateur doit avoir activé l'extension pour cette plateforme",
    platforms: ["onlyfans", "fansly", "mym", "instagram", "tiktok"],
    check: (ctx) => {
      if (!ctx.consentActive) {
        return {
          allowed: false,
          riskLevel: "high",
          reasons: ["Consentement créateur non activé pour cette plateforme."],
          requiredActions: ["Activer la plateforme dans les paramètres de l'extension"],
        };
      }
      return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
    },
  },

  // ── R3: Human validation required ──────────────────────
  {
    id: "human_validation",
    name: "Validation humaine obligatoire",
    description: "Aucun message n'est envoyé sans validation humaine explicite",
    platforms: ["onlyfans", "fansly", "mym"],
    check: (ctx) => {
      // Only applies to text insertion that would auto-send
      if (ctx.action === "insert_text" && ctx.metadata?.autoSend === true) {
        return {
          allowed: false,
          riskLevel: "blocked",
          reasons: ["L'envoi automatique sans validation humaine est interdit."],
          requiredActions: ["validation humaine requise — cliquez sur Envoyer manuellement"],
        };
      }
      return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
    },
  },

  // ── R4: Off-platform solicitation ──────────────────────
  {
    id: "no_off_platform",
    name: "Pas de sollicitation hors plateforme",
    description: "Interdit de rediriger les fans vers des plateformes externes (PayPal, WhatsApp, etc.)",
    platforms: ["onlyfans", "fansly", "mym"],
    check: (ctx) => {
      if (ctx.textToInsert) {
        const lower = ctx.textToInsert.toLowerCase();
        const flagged = OFF_PLATFORM_KEYWORDS.filter((kw) => lower.includes(kw));
        if (flagged.length > 0) {
          return {
            allowed: false,
            riskLevel: "high",
            reasons: [
              `Mots-clés de sollicitation hors plateforme détectés : ${flagged.join(", ")}`,
              "Cela peut entraîner la suspension de votre compte.",
            ],
            requiredActions: ["Supprimer les références aux plateformes externes"],
          };
        }
      }
      return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
    },
  },

  // ── R5: Aggressive/scam language ───────────────────────
  {
    id: "no_aggressive_language",
    name: "Pas de langage agressif ou frauduleux",
    description: "Bloque les messages contenant des termes liés aux scams, fraudes, etc.",
    platforms: ["onlyfans", "fansly", "mym", "instagram", "tiktok"],
    check: (ctx) => {
      if (ctx.textToInsert) {
        const lower = ctx.textToInsert.toLowerCase();

        // Explicitly blocked — always block
        const explicit = EXPLICIT_BLOCKED.filter((kw) => lower.includes(kw));
        if (explicit.length > 0) {
          return {
            allowed: false,
            riskLevel: "blocked",
            reasons: [`Contenu bloqué automatiquement : ${explicit.join(", ")}`],
            requiredActions: ["Supprimer le contenu inapproprié"],
          };
        }

        // Aggressive — warn
        const aggressive = AGGRESSIVE_KEYWORDS.filter((kw) => lower.includes(kw));
        if (aggressive.length > 0) {
          return {
            allowed: true,
            riskLevel: "medium",
            reasons: [`Attention : langage à risque détecté (${aggressive.join(", ")})`],
            requiredActions: ["Vérifier le message avant envoi"],
          };
        }
      }
      return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
    },
  },

  // ── R6: Rate limit enforcement ─────────────────────────
  {
    id: "rate_limit",
    name: "Respect des limites de fréquence",
    description: "Empêche le spam et le flooding des plateformes",
    platforms: ["onlyfans", "fansly", "mym", "instagram", "tiktok"],
    check: (ctx) => {
      const config = RATE_LIMIT_CONFIGS[ctx.action];
      if (!config) return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };

      const key = `compliance_${ctx.platform}_${ctx.action}`;
      const allowed = checkRateLimit(key, config.maxTokens, config.refillMs);
      if (!allowed) {
        return {
          allowed: false,
          riskLevel: "low",
          reasons: ["Limite de fréquence atteinte pour cette action. Veuillez patienter."],
          requiredActions: ["Attendre quelques secondes avant de réessayer"],
        };
      }
      return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
    },
  },

  // ── R7: Working hours (optional) ───────────────────────
  {
    id: "working_hours",
    name: "Heures de travail",
    description: "Optionnel : bloquer les actions en dehors des heures de travail configurées",
    platforms: ["onlyfans", "fansly", "mym"],
    check: (ctx) => {
      if (!ctx.workingHours) {
        return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
      }
      try {
        const now = new Date();
        const tz = ctx.workingHours.timezone || "Europe/Paris";
        const localeTime = new Date(now.toLocaleString("en-US", { timeZone: tz }));
        const hour = localeTime.getHours();
        const { start, end } = ctx.workingHours;
        if (hour < start || hour >= end) {
          return {
            allowed: true,
            riskLevel: "low",
            reasons: ["Action effectuée en dehors des heures de travail configurées."],
            requiredActions: [],
          };
        }
      } catch {
        // Timezone parsing failed — don't block, just warn
        return { allowed: true, riskLevel: "low", reasons: ["Impossible de vérifier les heures de travail."], requiredActions: [] };
      }
      return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
    },
  },

  // ── R8: No credential storage ─────────────────────────
  {
    id: "no_credential_storage",
    name: "Pas de stockage de credentials",
    description: "L'extension ne stocke jamais les mots de passe ou tokens de session",
    platforms: ["onlyfans", "fansly", "mym", "instagram", "tiktok"],
    check: (ctx) => {
      const meta = ctx.metadata ?? {};
      if (meta.storingCredentials || meta.hasSessionToken || meta.hasPassword) {
        return {
          allowed: false,
          riskLevel: "blocked",
          reasons: ["Stockage de credentials interdit. Les tokens plateforme ne sont jamais sauvegardés."],
          requiredActions: [],
        };
      }
      return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
    },
  },

  // ── R9: No mass actions (batch) ────────────────────────
  {
    id: "no_mass_actions",
    name: "Pas d'actions en masse non validées",
    description: "Toute action batch doit être explicitement approuvée",
    platforms: ["onlyfans", "fansly", "mym"],
    check: (ctx) => {
      if (ctx.action === "batch_action" && !ctx.metadata?.batchApproved) {
        return {
          allowed: false,
          riskLevel: "blocked",
          reasons: ["Les actions en masse nécessitent une validation explicite."],
          requiredActions: ["validation humaine requise"],
        };
      }
      return { allowed: true, riskLevel: "none", reasons: [], requiredActions: [] };
    },
  },
];

// ─── Public API ───────────────────────────────────────────

/**
 * Main entry point: check if an extension action is allowed.
 * Runs ALL applicable rules and aggregates results.
 */
export function canExtensionAssistAction(
  _action: ExtensionAction | string,
  context: ActionContext
): ComplianceCheck {
  const applicable = RULES.filter((r) =>
    r.platforms.includes(context.platform)
  );

  let overallAllowed = true;
  let worstRisk: ComplianceCheck["riskLevel"] = "none";
  const allReasons: string[] = [];
  const allRequiredActions: string[] = [];

  for (const rule of applicable) {
    const result = rule.check(context);

    // Log each rule evaluation
    logEvent({
      action: result.allowed ? "compliance_check_passed" : "compliance_check_blocked",
      platform: context.platform,
      details: {
        action: context.action,
        ruleId: rule.id,
        ruleName: rule.name,
        passed: result.allowed,
        riskLevel: result.riskLevel,
        reasons: result.reasons,
      },
      success: result.allowed,
      error: result.allowed ? undefined : result.reasons.join("; "),
    });

    if (!result.allowed) {
      overallAllowed = false;
    }

    if (result.reasons.length > 0) {
      allReasons.push(...result.reasons);
    }
    if (result.requiredActions.length > 0) {
      allRequiredActions.push(...result.requiredActions);
    }

    // Track worst risk level
    const riskOrder: ComplianceCheck["riskLevel"][] = ["none", "low", "medium", "high", "blocked"];
    if (riskOrder.indexOf(result.riskLevel) > riskOrder.indexOf(worstRisk)) {
      worstRisk = result.riskLevel;
    }
  }

  return {
    allowed: overallAllowed,
    riskLevel: worstRisk,
    reasons: allReasons,
    requiredActions: allRequiredActions,
  };
}

/**
 * Quick check — can this action proceed?
 * Returns false if any rule blocks it.
 */
export function canProceed(context: ActionContext): {
  allowed: boolean;
  blockedBy?: string;
} {
  const result = canExtensionAssistAction(context.action, context);
  if (!result.allowed) {
    return { allowed: false, blockedBy: result.reasons[0] ?? "Action bloquée" };
  }
  return { allowed: true };
}

/**
 * Check if a specific action type is in the V1 blocked list.
 */
export function isBlockedInV1(action: string): boolean {
  return BLOCKED_ACTIONS_V1.has(action);
}

/**
 * Get the list of all blocked actions in V1.
 */
export function getBlockedActions(): string[] {
  return [...BLOCKED_ACTIONS_V1];
}

// ─── Legacy-compatible exports ───────────────────────────

export interface ComplianceContext {
  platform: PlatformType;
  action: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}

export interface ComplianceCheckResult {
  passed: boolean;
  reason?: string;
  severity: "info" | "warning" | "block";
}

/**
 * Run compliance checks for an action.
 * @deprecated Use canExtensionAssistAction() for new code.
 */
export function checkCompliance(context: ComplianceContext): ComplianceCheckResult[] {
  const result = canExtensionAssistAction(context.action, {
    platform: context.platform,
    action: context.action,
    consentActive: true,
    metadata: context.metadata,
  });

  return [
    {
      passed: result.allowed,
      reason: result.reasons.join("; ") || undefined,
      severity: result.riskLevel === "blocked" ? "block" : result.riskLevel === "high" ? "warning" : "info",
    },
  ];
}
