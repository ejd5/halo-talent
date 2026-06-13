"use client";

import { useState, useEffect } from "react";
import { Activity, Users, FileText, Bot } from "lucide-react";

interface UsageData {
  usage: {
    totalUsers: number;
    demoUsers: number;
    productionUsers: number;
    totalDrafts: number;
    totalPpvRecommendations: number;
    totalAuditEvents: number;
    draftsPerUser: number;
    modeDistribution: Record<string, number>;
    planDistribution: Record<string, number>;
    dailyDrafts: Record<string, number>;
    dailyPpv: Record<string, number>;
    topActions: Record<string, number>;
  };
}

export default function ChatAIUsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/chat-ai/usage")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setData(d); })
      .catch(() => { if (!cancelled) setError("Erreur de chargement"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const u = data?.usage;

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          Usage, Chat AI
        </h1>
        <p style={{ fontSize: 11, color: "rgba(245,240,235,0.3)", marginTop: 4 }}>
          Statistiques d'utilisation du module Sovereign Chat AI
        </p>
      </div>

      {loading && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ flex: "1 1 180px", height: 100, background: "rgba(245,240,235,0.02)", borderRadius: 8 }} />
          ))}
        </div>
      )}

      {error && (
        <div style={{ padding: 12, background: "rgba(196,69,54,0.08)", border: "1px solid rgba(196,69,54,0.12)", borderRadius: 6, color: "var(--danger)", fontSize: 11, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {!loading && !error && u && (
        <>
          {/* KPI Row */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <div style={{ flex: "1 1 180px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Users size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
                <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", textTransform: "uppercase" }}>Utilisateurs</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {u.totalUsers}
              </div>
              <div style={{ fontSize: 9, color: "rgba(245,240,235,0.15)", marginTop: 4 }}>
                {u.productionUsers} production / {u.demoUsers} demo
              </div>
            </div>

            <div style={{ flex: "1 1 180px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <FileText size={12} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", textTransform: "uppercase" }}>Drafts</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {u.totalDrafts}
              </div>
              <div style={{ fontSize: 9, color: "rgba(245,240,235,0.15)", marginTop: 4 }}>
                {u.draftsPerUser} / utilisateur
              </div>
            </div>

            <div style={{ flex: "1 1 180px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Bot size={12} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", textTransform: "uppercase" }}>PPV Recos</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {u.totalPpvRecommendations}
              </div>
            </div>

            <div style={{ flex: "1 1 180px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <Activity size={12} style={{ color: "var(--accent)" }} />
                <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", textTransform: "uppercase" }}>Événements audit</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {u.totalAuditEvents}
              </div>
            </div>
          </div>

          {/* Mode & Plan Distribution */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
            <div style={{ flex: "1 1 300px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <h3 style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
                Distribution par mode
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(u.modeDistribution).sort(([, a], [, b]) => b - a).map(([mode, count]) => (
                  <div key={mode} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "var(--text-primary)", minWidth: 120 }}>{mode}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(245,240,235,0.04)" }}>
                      <div style={{
                        height: 6, borderRadius: 3, background: "var(--accent)",
                        width: `${(count / u.totalUsers) * 100}%`,
                      }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-primary)", minWidth: 30, textAlign: "right" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ flex: "1 1 300px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
              <h3 style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
                Distribution par plan
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(u.planDistribution).sort(([, a], [, b]) => b - a).map(([plan, count]) => (
                  <div key={plan} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 10, color: "var(--text-primary)", minWidth: 100, textTransform: "capitalize" }}>{plan}</span>
                    <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(245,240,235,0.04)" }}>
                      <div style={{
                        height: 6, borderRadius: 3, background: "var(--success)",
                        width: `${(count / u.totalUsers) * 100}%`,
                      }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-primary)", minWidth: 30, textAlign: "right" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div style={{ marginBottom: 24, padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
            <h3 style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
              Actions les plus fréquentes
            </h3>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(u.topActions).sort(([, a], [, b]) => b - a).slice(0, 10).map(([action, count]) => (
                <div
                  key={action}
                  style={{
                    padding: "4px 10px", borderRadius: 4,
                    background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)",
                    fontSize: 10, color: "var(--text-primary)",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span style={{ color: "rgba(245,240,235,0.3)", fontSize: 9 }}>{action}</span>
                  <span style={{ fontWeight: 600, color: "var(--accent)", fontFamily: "var(--font-display)" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily charts (text-based) */}
          {(Object.keys(u.dailyDrafts).length > 0 || Object.keys(u.dailyPpv).length > 0) && (
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 300px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
                <h3 style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
                  Drafts / jour (30j)
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
                  {Object.entries(u.dailyDrafts).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => (
                    <div key={date} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 9 }}>
                      <span style={{ color: "rgba(245,240,235,0.2)", minWidth: 80 }}>{date}</span>
                      <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(245,240,235,0.04)" }}>
                        <div style={{ height: 4, borderRadius: 2, background: "var(--accent)", width: `${Math.min(100, (count / Math.max(...Object.values(u.dailyDrafts))) * 100)}%` }} />
                      </div>
                      <span style={{ color: "var(--text-primary)", fontWeight: 500, minWidth: 20 }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ flex: "1 1 300px", padding: 16, borderRadius: 8, background: "rgba(245,240,235,0.01)", border: "1px solid rgba(245,240,235,0.04)" }}>
                <h3 style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
                  PPV / jour (30j)
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
                  {Object.entries(u.dailyPpv).sort(([a], [b]) => a.localeCompare(b)).map(([date, count]) => (
                    <div key={date} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 9 }}>
                      <span style={{ color: "rgba(245,240,235,0.2)", minWidth: 80 }}>{date}</span>
                      <div style={{ flex: 1, height: 4, borderRadius: 2, background: "rgba(245,240,235,0.04)" }}>
                        <div style={{ height: 4, borderRadius: 2, background: "var(--success)", width: `${Math.min(100, (count / Math.max(...Object.values(u.dailyPpv), 1)) * 100)}%` }} />
                      </div>
                      <span style={{ color: "var(--text-primary)", fontWeight: 500, minWidth: 20 }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
