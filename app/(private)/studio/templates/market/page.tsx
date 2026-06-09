"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Layout, Heart, Play, Search, Loader, Image, Film, Columns3, Square, MessageCircle, User, TrendingUp } from "lucide-react";
import type { Template, TemplateType } from "@/lib/studio/types";

const TYPE_ICONS: Record<TemplateType, any> = { photo: Image, video: Film, carousel: Columns3, story: Square, caption: MessageCircle };

export default function MarketPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  useEffect(() => { fetchMarket(); }, [type]);

  async function fetchMarket() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ market: "true", limit: "100" });
      if (type) params.set("type", type);
      const res = await fetch(`/api/studio/templates?${params}`);
      const data = await res.json();
      setTemplates(data.templates ?? []);
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(template: Template) {
    try {
      const res = await fetch(`/api/studio/templates/${template.id}/like`, { method: "POST" });
      const data = await res.json();
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === template.id
            ? { ...t, liked_by_me: data.liked as boolean, likes_count: t.likes_count + (data.liked ? 1 : -1) }
            : t
        )
      );
    } catch {
      // silent
    }
  }

  async function handleUse(template: Template) {
    try {
      await fetch(`/api/studio/templates/${template.id}/use`, { method: "POST" });
      const targets: Record<TemplateType, string> = { photo: "/studio/composer", video: "/studio/edit/video", carousel: "/studio/composer", story: "/studio/composer", caption: "/studio/generate/text" };
      localStorage.setItem("composer-template", JSON.stringify(template));
      window.location.href = targets[template.type] || "/studio/composer";
    } catch {
      // silent
    }
  }

  const filtered = templates.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.tags?.some((tag) => tag.includes(q));
  });

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="px-4 md:px-6 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/studio/templates" className="p-1 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.4)" }}>
            <ArrowLeft size={14} />
          </Link>
          <h1 className="text-lg italic" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Marketplace</h1>
        </div>
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          Templates créés par la communauté Halo Talent · {templates.length} disponibles
        </p>
      </div>

      <div className="flex items-center gap-0 px-4 md:px-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/studio/templates" className="px-3 py-2.5 text-[11px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
          Officiels
        </Link>
        <Link href="/studio/templates/mine" className="px-3 py-2.5 text-[11px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
          Mes templates
        </Link>
        <Link href="/studio/templates/market" className="px-3 py-2.5 text-[11px] font-medium" style={{ color: "#C75B39", borderBottom: "1px solid #C75B39" }}>
          Marketplace
        </Link>
      </div>

      {/* Filters */}
      <div className="px-4 md:px-6 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.15)" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher dans la marketplace..."
            className="w-full text-[10px] bg-transparent pl-7 pr-2.5 py-1.5 rounded-sm outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.06)", color: "#F5F0EB" }} />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none"
          style={{ border: "1px solid rgba(255,255,255,0.06)", color: "#F5F0EB" }}>
          <option value="">Tous les types</option>
          <option value="photo">Photo</option>
          <option value="video">Vidéo</option>
          <option value="carousel">Carrousel</option>
          <option value="story">Story</option>
          <option value="caption">Caption</option>
        </select>
      </div>

      {/* Grid */}
      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Layout size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Aucun template communautaire pour le moment</p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>Les templates publics des créateurs apparaîtront ici</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((template) => {
              const TypeIcon = TYPE_ICONS[template.type] || Layout;
              return (
                <div key={template.id} className="rounded-sm overflow-hidden group" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  <div className="relative aspect-[4/5] flex items-center justify-center overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
                    {template.preview_url ? (
                      <img src={template.preview_url} alt={template.name} className="w-full h-full object-cover" />
                    ) : (
                      <TypeIcon size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.6)" }}>
                      <button onClick={() => handleUse(template)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium rounded-sm transition-opacity hover:opacity-80"
                        style={{ background: "#C75B39", color: "#FFFFFF" }}>
                        <Play size={10} /> Utiliser
                      </button>
                    </div>
                    <span className="absolute bottom-1.5 left-1.5 text-[8px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.4)" }}>
                      <TypeIcon size={8} className="inline mr-1" /> {template.type}
                    </span>
                    {/* Like button */}
                    <button onClick={(e) => { e.stopPropagation(); handleLike(template); }}
                      className="absolute top-1.5 right-1.5 p-1.5 rounded-sm transition-colors hover:bg-white/10"
                      style={{ background: "rgba(0,0,0,0.4)" }}>
                      <Heart size={10} style={{ color: template.liked_by_me ? "#E5484D" : "rgba(255,255,255,0.3)", fill: template.liked_by_me ? "#E5484D" : "transparent" }} />
                    </button>
                  </div>
                  <div className="p-2.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[11px] font-medium truncate flex-1" style={{ color: "#F5F0EB" }}>{template.name}</h3>
                      {template.uses_count > 0 && <TrendingUp size={10} style={{ color: "#C75B39" }} />}
                    </div>
                    <p className="text-[9px] mt-0.5 line-clamp-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[8px]" style={{ color: "rgba(255,255,255,0.15)" }}>
                      <span className="flex items-center gap-1"><Heart size={8} /> {template.likes_count}</span>
                      <span>{template.uses_count} utilisations</span>
                    </div>
                    {template.tags?.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {template.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[7px] px-1 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
