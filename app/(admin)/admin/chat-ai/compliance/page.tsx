"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle, AlertTriangle, Pause, Activity, Users } from "lucide-react";

interface ComplianceData {
  compliance: {
    totalCreators: number;
    totalPaused: number;
    consentComplete: number;
    consentIncomplete: number;
    consentRate: number;
    qaBreakdown: Record<string, number>;
    totalQaItems: number;
    riskRatio: string;
  };
  creators: Array<{
    userId: string;
    mode: string;
    isPaused: boolean;
    isActive: boolean;
    plan: string;
    consentCompleted: boolean;
    consentVersion: number;
    createdAt: string;
  }>;
}

export default function ChatAICompliancePage() {
  const [data, setData] = useState<ComplianceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/chat-ai/compliance")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setError("Erreur de chargement"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const c = data?.compliance;

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            Conformité, CHATEENG
          </h1>
        </div>
        <p style={{ fontSize: 11, color: "rgba(245,240,235,0.3)", marginTop: 4 }}>
          Vue d'ensemble de la conformité IA
        </p>
      </div>

      {loading && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ flex: "1 1 220px", height: 120, background: "rgba(245,240,235,0.02)", borderRadius: 8 }} />
          ))}
        </div>
      )}

      {error && (
        <div style={{ padding: 12, background: "rgba(196,69,54,0.08)", border: "1px solid rgba(196,69,54,0.12)", borderRadius: 6, color: "var(--danger)", fontSize: 11, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && !error && c && (
        <>
          {/* KPI cards */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <div style={{ flex: "1 1 200px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Users size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
                <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", textTransform: "uppercase" }}>Créateurs</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {c.totalCreators}
              </div>
              <div style={{ fontSize: 9, color: "rgba(245,240,235,0.15)", marginTop: 4 }}>
                {c.totalPaused} en pause
              </div>
            </div>

            <div style={{ flex: "1 1 200px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <CheckCircle size={12} style={{ color: "var(--success)" }} />
                <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", textTransform: "uppercase" }}>Consentement</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: c.consentRate >= 80 ? "var(--success)" : "var(--accent)", fontFamily: "var(--font-display)" }}>
                {c.consentRate}%
              </div>
              <div style={{ fontSize: 9, color: "rgba(245,240,235,0.15)", marginTop: 4 }}>
                {c.consentComplete} complétés / {c.consentIncomplete} incomplets
              </div>
            </div>

            <div style={{ flex: "1 1 200px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Shield size={12} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", textTransform: "uppercase" }}>QA Items</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {c.totalQaItems}
              </div>
              <div style={{ fontSize: 9, color: "rgba(245,240,235,0.15)", marginTop: 4 }}>
                Ratio risque: {c.riskRatio}
              </div>
            </div>

            <div style={{ flex: "1 1 200px", padding: 16, borderRadius: 8, background: c.totalPaused > 0 ? "rgba(196,69,54,0.03)" : "rgba(245,240,235,0.02)", border: c.totalPaused > 0 ? "1px solid rgba(196,69,54,0.08)" : "1px solid rgba(245,240,235,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                {c.totalPaused > 0 ? (
                  <Pause size={12} style={{ color: "var(--danger)" }} />
                ) : (
                  <Activity size={12} style={{ color: "var(--success)" }} />
                )}
                <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", textTransform: "uppercase" }}>Module IA</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: c.totalPaused > 0 ? "var(--danger)" : "var(--success)", fontFamily: "var(--font-display)" }}>
                {c.totalPaused > 0 ? `${c.totalPaused} en pause` : "Tous actifs"}
              </div>
            </div>
          </div>

          {/* QA Breakdown */}
          <div style={{ marginBottom: 24, padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
            <h3 style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
              Distribution QA
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(c.qaBreakdown).map(([status, count]) => {
                const colors: Record<string, string> = {
                  pending: "rgba(245,240,235,0.3)",
                  approved: "var(--success)",
                  revised: "var(--accent)",
                  blocked: "var(--danger)",
                  escalated: "var(--or, #D8A95B)",
                  false_positive: "rgba(245,240,235,0.15)",
                };
                return (
                  <div key={status} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: colors[status] || "rgba(245,240,235,0.3)" }}>
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: colors[status] || "rgba(245,240,235,0.3)" }} />
                    {status}: {count}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Creator table */}
          <div style={{ padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
            <h3 style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
              Détail par créateur
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
                    <th style={{ padding: "6px 10px", textAlign: "left", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>User ID</th>
                    <th style={{ padding: "6px 10px", textAlign: "left", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Mode</th>
                    <th style={{ padding: "6px 10px", textAlign: "center", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Consent.</th>
                    <th style={{ padding: "6px 10px", textAlign: "center", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {data.creators.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 24, textAlign: "center", color: "rgba(245,240,235,0.15)", fontSize: 12 }}>
                        Aucun créateur
                      </td>
                    </tr>
                  ) : (
                    data.creators.map((cr) => (
                      <tr key={cr.userId} style={{ borderBottom: "1px solid rgba(245,240,235,0.03)" }}>
                        <td style={{ padding: "6px 10px", fontFamily: "monospace", fontSize: 10, color: "rgba(245,240,235,0.3)" }}>
                          {cr.userId.slice(0, 12)}...
                        </td>
                        <td style={{ padding: "6px 10px", color: "var(--text-primary)" }}>{cr.mode}</td>
                        <td style={{ padding: "6px 10px", textAlign: "center" }}>
                          {cr.consentCompleted ? (
                            <CheckCircle size={12} style={{ color: "var(--success)" }} />
                          ) : (
                            <AlertTriangle size={12} style={{ color: "var(--accent)" }} />
                          )}
                        </td>
                        <td style={{ padding: "6px 10px", textAlign: "center" }}>
                          {cr.isPaused ? (
                            <Pause size={10} style={{ color: "var(--danger)" }} />
                          ) : (
                            <Activity size={10} style={{ color: "var(--success)" }} />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
