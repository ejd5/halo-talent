"use client";

import type { SegmentEmoji } from "@/lib/chat-copilot/types";
import { cn } from "@/lib/utils";

const SEGMENT_CONFIG: Record<
  SegmentEmoji,
  { label: string; emoji: string; color: string; bg: string }
> = {
  whale: { label: "Baleine", emoji: "🐋", color: "var(--accent)", bg: "var(--accent)" },
  tipper: { label: "Tip", emoji: "💰", color: "var(--success)", bg: "var(--success)" },
  new: { label: "Nouveau", emoji: "✨", color: "#8B5CF6", bg: "#8B5CF6" },
  churning: { label: "Risque", emoji: "⚠️", color: "#EF4444", bg: "#EF4444" },
  regular: { label: "Régulier", emoji: "", color: "#6B7280", bg: "#6B7280" },
};

export function SegmentBadge({
  segment,
  className,
}: {
  segment: SegmentEmoji;
  className?: string;
}) {
  if (segment === "regular") return null;

  const config = SEGMENT_CONFIG[segment];

  return (
    <span
      className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium", className)}
      style={{
        backgroundColor: `${config.bg}18`,
        color: config.color,
        borderRadius: "4px",
      }}
    >
      {config.emoji && <span className="text-[11px]">{config.emoji}</span>}
      <span>{config.label}</span>
    </span>
  );
}
