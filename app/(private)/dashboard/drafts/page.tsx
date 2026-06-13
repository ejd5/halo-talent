"use client";

import { useState } from "react";
import {
  FileText, Clock, CheckCircle2, Circle, Sparkles, Camera,
  Play, AtSign, Eye, Trash2, Send, Plus, Filter, Search,
  MoreHorizontal, Calendar,
} from "lucide-react";

// ── Types & Mock ─────────────────────────────────────────
type Status = "draft" | "ready" | "ai-review";
type Platform = "instagram" | "tiktok" | "youtube" | "twitter";

interface Draft {
  id: string;
  title: string;
  excerpt: string;
  platform: Platform;
  status: Status;
  type: string;
  emoji: string;
  updatedAt: string;
  wordCount: number;
  aiScore?: number;
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Brouillon", color: "rgba(245,240,235,0.35)", icon: Circle },
  ready: { label: "Prêt à publier", color: "#A8D08D", icon: CheckCircle2 },
  "ai-review": { label: "Revue IA en cours", color: "var(--color-accent)", icon: Sparkles },
};

const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#E1306C",
  tiktok: "#69C9D0",
  youtube: "#FF0000",
  twitter: "#1DA1F2",
};

const DRAFTS: Draft[] = [
  {
    id: "d1",
    title: "Ma routine matinale qui a tout changé",
    excerpt: "Depuis 6 mois, je me lève à 6h30 sans alarme. Voilà ce que j'ai appris sur la discipline...",
    platform: "instagram",
    status: "ready",
    type: "Caption",
    emoji: "🌅",
    updatedAt: "Il y a 2h",
    wordCount: 148,
    aiScore: 92,
  },
  {
    id: "d2",
    title: "Script : comment j'ai atteint 100K",
    excerpt: "Introduction : Bam ! Voici la vérité sur la croissance que personne ne partage...",
    platform: "youtube",
    status: "ai-review",
    type: "Script vidéo",
    emoji: "🎬",
    updatedAt: "Il y a 5h",
    wordCount: 842,
    aiScore: 87,
  },
  {
    id: "d3",
    title: "Thread : stratégie contenu 2026",
    excerpt: "1/ Ce que j'ai découvert après avoir analysé 200 comptes qui ont explosé cette année...",
    platform: "twitter",
    status: "draft",
    type: "Thread",
    emoji: "🧵",
    updatedAt: "Hier",
    wordCount: 312,
  },
  {
    id: "d4",
    title: "Behind the scenes - shooting été",
    excerpt: "Il y a des shoots qui te marquent pour toujours. Celui-là en fait partie...",
    platform: "tiktok",
    status: "draft",
    type: "Caption vidéo",
    emoji: "📸",
    updatedAt: "Il y a 2j",
    wordCount: 95,
  },
  {
    id: "d5",
    title: "Offre exclusive PPV weekend",
    excerpt: "Pour mes abonnés les plus fidèles, ce weekend j'ai préparé quelque chose de spécial...",
    platform: "instagram",
    status: "ready",
    type: "Post PPV",
    emoji: "💎",
    updatedAt: "Il y a 3j",
    wordCount: 210,
    aiScore: 95,
  },
  {
    id: "d6",
    title: "Vlog : journée type créatrice",
    excerpt: "6h30 - réveil. Pas d'alarme. Le corps s'y est habitué depuis 3 mois...",
    platform: "youtube",
    status: "draft",
    type: "Vlog",
    emoji: "📹",
    updatedAt: "Il y a 4j",
    wordCount: 1240,
  },
];

export default function DraftsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [platformFilter, setPlatformFilter] = useState<"all" | Platform>("all");
  const [selected, setSelected] = useState<Draft | null>(null);

  const filtered = DRAFTS.filter((d) => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchPlatform = platformFilter === "all" || d.platform === platformFilter;
    return matchSearch && matchStatus && matchPlatform;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Brouillons
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
            {DRAFTS.length} brouillons · {DRAFTS.filter((d) => d.status === "ready").length} prêts à publier
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          <Plus size={14} />
          Nouveau brouillon
        </button>
      </div>

      {/* Filters & search */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 flex-1 min-w-48 border" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}>
          <Search size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un brouillon..."
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-1">
          {(["all", "draft", "ai-review", "ready"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wider border transition-all"
              style={{
                borderColor: statusFilter === f ? "var(--color-accent)" : "rgba(245,240,235,0.08)",
                color: statusFilter === f ? "var(--color-accent)" : "rgba(245,240,235,0.4)",
                backgroundColor: statusFilter === f ? "var(--accent-soft)" : "transparent",
              }}
            >
              {f === "all" ? "Tous" : STATUS_CONFIG[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Brouillons", count: DRAFTS.filter((d) => d.status === "draft").length, color: "rgba(245,240,235,0.5)" },
          { label: "Revue IA", count: DRAFTS.filter((d) => d.status === "ai-review").length, color: "var(--color-accent)" },
          { label: "Prêts", count: DRAFTS.filter((d) => d.status === "ready").length, color: "#A8D08D" },
        ].map((s) => (
          <div key={s.label} className="p-4 border border-[var(--color-border)] card-accent text-center" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: s.color }}>{s.count}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider mt-1" style={{ color: "rgba(245,240,235,0.35)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Draft grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((draft) => {
          const StatusIcon = STATUS_CONFIG[draft.status].icon;
          return (
            <div
              key={draft.id}
              className="border p-4 flex flex-col gap-3 cursor-pointer hover:border-[var(--color-accent)]/30 transition-all card-accent"
              style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}
              onClick={() => setSelected(draft)}
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{draft.emoji}</span>
                  <div>
                    <div
                      className="text-[10px] px-1.5 py-0.5 font-semibold"
                      style={{ backgroundColor: `${PLATFORM_COLORS[draft.platform]}15`, color: PLATFORM_COLORS[draft.platform], border: `1px solid ${PLATFORM_COLORS[draft.platform]}30` }}
                    >
                      {draft.platform}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <StatusIcon size={12} style={{ color: STATUS_CONFIG[draft.status].color }} />
                  <span className="text-[9px]" style={{ color: STATUS_CONFIG[draft.status].color }}>
                    {STATUS_CONFIG[draft.status].label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-sm font-semibold mb-1.5 line-clamp-1" style={{ color: "var(--text-primary)" }}>{draft.title}</h3>
                <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(245,240,235,0.4)" }}>{draft.excerpt}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>{draft.type}</span>
                  <span style={{ color: "rgba(245,240,235,0.15)" }}>·</span>
                  <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>{draft.wordCount} mots</span>
                </div>
                <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.25)" }}>{draft.updatedAt}</span>
              </div>

              {/* AI Score */}
              {draft.aiScore && (
                <div className="flex items-center justify-between px-2.5 py-1.5 border" style={{ backgroundColor: "var(--accent-soft)", borderColor: "rgba(199,91,57,0.2)" }}>
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={10} style={{ color: "var(--color-accent)" }} />
                    <span className="text-[9px] font-semibold" style={{ color: "var(--color-accent)" }}>Score IA</span>
                  </div>
                  <span className="text-[10px] font-bold" style={{ color: "var(--color-accent)" }}>{draft.aiScore}/100</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-semibold border transition-all hover:bg-[var(--color-surface)]"
                  style={{ borderColor: "rgba(245,240,235,0.08)", color: "rgba(245,240,235,0.5)" }}
                >
                  <Eye size={10} /> Voir
                </button>
                {draft.status === "ready" && (
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-semibold border transition-all"
                    style={{ borderColor: "rgba(199,91,57,0.3)", color: "var(--color-accent)", backgroundColor: "var(--accent-soft)" }}
                  >
                    <Send size={10} /> Publier
                  </button>
                )}
                {draft.status === "draft" && (
                  <button
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[10px] font-semibold border transition-all"
                    style={{ borderColor: "rgba(199,91,57,0.15)", color: "rgba(199,91,57,0.7)" }}
                  >
                    <Sparkles size={10} /> Améliorer IA
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center border border-dashed" style={{ borderColor: "rgba(245,240,235,0.08)" }}>
          <FileText size={24} className="mx-auto mb-3" style={{ color: "rgba(245,240,235,0.15)" }} />
          <div className="text-sm" style={{ color: "rgba(245,240,235,0.3)" }}>Aucun brouillon trouvé</div>
        </div>
      )}
    </div>
  );
}
