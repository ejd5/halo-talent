// ─── Intelligent Model Router ─────────────────────────────────
// Choisit automatiquement entre DeepSeek V4 Flash (économique)
// et DeepSeek V4 Pro (précis) selon la complexité de la requête.

import type { LexMessage } from "@/lib/halo-lex/types";
import type { DeepSeekModel } from "./deepseek-client";

export interface QueryContext {
  isFAQ?: boolean;
  isSimpleDefinition?: boolean;
  isQuestionnaire?: boolean;
  isComplexAnalysis?: boolean;
  isContractAnalysis?: boolean;
  isLetterRequest?: boolean;
}

// Patterns qui indiquent une question simple/FAQ
const SIMPLE_PATTERNS = [
  /\b(qu'est-ce que|c'est quoi|définition|signifie|explique moi)\b/i,
  /\b(combien de temps|quel délai|quelle est la différence)\b/i,
  /\b(c'est grave|est-ce grave|est-ce que je peux|ai-je le droit)\b/i,
  /\b(RGPD|DSA|CGU|loi|article)\s.*\b(c'est|définition|explique)\b/i,
  /\b(qui|quoi|où|quand|pourquoi)\s.*\b(plateforme|compte|contrat|droits)\b.{0,50}\?$/i,
];

// Patterns qui indiquent une analyse complexe
const COMPLEX_PATTERNS = [
  /\b(bannissement|suspension|compte fermé)\b/i,
  /\b(paiement bloqué|retenue|non.payé|impayé)\b/i,
  /\b(clause abusive|contrat agence|exclusivité)\b/i,
  /\b(droit à l'image|photo sans consentement|DMCA)\b/i,
  /\b(plainte|procédure|judiciaire|avocat|tribunal)\b/i,
  /\b(mise en demeure|lettre|recours|appel)\b/i,
  /\b(montant|somme|€|euros)\s.*\b(5000|[5-9]\d{3}|\d{5,})\b/i,
];

// Patterns qui indiquent une analyse de contrat
const CONTRACT_PATTERNS = [
  /\b(contrat|clause|CGU|conditions générales)\b.{0,100}\b(analyse|vérifi|détect|abusif|illégal)\b/i,
  /\b(relis|vérifie|analyse)\s.*\b(contrat|clause)\b/i,
];

// Patterns qui indiquent une demande de lettre officielle
const LETTER_REQUEST_PATTERNS = [
  /\b(génère|écris|rédige|prépare)\s.*\b(lettre|courrier|mise en demeure|appel|recours)\b/i,
  /\b(j'ai besoin|je veux|je dois)\s.*\b(lettre|écrire|contester|envoyer)\b/i,
  /\b(demande officielle|document officiel|lettre formelle)\b/i,
];

/**
 * Détecte une demande de lettre officielle dans la conversation.
 */
export function detectLetterNeed(messages: LexMessage[]): {
  detected: boolean;
  type?: string;
  complexity?: "standard" | "complex";
} {
  const lastMessages = messages
    .slice(-5)
    .map((m) => m.content.toLowerCase())
    .join(" ");

  const letterPatterns = [
    { keywords: ["suspension", "banni", "compte fermé"], type: "appel_suspension", complexity: "standard" as const },
    { keywords: ["paiement bloqué", "retenue", "non payé"], type: "reclamation_paiement", complexity: "standard" as const },
    { keywords: ["contrat agence", "clause abusive", "exclusivité"], type: "mise_en_demeure_agence", complexity: "complex" as const },
    { keywords: ["droit image", "photo sans consentement"], type: "mise_en_demeure_image", complexity: "complex" as const },
    { keywords: ["leak", "contenu volé", "DMCA"], type: "DMCA_takedown", complexity: "standard" as const },
    { keywords: ["contestation décision", "appel", "recours"], type: "appel_generique", complexity: "standard" as const },
  ];

  for (const pattern of letterPatterns) {
    if (pattern.keywords.some((k) => lastMessages.includes(k))) {
      return { detected: true, type: pattern.type, complexity: pattern.complexity };
    }
  }

  return { detected: false };
}

export type ComplexityLevel = "simple" | "medium" | "complex";

/**
 * Analyse la complexité d'un message selon 3 niveaux (32B-BIS).
 *
 * Simple : FAQ, définitions, questions courtes (< 30 mots)
 * Medium : analyse de situation, diagnostic, orientation
 * Complex : multi-juridictionnel, montants > 5000€, raisonnement juridique poussé
 */
export function analyzeComplexity(message: string): ComplexityLevel {
  const wordCount = message.split(/\s+/).length;
  const hasMultiJurisdictional = /(europe|usa|uk|brésil|allemagne|belgique|suisse)/i.test(message);
  const hasComplexLegal = /(préjudice|dommages|tribunal|procédure|pénal|prison)/i.test(message);
  const hasAmount = /\d{4,}\s?(€|euros|usd|dollars)/i.test(message);

  if (wordCount < 30 && !hasComplexLegal && !hasAmount) return "simple";
  if (hasMultiJurisdictional || hasAmount) return "complex";
  return "medium";
}

/**
 * Sélectionne le modèle selon le niveau de complexité (32B-BIS).
 */
export function selectModelByComplexity(level: ComplexityLevel): DeepSeekModel {
  if (level === "simple") return "deepseek-v4-flash";
  return "deepseek-v4-pro"; // medium ou complex → Pro
}

/**
 * Analyse le contexte de la requête pour router vers le bon modèle.
 */
export function analyzeContext(query: string, messages: LexMessage[]): QueryContext {
  const isFAQ = SIMPLE_PATTERNS.some((p) => p.test(query));
  const isSimpleDefinition = query.length < 80 && query.endsWith("?");
  const isContractAnalysis = CONTRACT_PATTERNS.some((p) => p.test(query));
  const isLetterRequest = LETTER_REQUEST_PATTERNS.some((p) => p.test(query));
  const isComplexAnalysis = COMPLEX_PATTERNS.some((p) => p.test(query));

  return {
    isFAQ,
    isSimpleDefinition,
    isQuestionnaire: messages.length > 3 && query.length > 100,
    isComplexAnalysis,
    isContractAnalysis,
    isLetterRequest,
  };
}

/**
 * Sélectionne le modèle DeepSeek le plus adapté.
 *
 * Règles :
 * - FAQ et questions simples → Flash (1/6 du prix)
 * - Diagnostic, analyse complexe, contrat → Pro
 * - Défaut → Pro pour la qualité
 */
export function selectModel(query: string, context: QueryContext): DeepSeekModel {
  if (context.isFAQ || context.isSimpleDefinition) {
    return "deepseek-v4-flash";
  }

  if (context.isQuestionnaire || context.isComplexAnalysis) {
    return "deepseek-v4-pro";
  }

  if (context.isContractAnalysis) {
    return "deepseek-v4-pro";
  }

  if (context.isLetterRequest) {
    return "deepseek-v4-pro";
  }

  return "deepseek-v4-pro";
}
