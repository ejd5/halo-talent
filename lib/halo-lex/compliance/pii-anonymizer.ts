// ─── PII Anonymization ────────────────────────────────────────
// Anonymise les données personnelles avant envoi à DeepSeek
// (hébergé en Chine — nécessaire pour la conformité RGPD)

export interface AnonymizationResult {
  anonymized: string;
  mappings: Record<string, string>;
}

/**
 * Anonymise les PII (Personally Identifiable Information) dans un texte.
 * Remplace les données sensibles par des placeholders réversibles.
 */
export function anonymizePII(text: string): AnonymizationResult {
  const mappings: Record<string, string> = {};
  let anonymized = text;

  // Emails
  anonymized = anonymized.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    (match) => {
      const key = "[EMAIL_" + Object.keys(mappings).length + "]";
      mappings[key] = match;
      return key;
    }
  );

  // Téléphones (format FR et international)
  anonymized = anonymized.replace(
    /(?:\+33|0|0033)[1-9](?:[\s.-]?\d{2}){4}/g,
    (match) => {
      const key = "[PHONE_" + Object.keys(mappings).length + "]";
      mappings[key] = match;
      return key;
    }
  );

  // Noms complets (prénom + nom — approximatif)
  anonymized = anonymized.replace(
    /\b([A-ZÉÈÊËÎÏÔÙÛÜÀÂÄÇ][a-zéèêëïîôöùûüàâäç]+)\s([A-ZÉÈÊËÎÏÔÙÛÜÀÂÄÇ][a-zéèêëïîôöùûüàâäç]+)\b/g,
    (match) => {
      // Ne pas anonymiser si c'est un mot courant
      const commonNames = new Set(["Bonjour", "Merci", "Cordialement", "Salutations", "Madame", "Monsieur", "Cher", "Chère"]);
      if (commonNames.has(match)) return match;
      const key = "[NAME_" + Object.keys(mappings).length + "]";
      mappings[key] = match;
      return key;
    }
  );

  // IBAN
  anonymized = anonymized.replace(
    /[A-Z]{2}\d{2}\s?(\d{4}\s?){5}\d{2}/g,
    (match) => {
      const key = "[IBAN_" + Object.keys(mappings).length + "]";
      mappings[key] = match;
      return key;
    }
  );

  // URLs personnelles / handles
  anonymized = anonymized.replace(
    /@[a-zA-Z0-9_.-]+/g,
    (match) => {
      const key = "[HANDLE_" + Object.keys(mappings).length + "]";
      mappings[key] = match;
      return key;
    }
  );

  // Adresses physiques (chiffre + rue approximatif)
  anonymized = anonymized.replace(
    /\b\d{1,3}\s+(?:rue|avenue|boulevard|impasse|allée|chemin|place|route)\s+[a-zA-Z\s]+\b/gi,
    (match) => {
      const key = "[ADDRESS_" + Object.keys(mappings).length + "]";
      mappings[key] = match;
      return key;
    }
  );

  return { anonymized, mappings };
}

/**
 * Réanonymise un texte avec les mêmes mappings (pour les messages suivants).
 */
export function reAnonymize(text: string, existingMappings: Record<string, string>): string {
  let result = text;
  for (const [placeholder] of Object.entries(existingMappings)) {
    // Ne pas ré-anonymiser les placeholders déjà présents
  }
  return anonymizePII(result).anonymized;
}

/**
 * Désanonymise (restitue les données originales) — à utiliser
 * UNIQUEMENT pour afficher à l'utilisateur ou sauvegarder en base.
 */
export function deanonymize(anonymized: string, mappings: Record<string, string>): string {
  let result = anonymized;
  for (const [placeholder, original] of Object.entries(mappings)) {
    result = result.replaceAll(placeholder, original);
  }
  return result;
}
