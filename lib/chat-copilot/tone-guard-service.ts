// ─── Tone Guard v2, Pre-send message verification ───
// 5 check categories: ADN, Taboos, TOS, Legal, Quality
// 3 severity levels: pass, warning, blocking

import type { ToneCheckResult, ToneWarning, ToneGuardConfig } from "./types";
import { mockToneGuardConfig, SENSITIVITY_THRESHOLDS } from "@/lib/mock/tone-guard-settings";

// ─── Rule patterns ─────────────────────────────────────

const UNREALISTIC_PROMISES = [
  /\bje te garantis?\b/i,
  /\b(?:tu|vous) (?:vas?|allez) (?:gagner|recevoir|avoir)\b.*\bgratuit\b/i,
  /\brencontre\b.*\bréelle?\b/i,
  /\b(?:je|on) (?:peut|pourrait) se voir\b/i,
  /\bmariage\b/i,
  /\b(?:je t'|je vous )aime\b/i,
];

const TOS_VIOLATIONS = [
  /\b(?:argent|payer) (?:facile|rapide|sans effort)\b/i,
  /\bmédicament\w*\b/i,
  /\btraitement\w*\b.*\bmédical\b/i,
  /\b(?:contre|rembours)\b.*\b(?:rembours|contre)\b/i,
  /\b(?:loterie|jeu d'argent|crypto)\b/i,
  /\b(?:lien|link|http|www\.|\.com|\.fr)\b/i,
  /\bpaiement\b.*\b(?:hors|en dehors|autre)\b/i,
  /\b(?:onlyfans|fansly|mym|fanvue)\b/i,
];

const TABOO_KEYWORDS = [
  "rencontre réelle", "vrai rendez-vous", "en vrai", "irl",
  "numéro de téléphone", "whatsapp", "télégram",
  "hôtel", "chez moi", "venir chez",
];

// ─── New: Legal issue patterns ─────────────────────────

const LEGAL_ISSUES = [
  /\b(?:on peut se voir|se voir en vrai|se rencontrer)\b/i,
  /\b(?:rendez-vous|rdv)\b.*\b(?:réel|vrai|physique)\b/i,
  /\b(?:je te promets?|promesse)\b.*\b(?:exclusif|spécial|unique)\b/i,
  /\b(?:mon adresse|mon téléphone|mon numéro|ma localisation)\b/i,
  /\b(?:envoie-moi|envoie moi)\b.*\b(?:ton numéro|ton adresse|tes photos)\b.*\b(?:perso|privé)\b/i,
  /\b(?:tu me dois|tu es obligé|tu dois m'envoyer)\b/i,
];

// ─── New: Quality check patterns ───────────────────────

const SPELLING_ISSUES = /\b(?:bonjours|merçi|j'ais|compri|tranquile|vrement|bizare)\b/i;

// ─── Check a single message ────────────────────────────

export function checkTone(
  message: string,
  creatorDNA: string | null,
  config: ToneGuardConfig = mockToneGuardConfig,
): ToneCheckResult {
  const warnings: ToneWarning[] = [];
  const lower = message.toLowerCase();
  const thresholds = SENSITIVITY_THRESHOLDS[config.sensitivity];

  // Scores for each category
  const scores = { dna: 100, taboo: 100, tos: 100, legal: 100, quality: 100 };

  // ── 1. ADN Check (cohérence de ton) ──
  if (config.checks.dna) {
    let dnaScore = 100;
    if (creatorDNA) {
      const dna = creatorDNA.toLowerCase();
      const bannedWords = extractBannedWords(dna);
      for (const word of bannedWords) {
        if (lower.includes(word.toLowerCase())) {
          dnaScore = Math.max(0, dnaScore - 25);
          warnings.push({
            type: "dna_mismatch",
            severity: dnaScore < thresholds.blockingScore ? "blocking" : "warning",
            message: `Le mot "${word}" n'est pas dans le style du créateur.`,
            score: dnaScore,
          });
          break;
        }
      }
    }
    // Simulated tone coherence check (mock: random-ish based on message length)
    const coherencePenalty = /\b(?:formidable|incroyable|fantastique|superbe)\b/i.test(message) ? 0 : 10;
    dnaScore = Math.max(0, dnaScore - coherencePenalty);
    scores.dna = dnaScore;
  }

  // ── 2. Taboo Check ──
  if (config.checks.taboo) {
    for (const taboo of TABOO_KEYWORDS) {
      if (lower.includes(taboo)) {
        scores.taboo = 15;
        warnings.push({
          type: "taboo_mention",
          severity: "blocking",
          message: `Ce message mentionne un sujet sensible : "${taboo}". Modifiez-le avant d'envoyer.`,
        });
        break;
      }
    }
    // Check custom blocked words
    if (config.blockedWords.length > 0) {
      for (const word of config.blockedWords) {
        if (lower.includes(word.toLowerCase())) {
          scores.taboo = Math.min(scores.taboo, 10);
          warnings.push({
            type: "taboo_mention",
            severity: "blocking",
            message: `Ce message contient un mot bloqué : "${word}".`,
          });
          break;
        }
      }
    }
  }

  // ── 3. TOS Check ──
  if (config.checks.tos) {
    for (const pattern of TOS_VIOLATIONS) {
      if (pattern.test(message)) {
        scores.tos = 10;
        warnings.push({
          type: "tos_violation",
          severity: "blocking",
          message: "Ce message pourrait violer les conditions d'utilisation de la plateforme.",
        });
        break;
      }
    }
  }

  // ── 4. Legal Check ──
  if (config.checks.legal) {
    for (const pattern of LEGAL_ISSUES) {
      if (pattern.test(message)) {
        scores.legal = Math.max(0, scores.legal - 30);
        const severity = scores.legal < thresholds.blockingScore ? "blocking" : "warning";
        warnings.push({
          type: "legal_issue",
          severity,
          message: severity === "blocking"
            ? "Ce message contient des éléments juridiquement problématiques. Modifiez-le avant d'envoyer."
            : "Ce message pourrait être perçu comme une promesse ou un engagement juridique.",
        });
        break;
      }
    }

    // Check for personal info patterns
    const personalInfoPattern = /\b(?:0[1-9]|1\d|2[0-8])[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}\b/;
    if (personalInfoPattern.test(message)) {
      scores.legal = 0;
      warnings.push({
        type: "legal_issue",
        severity: "blocking",
        message: "Ce message semble contenir des informations personnelles (numéro de téléphone).",
      });
    }
  }

  // ── 5. Quality Check ──
  if (config.checks.quality) {
    // Spelling check
    if (SPELLING_ISSUES.test(message)) {
      scores.quality = Math.max(0, scores.quality - 20);
      warnings.push({
        type: "quality_issue",
        severity: scores.quality < thresholds.blockingScore ? "warning" : "warning",
        message: "Ce message contient des fautes d'orthographe. Vérifiez avant d'envoyer.",
      });
    }

    // Too short message for a long fan message (context-based, mock: flag very short messages)
    if (message.trim().length > 0 && message.trim().split(/\s+/).length <= 2) {
      scores.quality = Math.max(0, scores.quality - 15);
      warnings.push({
        type: "quality_issue",
        severity: "warning",
        message: "Ce message est très court. Voulez-vous ajouter plus de contexte ?",
      });
    }
  }

  // ── Compute overall ──
  const hasBlocking = warnings.some((w) => w.severity === "blocking");
  const hasWarning = warnings.some((w) => w.severity === "warning");

  return {
    overall: hasBlocking ? "blocking" : hasWarning ? "warning" : "pass",
    passed: !hasBlocking,
    warnings,
    scores,
  };
}

// ─── Helper: extract banned words from DNA string ─────

function extractBannedWords(dna: string): string[] {
  const match = dna.match(/mots interdits\s*:\s*([^.]+)/i);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((w) => w.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean);
}

// ─── Mock tone guard (simulates varied results) ───────

export function getMockToneCheck(message: string): ToneCheckResult {
  const lower = message.toLowerCase();

  // Detect blocking patterns first
  if (/\b(?:whatsapp|télégram|mon numéro|mon adresse|irl)\b/i.test(message)) {
    const warnings: ToneWarning[] = [{
      type: lower.includes("whatsapp") || lower.includes("télégram") ? "tos_violation"
        : lower.includes("mon numéro") || lower.includes("mon adresse") ? "legal_issue"
        : "taboo_mention",
      severity: "blocking",
      message: lower.includes("whatsapp") || lower.includes("télégram")
        ? "Ce message mentionne une plateforme externe interdite."
        : lower.includes("mon numéro") || lower.includes("mon adresse")
          ? "Ce message partage des informations personnelles."
          : "Ce message mentionne un sujet sensible.",
    }];
    return {
      overall: "blocking",
      passed: false,
      warnings,
      scores: { dna: 100, taboo: 10, tos: 0, legal: 0, quality: 100 },
    };
  }

  // Detect warning patterns
  if (/\b(?:garantie?|promets?|t'aime|se voir|rencontre)\b/i.test(message)) {
    const type = /\b(?:garantie?|promets?)\b/i.test(message) ? "unrealistic_promise"
      : /\b(?:se voir|rencontre)\b/i.test(message) ? "legal_issue"
      : "dna_mismatch";
    const warnings: ToneWarning[] = [{
      type,
      severity: "warning",
      message: type === "unrealistic_promise"
        ? "Attention : ce message pourrait être perçu comme une promesse irréaliste."
        : type === "legal_issue"
          ? "Attention : ce message pourrait être perçu comme un engagement juridique."
          : "Attention : le ton de ce message ne correspond pas à votre ADN.",
      score: 45,
    }];
    return {
      overall: "warning",
      passed: true,
      warnings,
      scores: type === "unrealistic_promise" ? { dna: 100, taboo: 100, tos: 60, legal: 100, quality: 100 }
        : type === "legal_issue" ? { dna: 100, taboo: 100, tos: 100, legal: 45, quality: 100 }
        : { dna: 45, taboo: 100, tos: 100, legal: 100, quality: 100 },
    };
  }

  // Pass, clean message
  return {
    overall: "pass",
    passed: true,
    warnings: [],
    scores: { dna: 95, taboo: 100, tos: 100, legal: 100, quality: 90 },
  };
}
