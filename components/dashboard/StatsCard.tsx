"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatsCardProps = {
  label: string;
  value: string;
  trend?: { value: string; positive: boolean };
  mono?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function StatsCard({
  label,
  value,
  trend,
  mono = true,
  className,
  children,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative border border-ink/5 p-6 hover:border-ink/10 transition-colors group",
        className
      )}
    >
      <p className="text-xs text-ink-muted uppercase tracking-[0.15em] mb-2">
        {label}
      </p>
      <p
        className={cn(
          "font-display text-3xl md:text-4xl text-ink",
          mono && "font-mono text-2xl md:text-3xl"
        )}
      >
        {value}
      </p>
      {trend && (
        <div
          className={cn(
            "flex items-center gap-1 mt-2 text-xs",
            trend.positive ? "text-success" : "text-alert"
          )}
        >
          {trend.positive ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          <span>{trend.value}</span>
        </div>
      )}
      {children}
    </div>
  );
}
