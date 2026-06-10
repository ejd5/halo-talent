"use client";

import type { Platform } from "@/lib/chat-copilot/types";
import { cn } from "@/lib/utils";

const PLATFORM_CONFIG: Record<Platform, { label: string; color: string }> = {
  onlyfans: { label: "OF", color: "var(--accent)" },
  fansly: { label: "FY", color: "#8B5CF6" },
  mym: { label: "MY", color: "#EC4899" },
  instagram: { label: "IG", color: "#6366F1" },
};

export function PlatformBadge({
  platform,
  className,
}: {
  platform: Platform;
  className?: string;
}) {
  const config = PLATFORM_CONFIG[platform];
  return (
    <span
      className={cn("inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider", className)}
      style={{ backgroundColor: `${config.color}20`, color: config.color, borderRadius: "3px" }}
    >
      {config.label}
    </span>
  );
}
