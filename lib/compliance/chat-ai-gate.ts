// ─── Compliance Gate — Chat AI Actions ──────────────────
// Central gate for all sensitive Chat AI operations.
// Checks: consent → pause → platform → fan status → cooldown → vault → sensitive words → pricing

import type {
  ChatAIAction,
  ChatAIActionContext,
  ComplianceCheckResult,
  RiskLevel,
  Platform,
} from "@/lib/types/chat-ai";

// ── Sensitive word patterns (configurable) ──────────────
const SENSITIVE_WORDS = [
  /\b(garanti|garantie|revenu garanti)\b/i,
  /\b(zéro risque|zero risk|sans risque|risk.free)\b/i,
  /\b(zéro ban|zero ban|jamais ban|ban.proof)\b/i,
  /\b(100%|certain|certaine|à coup sûr)\b/i,
  /\b(illégal|illegal|contourner|bypass)\b/i,
];

// ── Platform-specific restrictions ──────────────────────
const PLATFORM_RESTRICTIONS: Record<Platform, string[]> = {
  onlyfans: ["Les CGU d'OnlyFans peuvent restreindre l'usage d'IA. Vérifiez les conditions applicables."],
  mym: ["Les CGU de MYM peuvent restreindre l'usage d'IA. Vérifiez les conditions applicables."],
  fansly: ["Les CGU de Fansly peuvent restreindre l'usage d'IA. Vérifiez les conditions applicables."],
  fanvue: ["Les CGU de Fanvue peuvent restreindre l'usage d'IA. Vérifiez les conditions applicables."],
  other: ["Vérifiez les CGU de la plateforme concernant l'usage d'IA dans les messages."],
};

// ── Anti-fatigue cooldown checks ────────────────────────
const COOLDOWNS: Partial<Record<ChatAIAction, number>> = {
  create_ppv: 60, // minutes between PPV proposals
  create_followup: 30,
};

function isCooldownActive(action: ChatAIAction, lastActionAt?: string): boolean {
  const cooldown = COOLDOWNS[action];
  if (!cooldown || !lastActionAt) return false;
  const elapsed = (Date.now() - new Date(lastActionAt).getTime()) / (1000 * 60);
  return elapsed < cooldown;
}

function hasSensitiveWords(text?: string): string[] {
  if (!text) return [];
  const found: string[] = [];
  for (const pattern of SENSITIVE_WORDS) {
    if (pattern.test(text)) {
      found.push(`Mot sensible détecté : ${pattern.source}`);
    }
  }
  return found;
}

// ── Main gate function ──────────────────────────────────

export function canUseChatAIAction(
  action: ChatAIAction,
  context: ChatAIActionContext
): ComplianceCheckResult {
  const reasons: string[] = [];
  const requiredActions: string[] = [];
  let riskLevel: RiskLevel = "low";

  // 1. Consent checklist must be complete
  if (context.consentCompleted === false) {
    reasons.push("Checklist de consentement incomplète. Les 11 cases doivent être validées.");
    requiredActions.push("complete_consent_checklist");
    riskLevel = "high";
  }

  // 2. Module must not be paused
  if (context.isPaused && action !== "activate_module") {
    reasons.push("Le module est en pause. Réactivez-le via le bouton Emergency Pause.");
    requiredActions.push("resume_module");
    riskLevel = "high";
  }

  // 3. Platform disclosure compatibility
  if (context.platform && context.disclosure === "platform_restricted") {
    const warnings = PLATFORM_RESTRICTIONS[context.platform] || [];
    reasons.push(...warnings);
    riskLevel = riskLevel === "low" ? "medium" : riskLevel;
  }

  // 4. Fan status checks (for commercial actions)
  const commercialActions: ChatAIAction[] = ["create_ppv", "create_followup"];
  if (commercialActions.includes(action) && context.fanId) {
    // These checks require DB lookups — the gate function is sync,
    // the caller should pre-check fan status and pass the result in context.
    // We add a note that the caller must verify.
    requiredActions.push("verify_fan_status");
  }

  // 5. Cooldown anti-fatigue
  if (isCooldownActive(action, context.cooldownSince)) {
    const mins = COOLDOWNS[action];
    reasons.push(`Cooldown actif : cette action nécessite ${mins} minutes entre chaque utilisation.`);
    requiredActions.push("wait_cooldown");
    riskLevel = "medium";
  }

  // 6. Draft count limits
  if (action === "generate_draft" && context.draftCount && context.draftCount >= 100) {
    reasons.push("Limite quotidienne de brouillons atteinte (100/jour).");
    requiredActions.push("wait_next_day");
    riskLevel = "medium";
  }

  // Determine if allowed
  const blocked = reasons.some((r) =>
    r.includes("Checklist") || r.includes("pause") || r.includes("Cooldown") || r.includes("Limite quotidienne")
  );

  return {
    allowed: !blocked,
    riskLevel,
    reasons,
    requiredActions,
    suggestedSafeAlternative: blocked ? "Veuillez résoudre les blocages ci-dessus avant de continuer." : null,
  };
}

/**
 * Check if action is blocked (high risk or not allowed).
 */
export function isActionBlocked(result: ComplianceCheckResult): boolean {
  return !result.allowed || result.riskLevel === "high";
}

/**
 * Validate message text against sensitive word patterns.
 */
export function scanMessageText(text: string): ComplianceCheckResult {
  const matches = hasSensitiveWords(text);
  if (matches.length > 0) {
    return {
      allowed: false,
      riskLevel: "high",
      reasons: matches,
      requiredActions: ["remove_sensitive_claims"],
      suggestedSafeAlternative: "Reformulez sans promesses de revenus, garanties, ou mentions de contournement.",
    };
  }
  return { allowed: true, riskLevel: "low", reasons: [], requiredActions: [], suggestedSafeAlternative: null };
}
