import { Clock } from "lucide-react";

export function FreshnessBadge({ date }: { date: string }) {
  const formatted = new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const daysSince = Math.floor(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );

  let color: string;
  if (daysSince <= 30) color = "var(--color-success)";
  else if (daysSince <= 90) color = "#F59E0B";
  else color = "var(--color-alert)";

  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-0.5"
      style={{
        color,
        backgroundColor: `${color}12`,
      }}
    >
      <Clock size={10} />
      Vérifié le {formatted}
    </span>
  );
}
