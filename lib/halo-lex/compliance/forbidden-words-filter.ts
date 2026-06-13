// ─── Forbidden Terms Filter ───────────────────────────────────
// Filtre les termes interdits dans les réponses de Lex avant envoi
// à l'utilisateur. Protège contre le risque d'exercice illégal du droit.

interface TermReplacement {
  forbidden: string;
  replacement: string;
}

// Termes à remplacer automatiquement avant envoi à l'utilisateur
const FORBIDDEN_TERMS: TermReplacement[] = [
  { forbidden: "conseil juridique", replacement: "information juridique" },
  { forbidden: "mon conseil est", replacement: "une approche possible serait" },
  { forbidden: "je vous conseille", replacement: "voici une option à considérer" },
  { forbidden: "je conseille", replacement: "il est possible d'envisager" },
  { forbidden: "notre conseil", replacement: "notre recommandation" },
  { forbidden: "vous devriez absolument", replacement: "il pourrait être pertinent de" },
  { forbidden: "vous devez", replacement: "il pourrait être pertinent de" },
  { forbidden: "vous devez impérativement", replacement: "selon le droit en vigueur" },
  { forbidden: "avocat partenaire", replacement: "équipe WTF" },
  { forbidden: "validé par un avocat", replacement: "validé par notre équipe" },
  { forbidden: "validé par des avocats", replacement: "validé par notre équipe" },
  { forbidden: "expert juridique", replacement: "notre équipe" },
  { forbidden: "conseiller juridique", replacement: "assistant à la rédaction" },
  { forbidden: "consultation juridique", replacement: "échange d'information" },
];

/**
 * Vérifie si un texte contient des termes interdits.
 */
export function checkForbiddenTerms(text: string): { found: boolean; terms: string[] } {
  const found: string[] = [];
  for (const { forbidden } of FORBIDDEN_TERMS) {
    const regex = new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    if (regex.test(text)) {
      found.push(forbidden);
    }
  }
  return { found: found.length > 0, terms: found };
}

/**
 * Applique le filtre des termes interdits sur un texte.
 */
export function applyTerminologyFilter(text: string): string {
  let filtered = text;

  for (const { forbidden, replacement } of FORBIDDEN_TERMS) {
    const regex = new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    filtered = filtered.replace(regex, replacement);
  }

  return filtered;
}

/**
 * Vérifie et filtre (warning + correction automatique).
 */
export function checkAndFilter(text: string): {
  filtered: string;
  corrections: { original: string; replacement: string }[];
} {
  const corrections: { original: string; replacement: string }[] = [];

  for (const { forbidden, replacement } of FORBIDDEN_TERMS) {
    const regex = new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    if (regex.test(text)) {
      corrections.push({ original: forbidden, replacement });
    }
  }

  return { filtered: applyTerminologyFilter(text), corrections };
}

/**
 * Liste des termes interdits (pour affichage admin).
 */
export function getForbiddenTermsList(): TermReplacement[] {
  return [...FORBIDDEN_TERMS];
}
