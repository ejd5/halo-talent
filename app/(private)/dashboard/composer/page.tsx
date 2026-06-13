"use client";

import { useState } from "react";
import {
  Calendar, Plus, ChevronLeft, ChevronRight, Camera, Play,
  AtSign, Clock, CheckCircle2, Circle, Pencil, Trash2, X,
} from "lucide-react";

// ── Types & Mock data ────────────────────────────────────
type Status = "published" | "scheduled" | "draft";
type Platform = "instagram" | "tiktok" | "youtube" | "twitter";

const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  twitter: "Twitter/X",
};


const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: "#E1306C",
  tiktok: "#69C9D0",
  youtube: "#FF0000",
  twitter: "#1DA1F2",
};

const STATUS_CONFIG: Record<Status, { label: string; color: string; icon: React.ElementType }> = {
  published: { label: "Publié", color: "#A8D08D", icon: CheckCircle2 },
  scheduled: { label: "Planifié", color: "var(--color-accent)", icon: Clock },
  draft: { label: "Brouillon", color: "rgba(245,240,235,0.35)", icon: Circle },
};

interface Post {
  id: string;
  title: string;
  platform: Platform;
  status: Status;
  day: number;
  time: string;
  type: string;
  emoji: string;
}

const POSTS: Post[] = [
  { id: "p1", title: "Routine matinale exclusive", platform: "instagram", status: "published", day: 2, time: "09:00", type: "Reel", emoji: "🌅" },
  { id: "p2", title: "Behind the scenes shooting", platform: "tiktok", status: "scheduled", day: 4, time: "18:30", type: "Vidéo", emoji: "🎬" },
  { id: "p3", title: "Q&A avec mes abonnés", platform: "youtube", status: "scheduled", day: 6, time: "20:00", type: "Live", emoji: "💬" },
  { id: "p4", title: "Tendances mode été 2026", platform: "instagram", status: "draft", day: 9, time: "12:00", type: "Carrousel", emoji: "👗" },
  { id: "p5", title: "Thread stratégie créateur", platform: "twitter", status: "draft", day: 10, time: "10:00", type: "Thread", emoji: "🧵" },
  { id: "p6", title: "Vlog journée de travail", platform: "youtube", status: "scheduled", day: 12, time: "17:00", type: "Vlog", emoji: "📹" },
  { id: "p7", title: "Offre PPV exclusive weekend", platform: "instagram", status: "scheduled", day: 14, time: "20:00", type: "Post PPV", emoji: "💎" },
  { id: "p8", title: "Recap mois de juin", platform: "tiktok", status: "draft", day: 15, time: "19:00", type: "Vidéo", emoji: "📊" },
];

const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function PlatformIcon({ platform, size = 14 }: { platform: Platform; size?: number }) {
  const icons: Record<Platform, React.ElementType> = {
    instagram: Camera,
    tiktok: () => <span style={{ fontSize: size, lineHeight: 1 }}>♪</span>,
    youtube: Play,
    twitter: AtSign,
  };
  const Icon = icons[platform];
  return <Icon size={size} style={{ color: PLATFORM_COLORS[platform] }} />;
}

export default function ComposerPage() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [month] = useState("Juin 2026");
  const [activeFilter, setActiveFilter] = useState<"all" | Status>("all");

  const filtered = POSTS.filter((p) => activeFilter === "all" || p.status === activeFilter);
  const postsByDay: Record<number, Post[]> = {};
  POSTS.forEach((p) => {
    postsByDay[p.day] = [...(postsByDay[p.day] || []), p];
  });

  // Build mini calendar (30 days, starting Wednesday for June 2026)
  const startOffset = 2; // June 1 = Wednesday
  const totalDays = 30;
  const calendarCells = Array.from({ length: Math.ceil((totalDays + startOffset) / 7) * 7 }, (_, i) => {
    const day = i - startOffset + 1;
    return day >= 1 && day <= totalDays ? day : null;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Composer
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
            Planifiez et organisez votre calendrier éditorial
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold transition-all"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          <Plus size={14} />
          Nouveau post
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Publiés", count: POSTS.filter((p) => p.status === "published").length, color: "#A8D08D" },
          { label: "Planifiés", count: POSTS.filter((p) => p.status === "scheduled").length, color: "var(--color-accent)" },
          { label: "Brouillons", count: POSTS.filter((p) => p.status === "draft").length, color: "rgba(245,240,235,0.35)" },
          { label: "Total", count: POSTS.length, color: "var(--text-primary)" },
        ].map((s) => (
          <div key={s.label} className="p-4 border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-display)", color: s.color }}>{s.count}</div>
            <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
            {/* Month nav */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <button className="p-1 opacity-40 hover:opacity-100 transition-opacity">
                <ChevronLeft size={16} style={{ color: "var(--text-primary)" }} />
              </button>
              <div className="flex items-center gap-2">
                <Calendar size={14} style={{ color: "var(--color-accent)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{month}</span>
              </div>
              <button className="p-1 opacity-40 hover:opacity-100 transition-opacity">
                <ChevronRight size={16} style={{ color: "var(--text-primary)" }} />
              </button>
            </div>
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-[var(--color-border)]">
              {DAYS_OF_WEEK.map((d) => (
                <div key={d} className="text-center py-2 text-[9px] font-semibold uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.3)" }}>
                  {d}
                </div>
              ))}
            </div>
            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarCells.map((day, i) => {
                const dayPosts = day ? (postsByDay[day] || []) : [];
                const isToday = day === 13;
                return (
                  <div
                    key={i}
                    className="min-h-[72px] p-1.5 border-b border-r border-[var(--color-border)] last:border-r-0 hover:bg-[var(--color-surface)]/50 transition-colors"
                    style={{ borderColor: "rgba(245,240,235,0.06)" }}
                  >
                    {day && (
                      <>
                        <div
                          className="text-[10px] font-mono mb-1 w-5 h-5 flex items-center justify-center"
                          style={{
                            color: isToday ? "#fff" : "rgba(245,240,235,0.4)",
                            backgroundColor: isToday ? "var(--color-accent)" : "transparent",
                          }}
                        >
                          {day}
                        </div>
                        <div className="space-y-0.5">
                          {dayPosts.slice(0, 2).map((p) => (
                            <button
                              key={p.id}
                              onClick={() => setSelectedPost(p)}
                              className="w-full text-left text-[9px] px-1 py-0.5 truncate transition-opacity hover:opacity-80"
                              style={{
                                backgroundColor: `${PLATFORM_COLORS[p.platform]}20`,
                                color: PLATFORM_COLORS[p.platform],
                                border: `1px solid ${PLATFORM_COLORS[p.platform]}30`,
                              }}
                            >
                              {p.emoji} {p.title}
                            </button>
                          ))}
                          {dayPosts.length > 2 && (
                            <div className="text-[8px] text-center" style={{ color: "rgba(245,240,235,0.3)" }}>
                              +{dayPosts.length - 2}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: post list */}
        <div className="flex flex-col gap-3">
          {/* Filters */}
          <div className="flex gap-1 flex-wrap">
            {(["all", "published", "scheduled", "draft"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="px-2 py-1 text-[9px] font-semibold uppercase tracking-wider border transition-all"
                style={{
                  borderColor: activeFilter === f ? "var(--color-accent)" : "rgba(245,240,235,0.1)",
                  color: activeFilter === f ? "var(--color-accent)" : "rgba(245,240,235,0.4)",
                  backgroundColor: activeFilter === f ? "var(--accent-soft)" : "transparent",
                }}
              >
                {f === "all" ? "Tous" : STATUS_CONFIG[f].label}
              </button>
            ))}
          </div>

          {/* Post list */}
          <div className="border border-[var(--color-border)] divide-y divide-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
            {filtered.map((post) => {
              const StatusIcon = STATUS_CONFIG[post.status].icon;
              return (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="w-full px-3 py-3 text-left flex items-start gap-2.5 hover:bg-[var(--color-surface)]/50 transition-colors"
                >
                  <span className="text-base shrink-0 mt-0.5">{post.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>{post.title}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <PlatformIcon platform={post.platform} size={10} />
                      <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.35)" }}>{PLATFORM_LABELS[post.platform]}</span>
                      <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.2)" }}>·</span>
                      <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>J{post.day} {post.time}</span>
                    </div>
                  </div>
                  <StatusIcon size={12} style={{ color: STATUS_CONFIG[post.status].color, marginTop: 2 }} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Post detail modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={() => setSelectedPost(null)}>
          <div
            className="w-full max-w-md border p-6 relative"
            style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 opacity-40 hover:opacity-100 transition-opacity">
              <X size={16} style={{ color: "var(--text-primary)" }} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selectedPost.emoji}</span>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selectedPost.title}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <PlatformIcon platform={selectedPost.platform} />
                  <span className="text-[10px]" style={{ color: "rgba(245,240,235,0.4)" }}>{PLATFORM_LABELS[selectedPost.platform]}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Type", value: selectedPost.type },
                { label: "Date", value: `${selectedPost.day} Juin 2026` },
                { label: "Heure", value: selectedPost.time },
                { label: "Statut", value: STATUS_CONFIG[selectedPost.status].label },
              ].map((d) => (
                <div key={d.label} className="p-2.5 border" style={{ borderColor: "rgba(245,240,235,0.08)", backgroundColor: "var(--color-surface)" }}>
                  <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "rgba(245,240,235,0.3)" }}>{d.label}</div>
                  <div className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>{d.value}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors" style={{ color: "var(--text-primary)" }}>
                <Pencil size={12} /> Éditer
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border transition-colors" style={{ borderColor: "#E05C5C30", color: "#E05C5C", backgroundColor: "transparent" }}>
                <Trash2 size={12} /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
