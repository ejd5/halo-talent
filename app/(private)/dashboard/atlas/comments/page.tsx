"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare, Loader, Filter, Search, RefreshCw, Check, X,
  Eye, EyeOff, Trash2, Reply, Heart, Shield, AlertTriangle,
  Camera, Film, Music2, Hash, SendHorizonal, Zap,
  ChevronDown, MessageCircle,
} from "lucide-react";
import type { AtlasComment, Platform, Sentiment, Intent } from "@/lib/atlas/comments/types";
import {
  PLATFORM_LABELS, PLATFORM_COLORS,
  SENTIMENT_LABELS, SENTIMENT_COLORS,
  INTENT_LABELS, INTENT_COLORS,
  STATUS_LABELS,
} from "@/lib/atlas/comments/types";

/* ─── Constants ─── */
const PLATFORM_ICONS: Record<string, any> = {
  instagram: Camera, tiktok: Music2, youtube: Film, twitter: Hash, facebook: MessageCircle,
};

export default function CommentsPage() {
  /* ─── State ─── */
  const [comments, setComments] = useState<AtlasComment[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({ all: 0 });
  const [platformCounts, setPlatformCounts] = useState<Record<string, number>>({ all: 0 });
  const [intentCounts, setIntentCounts] = useState<Record<string, number>>({ all: 0 });

  const [filterStatus, setFilterStatus] = useState("new");
  const [filterPlatform, setFilterPlatform] = useState("all");
  const [filterIntent, setFilterIntent] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyingLoading, setReplyingLoading] = useState(false);
  const [actingOn, setActingOn] = useState<string | null>(null);

  const replyRef = useRef<HTMLInputElement>(null);

  /* ─── Fetch ─── */
  useEffect(() => { fetchComments(); }, [filterStatus, filterPlatform, filterIntent]);

  async function fetchComments() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterPlatform !== "all") params.set("platform", filterPlatform);
      if (filterIntent !== "all") params.set("intent", filterIntent);
      params.set("limit", "100");

      const res = await fetch(`/api/dashboard/atlas/comments?${params}`);
      const d = await res.json();
      setComments(d.comments ?? []);
      setCount(d.count || 0);
      if (d.statusCounts) setStatusCounts(d.statusCounts);
      if (d.platformCounts) setPlatformCounts(d.platformCounts);
      if (d.intentCounts) setIntentCounts(d.intentCounts);
    } catch {} finally { setLoading(false); }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/dashboard/atlas/comments/sync");
      const d = await res.json();
      if (d.comments_found > 0) fetchComments();
    } catch {} finally { setSyncing(false); }
  }

  async function handleStatus(id: string, status: string) {
    setActingOn(id);
    try {
      await fetch("/api/dashboard/atlas/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_id: id, status }),
      });
      setComments((prev) => prev.map((c) => c.id === id ? { ...c, status: status as any } : c));
    } catch {} finally { setActingOn(null); }
  }

  async function handleReply(commentId: string) {
    if (!replyText.trim()) return;
    setReplyingLoading(true);
    try {
      await fetch(`/api/dashboard/atlas/comments/${commentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reply", content: replyText }),
      });
      setComments((prev) => prev.map((c) => c.id === commentId ? { ...c, status: "replied", auto_reply_content: replyText, replied_at: new Date().toISOString() } : c));
      setReplyingTo(null);
      setReplyText("");
    } catch {} finally { setReplyingLoading(false); }
  }

  const filtered = searchQuery
    ? comments.filter((c) => c.content.toLowerCase().includes(searchQuery.toLowerCase()) || c.author_username?.toLowerCase().includes(searchQuery.toLowerCase()))
    : comments;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Commentaires publics
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-ink-secondary)" }}>
            {count} commentaire{count > 1 ? "s" : ""} · Modération unifiée multi-plateforme
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1 px-3 py-2 text-[10px] rounded-sm transition-colors hover:bg-white/5 disabled:opacity-30"
            style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
          >
            <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Sync..." : "Sync"}
          </button>
          <Link
            href="/dashboard/atlas/comments/rules"
            className="flex items-center gap-1 px-3 py-2 text-[10px] font-medium rounded-sm transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            <Shield size={12} /> Règles auto
          </Link>
        </div>
      </div>

      {/* ─── KPI mini-cards ─── */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { key: "new", label: "Nouveaux", value: statusCounts.new || 0, color: "#5B8FA8" },
          { key: "replied", label: "Répondu", value: statusCounts.replied || 0, color: "var(--success)" },
          { key: "hidden", label: "Masqué", value: statusCounts.hidden || 0, color: "#F59E0B" },
          { key: "flagged", label: "Signalé", value: statusCounts.flagged || 0, color: "var(--danger)" },
          { key: null, label: "Total", value: statusCounts.all || 0, color: "var(--accent)" },
        ].map((kpi) => (
          <div key={kpi.key || "total"} className="p-2 text-center" style={{ backgroundColor: "var(--bg-card)", border: "1px solid rgba(245,240,235,0.06)" }}>
            <p className="text-[0.55rem] uppercase tracking-[0.1em]" style={{ color: "var(--color-ink-tertiary)" }}>{kpi.label}</p>
            <p className="text-lg font-bold" style={{ fontFamily: "var(--font-display)", color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* ─── Filters ─── */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-sm" style={{ backgroundColor: "var(--bg-card)" }}>
          {["new", "all", "replied", "hidden", "flagged"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-2 py-1 text-[9px] uppercase tracking-wider rounded-sm transition-colors"
              style={{
                backgroundColor: filterStatus === s ? "rgba(199,91,57,0.2)" : "transparent",
                color: filterStatus === s ? "var(--accent)" : "var(--color-ink-tertiary)",
              }}
            >
              {s === "all" ? "Tous" : STATUS_LABELS[s as keyof typeof STATUS_LABELS] || s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1" style={{ color: "var(--color-ink-tertiary)" }}>
          <Filter size={11} />
          <select
            value={filterPlatform}
            onChange={(e) => setFilterPlatform(e.target.value)}
            className="bg-transparent text-[10px] outline-none cursor-pointer"
            style={{ color: "var(--text-primary)" }}
          >
            <option value="all">Toutes plateformes</option>
            {Object.entries(PLATFORM_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 max-w-[200px]">
          <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: "var(--color-ink-tertiary)" }} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher..."
            className="w-full bg-transparent text-[10px] pl-7 pr-2 py-1 rounded-sm outline-none"
            style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
          />
        </div>
      </div>

      {/* ─── Comments list ─── */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <MessageCircle size={36} style={{ color: "rgba(255,255,255,0.05)" }} />
          <p className="text-sm mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun commentaire</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
            Synchronise les commentaires depuis tes plateformes connectées
          </p>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-sm mt-4 transition-opacity hover:opacity-80"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            Synchroniser
          </button>
        </div>
      ) : (
        <div className="space-y-1">
          {filtered.map((comment) => {
            const PlatformIcon = PLATFORM_ICONS[comment.platform] || MessageCircle;
            const platformColor = PLATFORM_COLORS[comment.platform] || "#666";
            const sentimentColor = comment.sentiment ? SENTIMENT_COLORS[comment.sentiment] : undefined;
            const intCol = comment.intent ? INTENT_COLORS[comment.intent] : undefined;

            return (
              <div key={comment.id} className="p-3 transition-colors" style={{
                backgroundColor: comment.status === "flagged" ? "rgba(196,69,54,0.03)" : comment.status === "new" ? "rgba(91,143,168,0.03)" : "#2A2420",
                border: "1px solid rgba(245,240,235,0.06)",
                borderLeft: `2px solid ${comment.status === "new" ? "#5B8FA8" : comment.status === "flagged" ? "var(--danger)" : comment.status === "replied" ? "var(--success)" : "transparent"}`,
              }}>
                {/* Main row */}
                <div className="flex items-start gap-3">
                  {/* Platform icon */}
                  <div className="w-8 h-8 flex items-center justify-center rounded-sm shrink-0" style={{ backgroundColor: `${platformColor}15` }}>
                    <PlatformIcon size={14} style={{ color: platformColor }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                        {comment.author_display_name || comment.author_username || "Anonyme"}
                      </span>
                      <span className="text-[8px]" style={{ color: platformColor }}>
                        {PLATFORM_LABELS[comment.platform]}
                      </span>
                      {comment.sentiment && (
                        <span className="text-[8px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: `${sentimentColor}15`, color: sentimentColor }}>
                          {SENTIMENT_LABELS[comment.sentiment]}
                        </span>
                      )}
                      {comment.intent && (
                        <span className="text-[8px] px-1 py-0.5 rounded-sm" style={{ backgroundColor: `${intCol}15`, color: intCol }}>
                          {INTENT_LABELS[comment.intent]}
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] leading-relaxed" style={{ color: "rgba(245,240,235,0.7)" }}>{comment.content}</p>

                    {/* Timestamp */}
                    <p className="text-[8px] mt-1" style={{ color: "var(--color-ink-tertiary)" }}>
                      {comment.occurred_at ? new Date(comment.occurred_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                      {comment.like_count > 0 && ` · ❤️ ${comment.like_count}`}
                    </p>

                    {/* Auto-reply indicator */}
                    {comment.auto_reply_content && (
                      <div className="flex items-start gap-1.5 mt-2 p-2 rounded-sm" style={{ backgroundColor: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.1)" }}>
                        <Zap size={10} style={{ color: "var(--success)", marginTop: 1 }} />
                        <div>
                          <span className="text-[8px] font-medium" style={{ color: "var(--success)" }}>Auto-réponse</span>
                          <p className="text-[10px] mt-0.5" style={{ color: "rgba(245,240,235,0.5)" }}>{comment.auto_reply_content}</p>
                        </div>
                      </div>
                    )}

                    {/* Reply form */}
                    {replyingTo === comment.id && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <input
                          ref={replyRef}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Écris ta réponse..."
                          className="flex-1 px-2 py-1.5 text-[10px] bg-transparent rounded-sm outline-none"
                          style={{ border: "1px solid rgba(245,240,235,0.08)", color: "var(--text-primary)" }}
                          onKeyDown={(e) => { if (e.key === "Enter") handleReply(comment.id); if (e.key === "Escape") setReplyingTo(null); }}
                          autoFocus
                        />
                        <button
                          onClick={() => handleReply(comment.id)}
                          disabled={replyingLoading || !replyText.trim()}
                          className="p-1.5 rounded-sm disabled:opacity-30"
                          style={{ color: "var(--accent)" }}
                        >
                          {replyingLoading ? <Loader size={12} className="animate-spin" /> : <SendHorizonal size={12} />}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyText(comment.auto_reply_content || ""); }}
                      className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                      title="Répondre"
                      style={{ color: comment.status === "replied" ? "var(--success)" : "var(--color-ink-tertiary)" }}
                    >
                      <Reply size={12} />
                    </button>
                    <button
                      onClick={() => handleStatus(comment.id, comment.status === "hidden" ? "approved" : "hidden")}
                      disabled={actingOn === comment.id}
                      className="p-1.5 rounded-sm transition-colors hover:bg-white/5 disabled:opacity-30"
                      title={comment.status === "hidden" ? "Afficher" : "Masquer"}
                      style={{ color: comment.status === "hidden" ? "#F59E0B" : "var(--color-ink-tertiary)" }}
                    >
                      {actingOn === comment.id ? <Loader size={12} className="animate-spin" /> : comment.status === "hidden" ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    {comment.status !== "deleted" && (
                      <button
                        onClick={() => handleStatus(comment.id, "deleted")}
                        disabled={actingOn === comment.id}
                        className="p-1.5 rounded-sm transition-colors hover:bg-white/5 disabled:opacity-30"
                        title="Supprimer"
                        style={{ color: "var(--danger)" }}
                      >
                        {actingOn === comment.id ? <Loader size={12} className="animate-spin" /> : <Trash2 size={12} />}
                      </button>
                    )}
                    <button
                      onClick={() => handleStatus(comment.id, comment.status === "flagged" ? "approved" : "flagged")}
                      className="p-1.5 rounded-sm transition-colors hover:bg-white/5"
                      title={comment.status === "flagged" ? "Lever le signalement" : "Signaler"}
                      style={{ color: comment.status === "flagged" ? "var(--danger)" : "var(--color-ink-tertiary)" }}
                    >
                      <AlertTriangle size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
