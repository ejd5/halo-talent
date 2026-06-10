"use client";

import { useState } from "react";
import { DEMO_CONVERSATIONS, type PersonaId } from "@/lib/mock/demo-data";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { MessageSquare, TrendingUp, Zap } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const priorityColors: Record<string, string> = {
  high: "var(--danger)",
  medium: "#F59E0B",
  low: "rgba(255,255,255,0.3)",
};

export function DemoRevenueInboxStep({ persona }: { persona: PersonaId }) {
  const locale = useLocale();
  const l = norm(locale);
  const [expandedConv, setExpandedConv] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleReply = (id: string) => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  };

  return (
    <div className="animate-fade-in space-y-3 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={14} style={{ color: "var(--success)" }} />
        <h3 className="text-sm font-medium" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          {t("demo_new.inbox.title", l)}
        </h3>
      </div>

      {DEMO_CONVERSATIONS.map((conv) => {
        const isExpanded = expandedConv === conv.id;
        return (
          <div
            key={conv.id}
            className="transition-all"
            style={{
              background: "var(--bg-card)",
              border: isExpanded ? "1px solid rgba(199,91,57,0.2)" : "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <button
              onClick={() => setExpandedConv(isExpanded ? null : conv.id)}
              className="w-full flex items-start gap-3 p-3 text-left"
            >
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0"
                style={{ backgroundColor: "rgba(199,91,57,0.15)", color: "var(--accent)" }}
              >
                {conv.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{conv.name}</span>
                  <span className="text-[8px] px-1 py-px" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
                    {conv.platformIcon}
                  </span>
                  {/* Priority dot */}
                  <div className="w-1.5 h-1.5 rounded-full ml-auto shrink-0" style={{ backgroundColor: priorityColors[conv.priority] }} />
                </div>
                <p className="text-[10px] mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.5)" }}>
                  {conv.preview}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {t("demo_new.inbox.revenue", l).replace("{n}", String(conv.revenuePotential))}
                  </span>
                  {conv.priority === "high" && (
                    <span className="text-[8px] flex items-center gap-0.5" style={{ color: "var(--danger)" }}>
                      <Zap size={8} />
                      {t("demo_new.inbox.priority_high", l)}
                    </span>
                  )}
                </div>
              </div>
            </button>

            {/* Expanded AI suggestion */}
            {isExpanded && (
              <div className="px-3 pb-3 border-t" style={{ borderColor: "var(--border-default)" }}>
                <div className="mt-2 flex items-start gap-2">
                  <MessageSquare size={12} style={{ color: "var(--accent)", marginTop: 2 }} />
                  <div>
                    <p className="text-[8px] font-medium mb-0.5" style={{ color: "var(--accent)" }}>
                      {t("demo_new.inbox.ai_reply", l)}
                    </p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {conv.aiSuggestion}
                    </p>
                    <button
                      onClick={() => handleReply(conv.id)}
                      className="mt-1.5 text-[9px] px-2 py-0.5 transition-colors"
                      style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}
                    >
                      {t("demo_new.inbox.reply", l)}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="p-2 text-[9px] text-center transition-opacity"
          style={{ backgroundColor: "rgba(199,91,57,0.06)", border: "1px solid rgba(199,91,57,0.1)", color: "rgba(255,255,255,0.6)" }}
        >
          💡 {t("demo_new.inbox.tooltip", l)}
        </div>
      )}

      {/* CTA */}
      <div className="text-center pt-2">
        <a
          href="/dashboard/atlas/inbox"
          className="inline-block px-4 py-1.5 text-[10px] transition-colors"
          style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}
        >
          {t("demo_new.inbox.view_inbox", l)} →
        </a>
      </div>
    </div>
  );
}
