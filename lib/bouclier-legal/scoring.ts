// ─── Bouclier Légal, Moteur de scoring ─────────────────

import type { RiskScore, RiskLevel, AnalyzedClause, AnalysisReport } from "./types";
import { CLAUSE_GROUPS } from "./clauses-data";

const MAX_SCORE = 100;

function getRiskLevel(percent: number): RiskLevel {
  if (percent <= 25) return "low";
  if (percent <= 50) return "moderate";
  if (percent <= 75) return "high";
  return "critical";
}

function getDiagnosis(level: RiskLevel, count: number): string {
  if (level === "low") {
    return "Votre contrat semble équilibré et ne contient pas de clauses particulièrement problématiques. Restez vigilant lors du renouvellement et conservez une copie de votre contrat actualisé.";
  }
  if (level === "moderate") {
    return "Votre contrat contient plusieurs clauses qui méritent votre attention. Bien qu'elles ne soient pas nécessairement abusives, nous vous recommandons de les renégocier avant le prochain renouvellement pour éviter tout risque futur.";
  }
  if (level === "high") {
    return `Votre contrat présente ${count} clauses préoccupantes. Certaines d'entre elles pourraient être considérées comme abusives par un tribunal. Nous vous recommandons vivement de consulter un avocat spécialisé et d'entamer des négociations avec votre agence.`;
  }
  return `Votre contrat contient ${count} clauses graves qui mettent en danger vos droits fondamentaux de créateur. Une action immédiate est nécessaire : cessez de partager vos identifiants, contactez un avocat spécialisé en droit du numérique, et envisagez une mise en demeure.`;
}

export function calculateRisk(
  clauseIds: string[],
  platforms: string[],
): AnalysisReport {
  // Build flat list of all clauses
  const allClauses = CLAUSE_GROUPS.flatMap((g) => g.clauses);

  // Find checked clauses
  const checkedDefs = allClauses.filter((c) => clauseIds.includes(c.id));

  // Calculate raw score (sum of severities, capped)
  const rawScore = checkedDefs.reduce((sum, c) => sum + c.severity, 0);
  const normalizedPercent = Math.min(Math.round((rawScore / 30) * 100), 100);
  const level = getRiskLevel(normalizedPercent);

  const riskScore: RiskScore = {
    total: rawScore,
    maxScore: 30,
    percent: normalizedPercent,
    level,
  };

  const analyzedClauses: AnalyzedClause[] = checkedDefs.map((clause) => ({
    clause,
    explanation: clause.legalArgument,
    reformulation: clause.sanaReformulation,
    action: clause.recommendedAction,
  }));

  const diagnosis = getDiagnosis(level, checkedDefs.length);

  return {
    platforms,
    riskScore,
    analyzedClauses,
    diagnosis,
  };
}

// Helper: get clause definitions by IDs (for display)
export function getClauseById(id: string) {
  return CLAUSE_GROUPS.flatMap((g) => g.clauses).find((c) => c.id === id);
}

export function getClausesByCategory(category: string) {
  return CLAUSE_GROUPS.flatMap((g) => g.clauses).filter((c) => c.category === category);
}
