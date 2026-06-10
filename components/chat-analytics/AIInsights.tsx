"use client";

import { Lightbulb, Clock, Smile, FileText, AlertTriangle, ArrowRight } from "lucide-react";
import type { AIInsight } from "@/lib/mock/chat-analytics";

const TYPE_ICONS: Record<string, React.ElementType> = {
  timing: Clock,
  emoji: Smile,
  script: FileText,
  churn: AlertTriangle,
};

const TYPE_COLORS: Record<string, string> = {
  timing: "#5B8FC4",
  emoji: "#D4A017",
  script: "var(--success)",
  churn: "var(--danger)",
};

export function AIInsightsPanel({ insights }: { insights: AIInsight[] }) {
  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 flex items-center justify-center rounded"
          style={{ backgroundColor: "rgba(199, 91, 57, 0.15)" }}
        >
          <Lightbulb size={12} style={{ color: "var(--accent)" }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          Insights IA
        </h3>
      </div>

      <div className="space-y-2">
        {insights.map((insight) => {
          const Icon = TYPE_ICONS[insight.type] || Lightbulb;
          const accentColor = TYPE_COLORS[insight.type] || "var(--accent)";

          return (
            <div
              key={insight.id}
              className="rounded-lg p-3 transition-colors"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderLeft: `3px solid ${accentColor}`,
              }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-6 h-6 flex items-center justify-center rounded shrink-0 mt-0.5"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Icon size={11} style={{ color: accentColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    {insight.message}
                  </p>
                  <button
                    className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-medium transition-opacity hover:opacity-70"
                    style={{ color: accentColor }}
                  >
                    {insight.ctaLabel}
                    <ArrowRight size={9} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
