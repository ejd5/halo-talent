"use client";

import { ShieldAlert, Ban } from "lucide-react";

const statusColors: Record<string, string> = {
  whale: "#f59e0b", vip: "#a78bfa", active: "#34d399",
  new: "#60a5fa", dormant: "#9ca3af", churn_risk: "#f87171",
  do_not_contact: "#ef4444",
};

const statusLabels: Record<string, string> = {
  whale: "Whale", vip: "VIP", active: "Actif",
  new: "Nouveau", dormant: "Dormant", churn_risk: "Churn Risk",
  do_not_contact: "Do Not Contact",
};

export function FanRiskBadge({ status, riskFlags }: { status: string; riskFlags?: string[] }) {
  const color = statusColors[status] || "#9ca3af";
  const label = statusLabels[status] || status;
  const isBlocked = status === "do_not_contact";
  const isVulnerable = riskFlags?.includes("vulnerable_fan");

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        padding: "2px 8px", borderRadius: 9999,
        fontSize: 10, fontWeight: 600, textTransform: "uppercase",
        background: `${color}20`, color, border: `1px solid ${color}30`,
      }}>
        {isBlocked ? <Ban size={10} /> : isVulnerable ? <ShieldAlert size={10} /> : null}
        {label}
      </span>
      {isBlocked && (
        <span style={{ fontSize: 10, color: "#ef4444", fontWeight: 500 }}>Ne pas contacter</span>
      )}
      {isVulnerable && !isBlocked && (
        <span style={{ fontSize: 10, color: "#f59e0b", fontWeight: 500 }}>Vulnérable</span>
      )}
    </span>
  );
}
