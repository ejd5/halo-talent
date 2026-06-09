"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Sparkles, Wand2, Download, Maximize2, Shuffle, Edit3, Send,
  Loader, ChevronDown, ToggleLeft, ToggleRight, Clock, History,
  BookTemplate, Lightbulb, Copy, Check, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───

type StyleKey =
  | "photorealism" | "cinematic" | "editorial" | "artistic" | "anime"
  | "3d_render" | "watercolor" | "minimalist" | "vintage" | "dark";

type AspectRatio = "1:1" | "4:5" | "9:16" | "16:9" | "3:2" | "2:3";
type Quality = "draft" | "standard" | "hd";
type Provider = "replicate" | "huggingface" | "openai";

interface GeneratedImage {
  url: string;
  id: string;
}

interface HistoryItem {
  id: string;
  prompt: string;
  image_url: string;
  created_at: string;
}

// ─── Constants ───

const STYLES: { key: StyleKey; label: string; emoji: string; desc: string }[] = [
  { key: "photorealism", label: "Photoréaliste", emoji: "📷", desc: "Hyper-détaillé, réaliste" },
  { key: "cinematic", label: "Cinematic", emoji: "🎬", desc: "Lumière dramatique, film" },
  { key: "editorial", label: "Editorial", emoji: "📰", desc: "Haute couture, studio" },
  { key: "artistic", label: "Artistique", emoji: "🎨", desc: "Expressif, créatif" },
  { key: "anime", label: "Anime", emoji: "🌸", desc: "Style japonais" },
  { key: "3d_render", label: "3D Render", emoji: "💎", desc: "Octane, Blender" },
  { key: "watercolor", label: "Aquarelle", emoji: "🖌️", desc: "Douceur, papiers" },
  { key: "minimalist", label: "Minimaliste", emoji: "◻️", desc: "Épuré, élégant" },
  { key: "vintage", label: "Vintage", emoji: "📟", desc: "Rétro, film" },
  { key: "dark", label: "Dark & Moody", emoji: "🌑", desc: "Sombre, dramatique" },
];

const ASPECTS: { value: AspectRatio; label: string }[] = [
  { value: "1:1", label: "Carré" },
  { value: "4:5", label: "Portrait" },
  { value: "9:16", label: "Story" },
  { value: "16:9", label: "Paysage" },
  { value: "3:2", label: "Photo" },
  { value: "2:3", label: "Portrait+" },
];

// ─── Image Card ───

function ImageCard({
  image,
  onUpscale,
  onVariations,
  onRemix,
  onUse,
  onDownload,
}: {
  image: GeneratedImage;
  onUpscale: () => void;
  onVariations: () => void;
  onRemix: () => void;
  onUse: () => void;
  onDownload: () => void;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative group rounded-sm overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
      <img src={image.url} alt="" className="w-full aspect-square object-cover" />
      {/* Actions overlay */}
      <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.5)" }}>
        <div className="flex flex-wrap justify-center gap-1 p-2">
          <ActionButton icon={Maximize2} label="HD" onClick={onUpscale} />
          <ActionButton icon={Shuffle} label="Var." onClick={onVariations} />
          <ActionButton icon={Wand2} label="Remix" onClick={onRemix} />
          <ActionButton icon={Download} label="DL" onClick={onDownload} />
          <ActionButton icon={Send} label="Use" onClick={onUse} />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 text-[9px] rounded-sm transition-colors hover:bg-white/20"
      style={{ background: "rgba(0,0,0,0.5)", color: "#F5F0EB", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <Icon size={10} />
      {label}
    </button>
  );
}

// ─── History Sidebar Item ───

function HistoryItem({ item, onClick }: { item: HistoryItem; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 w-full text-left px-2 py-1.5 text-[10px] transition-colors hover:bg-white/5 rounded-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
      <img src={item.image_url} alt="" className="w-8 h-8 object-cover rounded-sm" />
      <span className="flex-1 truncate">{item.prompt.slice(0, 60)}...</span>
    </button>
  );
}

// ─── Main Page ───

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<StyleKey>("photorealism");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [quality, setQuality] = useState<Quality>("standard");
  const [count, setCount] = useState(4);
  const [useDna, setUseDna] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsTotal, setCreditsTotal] = useState<number | null>(null);
  const [finalPrompt, setFinalPrompt] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    fetch("/api/studio/credits")
      .then((r) => r.json())
      .then((d) => {
        if (d.balance !== undefined) setCredits(d.balance);
        if (d.monthly_quota !== undefined) setCreditsTotal(d.monthly_quota);
      })
      .catch(() => {});
  }, []);

  const costPerGen = aspectRatio === "16:9" || aspectRatio === "9:16" ? 2 : 1;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style, aspect_ratio: aspectRatio, count, use_dna: useDna }),
      });
      if (res.status === 402 || res.status === 429) {
        const errData = await res.json();
        setError(errData.error || "Crédits insuffisants");
        return;
      }
      if (res.status === 503) {
        setError("Le service de génération est en cours de configuration. Réessayez dans quelques minutes.");
        return;
      }
      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "Erreur de génération");
        return;
      }
      const data = await res.json();
      setImages(data.images.map((url: string, i: number) => ({ url, id: `img-${Date.now()}-${i}` })));
      if (data.credits_remaining !== undefined) setCredits(data.credits_remaining);
      if (data.final_prompt) setFinalPrompt(data.final_prompt);
    } catch {
      setError("Erreur réseau");
    } finally {
      setGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setEnhancing(true);
    try {
      const res = await fetch("/api/studio/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: `Améliore et développe ce prompt de génération d'image. Garde l'essence mais rends-le plus descriptif, ajoute des détails visuels (lumière, composition, couleurs, mood). Style: ${style}. Prompt original: "${prompt}"`,
          type: "general", platform: "all", tone: "naturel", length: "long", count: 1,
        }),
      });
      const data = await res.json();
      if (data.variations?.[0]?.text) {
        setPrompt(data.variations[0].text.replace(/^["']|["']$/g, ""));
      }
    } catch {
      // silent
    } finally {
      setEnhancing(false);
    }
  };

  const handleSuggestPrompt = async () => {
    setEnhancing(true);
    try {
      const res = await fetch("/api/studio/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brief: `Suggère un prompt de génération d'image dans le style ${style} adapté à un créateur de contenu. Le prompt doit être en anglais, détaillé, et conçu pour Flux Schnell. Propose une scène qui fonctionnerait bien sur les réseaux sociaux (Instagram, TikTok).`,
          type: "general", platform: "all", tone: "naturel", length: "long", count: 1,
        }),
      });
      const data = await res.json();
      if (data.variations?.[0]?.text) {
        setPrompt(data.variations[0].text.replace(/^["']|["']$/g, ""));
      }
    } catch {
      // silent
    } finally {
      setEnhancing(false);
    }
  };

  const handleUpscale = async (imageUrl: string) => {
    try {
      const res = await fetch("/api/studio/generate/image/upscale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl, scale: 2 }),
      });
      if (res.ok) {
        const data = await res.json();
        setImages((prev) => [...prev, { url: data.image_url, id: `upscale-${Date.now()}` }]);
        if (data.credits_remaining !== undefined) setCredits(data.credits_remaining);
      }
    } catch {
      // silent
    }
  };

  const handleVariations = async () => {
    if (!prompt.trim()) return;
    try {
      const res = await fetch("/api/studio/generate/image/variations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), count: 4 }),
      });
      if (res.ok) {
        const data = await res.json();
        setImages(data.images.map((url: string, i: number) => ({ url, id: `var-${Date.now()}-${i}` })));
        if (data.credits_remaining !== undefined) setCredits(data.credits_remaining);
      }
    } catch {
      // silent
    }
  };

  const handleRemoveBg = async (imageUrl: string) => {
    try {
      const res = await fetch("/api/studio/generate/image/remove-bg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_url: imageUrl }),
      });
      if (res.ok) {
        const data = await res.json();
        setImages((prev) => [...prev, { url: data.image_url, id: `nobg-${Date.now()}` }]);
        if (data.credits_remaining !== undefined) setCredits(data.credits_remaining);
      }
    } catch {
      // silent
    }
  };

  // ─── Render ───

  return (
    <div className="flex gap-0 h-full animate-fade-in">
      {/* ─── LEFT — Prompt Builder ─── */}
      <div className="w-80 shrink-0 overflow-y-auto p-4 space-y-4" style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}>
        <div>
          <h1 className="text-lg italic mb-1" style={{ fontFamily: "var(--font-studio)", color: "#F5F0EB" }}>Images</h1>
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            {credits !== null ? (credits === -1 ? "∞ crédits" : `${credits} crédits`) : ""}{creditsTotal && creditsTotal > 0 && credits !== -1 ? ` / ${creditsTotal}` : ""}
          </p>
        </div>

        {/* Prompt */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Décris l'image que tu veux générer..."
            className="w-full text-xs bg-transparent outline-none resize-none px-2.5 py-2 rounded-sm"
            rows={4}
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
          />
          <div className="flex gap-1 mt-1.5">
            <button onClick={handleSuggestPrompt} disabled={enhancing} className="flex items-center gap-1 px-2 py-1 text-[9px] transition-colors hover:bg-white/5 rounded-sm" style={{ border: "1px solid rgba(199,91,57,0.15)", color: "#C75B39" }}>
              <Lightbulb size={10} /> Suggérer
            </button>
            <button onClick={handleEnhancePrompt} disabled={enhancing || !prompt.trim()} className="flex items-center gap-1 px-2 py-1 text-[9px] transition-colors hover:bg-white/5 rounded-sm disabled:opacity-30" style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}>
              {enhancing ? <Loader size={10} className="animate-spin" /> : <Wand2 size={10} />} Améliorer
            </button>
          </div>
        </div>

        {/* Style selector */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Style</label>
          <div className="grid grid-cols-2 gap-1">
            {STYLES.slice(0, 8).map((s) => (
              <button
                key={s.key}
                onClick={() => setStyle(s.key)}
                className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] rounded-sm transition-all text-left"
                style={{
                  border: `1px solid ${style === s.key ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                  background: style === s.key ? "rgba(199,91,57,0.06)" : "transparent",
                  color: style === s.key ? "#C75B39" : "rgba(255,255,255,0.5)",
                }}
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect ratio */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Ratio</label>
          <div className="flex flex-wrap gap-1">
            {ASPECTS.map((a) => (
              <button
                key={a.value}
                onClick={() => setAspectRatio(a.value)}
                className="px-2 py-1 text-[9px] rounded-sm transition-all"
                style={{
                  border: `1px solid ${aspectRatio === a.value ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                  background: aspectRatio === a.value ? "rgba(199,91,57,0.06)" : "transparent",
                  color: aspectRatio === a.value ? "#C75B39" : "rgba(255,255,255,0.4)",
                }}
              >
                {a.value}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>
            Nombre d&apos;images · {count}
          </label>
          <div className="flex gap-1">
            {[1, 2, 4].map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className="flex-1 px-2 py-1.5 text-[10px] rounded-sm transition-all"
                style={{
                  border: `1px solid ${count === n ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                  background: count === n ? "rgba(199,91,57,0.06)" : "transparent",
                  color: count === n ? "#C75B39" : "rgba(255,255,255,0.4)",
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* DNA toggle */}
        <div>
          <button onClick={() => setUseDna(!useDna)} className="flex items-center gap-2 px-2.5 py-2 w-full text-[10px] rounded-sm transition-all" style={{ border: `1px solid ${useDna ? "rgba(199,91,57,0.2)" : "rgba(255,255,255,0.06)"}`, color: useDna ? "#C75B39" : "rgba(255,255,255,0.4)" }}>
            {useDna ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
            Utiliser mon style ADN
          </button>
        </div>

        {/* Generate button */}
        <div className="pt-1">
          <button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-30 rounded-sm"
            style={{ background: "#C75B39", color: "#FFFFFF" }}
          >
            {generating ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {generating ? "Génération..." : "Générer"}
          </button>
          <p className="text-[9px] text-center mt-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>
            Coût : {costPerGen} crédit{costPerGen > 1 ? "s" : ""} · (1-4 images, prix unique)
          </p>
        </div>
      </div>

      {/* ─── CENTER — Results ─── */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto p-4">
          {/* Final prompt */}
          {finalPrompt && (
            <div className="mb-3 px-3 py-2 text-[10px] rounded-sm flex items-start gap-2" style={{ background: "rgba(199,91,57,0.04)", border: "1px solid rgba(199,91,57,0.1)", color: "rgba(255,255,255,0.5)" }}>
              <Sparkles size={10} className="shrink-0 mt-0.5" style={{ color: "#C75B39" }} />
              <span className="flex-1">{finalPrompt}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-3 px-3 py-2 text-xs rounded-sm" style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.2)", color: "#E5484D" }}>
              {error}
            </div>
          )}

          {/* Results grid */}
          {images.length > 0 && (
            <div className={cn("grid gap-3", count <= 1 ? "grid-cols-1" : "grid-cols-2")}>
              {images.map((img) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  onUpscale={() => handleUpscale(img.url)}
                  onVariations={handleVariations}
                  onRemix={() => handleGenerate()}
                  onUse={() => {
                    localStorage.setItem("composer-import-image", img.url);
                    window.location.href = "/studio/composer";
                  }}
                  onDownload={() => {
                    const a = document.createElement("a");
                    a.href = img.url;
                    a.download = `halo-${Date.now()}.webp`;
                    a.click();
                  }}
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {images.length === 0 && !generating && (
            <div className="flex flex-col items-center justify-center py-24">
              <Sparkles size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
              <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>
                Décris une image, choisis un style, génère.
              </p>
            </div>
          )}

          {/* Loading state */}
          {generating && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader size={24} className="animate-spin" style={{ color: "#C75B39" }} />
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-16 h-16 rounded-sm animate-pulse" style={{ background: "rgba(255,255,255,0.04)" }} />
                  ))}
                </div>
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Génération en cours via Flux Schnell...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT — History ─── */}
      <div className="w-64 shrink-0 overflow-y-auto p-4 space-y-3" style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
            <History size={10} className="inline mr-1" /> Historique
          </span>
        </div>

        {history.length === 0 && (
          <div className="flex flex-col items-center py-8 text-center">
            <BookTemplate size={16} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>
              Tes générations apparaîtront ici
            </p>
          </div>
        )}

        {history.map((item) => (
          <HistoryItem key={item.id} item={item} onClick={() => setPrompt(item.prompt)} />
        ))}

        {/* Inspirations */}
        <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[10px] uppercase tracking-wider block mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
            <Lightbulb size={10} className="inline mr-1" /> Inspirations
          </span>
          <div className="grid grid-cols-2 gap-1">
            {[
              { url: "", label: "Portrait éditorial" },
              { url: "", label: "Nature & paysage" },
              { url: "", label: "Studio minimal" },
              { url: "", label: "Couleurs chaudes" },
            ].map((insp, i) => (
              <button
                key={i}
                onClick={() => setPrompt(insp.label)}
                className="text-[9px] px-2 py-3 rounded-sm text-left transition-colors hover:bg-white/5"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}
              >
                {insp.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
