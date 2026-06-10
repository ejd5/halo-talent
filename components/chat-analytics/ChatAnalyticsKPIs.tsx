"use client";

import { MessageCircle, Reply, DollarSign, Clock, ShieldCheck } from "lucide-react";
import type { ChatAnalyticsKPIs as KPIs } from "@/lib/mock/chat-analytics";

const KPI_ICONS = [MessageCircle, Reply, DollarSign, Clock, ShieldCheck] as const;

function formatKpiValue(key: string, value: number): string {
  if (key === "chatRevenue") return `${value.toLocaleString()} €`;
  if (key === "avgCreatorResponseTime") {
    if (value < 60) return `${value}s`;
    return `${Math.floor(value / 60)}m ${value % 60}s`;
  }
  if (key === "avgToneGuardScore") return `${value}%`;
  return value.toLocaleString();
}

function formatChange(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatChangeLabel(key: string, value: number): string {
  const positiveIsGood = !["avgCreatorResponseTime"].includes(key);
  const isGood = value >= 0 ? positiveIsGood : !positiveIsGood;
  return isGood ? "hausse" : "baisse";
}

export function ChatAnalyticsKPIs({ data }: { data: KPIs }) {
  const entries = Object.entries(data).filter(([k]) => !k.endsWith("Change"));
  const changeEntries = Object.entries(data).filter(([k]) => k.endsWith("Change"));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
      {entries.map(([key, value], i) => {
        const changeKey = `${key}Change`;
        const change = changeEntries.find(([k]) => k === changeKey)?.[1] as number | undefined;
        const Icon = KPI_ICONS[i];

        return (
          <div
            key={key}
            className="rounded-lg p-3 transition-colors"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-default)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-7 h-7 flex items-center justify-center rounded"
                style={{ backgroundColor: "var(--accent-soft)" }}
              >
                <Icon size={12} style={{ color: "var(--accent)" }} />
              </div>
              <span className="text-[10px] font-medium truncate" style={{ color: "var(--text-secondary)" }}>
                {key === "messagesSent" ? "Messages envoyés"
                  : key === "avgFanResponseRate" ? "Taux réponse fans"
                  : key === "chatRevenue" ? "Revenu chat"
                  : key === "avgCreatorResponseTime" ? "Temps réponse"
                  : "Score TG"}
              </span>
            </div>
            <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              {formatKpiValue(key, value)}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                <span
                  className="text-[10px] font-medium"
                  style={{
                    color: change >= 0 ? "var(--success)" : "var(--danger)",
                  }}
                >
                  {formatChange(change)}
                </span>
                <span className="text-[9px]" style={{ color: "var(--text-tertiary)" }}>
                  {formatChangeLabel(key, change)}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
