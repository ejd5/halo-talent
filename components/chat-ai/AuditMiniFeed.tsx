"use client";

import { Activity, FileText, Check, Copy, Shield, AlertTriangle } from "lucide-react";

interface AuditEntry {
  id: string; action: string; target_type: string;
  created_at: string; metadata: Record<string, unknown>;
}

interface Props {
  logs: AuditEntry[];
  loading: boolean;
}

const actionIcons: Record<string, React.ReactNode> = {
  ai_draft_generated: <FileText size={10} />,
  ai_draft_approved: <Check size={10} />,
  ai_draft_copied: <Copy size={10} />,
  ai_draft_blocked: <Shield size={10} />,
  compliance_block_triggered: <AlertTriangle size={10} />,
  compliance_scan_passed: <Shield size={10} />,
  ppv_recommendation_created: <FileText size={10} />,
};

const actionLabels: Record<string, string> = {
  ai_draft_generated: "Brouillon généré",
  ai_draft_approved: "Brouillon approuvé",
  ai_draft_copied: "Brouillon copié",
  ai_draft_blocked: "Brouillon bloqué",
  compliance_block_triggered: "Conformité : bloqué",
  compliance_scan_passed: "Conformité : OK",
  ppv_recommendation_created: "PPV créé",
  module_activated: "Module activé",
  consent_checklist_completed: "Consentement validé",
};

export function AuditMiniFeed({ logs, loading }: Props) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
        <Activity size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
        <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(245,240,235,0.4)", textTransform: "uppercase" }}>
          Activité récente
        </span>
      </div>

      {loading ? (
        <div style={{ color: "rgba(245,240,235,0.15)", fontSize: 10 }}>Chargement...</div>
      ) : logs.length === 0 ? (
        <div style={{ color: "rgba(245,240,235,0.15)", fontSize: 10 }}>Aucune activité</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 3, maxHeight: 200, overflow: "auto" }}>
          {logs.slice(0, 15).map((log) => (
            <div key={log.id} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "3px 6px",
              borderRadius: 4, fontSize: 10,
            }}>
              <span style={{ color: "rgba(245,240,235,0.3)", display: "flex" }}>
                {actionIcons[log.action] || <Activity size={10} />}
              </span>
              <span style={{ color: "rgba(245,240,235,0.5)", flex: 1 }}>
                {actionLabels[log.action] || log.action}
              </span>
              <span style={{ color: "rgba(245,240,235,0.2)", fontSize: 9 }}>
                {new Date(log.created_at).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
