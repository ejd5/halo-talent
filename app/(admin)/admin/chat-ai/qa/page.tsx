"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, ChevronLeft, ChevronRight, CheckCircle, Ban, Flag, ThumbsUp, RefreshCw } from "lucide-react";

interface QAItem {
  id: string;
  user_id: string;
  reason: string;
  severity: number;
  status: string;
  notes: string;
  message_id: string | null;
  draft_id: string | null;
  created_at: string;
  updated_at: string;
}

interface StatusCounts {
  pending: number;
  approved: number;
  revised: number;
  blocked: number;
  escalated: number;
  false_positive: number;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvé",
  revised: "Révisé",
  blocked: "Bloqué",
  escalated: "Escaladé",
  false_positive: "Faux positif",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "rgba(245,240,235,0.3)",
  approved: "var(--success)",
  revised: "var(--accent)",
  blocked: "var(--danger)",
  escalated: "var(--or, #D8A95B)",
  false_positive: "rgba(245,240,235,0.2)",
};

const REASON_LABELS: Record<string, string> = {
  risky_message: "Message risqué",
  off_tone: "Ton inapproprié",
  excessive_pressure: "Pression excessive",
  duplicate_content: "Contenu dupliqué",
  vulnerable_fan: "Fan vulnérable",
  missing_disclosure: "Divulgation manquante",
  unauthorized_promise: "Promesse non autorisée",
  inconsistent_price: "Prix incohérent",
};

function SeverityBar({ severity }: { severity: number }) {
  const color = severity >= 4 ? "var(--danger)" : severity >= 3 ? "var(--accent)" : "rgba(245,240,235,0.2)";
  return (
    <div style={{ display: "flex", gap: 1 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 12, height: 4, borderRadius: 1,
            background: i < severity ? color : "rgba(245,240,235,0.06)",
          }}
        />
      ))}
    </div>
  );
}

export default function ChatAIQAPage() {
  const [items, setItems] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [reasonFilter, setReasonFilter] = useState("");
  const [statusCounts, setStatusCounts] = useState<StatusCounts>({ pending: 0, approved: 0, revised: 0, blocked: 0, escalated: 0, false_positive: 0 });
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const limit = 50;

  const fetchItems = useCallback((p: number, s: string, r: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(limit) });
    if (s) params.set("status", s);
    if (r) params.set("reason", r);

    fetch(`/api/admin/chat-ai/qa?${params}`)
      .then((res) => res.json())
      .then((d) => {
        setItems(d.items || []);
        setTotal(d.total || 0);
        if (d.statusCounts) setStatusCounts(d.statusCounts);
      })
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: "1", limit: String(limit) });
    fetch(`/api/admin/chat-ai/qa?${params}`)
      .then((res) => res.json())
      .then((d) => {
        if (!cancelled) {
          setItems(d.items || []);
          setTotal(d.total || 0);
          if (d.statusCounts) setStatusCounts(d.statusCounts);
        }
      })
      .catch(() => { if (!cancelled) setError("Erreur de chargement"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [limit]);

  function handleStatusFilter(s: string) {
    const newFilter = statusFilter === s ? "" : s;
    setStatusFilter(newFilter);
    fetchItems(1, newFilter, reasonFilter);
  }

  function goToPage(p: number) {
    setPage(p);
    fetchItems(p, statusFilter, reasonFilter);
  }

  const totalPages = Math.ceil(total / limit);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  async function handleReview(qaId: string, newStatus: string) {
    if (!confirm(`Marquer cet item comme "${STATUS_LABELS[newStatus] || newStatus}" ?`)) return;
    setReviewingId(qaId);
    try {
      const res = await fetch(`/api/admin/chat-ai/qa/${qaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, notes: reviewNotes || undefined }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((it) => (it.id === qaId ? { ...it, status: newStatus, notes: reviewNotes || it.notes } : it))
        );
        setReviewNotes("");
      }
    } catch { /* keep state */ }
    setReviewingId(null);
  }

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
          QA Review, Chat AI
        </h1>
        <p style={{ fontSize: 11, color: "rgba(245,240,235,0.3)", marginTop: 4 }}>
          Revue qualité des messages et brouillons IA
        </p>
      </div>

      {/* Status distribution */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => handleStatusFilter(status)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 6,
              background: statusFilter === status ? `${STATUS_COLORS[status]}15` : "rgba(245,240,235,0.02)",
              border: statusFilter === status ? `1px solid ${STATUS_COLORS[status]}30` : "1px solid rgba(245,240,235,0.04)",
              cursor: "pointer", fontSize: 11, color: statusFilter === status ? STATUS_COLORS[status] : "rgba(245,240,235,0.3)",
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14, fontFamily: "var(--font-display)" }}>{count}</span>
            {STATUS_LABELS[status] || status}
          </button>
        ))}
      </div>

      {/* Reason filter */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select
          value={reasonFilter}
          onChange={(e) => { setReasonFilter(e.target.value); fetchItems(1, statusFilter, e.target.value); }}
          style={{ fontSize: 9, padding: "4px 8px", background: "rgba(245,240,235,0.02)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)", borderRadius: 4 }}
        >
          <option value="">Toutes les raisons</option>
          {Object.entries(REASON_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{ padding: 12, background: "rgba(196,69,54,0.08)", border: "1px solid rgba(196,69,54,0.12)", borderRadius: 6, color: "var(--danger)", fontSize: 11, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 48, background: "rgba(245,240,235,0.02)", borderRadius: 4 }} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {items.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "rgba(245,240,235,0.15)", fontSize: 12 }}>
                Aucun item QA trouvé
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} style={{ borderRadius: 6, border: "1px solid rgba(245,240,235,0.04)", background: "rgba(245,240,235,0.01)", overflow: "hidden" }}>
                  <div
                    onClick={() => toggleExpand(item.id)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", cursor: "pointer" }}
                  >
                    <SeverityBar severity={item.severity} />
                    <span style={{ fontSize: 10, color: "rgba(245,240,235,0.2)", minWidth: 60 }}>
                      {REASON_LABELS[item.reason] || item.reason}
                    </span>
                    <span style={{ fontSize: 9, color: "rgba(245,240,235,0.15)", fontFamily: "monospace", flex: 1 }}>
                      {item.user_id?.slice(0, 10)}...
                    </span>
                    <span style={{
                      fontSize: 8, padding: "1px 5px", borderRadius: 3,
                      color: STATUS_COLORS[item.status] || "rgba(245,240,235,0.2)",
                      background: `${STATUS_COLORS[item.status] || "rgba(245,240,235,0.2)"}15`,
                    }}>
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                    <Eye size={10} style={{ color: "rgba(245,240,235,0.15)" }} />
                  </div>
                  {expanded.has(item.id) && (
                    <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(245,240,235,0.03)", fontSize: 10, color: "rgba(245,240,235,0.3)" }}>
                      <div style={{ marginBottom: 6 }}>
                        <strong style={{ color: "rgba(245,240,235,0.4)" }}>Notes :</strong> {item.notes || "Aucune note"}
                      </div>

                      {/* Review actions */}
                      <div style={{ marginBottom: 8 }}>
                        <textarea
                          placeholder="Notes de revue (optionnel)..."
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          style={{
                            width: "100%", minHeight: 40, fontSize: 9, padding: "4px 6px",
                            background: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.06)",
                            borderRadius: 4, color: "var(--text-primary)", resize: "vertical",
                          }}
                        />
                        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                          {([
                            ["approved", CheckCircle, "var(--success)"],
                            ["revised", RefreshCw, "var(--accent)"],
                            ["blocked", Ban, "var(--danger)"],
                            ["escalated", Flag, "var(--or, #D8A95B)"],
                            ["false_positive", ThumbsUp, "rgba(245,240,235,0.2)"],
                          ] as const).filter(([s]) => s !== item.status).map(([status, Icon, color]) => (
                            <button
                              key={status}
                              onClick={() => handleReview(item.id, status)}
                              disabled={reviewingId === item.id}
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 3,
                                fontSize: 8, padding: "3px 8px", borderRadius: 3,
                                border: `1px solid ${color}30`, background: `${color}10`,
                                color, cursor: "pointer",
                                opacity: reviewingId === item.id ? 0.4 : 1,
                              }}
                            >
                              <Icon size={9} />
                              {STATUS_LABELS[status] || status}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 16, fontSize: 9, color: "rgba(245,240,235,0.15)" }}>
                        <span>Créé le {new Date(item.created_at).toLocaleDateString("fr-FR")}</span>
                        <span>Mis à jour le {new Date(item.updated_at).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
              <button
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{ padding: "4px 8px", background: "none", border: "1px solid rgba(245,240,235,0.06)", borderRadius: 4, color: "rgba(245,240,235,0.3)", cursor: "pointer", fontSize: 10 }}
              >
                <ChevronLeft size={12} />
              </button>
              <span style={{ fontSize: 10, color: "rgba(245,240,235,0.3)" }}>{page} / {totalPages}</span>
              <button
                onClick={() => goToPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                style={{ padding: "4px 8px", background: "none", border: "1px solid rgba(245,240,235,0.06)", borderRadius: 4, color: "rgba(245,240,235,0.3)", cursor: "pointer", fontSize: 10 }}
              >
                <ChevronRight size={12} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
