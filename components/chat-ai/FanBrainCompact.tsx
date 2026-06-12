"use client";

import { Ban, ShieldAlert, Globe, Coins, TrendingUp } from "lucide-react";
import { FanRiskBadge } from "./FanRiskBadge";

interface FanData {
  id: string; pseudonym: string; platform: string; language: string;
  status: string; ltv: number; spend_30d: number;
  relationship_score: number; commercial_score: number;
  churn_risk: number; intent_score: number;
  preferences?: string[]; avoid_topics?: string[];
  risk_flags: string[]; notes?: string;
}

interface Props {
  fan: FanData | null;
  loading: boolean;
}

export function FanBrainCompact({ fan, loading }: Props) {
  if (loading) {
    return <div style={{ padding: 16, color: "rgba(245,240,235,0.2)", fontSize: 11 }}>Chargement...</div>;
  }

  if (!fan) {
    return <div style={{ padding: 16, color: "rgba(245,240,235,0.2)", fontSize: 11 }}>Fan non disponible</div>;
  }

  const isBlocked = fan.status === "do_not_contact";
  const isVulnerable = fan.risk_flags?.includes("vulnerable_fan");

  return (
    <div style={{ fontSize: 11 }}>
      {/* Blocked banner */}
      {isBlocked && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 6,
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 10,
        }}>
          <Ban size={14} color="#ef4444" />
          <span style={{ color: "#f87171", fontWeight: 600 }}>Ne pas contacter</span>
        </div>
      )}

      {isVulnerable && !isBlocked && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", borderRadius: 6,
          background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", marginBottom: 10,
        }}>
          <ShieldAlert size={14} color="#f59e0b" />
          <span style={{ color: "#fbbf24", fontWeight: 600 }}>Fan vulnérable — actions commerciales bloquées</span>
        </div>
      )}

      {/* Identity */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>{fan.pseudonym}</span>
          <FanRiskBadge status={fan.status} riskFlags={fan.risk_flags} />
        </div>
        <div style={{ display: "flex", gap: 12, color: "rgba(245,240,235,0.35)" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Globe size={10} />{fan.platform}</span>
          <span>{fan.language?.toUpperCase()}</span>
        </div>
      </div>

      {/* Financial */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Coins size={10} style={{ color: "rgba(245,240,235,0.3)" }} />
          <span style={{ color: "rgba(245,240,235,0.35)" }}>LTV</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600, marginLeft: "auto" }}>{fan.ltv}€</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <TrendingUp size={10} style={{ color: "rgba(245,240,235,0.3)" }} />
          <span style={{ color: "rgba(245,240,235,0.35)" }}>30j</span>
          <span style={{ color: "var(--text-primary)", fontWeight: 600, marginLeft: "auto" }}>{fan.spend_30d}€</span>
        </div>
      </div>

      {/* Scores */}
      <div style={{ marginBottom: 10 }}>
        <ScoreBar label="Relationnel" value={fan.relationship_score} color="#34d399" />
        <ScoreBar label="Commercial" value={fan.commercial_score} color="#60a5fa" />
        <ScoreBar label="Churn Risk" value={fan.churn_risk} color={fan.churn_risk > 70 ? "#f87171" : "#f59e0b"} invert />
        <ScoreBar label="Intention" value={fan.intent_score} color="#a78bfa" />
      </div>

      {/* Preferences & avoid */}
      {fan.preferences?.length ? (
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: "rgba(245,240,235,0.25)", fontSize: 9 }}>PRÉFÉRENCES</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 2 }}>
            {fan.preferences.map((p, i) => (
              <span key={i} style={{ padding: "1px 6px", borderRadius: 3, background: "rgba(52,211,153,0.08)", color: "#34d399", fontSize: 9 }}>{p}</span>
            ))}
          </div>
        </div>
      ) : null}

      {fan.avoid_topics?.length ? (
        <div style={{ marginBottom: 6 }}>
          <span style={{ color: "rgba(245,240,235,0.25)", fontSize: 9 }}>À ÉVITER</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, marginTop: 2 }}>
            {fan.avoid_topics.map((t, i) => (
              <span key={i} style={{ padding: "1px 6px", borderRadius: 3, background: "rgba(239,68,68,0.08)", color: "#f87171", fontSize: 9 }}>{t}</span>
            ))}
          </div>
        </div>
      ) : null}

      {fan.notes && (
        <div style={{ padding: "6px 8px", borderRadius: 4, background: "rgba(245,240,235,0.02)", fontSize: 10, color: "rgba(245,240,235,0.4)", fontStyle: "italic", marginTop: 8 }}>
          {fan.notes}
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, value, color, invert }: { label: string; value: number; color: string; invert?: boolean }) {
  const pct = invert ? 100 - value : value;
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
        <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)" }}>{label}</span>
        <span style={{ fontSize: 9, fontWeight: 600, color }}>{value}/100</span>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: "rgba(245,240,235,0.06)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, borderRadius: 2, background: color, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}
