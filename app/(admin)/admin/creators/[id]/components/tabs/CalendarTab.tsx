"use client";

import { calendarPosts } from "../../../data";
import { formatDate } from "../../../utils";
import { CalendarDays, CheckCircle, Clock, XCircle, MonitorPlay, Camera, Music2, Globe } from "lucide-react";

type Props = { creatorId: string };

const platformIcons: Record<string, React.ElementType> = {
  YouTube: MonitorPlay,
  Instagram: Camera,
  TikTok: Music2,
  OnlyFans: Globe,
};

const statusStyles: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  planned: { icon: Clock, label: "Planifié", color: "var(--accent)" },
  published: { icon: CheckCircle, label: "Publié", color: "var(--success)" },
  failed: { icon: XCircle, label: "Échec", color: "var(--danger)" },
};

export function CalendarTab({ creatorId }: Props) {
  const posts = calendarPosts[creatorId] ?? [];

  return (
    <div className="space-y-4 card-accent">
      {posts.length === 0 ? (
        <p className="text-sm font-sans text-center py-8" style={{ color: "var(--text-secondary)" }}>
          Aucun contenu planifié pour ce créateur.
        </p>
      ) : (
        <>
          {/* Mini calendar header */}
          <div className="p-4 text-center" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
            <p className="font-display text-lg font-bold" style={{ color: "var(--text-primary)" }}>
              Juin 2026
            </p>
            <p className="text-[11px] font-sans mt-1" style={{ color: "var(--text-primary)" }}>
              {posts.filter((p) => p.status === "planned").length} contenus planifiés
            </p>
          </div>

          {/* Posts */}
          <div className="space-y-2">
            {posts.map((post) => {
              const st = statusStyles[post.status];
              const Icon = st.icon;
              const PlatformIcon = platformIcons[post.platform] ?? Globe;
              return (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-4 transition-colors hover:bg-white/[0.02]"
                  style={{ border: "1px solid var(--border-default)" }}
                >
                  <PlatformIcon size={16} strokeWidth={1.5} style={{ color: "var(--text-primary)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-medium truncate" style={{ color: "#D0CCC6" }}>
                      {post.content_preview}
                    </p>
                    <p className="text-[10px] font-sans mt-0.5" style={{ color: "var(--text-secondary)" }}>
                      {formatDate(post.scheduled_date)}
                    </p>
                  </div>
                  <span
                    className="flex items-center gap-1 text-[10px] font-sans font-semibold uppercase tracking-[0.08em] px-2 py-1 shrink-0"
                    style={{ background: `${st.color}12`, color: st.color }}
                  >
                    <Icon size={10} strokeWidth={1.5} />
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
