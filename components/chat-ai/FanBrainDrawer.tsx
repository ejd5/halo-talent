"use client";

import { X } from "lucide-react";
import { FanBrainCompact } from "./FanBrainCompact";

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
  open: boolean;
  loading: boolean;
  onClose: () => void;
}

export function FanBrainDrawer({ fan, open, loading, onClose }: Props) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          zIndex: 50, transition: "opacity 0.2s",
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, width: 380, maxWidth: "90vw",
        background: "var(--bg-primary)", borderLeft: "1px solid rgba(245,240,235,0.06)",
        zIndex: 51, overflow: "auto", padding: "20px 24px",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.3)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 20, paddingBottom: 12,
          borderBottom: "1px solid rgba(245,240,235,0.06)",
        }}>
          <span style={{
            fontSize: 14, fontWeight: 700, color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
          }}>
            Fan Brain
          </span>
          <button
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 28, height: 28, borderRadius: 6, border: "none",
              background: "rgba(245,240,235,0.05)", color: "rgba(245,240,235,0.4)",
              cursor: "pointer",
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <FanBrainCompact fan={fan} loading={loading} />
      </div>
    </>
  );
}
