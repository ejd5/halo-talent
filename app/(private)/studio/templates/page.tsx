"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Layout, Search, Play, Image, Film, Columns3, Square, MessageCircle, Loader, Heart, TrendingUp, ArrowUpRight, ChevronDown, X } from "lucide-react";
import type { Template, TemplateType } from "@/lib/studio/types";

const CATEGORIES = [
  "Tous", "Instagram Posts", "Reels", "Stories", "TikTok", "YouTube Shorts", "Carrousels", "Quotes", "Promo",
];

const TYPE_ICONS: Record<TemplateType, any> = {
  photo: Image, video: Film, carousel: Columns3, story: Square, caption: MessageCircle,
};

const STYLE_OPTIONS = ["minimal", "editorial", "cinematic", "dynamic", "playful"];
const MOOD_OPTIONS = ["calm", "energetic", "peaceful", "dramatic", "happy"];

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [style, setStyle] = useState("");
  const [mood, setMood] = useState("");
  const [platform, setPlatform] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => { fetchTemplates(); }, [category, style, mood, platform]);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ official: "true", limit: "100" });
      if (category !== "Tous") params.set("category", category);
      if (style) params.set("style", style);
      if (mood) params.set("mood", mood);
      if (platform) params.set("platform", platform);

      const res = await fetch(`/api/studio/templates?${params}`);
      const data = await res.json();
      setTemplates(data.templates ?? []);
    } catch {
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = templates.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.tags?.some((tag) => tag.includes(q));
  });

  async function handleUse(template: Template) {
    try {
      await fetch(`/api/studio/templates/${template.id}/use`, { method: "POST" });
      // Redirect to the appropriate editor
      const targets: Record<TemplateType, string> = {
        photo: "/studio/composer",
        video: "/studio/edit/video",
        carousel: "/studio/composer",
        story: "/studio/composer",
        caption: "/studio/generate/text",
      };
      const url = targets[template.type] || "/studio/composer";
      localStorage.setItem("composer-template", JSON.stringify(template));
      window.location.href = url;
    } catch {
      // silent
    }
  }

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      {/* ─── Header ─── */}
      <div className="px-4 md:px-6 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/studio" className="p-1 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Layout size={14} />
          </Link>
          <h1 className="text-lg italic" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Templates</h1>
        </div>
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {templates.length} templates officiels · {templates.filter((t) => t.uses_count > 0).length} testés par les créateurs
        </p>
      </div>

      {/* ─── Subnav ─── */}
      <div className="flex items-center gap-0 px-4 md:px-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/studio/templates" className="px-3 py-2.5 text-[11px] font-medium" style={{ color: "#C75B39", borderBottom: "1px solid #C75B39" }}>
          Officiels
        </Link>
        <Link href="/studio/templates/mine" className="px-3 py-2.5 text-[11px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
          Mes templates
        </Link>
        <Link href="/studio/templates/market" className="px-3 py-2.5 text-[11px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
          Marketplace
        </Link>
      </div>

      {/* ─── Filters ─── */}
      <div className="px-4 md:px-6 py-3 space-y-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        {/* Search + platforms */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.15)" }} />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un template..."
              className="w-full text-[10px] bg-transparent pl-7 pr-2.5 py-1.5 rounded-sm outline-none"
              style={{ border: "1px solid rgba(255,255,255,0.06)", color: "#F5F0EB" }}
            />
          </div>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}
            className="text-[10px] bg-transparent px-2 py-1.5 rounded-sm outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.06)", color: "#F5F0EB" }}>
            <option value="">Toutes plateformes</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="linkedin">LinkedIn</option>
          </select>
          {(style || mood || platform || search) && (
            <button onClick={() => { setStyle(""); setMood(""); setPlatform(""); setSearch(""); }}
              className="text-[9px] px-2 py-1 rounded-sm flex items-center gap-1 transition-colors hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>
              <X size={10} /> Réinitialiser
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className="px-2.5 py-1 text-[9px] rounded-sm transition-all"
              style={{
                border: `1px solid ${category === cat ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                background: category === cat ? "rgba(199,91,57,0.06)" : "transparent",
                color: category === cat ? "#C75B39" : "rgba(255,255,255,0.4)",
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Style + Mood chips */}
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-1">
            <span className="text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Style</span>
            {STYLE_OPTIONS.map((s) => (
              <button key={s} onClick={() => setStyle(style === s ? "" : s)}
                className="px-1.5 py-0.5 text-[8px] rounded-sm transition-all"
                style={{
                  background: style === s ? "rgba(199,91,57,0.08)" : "transparent",
                  color: style === s ? "#C75B39" : "rgba(255,255,255,0.2)",
                }}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[8px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>Mood</span>
            {MOOD_OPTIONS.map((m) => (
              <button key={m} onClick={() => setMood(mood === m ? "" : m)}
                className="px-1.5 py-0.5 text-[8px] rounded-sm transition-all"
                style={{
                  background: mood === m ? "rgba(199,91,57,0.08)" : "transparent",
                  color: mood === m ? "#C75B39" : "rgba(255,255,255,0.2)",
                }}>
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Grid ─── */}
      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Layout size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>
              Aucun template trouvé pour ces filtres
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((template) => {
              const TypeIcon = TYPE_ICONS[template.type] || Layout;
              return (
                <div
                  key={template.id}
                  className="group rounded-sm overflow-hidden cursor-pointer transition-all hover:bg-white/5"
                  style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
                  onClick={() => setSelectedTemplate(template)}
                >
                  {/* Preview */}
                  <div className="relative aspect-[4/5] flex items-center justify-center overflow-hidden" style={{ background: "rgba(0,0,0,0.3)" }}>
                    {template.preview_url ? (
                      <img src={template.preview_url} alt={template.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2" style={{ color: "rgba(255,255,255,0.06)" }}>
                        <Layout size={32} />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.6)" }}>
                      <button onClick={(e) => { e.stopPropagation(); handleUse(template); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium rounded-sm transition-opacity hover:opacity-80"
                        style={{ background: "#C75B39", color: "#FFFFFF" }}>
                        <Play size={10} /> Utiliser
                      </button>
                    </div>
                    {/* Type badge */}
                    <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(0,0,0,0.6)", color: "rgba(255,255,255,0.5)" }}>
                      <TypeIcon size={8} /> {template.type}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <h3 className="text-[11px] font-medium truncate" style={{ color: "#F5F0EB" }}>{template.name}</h3>
                    <p className="text-[9px] mt-0.5 line-clamp-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {template.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {template.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[7px] px-1 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-[8px]" style={{ color: "rgba(255,255,255,0.15)" }}>
                      <span>{template.uses_count} utilisations</span>
                      {template.likes_count > 0 && <span>· {template.likes_count} likes</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Preview Modal ─── */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTemplate(null)} style={{ background: "rgba(0,0,0,0.7)" }}>
          <div className="max-w-lg w-full rounded-sm overflow-hidden" onClick={(e) => e.stopPropagation()} style={{ background: "#0A0908", border: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Preview */}
            <div className="aspect-[4/5] max-h-[50vh] flex items-center justify-center overflow-hidden" style={{ background: "rgba(0,0,0,0.4)" }}>
              {selectedTemplate.preview_url ? (
                <img src={selectedTemplate.preview_url} alt={selectedTemplate.name} className="w-full h-full object-contain" />
              ) : (
                <Layout size={40} style={{ color: "rgba(255,255,255,0.06)" }} />
              )}
            </div>
            {/* Details */}
            <div className="p-4 space-y-3">
              <div>
                <h2 className="text-sm font-semibold" style={{ color: "#F5F0EB" }}>{selectedTemplate.name}</h2>
                <p className="text-[10px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {selectedTemplate.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-[9px]">
                {selectedTemplate.style && (
                  <span className="px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(199,91,57,0.06)", color: "#C75B39" }}>{selectedTemplate.style}</span>
                )}
                {selectedTemplate.mood && (
                  <span className="px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>{selectedTemplate.mood}</span>
                )}
                {selectedTemplate.target_platforms?.map((p) => (
                  <span key={p} className="px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>{p}</span>
                ))}
              </div>
              <div className="flex items-center gap-3 text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                <span className="flex items-center gap-1"><TrendingUp size={10} /> {selectedTemplate.uses_count} utilisations</span>
                {selectedTemplate.is_official && <span className="flex items-center gap-1" style={{ color: "#C75B39" }}>Par Halo Talent</span>}
              </div>
              <button onClick={() => handleUse(selectedTemplate)}
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-xs font-medium rounded-sm transition-opacity hover:opacity-80"
                style={{ background: "#C75B39", color: "#FFFFFF" }}>
                <Play size={12} /> Utiliser ce template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
