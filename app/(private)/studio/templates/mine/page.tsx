"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Layout, Plus, Edit3, Trash2, Globe, Lock, Loader, Image, Film, Columns3, Square, MessageCircle } from "lucide-react";
import type { Template, TemplateType } from "@/lib/studio/types";

const TYPE_ICONS: Record<TemplateType, any> = { photo: Image, video: Film, carousel: Columns3, story: Square, caption: MessageCircle };

export default function MyTemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");

  useEffect(() => { fetchMine(); }, [type]);

  async function fetchMine() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ mine: "true", limit: "100" });
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

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce template ?")) return;
    try {
      await fetch(`/api/studio/templates/${id}`, { method: "DELETE" });
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // silent
    }
  }

  return (
    <div className="flex-1 overflow-y-auto animate-fade-in">
      <div className="px-4 md:px-6 pt-4 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2 mb-1">
          <Link href="/studio/templates" className="p-1 transition-opacity hover:opacity-70" style={{ color: "rgba(255,255,255,0.4)" }}>
            <ArrowLeft size={14} />
          </Link>
          <h1 className="text-lg italic" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Mes templates</h1>
        </div>
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {templates.length} template{templates.length > 1 ? "s" : ""} créé{templates.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-0 px-4 md:px-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/studio/templates" className="px-3 py-2.5 text-[11px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
          Officiels
        </Link>
        <Link href="/studio/templates/mine" className="px-3 py-2.5 text-[11px] font-medium" style={{ color: "#C75B39", borderBottom: "1px solid #C75B39" }}>
          Mes templates
        </Link>
        <Link href="/studio/templates/market" className="px-3 py-2.5 text-[11px] transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.4)" }}>
          Marketplace
        </Link>
      </div>

      {/* Filter + create */}
      <div className="px-4 md:px-6 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
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
        <div className="flex-1" />
        <Link href="/studio/composer"
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] rounded-sm transition-opacity hover:opacity-80"
          style={{ background: "#C75B39", color: "#FFFFFF" }}>
          <Plus size={10} /> Créer un template
        </Link>
      </div>

      <div className="p-4 md:p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} /></div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <Layout size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>Tu n&apos;as pas encore créé de template</p>
            <Link href="/studio/composer"
              className="flex items-center gap-1.5 mt-4 px-4 py-2 text-xs rounded-sm transition-opacity hover:opacity-80"
              style={{ background: "#C75B39", color: "#FFFFFF" }}>
              <Plus size={12} /> Créer depuis le composer
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {templates.map((t) => {
              const TypeIcon = TYPE_ICONS[t.type] || Layout;
              return (
                <div key={t.id} className="rounded-sm overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}>
                  <div className="relative aspect-video flex items-center justify-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                    {t.preview_url ? (
                      <img src={t.preview_url} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      <TypeIcon size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
                    )}
                    <span className="absolute top-1.5 right-1.5 flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(0,0,0,0.6)", color: t.is_public ? "#10B981" : "rgba(255,255,255,0.5)" }}>
                      {t.is_public ? <><Globe size={8} /> Public</> : <><Lock size={8} /> Privé</>}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="text-[11px] font-medium truncate" style={{ color: "#F5F0EB" }}>{t.name}</h3>
                    <p className="text-[9px] mt-0.5 line-clamp-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {t.description || "Aucune description"}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-[8px]" style={{ color: "rgba(255,255,255,0.15)" }}>
                      <span>{t.uses_count} utilisations</span>
                      {t.tags?.length > 0 && <span>· {t.tags.slice(0, 2).join(", ")}</span>}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Link href={`/studio/composer?template=${t.id}`}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-[9px] rounded-sm transition-colors hover:bg-white/5"
                        style={{ border: "1px solid rgba(255,255,255,0.06)", color: "#F5F0EB" }}>
                        <Edit3 size={8} /> Éditer
                      </Link>
                      <button onClick={() => handleDelete(t.id)}
                        className="flex items-center justify-center gap-1 px-2 py-1 text-[9px] rounded-sm transition-colors hover:bg-white/5"
                        style={{ border: "1px solid rgba(255,255,255,0.06)", color: "#E5484D" }}>
                        <Trash2 size={8} />
                      </button>
                    </div>
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
