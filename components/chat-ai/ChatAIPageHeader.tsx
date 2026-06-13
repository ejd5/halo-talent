"use client";

import { Pause } from "lucide-react";
import { ChatAIStatusBadges } from "./ChatAIStatusBadges";

interface Props {
  isActive: boolean;
  isPaused: boolean;
  demoMode: boolean;
  consentComplete: boolean;
  onPauseToggle?: () => void;
}

export function ChatAIPageHeader({ isActive, isPaused, demoMode, consentComplete, onPauseToggle }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{
            fontSize: 22, fontWeight: 700, color: "var(--text-primary)",
            fontFamily: "var(--font-display)", letterSpacing: "-0.02em", marginBottom: 4,
          }}>
            WTF Sovereign Chat AI
          </h1>
          <p style={{ fontSize: 12, color: "rgba(245,240,235,0.4)", maxWidth: 480 }}>
            Revenue Inbox, Fan Brain et brouillons IA validés humainement.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ChatAIStatusBadges isActive={isActive} isPaused={isPaused} demoMode={demoMode} consentComplete={consentComplete} />

          {onPauseToggle && (
            <button
              onClick={onPauseToggle}
              title={isPaused ? "Réactiver le module" : "Pause d'urgence"}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "6px 14px",
                borderRadius: 6, border: `1px solid ${isPaused ? "#34d39930" : "#ef444430"}`,
                background: isPaused ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)",
                color: isPaused ? "#34d399" : "#f87171", cursor: "pointer", fontSize: 11, fontWeight: 600,
              }}
            >
              {isPaused ? <PlayIcon size={12} /> : <Pause size={12} />}
              {isPaused ? "Réactiver" : "Pause urgence"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PlayIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
