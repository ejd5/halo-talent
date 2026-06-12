"use client";

import { MessageCircle, ArrowLeft, User, Zap, AlertTriangle, ShieldAlert, UserX, ArrowUpCircle, MoreHorizontal, Image, DollarSign } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { RevenueThread } from "@/lib/mock/atlas-revenue-inbox";
import { ComplianceRiskBadge } from "./ComplianceRiskBadge";
import { AISuggestionBox } from "./AISuggestionBox";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

function formatTime(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) +
    " " +
    d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function formatAmount(n: number): string {
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`;
  return `€${n}`;
}

const CHANNEL_LABELS: Record<string, string> = {
  onlyfans: "OF",
  fansly: "FY",
  mym: "MY",
  fanvue: "FV",
  instagram: "IG DM",
  tiktok: "TK DM",
};

interface RevenueThreadPanelProps {
  thread: RevenueThread | null;
  onBack: () => void;
  onOpenProfile: () => void;
  onGenerateSuggestion: () => void;
  onApproveSuggestion: () => void;
  onEditSuggestion: () => void;
  onRejectSuggestion: () => void;
  onMarkSensitive: () => void;
  onDoNotContact: () => void;
  onEscalate: () => void;
  isGenerating: boolean;
  aiSuggestion: string | null;
  suggestionReasoning?: string;
}

export function RevenueThreadPanel({
  thread,
  onBack,
  onOpenProfile,
  onGenerateSuggestion,
  onApproveSuggestion,
  onEditSuggestion,
  onRejectSuggestion,
  onMarkSensitive,
  onDoNotContact,
  onEscalate,
  isGenerating,
  aiSuggestion,
  suggestionReasoning,
}: RevenueThreadPanelProps) {
  const locale = useLocale();
  const l = norm(locale);

  // Empty: no thread selected
  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <MessageCircle size={36} style={{ color: "rgba(255,255,255,0.1)" }} />
        <p className="text-[13px] mt-4" style={{ color: "rgba(255,255,255,0.3)" }}>
          {t("revenue_inbox.select_thread", l)}
        </p>
        <p className="text-[11px] mt-1" style={{ color: "rgba(255,255,255,0.15)" }}>
          {t("revenue_inbox.select_thread_desc", l)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* ─── Header ─── */}
      <div
        className="shrink-0 flex items-center gap-3 px-4 py-3 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)", minHeight: 56 }}
      >
        <button
          onClick={onBack}
          className="lg:hidden p-1"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          <ArrowLeft size={18} />
        </button>

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-display font-bold shrink-0"
          style={{ backgroundColor: "var(--color-accent, var(--or, #D8A95B))", color: "#fff" }}
        >
          {thread.fanName.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium truncate" style={{ color: "var(--color-base, #F5F0EB)" }}>
              {thread.fanName}
            </span>
            {thread.assignedTo && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-sm shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.35)" }}
              >
                {thread.assignedTo}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              {formatAmount(thread.revenuePotential * 10)} potentiel
            </span>
            <ComplianceRiskBadge level={thread.riskLevel} compact />
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          className="lg:hidden p-1"
          style={{ color: "rgba(255,255,255,0.4)" }}
          title={t("revenue_inbox.view_profile", l)}
        >
          <User size={18} />
        </button>
      </div>

      {/* ─── Messages ─── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {thread.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <MessageCircle size={28} style={{ color: "rgba(255,255,255,0.08)" }} />
            <p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("revenue_inbox.no_messages", l)}
            </p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.12)" }}>
              {t("revenue_inbox.no_messages_desc", l)}
            </p>
          </div>
        ) : (
          thread.messages.map((msg, idx) => {
            const isInbound = msg.direction === "inbound";
            const prevMsg = idx > 0 ? thread.messages[idx - 1] : null;
            const showDate =
              !prevMsg || new Date(msg.occurredAt).getDate() !== new Date(prevMsg.occurredAt).getDate();

            return (
              <div key={msg.id}>
                {/* Date divider */}
                {showDate && (
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
                    <span className="text-[10px] shrink-0" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {formatTime(msg.occurredAt).split(" ")[0]}
                    </span>
                    <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
                  </div>
                )}

                {/* PPV marker */}
                {msg.isPPV && (
                  <div className="flex items-center justify-center gap-2 my-3">
                    <div className="h-px w-8" style={{ backgroundColor: "rgba(16,185,129,0.2)" }} />
                    <span
                      className="text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--success)" }}
                    >
                      <DollarSign size={10} />
                      {msg.ppvName || "PPV"} · {formatAmount(msg.ppvAmount || 0)}
                    </span>
                    <div className="h-px w-8" style={{ backgroundColor: "rgba(16,185,129,0.2)" }} />
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`flex ${isInbound ? "justify-start" : "justify-end"} mb-1.5`}
                >
                  <div
                    className="max-w-[80%] rounded-sm px-3 py-2"
                    style={{
                      backgroundColor: isInbound
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(199,91,57,0.15)",
                      borderTopLeftRadius: isInbound ? "2px" : undefined,
                      borderTopRightRadius: isInbound ? undefined : "2px",
                    }}
                  >
                    <p
                      className="text-[12px] leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {msg.content}
                    </p>
                    <div
                      className="flex items-center gap-2 mt-1"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      <span className="text-[9px]">{CHANNEL_LABELS[msg.channel] || msg.channel}</span>
                      <span className="text-[9px]">{formatTime(msg.occurredAt).split(" ").slice(1).join(" ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* AISuggestionBox inline */}
        {(aiSuggestion || isGenerating) && (
          <AISuggestionBox
            suggestion={aiSuggestion || ""}
            reasoning={suggestionReasoning}
            isLoading={isGenerating}
            onApprove={onApproveSuggestion}
            onEdit={onEditSuggestion}
            onReject={onRejectSuggestion}
          />
        )}
      </div>

      {/* ─── Compliance warning bar ─── */}
      {thread.complianceWarning && (
        <div
          className="shrink-0 flex items-center gap-2 px-4 py-2 text-[11px]"
          style={{ backgroundColor: "rgba(245,158,11,0.08)", borderTop: "1px solid rgba(245,158,11,0.2)" }}
        >
          <AlertTriangle size={13} style={{ color: "#F59E0B" }} />
          <span style={{ color: "rgba(245,158,11,0.9)" }}>
            {t("revenue_inbox.compliance_warning_label", l)}: {thread.complianceWarning}
          </span>
        </div>
      )}

      {/* ─── Reply zone ─── */}
      <div
        className="shrink-0 p-4 border-t space-y-3"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {/* Generate button */}
        <button
          onClick={onGenerateSuggestion}
          disabled={isGenerating}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-sm text-[12px] font-medium font-display uppercase tracking-wider transition-all"
          style={{
            backgroundColor: isGenerating
              ? "rgba(199,91,57,0.3)"
              : "var(--color-accent, var(--or, #D8A95B))",
            color: "#fff",
            opacity: isGenerating ? 0.6 : 1,
          }}
        >
          <Zap size={14} />
          {isGenerating ? t("revenue_inbox.btn_generating", l) : t("revenue_inbox.btn_generate", l)}
        </button>

        {/* Action row */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <button
            onClick={onMarkSensitive}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] rounded-sm transition-colors"
            style={{ color: "rgba(229,72,77,0.7)" }}
          >
            <ShieldAlert size={12} />
            {t("revenue_inbox.btn_mark_sensitive", l)}
          </button>
          <button
            onClick={onDoNotContact}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] rounded-sm transition-colors"
            style={{ color: "rgba(229,72,77,0.5)" }}
          >
            <UserX size={12} />
            {t("revenue_inbox.btn_do_not_contact", l)}
          </button>
          <button
            onClick={onEscalate}
            className="flex items-center gap-1 px-2 py-1.5 text-[10px] rounded-sm transition-colors"
            style={{ color: "rgba(245,158,11,0.7)" }}
          >
            <ArrowUpCircle size={12} />
            {t("revenue_inbox.btn_escalate", l)}
          </button>
        </div>

        {/* Watermark */}
        <p
          className="text-center text-[9px] uppercase tracking-wider"
          style={{ color: "rgba(255,255,255,0.08)" }}
        >
          {t("revenue_inbox.ai_watermark", l)}
        </p>
      </div>
    </div>
  );
}
