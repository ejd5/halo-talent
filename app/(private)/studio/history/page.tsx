"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, History, Sparkles, Loader, Download, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface HistoryImage {
  id: string;
  action: string;
  credits_used: number;
  prompt: string | null;
  image_url: string | null;
  provider: string | null;
  model: string | null;
  status: string;
  created_at: string;
}

export default function HistoryPage() {
  const [images, setImages] = useState<HistoryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/studio/history")
      .then((r) => r.json())
      .then((d) => setImages(d.images || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader size={20} className="animate-spin" style={{ color: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <div className="flex h-full animate-fade-in">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl italic" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>
              Mes images
            </h1>
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              {images.length} image{images.length > 1 ? "s" : ""} générée{images.length > 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/studio/generate/image"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] transition-opacity hover:opacity-80 rounded-sm"
            style={{ background: "var(--accent)", color: "#FFF" }}
          >
            <Sparkles size={10} /> Générer
          </Link>
        </div>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <History size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>
              Aucune image générée pour l&apos;instant
            </p>
            <Link
              href="/studio/generate/image"
              className="flex items-center gap-1.5 text-xs mt-4 transition-opacity hover:opacity-70"
              style={{ color: "var(--accent)" }}
            >
              <Sparkles size={12} /> Générer ma première image
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group rounded-sm overflow-hidden cursor-pointer"
                style={{ border: "1px solid var(--border-default)", background: "var(--bg-primary)" }}
                onClick={() => setSelected(img.id === selected ? null : img.id)}
              >
                <img
                  src={img.image_url || ""}
                  alt={img.prompt || "Generated image"}
                  className="w-full aspect-square object-cover"
                  loading="lazy"
                />
                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(transparent 60%, rgba(0,0,0,0.8))" }}
                >
                  <p className="text-[9px] leading-tight line-clamp-2" style={{ color: "var(--text-primary)" }}>
                    {img.prompt || "Sans prompt"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {new Date(img.created_at).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="text-[8px]" style={{ color: "var(--accent)" }}>
                      {img.credits_used} crédit{img.credits_used > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {/* Selected actions */}
                {selected === img.id && (
                  <div
                    className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(img.image_url || "", "_blank");
                      }}
                      className="p-1 rounded-sm hover:bg-white/20 transition-colors"
                      style={{ background: "rgba(0,0,0,0.6)" }}
                      title="Ouvrir"
                    >
                      <ExternalLink size={10} style={{ color: "var(--text-primary)" }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const a = document.createElement("a");
                        a.href = img.image_url || "";
                        a.download = `halo-${Date.now()}.webp`;
                        a.click();
                      }}
                      className="p-1 rounded-sm hover:bg-white/20 transition-colors"
                      style={{ background: "rgba(0,0,0,0.6)" }}
                      title="Télécharger"
                    >
                      <Download size={10} style={{ color: "var(--text-primary)" }} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar — selected image detail */}
      {selected && (() => {
        const img = images.find((i) => i.id === selected);
        if (!img) return null;
        return (
          <div className="w-72 shrink-0 overflow-y-auto p-4" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="mb-3">
              <img src={img.image_url || ""} alt="" className="w-full aspect-square object-cover rounded-sm" style={{ border: "1px solid var(--border-default)" }} />
            </div>
            <div className="space-y-2 text-[10px]">
              <div>
                <span className="block text-[9px] uppercase tracking-wider mb-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Prompt</span>
                <p style={{ color: "var(--text-primary)" }}>{img.prompt || "—"}</p>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Date</span>
                <span style={{ color: "var(--text-primary)" }}>{new Date(img.created_at).toLocaleString("fr-FR")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Provider</span>
                <span style={{ color: "var(--text-primary)" }}>{img.provider || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Modèle</span>
                <span style={{ color: "var(--text-primary)" }}>{img.model || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Crédits</span>
                <span style={{ color: "var(--accent)" }}>{img.credits_used}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = img.image_url || "";
                  a.download = `halo-${Date.now()}.webp`;
                  a.click();
                }}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-[10px] transition-opacity hover:opacity-80 rounded-sm"
                style={{ background: "var(--accent)", color: "#FFF" }}
              >
                <Download size={10} /> Télécharger
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
