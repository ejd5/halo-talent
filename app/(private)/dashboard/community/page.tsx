"use client";

import { useState } from "react";
import { MessageCircle, Heart, Eye, Shield, Plus, Send, X, Calendar, MapPin, Users, ChevronDown, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────

type PostCategory = "strategie" | "wellness" | "business" | "qa";

type ForumPost = {
  id: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  author: string;
  authorAvatar: string | null;
  anonymous: boolean;
  isManager: boolean;
  replies: number;
  likes: number;
  views: number;
  timestamp: string;
  pinned: boolean;
};

type Meetup = {
  id: string;
  title: string;
  date: string;
  location: string;
  spots: number;
  spotsLeft: number;
  description: string;
};

// ─── Mock data ─────────────────────────────────────────

const CATEGORIES: { key: PostCategory | "all"; label: string; color: string }[] = [
  { key: "all", label: "Tous", color: "var(--text-primary)" },
  { key: "strategie", label: "Stratégie", color: "var(--accent)" },
  { key: "wellness", label: "Wellness", color: "var(--success)" },
  { key: "business", label: "Business", color: "#3B82F6" },
  { key: "qa", label: "Q&A", color: "#F59E0B" },
];

const CATEGORY_BADGE: Record<PostCategory, { label: string; color: string; bg: string }> = {
  strategie: { label: "Stratégie", color: "var(--accent)", bg: "rgba(199, 91, 57, 0.08)" },
  wellness: { label: "Wellness", color: "var(--success)", bg: "#10B98115" },
  business: { label: "Business", color: "#3B82F6", bg: "#3B82F615" },
  qa: { label: "Q&A", color: "#F59E0B", bg: "#F59E0B15" },
};

const MOCK_POSTS: ForumPost[] = [
  {
    id: "p1", title: "Comment structurez-vous votre semaine de contenu ?",
    excerpt: "J'essaie de planifier 7 jours à l'avance mais je finis toujours par tout faire à la dernière minute. Des tips ?",
    category: "strategie", author: "Camille R.", authorAvatar: null, anonymous: false, isManager: false,
    replies: 24, likes: 18, views: 342, timestamp: "2026-06-07T14:30:00", pinned: true,
  },
  {
    id: "p2", title: "Burn-out : comment je gère mon énergie sur la durée",
    excerpt: "Après 2 ans sur OF, j'ai appris à écouter mon corps. Voici ce qui marche pour moi...",
    category: "wellness", author: "Anonyme", authorAvatar: null, anonymous: true, isManager: false,
    replies: 31, likes: 47, views: 521, timestamp: "2026-06-06T09:15:00", pinned: true,
  },
  {
    id: "p3", title: "Quel logiciel de comptabilité utilisez-vous ?",
    excerpt: "Je cherche un outil pour gérer mes déclarations URSSAF et mes notes de frais. Des recommandations ?",
    category: "business", author: "Léa M.", authorAvatar: null, anonymous: false, isManager: false,
    replies: 12, likes: 8, views: 189, timestamp: "2026-06-05T16:45:00", pinned: false,
  },
  {
    id: "p4", title: "Vos questions sur le nouveau contrat WTF",
    excerpt: "Nouveau dans la maison, j'ai quelques questions sur les clauses d'exclusivité et le partage des revenus.",
    category: "qa", author: "Chloé T.", authorAvatar: null, anonymous: false, isManager: false,
    replies: 7, likes: 11, views: 156, timestamp: "2026-06-04T11:20:00", pinned: false,
  },
  {
    id: "p5", title: "Rappel : atelier Instagram Reels ce jeudi 15h",
    excerpt: "On organise un workshop avec Sarah pour optimiser vos Reels. Inscrivez-vous via le lien !",
    category: "strategie", author: "Thomas (Manager)", authorAvatar: null, anonymous: false, isManager: true,
    replies: 9, likes: 23, views: 278, timestamp: "2026-06-03T08:00:00", pinned: true,
  },
  {
    id: "p6", title: "Méditation guidée : on se fait une session ?",
    excerpt: "Je propose une méditation collective sur Discord ce dimanche 20h. Qui est partant ?",
    category: "wellness", author: "Anonyme", authorAvatar: null, anonymous: true, isManager: false,
    replies: 15, likes: 32, views: 204, timestamp: "2026-06-02T19:30:00", pinned: false,
  },
  {
    id: "p7", title: "Optimisation fiscale pour créateurs : ce qu'il faut savoir",
    excerpt: "Un point sur les différentes options : EI, EURL, SASU. Avantages et inconvénients de chaque statut.",
    category: "business", author: "Sophie (Comptable)", authorAvatar: null, anonymous: false, isManager: true,
    replies: 19, likes: 36, views: 412, timestamp: "2026-06-01T10:00:00", pinned: false,
  },
  {
    id: "p8", title: "Comment gérer les haters et les commentaires négatifs ?",
    excerpt: "Je reçois pas mal de messages durs depuis que j'ai grandi. Comment vous faites pour encaisser ?",
    category: "qa", author: "Anonyme", authorAvatar: null, anonymous: true, isManager: false,
    replies: 28, likes: 44, views: 389, timestamp: "2026-05-30T22:10:00", pinned: false,
  },
];

const MOCK_MEETUPS: Meetup[] = [
  {
    id: "m1", title: "Summer Retreat Créateurs 2026",
    date: "2026-07-18T10:00:00", location: "Biarritz, France",
    spots: 20, spotsLeft: 7,
    description: "3 jours de workshops, networking et bien-être au bord de l'océan.",
  },
  {
    id: "m2", title: "Afterwork Paris, Juillet",
    date: "2026-07-08T18:30:00", location: "Paris 11e",
    spots: 30, spotsLeft: 12,
    description: "Rencontre informelle entre créateurs WTF. Verre offert par la maison.",
  },
];

// ─── Helpers ───────────────────────────────────────────

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  return `Il y a ${days} jours`;
};

// ─── Component ─────────────────────────────────────────

export default function CommunityPage() {
  const [category, setCategory] = useState<PostCategory | "all">("all");
  const [showNewPost, setShowNewPost] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<PostCategory>("strategie");
  const [search, setSearch] = useState("");
  const [showMeetups, setShowMeetups] = useState(false);

  const filtered = MOCK_POSTS.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.excerpt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const pinned = filtered.filter((p) => p.pinned);
  const normal = filtered.filter((p) => !p.pinned);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Communauté</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-primary)" }}>Échange avec les autres créateurs de la maison</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMeetups(!showMeetups)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium border border-[var(--color-border)] transition-all hover:border-[var(--accent)]/50"
            style={{ color: "var(--text-primary)" }}
          >
            <Calendar size={11} /> Meet-ups
          </button>
          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
            style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
          >
            <Plus size={11} /> Nouveau post
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255, 255, 255, 0.19)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher dans la communauté..."
          className="w-full bg-transparent border border-[var(--color-border)] py-2.5 pl-9 pr-3 text-sm placeholder:opacity-30 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 border-b border-[var(--color-border)] pb-0 overflow-x-auto">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={cn(
              "px-4 py-2.5 text-[10px] uppercase tracking-wider font-medium transition-all whitespace-nowrap",
              category === cat.key ? "border-b-2" : "opacity-40 hover:opacity-70"
            )}
            style={{
              borderColor: category === cat.key ? cat.color : "transparent",
              color: "var(--text-primary)",
            }}
          >
            {cat.label}
            {cat.key !== "all" && (
              <span className="ml-1.5 text-[8px] opacity-40">
                ({MOCK_POSTS.filter((p) => p.category === cat.key).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Meetups section */}
      {showMeetups && (
        <div className="border border-[var(--color-border)] p-4" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Calendar size={13} style={{ color: "var(--accent)" }} />
              Meet-ups à venir
            </h3>
            <button onClick={() => setShowMeetups(false)} className="opacity-40 hover:opacity-100">
              <X size={12} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOCK_MEETUPS.map((m) => (
              <div key={m.id} className="p-3 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{m.title}</h4>
                  <span className={cn(
                    "text-[8px] px-1.5 py-0.5 font-mono",
                    m.spotsLeft <= 5 ? "text-[var(--danger)] bg-[var(--danger)]/10" : "text-[var(--success)] bg-[var(--success)]/10"
                  )}>
                    {m.spotsLeft}/{m.spots} places
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] mb-2" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                  <span className="flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(m.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {m.location}
                  </span>
                </div>
                <p className="text-[10px] mb-3" style={{ color: "rgba(255, 255, 255, 0.5)" }}>{m.description}</p>
                <button
                  className="text-[9px] px-3 py-1.5 font-medium uppercase tracking-wider"
                  style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
                >
                  <Users size={10} className="inline mr-1" />
                  S'inscrire
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Posts list */}
      <div className="space-y-2">
        {/* Pinned */}
        {pinned.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {pinned.length > 0 && normal.length > 0 && (
          <div className="border-t border-[var(--color-border)] my-2" />
        )}
        {normal.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {filtered.length === 0 && (
          <div className="p-12 border border-[var(--color-border)] flex items-center justify-center" style={{ backgroundColor: "var(--color-card)" }}>
            <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Aucun post trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "#00000080" }}>
          <div className="w-full max-w-lg border border-[var(--color-border)] p-6" style={{ backgroundColor: "var(--color-card)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Nouvelle discussion</h2>
              <button onClick={() => { setShowNewPost(false); setAnonymous(false); setNewTitle(""); setNewContent(""); }}
                className="opacity-40 hover:opacity-100 transition-opacity">
                <X size={14} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Category select */}
              <div>
                <p className="text-[10px] uppercase tracking-wider font-medium mb-1.5" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Catégorie</p>
                <div className="flex gap-2">
                  {(["strategie", "wellness", "business", "qa"] as PostCategory[]).map((c) => (
                    <button
                      key={c}
                      onClick={() => setNewCategory(c)}
                      className={cn(
                        "px-3 py-1.5 text-[9px] font-medium border transition-all",
                        newCategory === c ? "border-current" : "border-[var(--color-border)]"
                      )}
                      style={{
                        color: newCategory === c ? CATEGORY_BADGE[c].color : "var(--text-primary)",
                        backgroundColor: newCategory === c ? CATEGORY_BADGE[c].bg : "transparent",
                      }}
                    >
                      {CATEGORY_BADGE[c].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Titre de votre discussion..."
                className="w-full bg-transparent border-b border-[var(--color-border)] py-2 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:opacity-30"
                style={{ color: "var(--text-primary)" }}
              />

              {/* Content */}
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Écrivez votre message..."
                rows={4}
                className="w-full bg-transparent border border-[var(--color-border)] p-3 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors placeholder:opacity-30 resize-none"
                style={{ color: "var(--text-primary)" }}
              />

              {/* Anonymous toggle */}
              <button
                onClick={() => setAnonymous(!anonymous)}
                className={cn(
                  "flex items-center gap-2 text-[10px] font-medium transition-all",
                  anonymous ? "opacity-100" : "opacity-40 hover:opacity-70"
                )}
                style={{ color: anonymous ? "var(--success)" : "var(--text-primary)" }}
              >
                <div className={cn(
                  "w-4 h-4 border flex items-center justify-center transition-all",
                  anonymous && "border-[#10B981] bg-[var(--success)]"
                )}>
                  {anonymous && <X size={9} className="text-white" />}
                </div>
                Poster anonymement
              </button>

              {/* Submit */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => { setShowNewPost(false); setAnonymous(false); setNewTitle(""); setNewContent(""); }}
                  className="px-4 py-2 text-[10px] font-medium uppercase tracking-wider border border-[var(--color-border)] hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text-primary)" }}
                >
                  Annuler
                </button>
                <button
                  onClick={() => { setShowNewPost(false); setAnonymous(false); setNewTitle(""); setNewContent(""); }}
                  disabled={!newTitle.trim() || !newContent.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-medium uppercase tracking-wider disabled:opacity-40 transition-opacity"
                  style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
                >
                  <Send size={11} />
                  Publier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Post Card ─────────────────────────────────────────

function PostCard({ post }: { post: ForumPost }) {
  const [liked, setLiked] = useState(false);
  const badge = CATEGORY_BADGE[post.category];

  return (
    <div className={cn(
      "p-4 border border-[var(--color-border)] transition-all hover:border-[var(--color-border)]/60 card-accent",
      post.pinned && "border-l-[var(--accent)]"
    )} style={{ backgroundColor: "var(--color-card)" }}>
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 border",
          post.anonymous ? "border-dashed border-[#10B981]/40" : "border-[var(--color-border)]"
        )} style={{
          backgroundColor: post.anonymous ? "#10B98110" : "var(--color-base)",
          color: post.anonymous ? "var(--success)" : "var(--text-primary)",
        }}>
          {post.anonymous ? "?" : post.author.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Meta row */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-medium" style={{ color: post.anonymous ? "var(--success)" : "var(--text-primary)" }}>
              {post.author}
              {post.anonymous && <span className="text-[8px] ml-1 italic opacity-60">(anonyme)</span>}
            </span>
            {post.isManager && (
              <span className="inline-flex items-center gap-0.5 px-1 py-0.5 text-[7px] font-mono uppercase tracking-wider"
                style={{ backgroundColor: "rgba(199, 91, 57, 0.08)", color: "var(--accent)" }}>
                <Shield size={7} /> Manager
              </span>
            )}
            <span className="text-[9px]" style={{ color: "rgba(255, 255, 255, 0.25)" }}>·</span>
            <span className="text-[9px]" style={{ color: "rgba(255, 255, 255, 0.25)" }}>{timeAgo(post.timestamp)}</span>
          </div>

          {/* Title + excerpt */}
          <h3 className="text-sm font-semibold mb-0.5" style={{ color: "var(--text-primary)" }}>
            {post.pinned && <span className="mr-1 text-[var(--accent)]">📌</span>}
            {post.title}
          </h3>
          <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(255, 255, 255, 0.5)" }}>{post.excerpt}</p>

          {/* Footer */}
          <div className="flex items-center gap-3 text-[10px]" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
            <span className={cn("px-1.5 py-0.5 font-medium")} style={{ backgroundColor: badge.bg, color: badge.color }}>
              {badge.label}
            </span>
            <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
              <Heart size={11} className={liked ? "fill-current" : ""} style={{ color: liked ? "var(--danger)" : undefined }} />
              <span onClick={() => setLiked(!liked)}>{post.likes + (liked ? 1 : 0)}</span>
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle size={11} /> {post.replies}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={11} /> {post.views}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
