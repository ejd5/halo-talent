"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, CheckCircle, AlertTriangle, Pause, Activity } from "lucide-react";

interface Creator {
  userId: string;
  mode: string;
  disclosure: string;
  isPaused: boolean;
  isActive: boolean;
  demoMode: boolean;
  plan: string;
  fansCount: number;
  draftsCount: number;
  pendingQa: number;
  consentComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ChatAICreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [pausingId, setPausingId] = useState<string | null>(null);
  const limit = 50;

  async function handlePauseToggle(creatorId: string, currentPaused: boolean) {
    if (!confirm(`${currentPaused ? "Réactiver" : "Mettre en pause"} le module CHATEENG pour ce créateur ?`)) return;
    setPausingId(creatorId);
    try {
      const res = await fetch(`/api/admin/chat-ai/creators/${creatorId}/pause`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_paused: !currentPaused }),
      });
      if (res.ok) {
        setCreators((prev) =>
          prev.map((c) => (c.userId === creatorId ? { ...c, isPaused: !currentPaused } : c))
        );
      }
    } catch { /* keep state */ }
    setPausingId(null);
  }

  const fetchCreators = useCallback((p: number) => {
    setLoading(true);
    fetch(`/api/admin/chat-ai/creators?page=${p}&limit=${limit}`)
      .then((r) => r.json())
      .then((d) => {
        setCreators(d.creators || []);
        setTotal(d.total || 0);
      })
      .catch(() => setError("Erreur de chargement"))
      .finally(() => setLoading(false));
  }, [limit]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/chat-ai/creators?page=1&limit=${limit}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setCreators(d.creators || []);
          setTotal(d.total || 0);
        }
      })
      .catch(() => { if (!cancelled) setError("Erreur de chargement"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [limit]);

  function goToPage(p: number) {
    setPage(p);
    fetchCreators(p);
  }

  const totalPages = Math.ceil(total / limit);
  const filtered = search
    ? creators.filter((c) => c.userId.toLowerCase().includes(search.toLowerCase()))
    : creators;

  return (
    <div style={{ padding: "24px 32px", maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
            Créateurs, CHATEENG
          </h1>
        </div>
        <p style={{ fontSize: 11, color: "rgba(245,240,235,0.3)", marginTop: 4 }}>
          {total} créateur(s) utilisant le module CHATEENG
        </p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 6, border: "1px solid rgba(245,240,235,0.06)", background: "rgba(245,240,235,0.01)", maxWidth: 320 }}>
        <Search size={12} style={{ color: "rgba(245,240,235,0.2)" }} />
        <input
          placeholder="Rechercher par ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ background: "none", border: "none", color: "var(--text-primary)", fontSize: 11, outline: "none", flex: 1 }}
        />
      </div>

      {error && (
        <div style={{ padding: 12, background: "rgba(196,69,54,0.08)", border: "1px solid rgba(196,69,54,0.12)", borderRadius: 6, color: "var(--danger)", fontSize: 11, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ height: 44, background: "rgba(245,240,235,0.02)", borderRadius: 4 }} />
          ))}
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
                  <th style={{ padding: "8px 12px", textAlign: "left", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>User ID</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Plan</th>
                  <th style={{ padding: "8px 12px", textAlign: "left", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Mode</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Fans</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Drafts</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>QA</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Consent.</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Statut</th>
                  <th style={{ padding: "8px 12px", textAlign: "center", color: "rgba(245,240,235,0.2)", fontWeight: 500, fontSize: 9, textTransform: "uppercase" }}>Demo</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: 32, textAlign: "center", color: "rgba(245,240,235,0.15)", fontSize: 12 }}>
                      Aucun créateur trouvé
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.userId} style={{ borderBottom: "1px solid rgba(245,240,235,0.03)" }}>
                      <td style={{ padding: "8px 12px", fontFamily: "monospace", fontSize: 10, color: "rgba(245,240,235,0.3)" }}>
                        {c.userId.slice(0, 12)}...
                      </td>
                      <td style={{ padding: "8px 12px", color: "rgba(245,240,235,0.3)" }}>{c.plan || "-"}</td>
                      <td style={{ padding: "8px 12px", color: "var(--text-primary)" }}>{c.mode}</td>
                      <td style={{ padding: "8px 12px", textAlign: "center", color: "var(--text-primary)" }}>{c.fansCount}</td>
                      <td style={{ padding: "8px 12px", textAlign: "center", color: "var(--text-primary)" }}>{c.draftsCount}</td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        {c.pendingQa > 0 ? (
                          <span style={{ color: "var(--danger)", fontWeight: 600 }}>{c.pendingQa}</span>
                        ) : (
                          <span style={{ color: "rgba(245,240,235,0.2)" }}>0</span>
                        )}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        {c.consentComplete ? (
                          <CheckCircle size={12} style={{ color: "var(--success)" }} />
                        ) : (
                          <AlertTriangle size={12} style={{ color: "var(--accent)" }} />
                        )}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        <button
                          onClick={() => handlePauseToggle(c.userId, c.isPaused)}
                          disabled={pausingId === c.userId}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9,
                            color: c.isPaused ? "var(--danger)" : "var(--success)",
                            background: c.isPaused ? "rgba(196,69,54,0.08)" : "rgba(122,154,101,0.08)",
                            padding: "2px 6px", borderRadius: 3, border: "none", cursor: "pointer",
                            opacity: pausingId === c.userId ? 0.5 : 1,
                          }}
                        >
                          {c.isPaused ? <><Pause size={8} /> Pause</> : <><Activity size={8} /> Actif</>}
                        </button>
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "center" }}>
                        {c.demoMode && (
                          <span style={{ fontSize: 8, color: "var(--accent)", background: "rgba(199,91,57,0.1)", padding: "1px 4px", borderRadius: 2 }}>
                            DEMO
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 16 }}>
              <button
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{ padding: "4px 8px", background: "none", border: "1px solid rgba(245,240,235,0.06)", borderRadius: 4, color: "rgba(245,240,235,0.3)", cursor: "pointer", fontSize: 10 }}
              >
                <ChevronLeft size={12} />
              </button>
              <span style={{ fontSize: 10, color: "rgba(245,240,235,0.3)" }}>
                {page} / {totalPages}
              </span>
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
