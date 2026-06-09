"use client";

import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "card" | "avatar" | "chart" | "hero";

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  lines = 1,
}: {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}) {
  const base = "relative overflow-hidden bg-[var(--color-base)] before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-[var(--color-accent)]/10 before:to-transparent before:animate-[shimmer_1.5s_infinite] motion-reduce:before:animate-none motion-reduce:bg-[var(--color-base)]";

  if (variant === "avatar") {
    return (
      <div
        className={cn(base, "rounded-full", className)}
        style={{ width: width ?? 40, height: height ?? 40, aspectRatio: "1" }}
        aria-hidden="true"
      />
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("border border-[var(--color-border)]", className)} style={{ backgroundColor: "var(--color-card)" }} aria-hidden="true">
        <div className={cn(base, "aspect-[4/3]")} />
        <div className="p-3 space-y-2">
          <div className={cn(base, "h-3 w-3/4")} />
          <div className={cn(base, "h-2 w-1/2")} />
          <div className="flex gap-1 pt-1">
            <div className={cn(base, "h-3 w-12")} />
            <div className={cn(base, "h-3 w-16")} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className={cn("border border-[var(--color-border)] p-4", className)} style={{ backgroundColor: "var(--color-card)" }} aria-hidden="true">
        <div className={cn(base, "h-3 w-1/3 mb-4")} />
        <div className="flex items-end gap-2 h-32">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className={cn(base, "flex-1")} style={{ height: `${20 + Math.random() * 80}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cn("border border-[var(--color-border)]", className)} style={{ backgroundColor: "var(--color-card)" }} aria-hidden="true">
        <div className={cn(base, "aspect-[21/9]")} />
        <div className="p-6 space-y-3">
          <div className={cn(base, "h-6 w-1/3")} />
          <div className={cn(base, "h-4 w-2/3")} />
          <div className={cn(base, "h-4 w-1/2")} />
        </div>
      </div>
    );
  }

  // Text variant
  if (lines > 1) {
    return (
      <div className={cn("space-y-2", className)} aria-hidden="true">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(base, "h-3")}
            style={{ width: i === lines - 1 ? "60%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(base, className)}
      style={{ width, height: height ?? 12 }}
      aria-hidden="true"
    />
  );
}
