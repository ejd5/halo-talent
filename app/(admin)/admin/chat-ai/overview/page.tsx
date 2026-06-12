"use client";

import { useState, useEffect } from "react";
import { Bot, Users, FileText, Shield, AlertTriangle, CheckCircle, Activity } from "lucide-react";

interface Overview {
  totalCreators: number;
  totalFans: number;
  totalConversations: number;
  totalDrafts: number;
  totalPpvRecommendations: number;
  totalQaItems: number;
  pendingQaItems: number;
  activeUsers: number;
  pausedUsers: number;
  consentComplete: number;
  consentRate: number;
}

export default function ChatAIOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/chat-ai/overview")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setData(d.overview); })
      .catch(() => { if (!cancelled) setError("Erreur de chargement"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const kpis = data ? [
    { label: "Créateurs actifs", value: data.activeUsers, icon: Users, color: "var(--success)" },
    { label: "En pause", value: data.pausedUsers, icon: Activity, color: "var(--danger)" },
    { label: "Fans", value: data.totalFans, icon: Users, color: "rgba(245,240,235,0.4)" },
    { label: "Conversations", value: data.totalConversations, icon: Bot, color: "rgba(245,240,235,0.4)" },
    { label: "Drafts générés", value: data.totalDrafts, icon: FileText, color: "var(--accent)" },
    { label: "Recommandations PPV", value: data.totalPpvRecommendations, icon: Bot, color: "var(--accent)" },
    { label: "Items QA", value: data.totalQaItems, icon: Shield, color: "var(--accent)" },
    { label: "QA en attente", value: data.pendingQaItems, icon: AlertTriangle, color: data.pendingQaItems > 0 ? "var(--danger)" : "rgba(245,240,235,0.4)" },
    { label: "Consentement complété", value: `${data.consentRate}%`, icon: CheckCircle, color: data.consentRate >= 80 ? "var(--success)" : "var(--accent)" },
  ] : [];

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          Chat AI — Vue d&apos;ensemble
        </h1>
        <p style={{ fontSize: 11, color: "rgba(245,240,235,0.3)", marginTop: 4 }}>
          Statistiques globales du module Sovereign Chat AI
        </p>
      </div>

      {loading && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} style={{ flex: "1 1 180px", height: 100, background: "rgba(245,240,235,0.02)", borderRadius: 8, animation: "pulse" }} />
          ))}
        </div>
      )}

      {error && (
        <div style={{ padding: 12, background: "rgba(196,69,54,0.08)", border: "1px solid rgba(196,69,54,0.12)", borderRadius: 6, color: "var(--danger)", fontSize: 11 }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              style={{
                flex: "1 1 180px",
                padding: 16,
                borderRadius: 8,
                background: "rgba(245,240,235,0.02)",
                border: "1px solid rgba(245,240,235,0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <kpi.icon size={12} style={{ color: kpi.color }} />
                <span style={{ fontSize: 9, color: "rgba(245,240,235,0.3)", textTransform: "uppercase", fontWeight: 500 }}>
                  {kpi.label}
                </span>
              </div>
              <span style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {kpi.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && data && data.totalCreators === 0 && (
        <div style={{ marginTop: 32, padding: 24, textAlign: "center", color: "rgba(245,240,235,0.2)", fontSize: 13 }}>
          Aucune donnée Chat AI disponible. Les créateurs commencent à utiliser le module.
        </div>
      )}
    </div>
  );
}
