export function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 10) return "à l'instant";
  const units: [string, number][] = [
    ["an", 31536000], ["mois", 2592000], ["semaine", 604800],
    ["jour", 86400], ["h", 3600], ["min", 60], ["s", 1],
  ];
  for (const [label, seconds] of units) {
    const val = Math.floor(diff / seconds);
    if (val >= 1) {
      const plural = val > 1 && !label.endsWith("s") ? `${label}s` : label;
      return `il y a ${val} ${plural}`;
    }
  }
  return "à l'instant";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", notation: "compact",
  }).format(value);
}

export function sparklinePath(data: number[], width = 80, height = 28): string {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const xStep = width / (data.length - 1);
  return data
    .map((v, i) => {
      const x = i * xStep;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}
