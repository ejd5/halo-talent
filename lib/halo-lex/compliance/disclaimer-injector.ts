// ─── Disclaimer Injector ──────────────────────────────────────
// Injecte les mentions légales obligatoires dans les réponses
// et les documents générés par Halo Lex.

export type DisclaimerMode = "chat" | "document" | "full";

const DISCLAIMERS: Record<DisclaimerMode, string> = {
  chat:
    "ℹ️ Information juridique générale. Halo Lex ne constitue pas un acte d'avocat au sens de la loi du 31 décembre 1971. Pour une représentation juridique, consultez un avocat inscrit au barreau.",
  document:
    "Document préparé avec l'assistance de Halo Talent. Information juridique générale, ne constitue pas un acte d'avocat. Le créateur reste seul responsable de l'envoi et des conséquences de ce document.",
  full:
    "Halo Lex fournit une assistance à la rédaction juridique et une information juridique générale. Cela ne constitue pas un acte d'avocat ni un conseil juridique personnalisé au sens de la loi du 31 décembre 1971. Pour une représentation juridique ou un conseil adapté à votre situation personnelle, veuillez consulter un avocat inscrit au barreau.",
};

/**
 * Récupère le disclaimer approprié selon le mode.
 */
export function getDisclaimer(mode: DisclaimerMode = "chat"): string {
  return DISCLAIMERS[mode];
}

/**
 * Injecte le disclaimer à la fin d'une réponse.
 */
export function injectDisclaimer(
  text: string,
  mode: DisclaimerMode = "chat",
  separator: string = "\n\n---\n"
): string {
  // Éviter les doublons
  if (text.includes(DISCLAIMERS.chat) || text.includes(DISCLAIMERS.document)) {
    return text;
  }

  return text + separator + DISCLAIMERS[mode];
}

/**
 * Vérifie qu'un texte contient un disclaimer.
 */
export function hasDisclaimer(text: string): boolean {
  return (
    text.includes("Information juridique générale") ||
    text.includes("ne constitue pas un acte d'avocat")
  );
}

/**
 * Génère le pied de page pour les documents PDF.
 */
export function getDocumentFooter(): string {
  return [
    "────────────────────────────────────────",
    "Document préparé avec l'assistance de Halo Talent.",
    "Information juridique générale, ne constitue pas un acte d'avocat.",
    "Le créateur reste seul responsable de l'envoi et des conséquences de ce document.",
  ].join("\n");
}

/**
 * Génère l'en-tête de document.
 */
export function getDocumentHeader(): string {
  return [
    "HALO TALENT — Assistance à la rédaction juridique",
    "Plateforme de gestion créateur · halo-talent.com",
    "",
  ].join("\n");
}
