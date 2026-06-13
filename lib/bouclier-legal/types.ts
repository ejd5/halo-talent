// ─── Bouclier Légal, Types ──────────────────────────────

export type ClauseCategory =
  | "account_control"
  | "financial"
  | "contractual"
  | "content_rights"
  | "communication"
  | "psychological";

export interface ClauseDef {
  id: string;
  label: string;
  description: string;
  category?: ClauseCategory;  // Derived from parent group
  severity: number;           // 1-5
  legalArgument: string;      // Pourquoi c'est abusif
  recommendedAction: string;
  sanaReformulation: string;  // Exemple de clause saine
  legalRef?: string;          // Référence légale (CGU, loi)
}

export interface ClauseGroup {
  category: ClauseCategory;
  label: string;
  icon: string;
  severityLabel: "haute" | "moyenne-haute" | "moyenne";
  clauses: ClauseDef[];
}

export type RiskLevel = "low" | "moderate" | "high" | "critical";

export interface RiskScore {
  total: number;
  maxScore: number;
  percent: number;
  level: RiskLevel;
}

export interface AnalyzedClause {
  clause: ClauseDef;
  explanation: string;
  reformulation: string;
  action: string;
}

export interface AnalysisReport {
  platforms: string[];
  riskScore: RiskScore;
  analyzedClauses: AnalyzedClause[];
  diagnosis: string;
  aiDiagnosis?: string;
}

export type WizardStep = "welcome" | "platforms" | "clauses" | "result";

export const PLATFORMS = [
  { id: "onlyfans", label: "OnlyFans" },
  { id: "fansly", label: "Fansly" },
  { id: "mym", label: "MYM" },
  { id: "instagram", label: "Instagram" },
  { id: "youtube", label: "YouTube" },
  { id: "other", label: "Autre plateforme" },
] as const;

export const RISK_COLORS: Record<RiskLevel, { text: string; bg: string; gauge: string; label: string }> = {
  low:      { text: "#10B981", bg: "rgba(16,185,129,0.12)", gauge: "#10B981", label: "Faible" },
  moderate: { text: "#F59E0B", bg: "rgba(245,158,11,0.12)", gauge: "#F59E0B", label: "Moyen" },
  high:     { text: "#EF4444", bg: "rgba(239,68,68,0.12)", gauge: "#EF4444", label: "Élevé" },
  critical: { text: "#111827", bg: "rgba(17,24,39,0.12)", gauge: "#111827", label: "Critique" },
};
