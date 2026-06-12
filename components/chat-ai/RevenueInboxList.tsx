"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FanRiskBadge } from "./FanRiskBadge";
import { EmptyState } from "./EmptyState";

interface Fan {
  id: string; pseudonym: string; status: string; language: string;
  ltv: number; intent_score: number; churn_risk: number;
  spend_30d: number; risk_flags: string[]; platform: string;
}

interface Conversation {
  id: string; fan_id: string; platform: string; priority_score: number;
  last_message_preview: string; unread: number;
  recommended_action: string; compliance_flags: string[];
  chat_ai_fans?: Fan;
}

interface Props {
  conversations: Conversation[];
  loading: boolean;
  onSeedClick?: () => void;
}

export function RevenueInboxList({ conversations, loading, onSeedClick }: Props) {
  const router = useRouter();

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            height: 72, borderRadius: 8, background: "rgba(245,240,235,0.02)",
            animation: "pulse 2s infinite",
          }} />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <EmptyState
        title="Aucune conversation"
        description="Lance le seed demo pour peupler la base avec des données de test, ou connecte un vrai compte créateur."
        action={onSeedClick ? { label: "Lancer le seed demo", onClick: onSeedClick } : undefined}
      />
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {conversations.map((conv) => {
        const fan = conv.chat_ai_fans;
        const priority = conv.priority_score >= 80 ? "high" : conv.priority_score >= 50 ? "medium" : "low";
        const priorityColor = priority === "high" ? "#f59e0b" : priority === "medium" ? "#60a5fa" : "rgba(245,240,235,0.2)";

        return (
          <button
            key={conv.id}
            onClick={() => router.push(`/dashboard/chat-ai/inbox/${conv.id}`)}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
              borderRadius: 8, cursor: "pointer", textAlign: "left", width: "100%",
              border: "1px solid rgba(245,240,235,0.05)", background: "rgba(245,240,235,0.015)",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(245,240,235,0.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(245,240,235,0.015)"; }}
          >
            {/* Priority indicator */}
            <div style={{ width: 3, minHeight: 40, borderRadius: 2, background: priorityColor, flexShrink: 0 }} />

            {/* Fan info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>
                  {fan?.pseudonym || "Inconnu"}
                </span>
                {fan && <FanRiskBadge status={fan.status} riskFlags={fan.risk_flags} />}
                {conv.unread > 0 && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    minWidth: 18, height: 18, borderRadius: 9999,
                    background: "#60a5fa", color: "#000", fontSize: 10, fontWeight: 700, padding: "0 5px",
                  }}>
                    {conv.unread}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: "rgba(245,240,235,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {conv.last_message_preview || "Aucun message"}
              </div>
            </div>

            {/* Scores */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              {fan && (
                <>
                  <ScoreBadge label="LTV" value={`${fan.ltv}€`} color="#34d399" />
                  <ScoreBadge label="Int." value={fan.intent_score} color="#60a5fa" />
                  <ScoreBadge label="Churn" value={fan.churn_risk} color={fan.churn_risk > 70 ? "#f87171" : "#f59e0b"} />
                </>
              )}
              <ArrowRight size={14} style={{ color: "rgba(245,240,235,0.15)" }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function ScoreBadge({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 9, color: "rgba(245,240,235,0.25)", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}
