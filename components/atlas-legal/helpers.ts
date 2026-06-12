export const SEVERITY_COLORS: Record<number, string> = {
  1: "#22c55e",
  2: "#84cc16",
  3: "#eab308",
  4: "#f97316",
  5: "#ef4444",
};

export const RISK_COLORS: Record<string, string> = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#f97316",
  critical: "#ef4444",
};

export const ACTION_LABELS: Record<string, string> = {
  cgu_scraped: "CGU mises à jour",
  clause_added: "Nouvelle clause suggérée",
  knowledge_updated: "Base juridique mise à jour",
  pattern_detected: "Motif détecté",
};

export const PLATFORM_OPTIONS = ["onlyfans", "fansly", "mym", "instagram", "tiktok", "youtube"];
export const CATEGORY_OPTIONS = ["cgu_platform", "law", "jurisprudence", "best_practice"];
export const JURISDICTION_OPTIONS = ["fr", "eu", "us", "uk", "international"];

export const IMPACT_COLORS: Record<string, string> = {
  critical: "var(--color-alert)",
  major: "#F59E0B",
  minor: "var(--color-success)",
  none: "var(--color-ink-tertiary)",
};

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const h = Math.round(mins / 60);
  if (h < 24) return `il y a ${h}h`;
  const d = Math.round(h / 24);
  return `il y a ${d}j`;
}
