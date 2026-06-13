// ─── WTF Lex, Guardrails (Express compliance) ──────────────
// Détection des demandes hors-champ, urgences, cas complexes.
// Version Express : terminologie conforme (pas de "conseil juridique",
// pas d'"avocat partenaire").

import type { GuardrailResult } from "../types";

// Mots-clés d'urgence
const EMERGENCY_KEYWORDS: { words: string[]; message: string }[] = [
  {
    words: ["menace", "menacer", "menaçant"],
    message: "Si vous êtes victime de menaces, contactez immédiatement le 17 (police) ou le 3919 (violences femmes).",
  },
  {
    words: ["viol", "violé", "violée", "agression sexuelle"],
    message: "Si vous êtes victime de viol ou d'agression sexuelle, contactez le 17 (police) ou le 3919. Vous pouvez aussi appeler le 119 si vous êtes mineur(e).",
  },
  {
    words: ["suicide", "suicidaire", "mourir", "veux plus vivre"],
    message: "Si vous traversez une crise, appelez le 3114 (ligne de prévention du suicide, 24h/24). Vous n'êtes pas seul(e).",
  },
  {
    words: ["violence", "violent", "battre", "frappé"],
    message: "Si vous êtes victime de violences, appelez le 17 (police) ou le 3919. Ne restez pas seul(e).",
  },
  {
    words: ["harcèlement grave", "harcèlement sexuel", "cyberharcèlement"],
    message: "Le harcèlement est puni par la loi. Signalez-le sur la plateforme concernée, bloquez l'auteur, et contactez le 3018 (cyberharcèlement).",
  },
];

// Motifs d'escalade vers l'équipe WTF
const ESCALATION_PATTERNS = [
  { regex: /(\d{4,})\s*€|(\d+)\s*000\s*euros?/i, reason: "Montant significatif en jeu" },
  { regex: /proc[èe]s|tribunal|plainte|judiciaire/i, reason: "Procédure judiciaire mentionnée" },
  { regex: /p[ée]nal|prison|délit|criminel?/i, reason: "Cas à caractère pénal" },
  { regex: /(france|usa|uk|espagne|allemagne|belgique|suisse).*(abonné|plateforme)/i, reason: "Situation multi-juridictionnelle" },
];

// Sujets hors-champ
const OUT_OF_SCOPE_PATTERNS = [
  { regex: /divorce|séparation|garde d'enfant|pension alimentaire/i, topic: "droit de la famille" },
  { regex: /achat|vente\s+(maison|appartement|immobilier)|bail\s+locatif/i, topic: "droit immobilier" },
  { regex: /succession|héritage|testament|donation/i, topic: "droit des successions" },
  { regex: /créer\s+(mon\s+)?entreprise|sarl|sas|eurl|micro-entreprise/i, topic: "droit des sociétés" },
];

// Phrases indiquant une demande d'orientation personnalisée
const PERSONAL_ADVICE_PATTERNS = [
  /\bque\s+dois-je\s+faire\b/i,
  /\bai-je\s+le\s+droit\b/i,
  /\bvais-je\s+gagner\b/i,
  /\bpuis-je\s+(les|le|la)\s+attaquer\b/i,
  /\bcombien\s+vais-je\s+percevoir\b/i,
  /\best-ce\s+que\s+je\s+dois\b/i,
  /what\s+should\s+i\s+do/i,
  /can\s+i\s+sue/i,
  /will\s+i\s+win/i,
];

/**
 * Vérifie les guardrails sur un message utilisateur.
 * Retourne le résultat avec l'action recommandée.
 * Conforme à la terminologie Express : pas de "conseil juridique",
 * pas d'"avocat partenaire".
 */
export function checkGuardrails(message: string): GuardrailResult {
  // 1. Urgences (priorité absolue)
  for (const emergency of EMERGENCY_KEYWORDS) {
    for (const word of emergency.words) {
      if (message.toLowerCase().includes(word.toLowerCase())) {
        return {
          safe: false,
          reason: emergency.message,
          action: "emergency",
        };
      }
    }
  }

  // 2. Sujets hors-champ
  for (const pattern of OUT_OF_SCOPE_PATTERNS) {
    if (pattern.regex.test(message)) {
      return {
        safe: false,
        reason: `Ce sujet (${pattern.topic}) ne fait pas partie de mon domaine d'assistance spécialisé pour créateurs. Je vous recommande de consulter une équipe spécialisée dans ce domaine.`,
        action: "redirect",
      };
    }
  }

  // 3. Escalade pour cas complexes
  for (const pattern of ESCALATION_PATTERNS) {
    if (pattern.regex.test(message)) {
      return {
        safe: true,
        reason: `Cette situation semble complexe : ${pattern.reason}. Je vous fournis une information générale et vous propose de faire appel à notre service de rédaction pour obtenir un document officiel.`,
        action: "escalate",
      };
    }
  }

  // 4. Détection de demande d'orientation personnalisée
  for (const pattern of PERSONAL_ADVICE_PATTERNS) {
    if (pattern.test(message)) {
      return {
        safe: true,
        reason: "Je comprends que vous cherchez une orientation. Je vais vous fournir une information juridique générale sur le sujet.",
        action: "redirect",
      };
    }
  }

  // 5. Tout est OK
  return { safe: true };
}
