const units: [string, number][] = [
  ["an", 31536000],
  ["mois", 2592000],
  ["semaine", 604800],
  ["jour", 86400],
  ["h", 3600],
  ["min", 60],
  ["s", 1],
];

export function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 10) return "à l'instant";
  for (const [label, seconds] of units) {
    const val = Math.floor(diff / seconds);
    if (val >= 1) {
      const plural = val > 1 && label !== "mois" && !label.endsWith("s") ? `${label}s` : label;
      return `il y a ${val} ${plural}`;
    }
  }
  return "à l'instant";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}
