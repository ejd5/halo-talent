"use client";

import { CheckCircle2, AlertTriangle, Pause, Play, FlaskConical } from "lucide-react";

interface Props {
  isActive: boolean;
  isPaused: boolean;
  demoMode: boolean;
  consentComplete: boolean;
}

export function ChatAIStatusBadges({ isActive, isPaused, demoMode, consentComplete }: Props) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {isPaused ? (
        <Badge icon={<Pause size={11} />} label="En pause" color="#f59e0b" />
      ) : isActive ? (
        <Badge icon={<Play size={11} />} label="Actif" color="#34d399" />
      ) : (
        <Badge icon={<AlertTriangle size={11} />} label="Inactif" color="#9ca3af" />
      )}

      {demoMode && (
        <Badge icon={<FlaskConical size={11} />} label="Demo Mode" color="#60a5fa" />
      )}

      {consentComplete ? (
        <Badge icon={<CheckCircle2 size={11} />} label="Consent OK" color="#34d399" />
      ) : (
        <Badge icon={<AlertTriangle size={11} />} label="Consent requis" color="#ef4444" />
      )}
    </div>
  );
}

function Badge({ icon, label, color }: { icon: React.ReactNode; label: string; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 9999,
      fontSize: 11, fontWeight: 500,
      background: `${color}18`, color, border: `1px solid ${color}30`,
    }}>
      {icon}
      {label}
    </span>
  );
}
