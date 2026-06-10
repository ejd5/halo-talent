"use client";

import { useState } from "react";
import { DollarSign, MessageSquare, TrendingUp, Bookmark } from "lucide-react";
import type { TopMessage } from "@/lib/mock/chat-analytics";

function truncateText(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max) + "...";
}

export function TopMessages({ messages }: { messages: TopMessage[] }) {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"revenue" | "used" | "conversion">("revenue");

  const sorted = [...messages].sort((a, b) => {
    if (sortBy === "revenue") return b.revenue - a.revenue;
    if (sortBy === "used") return b.timesUsed - a.timesUsed;
    return b.conversionRate - a.conversionRate;
  });

  const handleSave = (id: string) => {
    setSavedIds((prev) => new Set(prev).add(id));
  };

  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Top messages
          </h3>
          <p className="text-[10px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
            Messages ayant généré le plus de revenus
          </p>
        </div>
      </div>

      {/* Sort controls */}
      <div className="flex gap-1 mb-3">
        {[
          { key: "revenue" as const, label: "Revenus", icon: DollarSign },
          { key: "used" as const, label: "Utilisations", icon: MessageSquare },
          { key: "conversion" as const, label: "Conversion", icon: TrendingUp },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className="flex items-center gap-1 px-2 py-1 text-[9px] font-medium rounded transition-colors"
            style={{
              backgroundColor: sortBy === key ? "var(--accent-soft)" : "transparent",
              color: sortBy === key ? "var(--accent)" : "var(--text-tertiary)",
              border: "1px solid",
              borderColor: sortBy === key ? "var(--accent-border)" : "var(--border-default)",
            }}
          >
            <Icon size={10} />
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-1.5 max-h-[420px] overflow-y-auto custom-scrollbar pr-1">
        {sorted.map((msg, i) => (
          <div
            key={msg.id}
            className="rounded-lg p-2.5 transition-colors"
            style={{ backgroundColor: "var(--bg-surface)" }}
          >
            <div className="flex items-start gap-2">
              <span
                className="text-[9px] font-bold mt-0.5 shrink-0 w-4 text-center"
                style={{ color: i < 3 ? "var(--accent)" : "var(--text-tertiary)" }}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {truncateText(msg.text, 90)}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <MetricBadge icon={DollarSign} value={`${msg.revenue} €`} />
                  <MetricBadge icon={MessageSquare} value={`${msg.timesUsed}x`} />
                  <MetricBadge icon={TrendingUp} value={`${msg.conversionRate}%`} color="var(--success)" />
                </div>
              </div>
              <button
                onClick={() => handleSave(msg.id)}
                className="shrink-0 p-1 rounded transition-colors"
                style={{
                  color: savedIds.has(msg.id) ? "var(--accent)" : "var(--text-tertiary)",
                }}
                title="Sauvegarder comme script"
              >
                <Bookmark size={11} fill={savedIds.has(msg.id) ? "var(--accent)" : "none"} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricBadge({
  icon: Icon,
  value,
  color,
}: {
  icon: React.ElementType;
  value: string;
  color?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-medium"
      style={{ color: color || "var(--text-secondary)" }}
    >
      <Icon size={9} />
      {value}
    </span>
  );
}
