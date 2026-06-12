"use client";

import { useState } from "react";
import { Pause, AlertTriangle } from "lucide-react";

interface Props {
  isPaused: boolean;
  onToggle: () => Promise<boolean>;
}

export function EmergencyPauseButton({ isPaused, onToggle }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (isPaused) {
      setLoading(true);
      await onToggle();
      setLoading(false);
      return;
    }

    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading(true);
    const ok = await onToggle();
    setLoading(false);
    if (ok) setConfirming(false);
  };

  const handleCancel = () => setConfirming(false);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {confirming && !isPaused && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 6,
          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
        }}>
          <AlertTriangle size={12} style={{ color: "#f59e0b" }} />
          <span style={{ fontSize: 10, color: "#f87171", fontWeight: 500 }}>
            Confirmer la pause ?
          </span>
          <button
            onClick={handleClick}
            disabled={loading}
            style={{
              padding: "3px 10px", borderRadius: 4, border: "none",
              background: "rgba(239,68,68,0.15)", color: "#f87171",
              fontSize: 10, fontWeight: 600, cursor: "pointer",
            }}
          >
            {loading ? "..." : "Oui, pauser"}
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: "3px 8px", borderRadius: 4, border: "none",
              background: "rgba(245,240,235,0.05)", color: "rgba(245,240,235,0.4)",
              fontSize: 10, cursor: "pointer",
            }}
          >
            Annuler
          </button>
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={loading}
        title={isPaused ? "Réactiver le module" : "Pause d'urgence"}
        style={{
          display: "flex", alignItems: "center", gap: 5, padding: "6px 14px",
          borderRadius: 6, border: `1px solid ${isPaused ? "#34d39930" : "#ef444430"}`,
          background: isPaused ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)",
          color: isPaused ? "#34d399" : "#f87171", cursor: "pointer", fontSize: 11, fontWeight: 600,
          opacity: loading ? 0.5 : 1,
        }}
      >
        {isPaused ? (
          <PlayIcon size={12} />
        ) : (
          <Pause size={12} />
        )}
        {isPaused ? "Réactiver" : "Pause urgence"}
      </button>
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
