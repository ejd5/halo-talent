"use client";

import { useState, useMemo } from "react";
import { Plus, Search, FileEdit, Sparkles } from "lucide-react";
import { blogPosts as initialPosts } from "../../data";
import type { BlogPost } from "../../types";
import { BlogEditor } from "./BlogEditor";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  draft: { label: "Brouillon", color: "#E0D8D0" },
  published: { label: "Publié", color: "#7A9A65" },
  scheduled: { label: "Programmé", color: "#C75B39" },
};

const ALL_TAGS = [...new Set(initialPosts.flatMap((p) => p.tags))].sort();
const ALL_CATEGORIES = [...new Set(initialPosts.map((p) => p.category))].sort();
const ALL_STATUSES = ["draft", "published", "scheduled"] as const;

export function BlogListPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [search, setSearch] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.subtitle.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterTag && !p.tags.includes(filterTag)) return false;
      if (filterCategory && p.category !== filterCategory) return false;
      if (filterStatus && p.status !== filterStatus) return false;
      return true;
    });
  }, [posts, search, filterTag, filterCategory, filterStatus]);

  const handleSave = (post: BlogPost) => {
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === post.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = post;
        return next;
      }
      return [post, ...prev];
    });
    setEditingPost(null);
  };

  if (editingPost) {
    return <BlogEditor post={editingPost} onSave={handleSave} onBack={() => setEditingPost(null)} />;
  }

  return (
    <div className="flex flex-col gap-4 p-6 card-accent" style={{ background: "#0A0908" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: "#F5F0EB" }}>Blog</h1>
          <p className="text-xs opacity-40 mt-0.5">{filtered.length} article{filtered.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={() => setEditingPost({
            id: `post-${Date.now()}`, slug: "", title: "", subtitle: "", author: "Admin",
            cover_url: null, tags: [], category: "", content: "",
            status: "draft", scheduled_at: null, published_at: null,
            views: 0, seo_title: "", seo_description: "", seo_image: null,
            created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
          })}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity rounded-[0px]"
        >
          <Plus size={14} />
          Nouvel article
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40" />
          <input
            type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..." className="w-full pl-8 pr-3 py-1.5 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none"
          />
        </div>
        <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent rounded-[0px]">
          <option value="">Tous les tags</option>
          {ALL_TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent rounded-[0px]">
          <option value="">Toutes catégories</option>
          {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-2 py-1.5 text-[11px] border border-[var(--color-border)] bg-transparent rounded-[0px]">
          <option value="">Tous statuts</option>
          {ALL_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s].label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="border border-[var(--color-border)]">
        <div className="grid grid-cols-[1fr_120px_100px_140px_80px_80px] gap-4 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider opacity-40 border-b border-[var(--color-border)]">
          <div>Titre</div>
          <div>Auteur</div>
          <div>Statut</div>
          <div>Date</div>
          <div>Vues</div>
          <div>Actions</div>
        </div>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-sm opacity-30">Aucun article trouvé</div>
        ) : (
          filtered.map((post) => {
            const st = STATUS_LABELS[post.status];
            const date = post.published_at || post.scheduled_at || post.updated_at;
            const d = date ? new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) : "—";
            return (
              <div key={post.id} className="grid grid-cols-[1fr_120px_100px_140px_80px_80px] gap-4 px-5 py-3 items-center hover:bg-[var(--color-card)] transition-colors border-b border-[var(--color-border)] last:border-b-0">
                <div>
                  <div className="text-sm font-medium truncate">{post.title || "Sans titre"}</div>
                  <div className="text-[10px] opacity-30 truncate">{post.subtitle}</div>
                </div>
                <div className="text-xs opacity-50">{post.author}</div>
                <div>
                  <span className="text-[10px] font-medium px-2 py-0.5" style={{ color: st.color, backgroundColor: `${st.color}15` }}>{st.label}</span>
                </div>
                <div className="text-xs opacity-50">{d}</div>
                <div className="text-xs opacity-50">{post.views.toLocaleString("fr-FR")}</div>
                <div>
                  <button onClick={() => setEditingPost(post)} className="p-1 hover:opacity-60 transition-opacity">
                    <FileEdit size={14} className="opacity-40" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
