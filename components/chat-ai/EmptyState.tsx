"use client";

import { Inbox } from "lucide-react";

interface Props {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 24px", textAlign: "center",
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 9999,
        background: "rgba(245,240,235,0.04)", display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 16,
      }}>
        <Inbox size={22} style={{ color: "rgba(245,240,235,0.2)" }} />
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 600, color: "rgba(245,240,235,0.5)", marginBottom: 4 }}>
        {title}
      </h3>
      <p style={{ fontSize: 11, color: "rgba(245,240,235,0.25)", maxWidth: 300, marginBottom: 16 }}>
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          style={{
            padding: "8px 16px", borderRadius: 6, border: "1px solid rgba(245,240,235,0.1)",
            background: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.6)",
            cursor: "pointer", fontSize: 12,
          }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
