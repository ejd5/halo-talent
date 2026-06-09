"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Loader, CheckCircle, XCircle, Clock, Sparkles } from "lucide-react";

interface Draft {
  id: string;
  fan_id: string;
  channel: string;
  content: string;
  status: string;
  created_at: string;
  atlas_fans: { display_name: string | null; avatar_url: string | null; fan_tier: string } | null;
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadDrafts(); }, []);

  async function loadDrafts() {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/atlas/inbox/drafts");
      const d = await res.json();
      setDrafts(d.drafts ?? []);
    } catch {} finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: "approve" | "reject") {
    try {
      await fetch(`/api/dashboard/atlas/inbox/drafts`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: id, action }),
      });
      setDrafts((prev) => prev.filter((d) => d.id !== id));
    } catch {}
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/atlas/inbox" className="p-1 transition-opacity hover:opacity-70" style={{ color: "#FFFFFF" }}>
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}>Brouillons IA</h1>
          <p className="text-sm mt-1" style={{ color: "#FFFFFF" }}>{drafts.length} brouillon{drafts.length > 1 ? "s" : ""} en attente de validation</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
      ) : drafts.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <Sparkles size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun brouillon en attente</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>Les brouillons IA apparaîtront ici pour validation</p>
        </div>
      ) : (
        <div className="space-y-3">
          {drafts.map((draft) => (
            <div key={draft.id} className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: "var(--color-surface)" }}>
                    {(draft.atlas_fans?.display_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="text-sm font-medium" style={{ color: "#FFFFFF" }}>{draft.atlas_fans?.display_name || "Fan inconnu"}</span>
                    <span className="text-xs ml-2 px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
                      {draft.channel}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs" style={{ color: "#FFFFFF" }}>
                  <Clock size={10} /> {new Date(draft.created_at).toLocaleDateString("fr-FR")}
                </div>
              </div>
              <div className="p-3 mb-3 text-sm italic" style={{ background: "rgba(199,91,57,0.04)", borderLeft: "2px solid #C75B39", color: "#FFFFFF" }}>
                {draft.content}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleAction(draft.id, "approve")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-sm transition-opacity hover:opacity-80"
                  style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>
                  <CheckCircle size={12} /> Approuver
                </button>
                <button onClick={() => handleAction(draft.id, "reject")}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs rounded-sm transition-opacity hover:opacity-80"
                  style={{ background: "rgba(229,72,77,0.15)", color: "#E5484D" }}>
                  <XCircle size={12} /> Rejeter
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
