"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, SkipForward, Send, Edit3, X, Check, ChevronLeft, ChevronRight,
  Users, Clock,
} from "lucide-react";

interface Draft {
  id: string;
  draft_text: string;
  edited_text: string | null;
  approach: string | null;
  rationale: string | null;
  estimated_engagement: number | null;
  status: string;
  compliance_check: any;
  warnings: any;
  atlas_fans: {
    display_name: string | null;
    email: string | null;
    username_onlyfans: string | null;
    total_spent: number;
    fan_tier: string;
    fan_score: number;
    language: string | null;
    country: string | null;
    last_interaction_at: string | null;
  };
}

const STATUS_LABELS: Record<string, string> = {
  sent: "✅ Envoyé",
  skip: "⏭ Ignoré",
  edited: "✏️ Modifié",
  rejected: "🗑 Rejeté",
};

export default function ValidatePage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = use(params);
  const router = useRouter();

  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [campaign, setCampaign] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({ sent: 0, skipped: 0, edited: 0, rejected: 0 });
  const [showSendAll, setShowSendAll] = useState(false);
  const [sendingAll, setSendingAll] = useState(false);

  useEffect(() => {
    fetch(`/api/sovereign-chat/smart-messages?id=${campaignId}`)
      .then((r) => r.json())
      .then((d) => {
        setCampaign(d.campaign);
        const uncategorized = d.drafts || [];
        setDrafts(uncategorized);

        // Compute stats from existing statuses
        const s = { sent: 0, skipped: 0, edited: 0, rejected: 0 };
        for (const dr of uncategorized) {
          if (dr.status === "sent") s.sent++;
          else if (dr.status === "edited") s.edited++;
          else if (dr.status === "rejected") s.rejected++;
          else s.skipped++;
        }
        setStats(s);

        // Find first non-processed draft
        const firstUnprocessed = uncategorized.findIndex(
          (dr: Draft) => dr.status === "pending_validation",
        );
        setCurrentIndex(firstUnprocessed >= 0 ? firstUnprocessed : 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [campaignId]);

  const current = drafts[currentIndex];
  const pendingCount = drafts.filter((d) => d.status === "pending_validation").length;
  const processedCount = drafts.length - pendingCount;

  const handleAction = useCallback(async (action: string, editedText?: string) => {
    if (!current || actionLoading) return;
    setActionLoading(true);
    try {
      await fetch("/api/sovereign-chat/smart-messages/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: current.id,
          action,
          edited_text: editedText || null,
        }),
      });

      setStats((prev) => ({
        ...prev,
        [action === "send" ? "sent" : action === "skip" ? "skipped" : action === "reject" ? "rejected" : "edited"]:
          prev[action === "send" ? "sent" : action === "skip" ? "skipped" : action === "reject" ? "rejected" : "edited"] + 1,
      }));

      setDrafts((prev) =>
        prev.map((d) =>
          d.id === current.id
            ? { ...d, status: action === "send" ? "sent" : action === "edit" ? "edited" : action === "reject" ? "rejected" : "pending_validation", edited_text: editedText || d.edited_text }
            : d,
        ),
      );

      setEditMode(false);
      advanceToNext();
    } catch {
    } finally {
      setActionLoading(false);
    }
  }, [current, actionLoading, drafts]);

  const advanceToNext = () => {
    const nextIdx = drafts.findIndex(
      (d, i) => i > currentIndex && d.status === "pending_validation",
    );
    if (nextIdx >= 0) {
      setCurrentIndex(nextIdx);
    } else {
      // Wrap or find any pending
      const firstPending = drafts.findIndex((d) => d.status === "pending_validation");
      if (firstPending >= 0) {
        setCurrentIndex(firstPending);
      } else {
        // All processed!
        setCurrentIndex(drafts.length); // past the end
      }
    }
  };

  const handleSendAll = async () => {
    setSendingAll(true);
    try {
      await fetch("/api/sovereign-chat/smart-messages/send-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId }),
      });
      setStats((prev) => ({ ...prev, sent: prev.sent + pendingCount }));
      setDrafts((prev) =>
        prev.map((d) =>
          d.status === "pending_validation" ? { ...d, status: "sent" } : d,
        ),
      );
      setCurrentIndex(drafts.length);
    } catch {
    } finally {
      setSendingAll(false);
      setShowSendAll(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
        <div className="h-8 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />
        <div className="h-64 animate-pulse" style={{ backgroundColor: "rgba(245,240,235,0.03)" }} />
      </div>
    );
  }

  const allProcessed = currentIndex >= drafts.length || pendingCount === 0;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/sovereign-chat/smart-messages" className="transition-all hover:opacity-70">
            <ArrowLeft size={14} style={{ color: "rgba(245,240,235,0.3)" }} />
          </Link>
          <div>
            <h1 className="text-base font-semibold" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
              Validation
            </h1>
            <p className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>
              {campaign?.name || "Smart Message"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <button
              onClick={() => setShowSendAll(true)}
              className="text-[9px] font-medium py-1.5 px-2.5 transition-all hover:opacity-80"
              style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39", border: "1px solid rgba(199,91,57,0.15)" }}
            >
              Skip tout & envoyer ({pendingCount})
            </button>
          )}
          <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.3)" }}>
            {processedCount}/{drafts.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full" style={{ backgroundColor: "rgba(245,240,235,0.06)" }}>
        <div
          className="h-full transition-all"
          style={{
            width: `${drafts.length > 0 ? (processedCount / drafts.length) * 100 : 0}%`,
            backgroundColor: "#C75B39",
          }}
        />
      </div>

      {/* Stats row */}
      <div className="flex gap-2 text-[8px]">
        <span style={{ color: "#7A9A65" }}>✅ {stats.sent} envoyés</span>
        <span style={{ color: "rgba(245,240,235,0.2)" }}>⏭ {stats.skipped} ignorés</span>
        <span style={{ color: "#C75B39" }}>✏️ {stats.edited} modifiés</span>
        <span style={{ color: "#C44536" }}>🗑 {stats.rejected} rejetés</span>
      </div>

      {/* All processed banner */}
      {allProcessed ? (
        <div className="p-8 text-center space-y-4" style={{ backgroundColor: "rgba(122,154,101,0.04)", border: "1px solid rgba(122,154,101,0.1)" }}>
          <Check size={24} className="mx-auto" style={{ color: "#7A9A65" }} />
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>Tous les drafts sont traités !</h2>
            <p className="text-[10px] mt-1" style={{ color: "rgba(245,240,235,0.3)" }}>
              {drafts.length} drafts · {stats.sent} envoyés · {stats.edited} modifiés · {stats.rejected} rejetés
            </p>
          </div>
          <div className="flex gap-2 justify-center">
            <Link href={`/dashboard/sovereign-chat/smart-messages/${campaignId}/results`}
              className="text-[10px] font-medium py-2 px-3"
              style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}>
              Voir les résultats
            </Link>
            <Link href="/dashboard/sovereign-chat/smart-messages"
              className="text-[10px] font-medium py-2 px-3"
              style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}>
              Retour aux campagnes
            </Link>
          </div>
        </div>
      ) : current ? (
        <>
          {/* Fan info */}
          <div className="flex items-center gap-2 p-2.5" style={{ backgroundColor: "rgba(245,240,235,0.02)", border: "1px solid rgba(245,240,235,0.04)" }}>
            <div className="w-7 h-7 flex items-center justify-center text-[10px] font-medium shrink-0"
              style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
              {(current.atlas_fans?.display_name || current.atlas_fans?.email || "?").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium truncate" style={{ color: "#F5F0EB" }}>
                {current.atlas_fans?.display_name || current.atlas_fans?.email || "Inconnu"}
                <span className="text-[8px] ml-1.5" style={{ color: "rgba(245,240,235,0.2)" }}>
                  {current.atlas_fans?.fan_tier} · LTV {current.atlas_fans?.total_spent}€
                </span>
              </p>
              <p className="text-[8px]" style={{ color: "rgba(245,240,235,0.15)" }}>
                Dernière interaction : {current.atlas_fans?.last_interaction_at
                  ? new Date(current.atlas_fans.last_interaction_at).toLocaleDateString("fr-FR")
                  : "inconnue"}
              </p>
            </div>
            {current.approach && (
              <span className="text-[8px] px-1.5 py-0.5 shrink-0" style={{ backgroundColor: "rgba(199,91,57,0.08)", color: "#C75B39" }}>
                {current.approach}
              </span>
            )}
          </div>

          {/* Draft card */}
          <div className="p-4 min-h-[120px]" style={{
            backgroundColor: editMode ? "rgba(199,91,57,0.04)" : "rgba(245,240,235,0.02)",
            border: editMode ? "1px solid rgba(199,91,57,0.2)" : "1px solid rgba(245,240,235,0.06)",
          }}>
            {editMode ? (
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full min-h-[100px] text-xs leading-relaxed bg-transparent resize-none"
                style={{ color: "#F5F0EB" }}
              />
            ) : (
              <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "rgba(245,240,235,0.8)" }}>
                {current.draft_text}
              </p>
            )}
          </div>

          {/* Edit mode buttons */}
          {editMode && (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditMode(false); }}
                className="flex-1 text-[10px] font-medium py-2 transition-all hover:opacity-70"
                style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleAction("edit", editText)}
                disabled={actionLoading}
                className="flex-1 text-[10px] font-semibold py-2 transition-all disabled:opacity-30"
                style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}
              >
                {actionLoading ? "..." : "Sauvegarder & passer"}
              </button>
              <button
                onClick={() => handleAction("send", editText)}
                disabled={actionLoading}
                className="flex-1 text-[10px] font-semibold py-2 transition-all disabled:opacity-30"
                style={{ backgroundColor: "#7A9A65", color: "#F5F0EB" }}
              >
                {actionLoading ? "..." : "Envoyer modifié"}
              </button>
            </div>
          )}

          {/* Action buttons */}
          {!editMode && (
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleAction("skip")}
                disabled={actionLoading}
                className="text-[10px] font-medium py-2.5 transition-all hover:opacity-70 disabled:opacity-30 flex items-center justify-center gap-1"
                style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}
              >
                <SkipForward size={10} />
                Skip
              </button>
              <button
                onClick={() => { setEditText(current.draft_text); setEditMode(true); }}
                disabled={actionLoading}
                className="text-[10px] font-medium py-2.5 transition-all hover:opacity-70 disabled:opacity-30 flex items-center justify-center gap-1"
                style={{ backgroundColor: "rgba(199,91,57,0.08)", color: "#C75B39", border: "1px solid rgba(199,91,57,0.15)" }}
              >
                <Edit3 size={10} />
                Éditer
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={actionLoading}
                className="text-[10px] font-medium py-2.5 transition-all hover:opacity-70 disabled:opacity-30 flex items-center justify-center gap-1"
                style={{ backgroundColor: "rgba(196,69,54,0.08)", color: "#C44536", border: "1px solid rgba(196,69,54,0.15)" }}
              >
                <X size={10} />
                Rejeter
              </button>
              <button
                onClick={() => handleAction("send")}
                disabled={actionLoading}
                className="text-[10px] font-semibold py-2.5 transition-all hover:opacity-80 disabled:opacity-30 flex items-center justify-center gap-1"
                style={{ backgroundColor: "#7A9A65", color: "#F5F0EB" }}
              >
                <Send size={10} />
                Envoyer
              </button>
            </div>
          )}

          {/* Keyboard shortcut hint */}
          <p className="text-[8px] text-center" style={{ color: "rgba(245,240,235,0.1)" }}>
            ← Skip · ↑ Éditer · → Envoyer · ↓ Rejeter
          </p>
        </>
      ) : null}

      {/* Send all confirmation modal */}
      {showSendAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
          <div className="w-full max-w-sm p-4" style={{ backgroundColor: "#1A1614", border: "1px solid rgba(245,240,235,0.08)" }}>
            <h3 className="text-xs font-semibold mb-2" style={{ color: "#F5F0EB" }}>Envoyer tout sans relecture ?</h3>
            <p className="text-[10px] mb-3" style={{ color: "rgba(245,240,235,0.3)" }}>
              {pendingCount} drafts seront marqués comme envoyés sans validation individuelle. Cette action est irréversible.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowSendAll(false)}
                className="flex-1 text-[10px] font-medium py-2"
                style={{ backgroundColor: "rgba(245,240,235,0.04)", color: "rgba(245,240,235,0.3)", border: "1px solid rgba(245,240,235,0.06)" }}>
                Annuler
              </button>
              <button onClick={handleSendAll} disabled={sendingAll}
                className="flex-1 text-[10px] font-semibold py-2 disabled:opacity-30"
                style={{ backgroundColor: "#C75B39", color: "#F5F0EB" }}>
                {sendingAll ? "Envoi..." : `Envoyer ${pendingCount} drafts`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
