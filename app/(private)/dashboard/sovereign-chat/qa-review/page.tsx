"use client";

import { useState, useEffect } from "react";
import {
  Shield, CheckCircle, X,
  ChevronDown, Flag, Eye, MessageSquare, FileText, Zap,
} from "lucide-react";

interface QAMessage {
  id: string; text: string; direction: string; created_at: string;
}

interface QADraft {
  id: string; text: string; objective: string; tone: string; status: string; risk_level: string;
}

interface QAItem {
  id: string;
  reason: string;
  severity: number;
  status: string;
  notes: string | null;
  messageId: string | null;
  draftId: string | null;
  message: QAMessage | null;
  draft: QADraft | null;
  createdAt: string;
  updatedAt: string;
}

const REASON_LABELS: Record<string, string> = {
  risky_message: "Message à risque",
  off_tone: "Ton inapproprié",
  excessive_pressure: "Pression excessive",
  duplicate_content: "Contenu dupliqué",
  vulnerable_fan: "Fan vulnérable",
  missing_disclosure: "Divulgation manquante",
  unauthorized_promise: "Promesse non autorisée",
  inconsistent_price: "Prix incohérent",
};

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: "rgba(245,240,235,0.3)", bg: "rgba(245,240,235,0.04)", label: "En attente" },
  approved: { color: "var(--success)", bg: "rgba(122,154,101,0.08)", label: "Approuvé" },
  revised: { color: "var(--accent)", bg: "rgba(199,91,57,0.08)", label: "Révisé" },
  blocked: { color: "var(--danger)", bg: "rgba(196,69,54,0.08)", label: "Bloqué" },
  escalated: { color: "var(--or, #D8A95B)", bg: "rgba(199,91,57,0.12)", label: "Escaladé" },
  false_positive: { color: "rgba(245,240,235,0.2)", bg: "rgba(245,240,235,0.03)", label: "Faux positif" },
};

export default function QAReviewPage() {
  const [items, setItems] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", reason: "", severity: "" });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadItems() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.set("status", filters.status);
      if (filters.reason) params.set("reason", filters.reason);
      if (filters.severity) params.set("severity", filters.severity);
      const r = await fetch(`/api/chat-ai/qa-items?${params.toString()}`);
      const d = await r.json();
      setItems(d.items || []);
    } catch { /* empty */ }
    setLoading(false);
  }

  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat-ai/qa-items?limit=50")
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setItems(d.items || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleUpdate = async (itemId: string, newStatus: string) => {
    setUpdatingId(itemId);
    try {
      await fetch(`/api/chat-ai/qa-items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      loadItems();
    } catch { /* empty */ }
    setUpdatingId(null);
  };

  const severityColor = (s: number) => {
    if (s >= 4) return "var(--danger)";
    if (s === 3) return "var(--accent)";
    return "rgba(245,240,235,0.3)";
  };

  const stats = {
    total: items.length,
    pending: items.filter((i) => i.status === "pending").length,
    blocked: items.filter((i) => i.status === "blocked").length,
    escalated: items.filter((i) => i.status === "escalated").length,
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} style={{ color: "var(--accent)" }} />
            <h1 className="text-xl font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
              QA Review
            </h1>
          </div>
          <p className="text-xs" style={{ color: "rgba(245,240,235,0.4)" }}>
            Revue des messages et brouillons signalés, validation humaine avant envoi
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[
          { label: "Total", value: stats.total, color: "var(--text-primary)" },
          { label: "En attente", value: stats.pending, color: "rgba(245,240,235,0.3)" },
          { label: "Bloqués", value: stats.blocked, color: "var(--danger)" },
          { label: "Escaladés", value: stats.escalated, color: "var(--or, #D8A95B)" },
        ].map((s) => (
          <div key={s.label} style={{
            padding: "8px 14px", borderRadius: 6,
            background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)",
            textAlign: "center", minWidth: 80,
          }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: s.color, margin: 0 }}>{s.value}</p>
            <p style={{ fontSize: 9, color: "rgba(245,240,235,0.25)", marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <select
          value={filters.status}
          onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); }}
          style={{ fontSize: 10, padding: "6px 10px", background: "transparent", color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.08)", borderRadius: 4 }}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={filters.reason}
          onChange={(e) => { setFilters((f) => ({ ...f, reason: e.target.value })); }}
          style={{ fontSize: 10, padding: "6px 10px", background: "transparent", color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.08)", borderRadius: 4 }}
        >
          <option value="">Toutes les raisons</option>
          {Object.entries(REASON_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          value={filters.severity}
          onChange={(e) => { setFilters((f) => ({ ...f, severity: e.target.value })); }}
          style={{ fontSize: 10, padding: "6px 10px", background: "transparent", color: "var(--text-primary)", border: "1px solid rgba(245,240,235,0.08)", borderRadius: 4 }}
        >
          <option value="">Toutes sévérités</option>
          {[1, 2, 3, 4, 5].map((s) => (
            <option key={s} value={s}>Sévérité {s}</option>
          ))}
        </select>
        <button onClick={loadItems} className="text-[10px] py-1.5 px-3" style={{ background: "rgba(245,240,235,0.04)", color: "var(--text-primary)", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Appliquer
        </button>
      </div>

      {/* Items list */}
      {loading ? (
        <div className="space-y-2">{[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse" style={{ background: "rgba(245,240,235,0.03)" }} />
        ))}</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center py-12">
          <CheckCircle size={32} style={{ color: "rgba(245,240,235,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(245,240,235,0.15)" }}>Aucun signalement</p>
          <p className="text-xs mt-1" style={{ color: "rgba(245,240,235,0.1)" }}>Tout est clean pour le moment</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const statusConf = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
            const isExpanded = expandedId === item.id;

            return (
              <div key={item.id} style={{
                background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)", borderRadius: 6,
              }}>
                {/* Row */}
                <div style={{ display: "flex", alignItems: "center", padding: "10px 14px", gap: 10 }}>
                  {/* Severity */}
                  <div style={{
                    width: 24, height: 24, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${severityColor(item.severity)}14`, color: severityColor(item.severity), fontSize: 10, fontWeight: 700,
                  }}>
                    {item.severity}
                  </div>

                  {/* Reason + type */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 500, color: "var(--text-primary)" }}>
                        {REASON_LABELS[item.reason] || item.reason}
                      </span>
                      {item.messageId && <MessageSquare size={10} style={{ color: "rgba(245,240,235,0.2)" }} />}
                      {item.draftId && <FileText size={10} style={{ color: "rgba(245,240,235,0.2)" }} />}
                    </div>
                    <p style={{ fontSize: 9, color: "rgba(245,240,235,0.2)", marginTop: 1 }}>
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")} · {item.messageId ? "Message" : "Brouillon"}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span style={{
                    fontSize: 9, padding: "2px 7px", borderRadius: 3,
                    color: statusConf.color, background: statusConf.bg,
                  }}>
                    {statusConf.label}
                  </span>

                  {/* Expand */}
                  <button onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    style={{ padding: 4, cursor: "pointer", background: "none", border: "none", color: "rgba(245,240,235,0.2)" }}>
                    <ChevronDown size={12} style={{ transform: isExpanded ? "rotate(180deg)" : undefined, transition: "transform 0.2s" }} />
                  </button>
                </div>

                {/* Expanded content */}
                {isExpanded && (
                  <div style={{ padding: "0 14px 12px", borderTop: "1px solid rgba(245,240,235,0.03)" }}>
                    {/* Content preview */}
                    <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(245,240,235,0.02)", borderRadius: 4 }}>
                      <p style={{ fontSize: 10, color: "rgba(245,240,235,0.15)", marginBottom: 4 }}>
                        {item.message ? "Message" : item.draft ? `Brouillon · ${item.draft.objective || "sans objectif"} · ${item.draft.tone || "ton par défaut"}` : "Sans contenu"}
                      </p>
                      <p style={{ fontSize: 11, color: "rgba(245,240,235,0.5)", lineHeight: 1.4, margin: 0 }}>
                        {(item.message?.text || item.draft?.text || ", ").slice(0, 300)}
                        {(item.message?.text?.length || item.draft?.text?.length || 0) > 300 ? "…" : ""}
                      </p>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <p style={{ fontSize: 10, color: "rgba(245,240,235,0.3)", marginTop: 8, fontStyle: "italic" }}>
                        Note: {item.notes}
                      </p>
                    )}

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                      <button
                        onClick={() => handleUpdate(item.id, "approved")}
                        disabled={updatingId === item.id || item.status === "approved"}
                        style={{
                          display: "flex", alignItems: "center", gap: 4, fontSize: 10, padding: "4px 10px",
                          background: item.status === "approved" ? "rgba(122,154,101,0.1)" : "rgba(122,154,101,0.06)",
                          color: item.status === "approved" ? "var(--success)" : "rgba(122,154,101,0.5)",
                          border: "1px solid rgba(122,154,101,0.1)", borderRadius: 4, cursor: "pointer",
                          opacity: item.status === "approved" ? 0.5 : 1,
                        }}
                      >
                        <CheckCircle size={10} /> Approuver
                      </button>
                      <button
                        onClick={() => handleUpdate(item.id, "revised")}
                        disabled={updatingId === item.id}
                        style={{
                          display: "flex", alignItems: "center", gap: 4, fontSize: 10, padding: "4px 10px",
                          background: "rgba(199,91,57,0.06)", color: "var(--accent)",
                          border: "1px solid rgba(199,91,57,0.1)", borderRadius: 4, cursor: "pointer",
                        }}
                      >
                        <Zap size={10} /> À réviser
                      </button>
                      <button
                        onClick={() => handleUpdate(item.id, "blocked")}
                        disabled={updatingId === item.id || item.status === "blocked"}
                        style={{
                          display: "flex", alignItems: "center", gap: 4, fontSize: 10, padding: "4px 10px",
                          background: item.status === "blocked" ? "rgba(196,69,54,0.1)" : "rgba(196,69,54,0.06)",
                          color: item.status === "blocked" ? "var(--danger)" : "rgba(196,69,54,0.5)",
                          border: "1px solid rgba(196,69,54,0.1)", borderRadius: 4, cursor: "pointer",
                          opacity: item.status === "blocked" ? 0.5 : 1,
                        }}
                      >
                        <X size={10} /> Bloquer
                      </button>
                      <button
                        onClick={() => handleUpdate(item.id, "escalated")}
                        disabled={updatingId === item.id}
                        style={{
                          display: "flex", alignItems: "center", gap: 4, fontSize: 10, padding: "4px 10px",
                          background: "rgba(199,91,57,0.08)", color: "var(--or, #D8A95B)",
                          border: "1px solid rgba(199,91,57,0.2)", borderRadius: 4, cursor: "pointer",
                        }}
                      >
                        <Flag size={10} /> Escalader
                      </button>
                      <button
                        onClick={() => handleUpdate(item.id, "false_positive")}
                        disabled={updatingId === item.id}
                        style={{
                          display: "flex", alignItems: "center", gap: 4, fontSize: 10, padding: "4px 10px",
                          background: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)",
                          border: "1px solid rgba(245,240,235,0.06)", borderRadius: 4, cursor: "pointer",
                        }}
                      >
                        <Eye size={10} /> Faux positif
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
