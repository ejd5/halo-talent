"use client";

import { Shield, AlertTriangle, Check, Ban, Info } from "lucide-react";

interface ComplianceResult {
  allowed: boolean;
  riskLevel: "low" | "medium" | "high";
  reasons: string[];
  requiredActions: string[];
  suggestedSafeAlternative: string | null;
}

interface Props {
  result: ComplianceResult | null;
  loading: boolean;
}

export function ComplianceResultPanel({ result, loading }: Props) {
  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 6,
        background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.05)",
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: 9999,
          background: "rgba(245,240,235,0.05)", animation: "pulse 2s infinite",
        }} />
        <span style={{ fontSize: 10, color: "rgba(245,240,235,0.2)" }}>Analyse en cours...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", borderRadius: 6,
        background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.05)",
      }}>
        <Info size={12} style={{ color: "rgba(245,240,235,0.2)" }} />
        <span style={{ fontSize: 10, color: "rgba(245,240,235,0.25)" }}>Aucune analyse de conformité</span>
      </div>
    );
  }

  const isBlocked = !result.allowed;
  const riskColor = result.riskLevel === "high" ? "#f87171"
    : result.riskLevel === "medium" ? "#f59e0b"
    : "#34d399";

  return (
    <div style={{
      padding: "12px 14px", borderRadius: 8,
      border: `1px solid ${isBlocked ? "rgba(239,68,68,0.2)" : "rgba(52,211,153,0.1)"}`,
      background: isBlocked ? "rgba(239,68,68,0.04)" : "rgba(52,211,153,0.03)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        {isBlocked ? (
          <Ban size={14} style={{ color: "#f87171" }} />
        ) : (
          <Shield size={14} style={{ color: "#34d399" }} />
        )}
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: isBlocked ? "#f87171" : "#34d399",
          textTransform: "uppercase",
        }}>
          {isBlocked ? "Non conforme" : "Conforme"}
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 4, marginLeft: "auto",
          padding: "2px 8px", borderRadius: 3,
          background: `${riskColor}10`, border: `1px solid ${riskColor}20`,
        }}>
          <AlertTriangle size={10} style={{ color: riskColor }} />
          <span style={{ fontSize: 9, fontWeight: 600, color: riskColor, textTransform: "uppercase" }}>
            {result.riskLevel === "high" ? "Élevé" : result.riskLevel === "medium" ? "Moyen" : "Faible"}
          </span>
        </div>
      </div>

      {/* Reasons */}
      {result.reasons.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          {result.reasons.map((reason, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 4, marginBottom: 3, fontSize: 10,
              color: isBlocked ? "rgba(248,113,113,0.7)" : "rgba(245,240,235,0.35)",
            }}>
              {isBlocked ? (
                <AlertTriangle size={10} style={{ color: "#f87171", marginTop: 1, flexShrink: 0 }} />
              ) : (
                <Check size={10} style={{ color: "#34d399", marginTop: 1, flexShrink: 0 }} />
              )}
              <span>{reason}</span>
            </div>
          ))}
        </div>
      )}

      {/* Required actions */}
      {result.requiredActions.length > 0 && (
        <div style={{
          padding: "8px 10px", borderRadius: 6,
          background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.1)", marginBottom: 8,
        }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: "#f59e0b", textTransform: "uppercase" }}>
            Actions requises
          </span>
          <div style={{ marginTop: 4 }}>
            {result.requiredActions.map((action, i) => (
              <div key={i} style={{ fontSize: 10, color: "#fbbf24", marginBottom: 2 }}>
                {action.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safe alternative */}
      {result.suggestedSafeAlternative && (
        <div style={{
          padding: "8px 10px", borderRadius: 6,
          background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.08)",
        }}>
          <span style={{ fontSize: 9, fontWeight: 600, color: "#60a5fa", textTransform: "uppercase" }}>
            Alternative suggérée
          </span>
          <div style={{ fontSize: 10, color: "rgba(245,240,235,0.45)", marginTop: 4 }}>
            {result.suggestedSafeAlternative}
          </div>
        </div>
      )}
    </div>
  );
}
