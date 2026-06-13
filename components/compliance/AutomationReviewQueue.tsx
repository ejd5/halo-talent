"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { REVIEW_QUEUE, type ReviewQueueItem, type ReviewStatus } from "@/lib/mock/atlas-compliance";
import { CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
  campaign: { color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
  message: { color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
  automation: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
};

interface AutomationReviewQueueProps {
  items?: ReviewQueueItem[];
}

export function AutomationReviewQueue({ items = REVIEW_QUEUE }: AutomationReviewQueueProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [queue, setQueue] = useState(items);
  const [tab, setTab] = useState<ReviewStatus | "all">("pending");

  const tabs: { key: typeof tab; labelKey: string }[] = [
    { key: "pending", labelKey: "compliance.queue.pending" },
    { key: "approved", labelKey: "compliance.queue.approved" },
    { key: "rejected", labelKey: "compliance.queue.rejected" },
  ];

  const filtered = queue.filter((item) => tab === "all" || item.status === tab);
  const pendingCount = queue.filter((i) => i.status === "pending").length;

  const handleApprove = (id: string) => {
    setQueue((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "approved" as const, reviewedBy: "Vous", reviewedAt: new Date().toISOString() } : i
      )
    );
  };

  const handleReject = (id: string) => {
    setQueue((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: "rejected" as const, reviewedBy: "Vous", reviewedAt: new Date().toISOString() } : i
      )
    );
  };

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("compliance.queue.title", l)}
        {pendingCount > 0 && (
          <span className="ml-2 text-[8px] px-1.5 py-0.5" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>
            {pendingCount}
          </span>
        )}
      </h2>
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        {/* Tabs */}
        <div className="flex gap-1 mb-3">
          {tabs.map((tItem) => {
            const count = queue.filter((i) => tItem.key === "all" || i.status === tItem.key).length;
            return (
              <button
                key={tItem.key}
                onClick={() => setTab(tItem.key)}
                className="text-[8px] px-2 py-1 transition-colors"
                style={{
                  background: tab === tItem.key ? "rgba(199,91,57,0.15)" : "rgba(255,255,255,0.03)",
                  color: tab === tItem.key ? "var(--accent)" : "rgba(255,255,255,0.3)",
                }}
              >
                {t(tItem.labelKey, l).replace("{n}", String(count))}
              </button>
            );
          })}
        </div>

        {/* Items */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Clock size={16} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("compliance.queue.empty", l)}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin">
            {filtered.map((item) => {
              const typeCfg = TYPE_CONFIG[item.type] || { color: "rgba(255,255,255,0.3)", bg: "rgba(255,255,255,0.03)" };
              const isPending = item.status === "pending";
              return (
                <div
                  key={item.id}
                  className="p-3"
                  style={{
                    background: isPending ? "rgba(255,255,255,0.03)" : "transparent",
                    border: "1px solid var(--border-default)",
                    opacity: isPending ? 1 : 0.6,
                  }}
                >
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] px-1.5 py-0.5" style={{ background: typeCfg.bg, color: typeCfg.color }}>
                        {t(`compliance.queue.type_${item.type}`, l)}
                      </span>
                      <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {t("compliance.queue.from", l).replace("{user}", item.createdBy)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle size={8} style={{ color: item.riskScore >= 70 ? "var(--danger)" : item.riskScore >= 40 ? "#F59E0B" : "var(--success)" }} />
                      <span className="text-[8px]" style={{ color: item.riskScore >= 70 ? "var(--danger)" : item.riskScore >= 40 ? "#F59E0B" : "var(--success)" }}>
                        {t("compliance.queue.risk_score", l).replace("{n}", String(item.riskScore))}
                      </span>
                    </div>
                  </div>

                  <p className="text-[9px] mb-1 leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    {item.content.length > 100 ? `${item.content.slice(0, 100)}...` : item.content}
                  </p>

                  <p className="text-[7px] mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {t("compliance.queue.risk_reason", l).replace("{reason}", item.riskReason)}
                  </p>

                  {isPending && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1 text-[8px] px-2 py-1 transition-colors"
                        style={{ background: "rgba(16,185,129,0.15)", color: "var(--success)" }}
                      >
                        <CheckCircle size={8} />
                        {t("compliance.queue.approve", l)}
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="flex items-center gap-1 text-[8px] px-2 py-1 transition-colors"
                        style={{ background: "rgba(229,72,77,0.15)", color: "var(--danger)" }}
                      >
                        <XCircle size={8} />
                        {t("compliance.queue.reject", l)}
                      </button>
                    </div>
                  )}

                  {!isPending && item.reviewedBy && (
                    <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {item.status === "approved" ? "✓" : "✗"} {item.reviewedBy}, {item.reviewedAt ? new Date(item.reviewedAt).toLocaleDateString("fr-FR") : ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
