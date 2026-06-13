"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface AuditLog {
  id: string;
  user_id: string;
  actor_id: string;
  actor_type: string;
  action: string;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export default function ChatAIAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [availableActions, setAvailableActions] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const limit = 50;

  const fetchLogs = useCallback((p: number, action: string, uid: string) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(limit) });
    if (action) params.set("action", action);
    if (uid) params.set("userId", uid);

    fetch(`/api/admin/chat-ai/audit?${params}`)
      .then((res) => res.json())
      .then((d) => {
        setLogs(d.logs || []);
        setTotal(d.total || 0);
        if (d.availableActions) setAvailableActions(d.availableActions);
      })
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ page: "1", limit: String(limit) });
    fetch(`/api/admin/chat-ai/audit?${params}`)
      .then((res) => res.json())
      .then((d) => {
        if (!cancelled) {
          setLogs(d.logs || []);
          setTotal(d.total || 0);
          if (d.availableActions) setAvailableActions(d.availableActions);
        }
      })
      .catch(() => { if (!cancelled) setError("Erreur de chargement"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [limit]);

  function goToPage(p: number) {
    setPage(p);
    fetchLogs(p, actionFilter, userIdFilter);
  }

  function handleExport() {
    const params = new URLSearchParams({ export: "true" });
    if (actionFilter) params.set("action", actionFilter);
    if (userIdFilter) params.set("userId", userIdFilter);
    window.open(`/api/admin/chat-ai/audit?${params}`, "_blank");
  }

  const totalPages = Math.ceil(total / limit);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1400 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            Audit Log, Chat AI
          </h1>
          <p style={{ fontSize: 11, color: "rgba(245,240,235,0.3)", marginTop: 4 }}>
            {total} événements d'audit enregistrés
          </p>
        </div>
        <button
          onClick={handleExport}
          style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
            background: "rgba(245,240,235,0.03)", border: "1px solid rgba(245,240,235,0.06)",
            borderRadius: 6, color: "rgba(245,240,235,0.3)", cursor: "pointer", fontSize: 10,
          }}
        >
          <Download size={12} /> Exporter
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); fetchLogs(1, e.target.value, userIdFilter); }}
          style={{ fontSize: 9, padding: "5px 10px", background: "rgba(245,240,235,0.02)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)", borderRadius: 4, maxWidth: 200 }}
        >
          <option value="">Toutes les actions</option>
          {availableActions.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 4, border: "1px solid rgba(245,240,235,0.06)", background: "rgba(245,240,235,0.01)", maxWidth: 280 }}>
          <Search size={10} style={{ color: "rgba(245,240,235,0.15)" }} />
          <input
            placeholder="Filtrer par user ID..."
            value={userIdFilter}
            onChange={(e) => { setUserIdFilter(e.target.value); fetchLogs(1, actionFilter, e.target.value); }}
            style={{ background: "none", border: "none", color: "var(--text-primary)", fontSize: 10, outline: "none", flex: 1 }}
          />
        </div>
      </div>

      {error && (
        <div style={{ padding: 12, background: "rgba(196,69,54,0.08)", border: "1px solid rgba(196,69,54,0.12)", borderRadius: 6, color: "var(--danger)", fontSize: 11, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ height: 40, background: "rgba(245,240,235,0.02)", borderRadius: 4 }} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {logs.length === 0 ? (
              <div style={{ padding: 32, textAlign: "center", color: "rgba(245,240,235,0.15)", fontSize: 12 }}>
                Aucun événement d'audit trouvé
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} style={{ borderRadius: 4, border: "1px solid rgba(245,240,235,0.03)", background: "rgba(245,240,235,0.01)", overflow: "hidden" }}>
                  <div
                    onClick={() => toggleExpand(log.id)}
                    style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", fontSize: 10 }}
                  >
                    <Clock size={10} style={{ color: "rgba(245,240,235,0.15)" }} />
                    <span style={{ color: "rgba(245,240,235,0.25)", minWidth: 130, fontSize: 9 }}>
                      {new Date(log.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span style={{
                      color: "var(--accent)", fontWeight: 500, minWidth: 160, fontSize: 9,
                    }}>
                      {log.action}
                    </span>
                    <span style={{ color: "rgba(245,240,235,0.15)", fontFamily: "monospace", flex: 1, fontSize: 9 }}>
                      {log.user_id?.slice(0, 10)}...
                    </span>
                    <span style={{ color: "rgba(245,240,235,0.12)", fontSize: 8 }}>
                      {log.target_type}
                    </span>
                  </div>
                  {expanded.has(log.id) && (
                    <div style={{ padding: "8px 12px", borderTop: "1px solid rgba(245,240,235,0.03)", fontSize: 9, color: "rgba(245,240,235,0.2)" }}>
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span>Target: {log.target_id || "N/A"}</span>
                        <span>Actor: {log.actor_type} ({log.actor_id.slice(0, 10)}...)</span>
                      </div>
                      {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div style={{ marginTop: 4, padding: 4, background: "rgba(245,240,235,0.02)", borderRadius: 3, fontSize: 8, fontFamily: "monospace", color: "rgba(245,240,235,0.15)" }}>
                          {JSON.stringify(log.metadata).slice(0, 200)}
                        </div>
                      )}
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
