"use client";

import { MessageSquare, Star, Users, AlertTriangle, FileText, Shield, TrendingUp, Clock } from "lucide-react";

interface MetricCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}

interface Props {
  totalConversations: number;
  priorityConversations: number;
  hotFans: number;
  vipWhales: number;
  dormant: number;
  churnRisk: number;
  pendingDrafts: number;
  complianceAlerts: number;
}

export function ChatAIMetricsGrid(props: Props) {
  const metrics: MetricCard[] = [
    { label: "Conversations", value: props.totalConversations, icon: <MessageSquare size={14} />, color: "#60a5fa", sub: `${props.priorityConversations} prioritaires` },
    { label: "Fans VIP/Whales", value: props.vipWhales, icon: <Star size={14} />, color: "#f59e0b" },
    { label: "Fans actifs", value: props.hotFans, icon: <Users size={14} />, color: "#34d399" },
    { label: "Fans dormants", value: props.dormant, icon: <Clock size={14} />, color: "#9ca3af" },
    { label: "Risque churn", value: props.churnRisk, icon: <AlertTriangle size={14} />, color: props.churnRisk > 3 ? "#f87171" : "#f59e0b" },
    { label: "Brouillons", value: props.pendingDrafts, icon: <FileText size={14} />, color: "#a78bfa", sub: "en attente" },
    { label: "Compliance", value: props.complianceAlerts, icon: <Shield size={14} />, color: props.complianceAlerts > 0 ? "#ef4444" : "#34d399", sub: props.complianceAlerts > 0 ? "alertes" : "OK" },
    { label: "Revenus", value: ", ", icon: <TrendingUp size={14} />, color: "rgba(245,240,235,0.25)", sub: "Tracking bientôt" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10, marginBottom: 24 }}>
      {metrics.map((m) => (
        <div key={m.label} style={{
          padding: "14px", borderRadius: 8,
          border: "1px solid rgba(245,240,235,0.06)", background: "rgba(245,240,235,0.02)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ color: m.color, display: "flex" }}>{m.icon}</span>
            <span style={{ fontSize: 10, color: "rgba(245,240,235,0.35)", textTransform: "uppercase", fontWeight: 500 }}>
              {m.label}
            </span>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            {m.value}
          </div>
          {m.sub && (
            <div style={{ fontSize: 10, color: "rgba(245,240,235,0.25)", marginTop: 2 }}>{m.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}
