"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Clock, CheckCircle, Scan, Trash2, RefreshCw, AlertTriangle, Info } from "lucide-react";

type Update = {
  id: string;
  action: string;
  source: string;
  details: Record<string, unknown> | null;
  items_affected: number;
  reviewed_by_admin: boolean;
  created_at: string;
};

const ACTION_LABELS: Record<string, string> = {
  cgu_scraped: "CGU scannées",
  law_update: "Mise à jour légale",
  clause_added: "Clause ajoutée",
  review: "Révision",
  scan: "Scan",
};

const ACTION_ICONS: Record<string, React.ElementType> = {
  cgu_scraped: Scan,
  law_update: AlertTriangle,
  clause_added: Info,
  scan: Scan,
};

export default function LegalUpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/legal/updates");
      const data = await res.json();
      setUpdates(data.updates || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchUpdates(); }, [fetchUpdates]);

  const handleApprove = async (id: string) => {
    try {
      await fetch("/api/admin/legal/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", id }),
      });
      fetchUpdates();
    } catch (e) { console.error(e); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette entrée du journal ?")) return;
    try {
      await fetch("/api/admin/legal/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      fetchUpdates();
    } catch (e) { console.error(e); }
  };

  const handleScan = async () => {
    setScanning(true);
    try {
      await fetch("/api/admin/legal/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "scan" }),
      });
      fetchUpdates();
    } catch (e) { console.error(e); }
    setScanning(false);
  };

  return (
    <div style={{ padding: "32px 40px" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Clock size={24} style={{ color: "var(--accent)" }} />
            <h1 className="text-2xl font-display font-semibold" style={{ color: "var(--text-primary)" }}>
              Journal des mises à jour
            </h1>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Suivi des scans CGU et mises à jour juridiques
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleScan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40"
            style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
          >
            {scanning ? <Loader2 size={14} className="animate-spin" /> : <Scan size={14} />}
            Lancer un scan
          </button>
          <button
            onClick={fetchUpdates}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            <RefreshCw size={14} /> Actualiser
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <SummaryCard label="Total entrées" value={updates.length} />
        <SummaryCard label="En attente de révision" value={updates.filter((u) => !u.reviewed_by_admin).length} color="#D4A24C" />
        <SummaryCard label="Approuvées" value={updates.filter((u) => u.reviewed_by_admin).length} color="var(--success)" />
        <SummaryCard label="Scans CGU" value={updates.filter((u) => u.action === "cgu_scraped" || u.action === "scan").length} color="var(--accent)" />
      </div>

      {/* Timeline */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
        </div>
      ) : (
        <div className="space-y-2">
          {updates.map((update) => {
            const Icon = ACTION_ICONS[update.action] || Clock;
            return (
              <div
                key={update.id}
                className="flex items-start gap-4 p-4"
                style={{ border: "1px solid var(--border-default)" }}
              >
                <div className="p-2 shrink-0" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <Icon size={16} style={{ color: update.reviewed_by_admin ? "var(--success)" : "#D4A24C" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {ACTION_LABELS[update.action] || update.action}
                    </span>
                    {!update.reviewed_by_admin && (
                      <span className="text-[10px] px-1.5 py-0.5 font-medium" style={{ background: "rgba(212,162,76,0.12)", color: "#D4A24C" }}>
                        en attente
                      </span>
                    )}
                    {update.reviewed_by_admin && (
                      <span className="text-[10x] px-1.5 py-0.5 font-medium" style={{ background: "rgba(122,154,101,0.12)", color: "var(--success)" }}>
                        approuvé
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                    <span>Source: {update.source}</span>
                    {update.items_affected > 0 && <span>{update.items_affected} élément(s) affecté(s)</span>}
                    <span>{new Date(update.created_at).toLocaleDateString("fr-FR", { dateStyle: "short", timeStyle: "short" })}</span>
                  </div>
                  {update.details && (
                    <div className="mt-1 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {typeof update.details === "object" && "note" in update.details && String(update.details.note)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!update.reviewed_by_admin && (
                    <button
                      onClick={() => handleApprove(update.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-90"
                      style={{ background: "rgba(122,154,101,0.12)", color: "var(--success)" }}
                    >
                      <CheckCircle size={12} /> Approuver
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(update.id)}
                    className="p-1.5 transition-colors hover:bg-white/5"
                    style={{ color: "var(--danger)" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
          {updates.length === 0 && (
            <div className="text-center py-12 text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              Aucune mise à jour enregistrée
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="p-4" style={{ border: "1px solid var(--border-default)", background: "var(--bg-card)" }}>
      <div className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>{label}</div>
      <div className="text-2xl font-semibold" style={{ color: color || "var(--text-primary)" }}>{value}</div>
    </div>
  );
}
