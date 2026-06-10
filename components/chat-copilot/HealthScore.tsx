"use client";

import { cn } from "@/lib/utils";

function getScoreColor(score: number): string {
  if (score >= 67) return "var(--success)";
  if (score >= 34) return "var(--warning)";
  return "var(--danger)";
}

function getScoreLabel(score: number): string {
  if (score >= 67) return "Bon";
  if (score >= 34) return "Moyen";
  return "Faible";
}

export function HealthScore({
  score,
  size = "md",
  className,
}: {
  score: number;
  size?: "sm" | "md";
  className?: string;
}) {
  const color = getScoreColor(score);
  const circleSize = size === "sm" ? 28 : 36;
  const fontSize = size === "sm" ? "9px" : "11px";
  const barH = size === "sm" ? 3 : 4;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex items-center justify-center shrink-0 font-semibold"
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          color,
          fontSize,
        }}
      >
        {score}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
          Santé
        </span>
        <span className="text-[10px]" style={{ color }}>
          {getScoreLabel(score)}
        </span>
      </div>
    </div>
  );
}
