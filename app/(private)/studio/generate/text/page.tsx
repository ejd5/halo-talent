"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Sparkles, Copy, Check, ThumbsUp, ThumbsDown, Edit3, RefreshCw,
  BookTemplate, Send, Loader, ChevronDown, Zap, Command, X,
  Camera, Music2, Video, MessageCircle, Globe, Lock,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// ─── Types ───

type ContentType = "caption" | "story" | "tweet" | "thread_tweet" | "youtube_description" | "linkedin_post" | "tiktok_caption" | "onlyfans_post" | "dm_reply" | "general";
type ToneOption = "naturel" | "professionnel" | "humoristique" | "inspirant" | "provocant" | "intime" | "punchy";
type LengthOption = "court" | "moyen" | "long";

interface Variation {
  angle: string;
  text: string;
  estimated_engagement_score: number;
  hashtags_suggested: string[];
}

interface GenerateResult {
  variations: Variation[];
  credits_used: number;
  credits_remaining: number;
}

// ─── Constants ───

const CONTENT_TYPES: { value: ContentType; label: string; icon: React.ElementType; platforms: string }[] = [
  { value: "caption", label: "Caption Instagram", icon: Camera, platforms: "Instagram" },
  { value: "story", label: "Story Instagram", icon: Camera, platforms: "Instagram" },
  { value: "tweet", label: "Tweet / X", icon: MessageCircle, platforms: "Twitter / X" },
  { value: "thread_tweet", label: "Thread Twitter", icon: MessageCircle, platforms: "Twitter / X" },
  { value: "tiktok_caption", label: "Caption TikTok", icon: Music2, platforms: "TikTok" },
  { value: "youtube_description", label: "Description YouTube", icon: Video, platforms: "YouTube" },
  { value: "linkedin_post", label: "Post LinkedIn", icon: Globe, platforms: "LinkedIn" },
  { value: "onlyfans_post", label: "Post OnlyFans/MYM", icon: Lock, platforms: "OnlyFans, MYM" },
  { value: "dm_reply", label: "Réponse DM", icon: MessageCircle, platforms: "Toutes" },
  { value: "general", label: "Texte libre", icon: Sparkles, platforms: "Toutes" },
];

const TONES: ToneOption[] = ["naturel", "professionnel", "humoristique", "inspirant", "provocant", "intime", "punchy"];
const LENGTHS: { value: LengthOption; label: string; desc: string }[] = [
  { value: "court", label: "Court", desc: "~50-100 car." },
  { value: "moyen", label: "Moyen", desc: "~100-300 car." },
  { value: "long", label: "Long", desc: "~300+ car." },
];

// ─── Express Modal ───

function ExpressModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [brief, setBrief] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!brief.trim()) return;
    setGenerating(true);
    setResult(null);
    try {
      const res = await fetch("/api/studio/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: brief.trim(), type: "general", platform: "all", tone: "naturel", length: "moyen", count: 1 }),
      });
      const data = await res.json();
      const text = data.variations?.[0]?.text || "Erreur de génération";
      setResult(text);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setResult("Erreur réseau");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (!open) { setBrief(""); setResult(null); setCopied(false); }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-lg mx-4 animate-fade-in" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: "var(--accent)" }} />
            <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>Génération express</span>
            <span className="text-[9px] px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>1 crédit</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/5 rounded-sm transition-colors">
            <X size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
          </button>
        </div>
        <div className="p-4">
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Décris en 1 phrase ce que tu veux dire..."
            className="w-full text-sm bg-transparent outline-none resize-none mb-3"
            rows={3}
            style={{ color: "var(--text-primary)" }}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={generating || !brief.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs transition-opacity hover:opacity-80 disabled:opacity-30 rounded-sm"
              style={{ background: "var(--accent)", color: "var(--text-primary)" }}
            >
              {generating ? <Loader size={12} className="animate-spin" /> : <Zap size={12} />}
              {generating ? "Génération..." : "Générer"}
            </button>
            {result && (
              <span className="flex items-center gap-1 text-[10px]" style={{ color: copied ? "var(--success)" : "rgba(255,255,255,0.3)" }}>
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {copied ? "Copié !" : "Copié automatiquement"}
              </span>
            )}
          </div>
          {result && (
            <div className="mt-3 p-3 text-xs leading-relaxed rounded-sm" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}>
              {result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Variation Card ───

function VariationCard({
  variation,
  index,
  onUse,
  onRegenerate,
  onSaveTemplate,
}: {
  variation: Variation;
  index: number;
  onUse: () => void;
  onRegenerate: () => void;
  onSaveTemplate: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(variation.text);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(variation.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scoreColor = variation.estimated_engagement_score >= 70 ? "var(--success)" : variation.estimated_engagement_score >= 40 ? "var(--warning)" : "var(--danger)";

  return (
    <div
      className="flex flex-col rounded-sm overflow-hidden transition-all"
      style={{
        border: "1px solid rgba(199,91,57,0.08)",
        background: "var(--bg-card)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid var(--border-default)" }}>
        <span className="text-[10px] font-medium" style={{ color: "var(--accent)" }}>
          {variation.angle}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: `${scoreColor}15`, color: scoreColor }}>
            {variation.estimated_engagement_score}/100
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-3">
        {editing ? (
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full text-xs leading-relaxed bg-transparent outline-none resize-none"
            rows={6}
            style={{ color: "var(--text-primary)" }}
          />
        ) : (
          <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-primary)" }}>
            {variation.text}
          </p>
        )}

        {/* Hashtags */}
        {variation.hashtags_suggested?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {variation.hashtags_suggested.map((tag) => (
              <button
                key={tag}
                onClick={async () => { await navigator.clipboard.writeText(tag); }}
                className="text-[9px] px-1.5 py-0.5 rounded-sm transition-colors hover:opacity-70"
                style={{ background: "var(--accent-soft)", color: "var(--accent)" }}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 px-3 py-2" style={{ borderTop: "1px solid var(--border-default)" }}>
        <button onClick={handleCopy} className="p-1.5 rounded-sm hover:bg-white/5 transition-colors" title="Copier">
          {copied ? <Check size={11} style={{ color: "var(--success)" }} /> : <Copy size={11} style={{ color: "rgba(255,255,255,0.3)" }} />}
        </button>
        <button onClick={() => setEditing(!editing)} className="p-1.5 rounded-sm hover:bg-white/5 transition-colors" title="Modifier">
          <Edit3 size={11} style={{ color: editing ? "var(--accent)" : "rgba(255,255,255,0.3)" }} />
        </button>
        <button onClick={onRegenerate} className="p-1.5 rounded-sm hover:bg-white/5 transition-colors" title="Reformuler">
          <RefreshCw size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
        </button>
        <span className="w-px h-3 mx-0.5" style={{ background: "rgba(255,255,255,0.06)" }} />
        <button onClick={onSaveTemplate} className="flex items-center gap-1 px-1.5 py-1 text-[9px] rounded-sm hover:bg-white/5 transition-colors" style={{ color: "rgba(255,255,255,0.3)" }}>
          <BookTemplate size={10} /> Template
        </button>
        <button onClick={onUse} className="flex items-center gap-1 px-1.5 py-1 text-[9px] rounded-sm transition-colors ml-auto" style={{ color: "var(--accent)", border: "1px solid var(--accent-border)" }}>
          <Send size={10} /> Utiliser
        </button>
        <span className="w-px h-3 mx-0.5" style={{ background: "rgba(255,255,255,0.06)" }} />
        <button onClick={() => setLiked(true)} className="p-1.5 rounded-sm hover:bg-white/5 transition-colors" title="J'aime">
          <ThumbsUp size={11} style={{ color: liked === true ? "var(--success)" : "rgba(255,255,255,0.2)" }} />
        </button>
        <button onClick={() => setLiked(false)} className="p-1.5 rounded-sm hover:bg-white/5 transition-colors" title="Je n'aime pas">
          <ThumbsDown size={11} style={{ color: liked === false ? "var(--danger)" : "rgba(255,255,255,0.2)" }} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───

export default function GenerateTextPage() {
  const [contentType, setContentType] = useState<ContentType>("caption");
  const [platform, setPlatform] = useState("instagram");
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState<ToneOption>("naturel");
  const [length, setLength] = useState<LengthOption>("moyen");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [typeOpen, setTypeOpen] = useState(false);
  const [toneOpen, setToneOpen] = useState(false);
  const [expressOpen, setExpressOpen] = useState(false);

  useEffect(() => {
    fetch("/api/studio/credits")
      .then((r) => r.json())
      .then((d) => {
        if (d.balance !== undefined) setCredits(d.balance);
      })
      .catch(() => {});
  }, []);

  // Cmd+G for express modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "g") {
        e.preventDefault();
        setExpressOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const selectedType = CONTENT_TYPES.find((t) => t.value === contentType);

  const handleGenerate = async () => {
    if (!brief.trim()) return;
    setGenerating(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/studio/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: brief.trim(), type: contentType, platform, tone, length, count: 3 }),
      });
      if (res.status === 402 || res.status === 429) {
        const errData = await res.json();
        setError(errData.error || "Crédits insuffisants");
        return;
      }
      if (!res.ok) {
        setError("Erreur de génération");
        return;
      }
      const data = await res.json();
      setResult(data);
      if (data.credits_remaining !== undefined) setCredits(data.credits_remaining);
    } catch {
      setError("Erreur réseau");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl italic mb-1" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>
            Texte & Captions
          </h1>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            Génération de textes personnalisée selon ton ADN de créateur · {credits !== null ? (credits === -1 ? "∞ crédits" : `${credits} crédits`) : ""} restants
          </p>
        </div>
        <button
          onClick={() => setExpressOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] transition-colors hover:bg-white/5 rounded-sm shrink-0"
          style={{ border: "1px solid var(--accent-border)", color: "var(--accent)" }}
        >
          <Zap size={10} />
          Express
          <span className="text-[8px] ml-0.5 px-1 py-0.5" style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}>⌘G</span>
        </button>
      </div>

      {/* Form */}
      <div className="space-y-3 mb-6 p-4 rounded-sm" style={{ border: "1px solid var(--border-default)" }}>
        {/* Content type selector */}
        <div className="relative">
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>
            Type de contenu
          </label>
          <button
            onClick={() => setTypeOpen(!typeOpen)}
            className="flex items-center gap-2 w-full px-2.5 py-2 text-xs rounded-sm"
            style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          >
            {selectedType && <selectedType.icon size={14} style={{ color: "var(--accent)" }} />}
            <span className="flex-1 text-left">{selectedType?.label}</span>
            <ChevronDown size={10} className={typeOpen ? "rotate-180" : ""} style={{ transition: "transform 0.2s", color: "rgba(255,255,255,0.3)" }} />
          </button>
          {typeOpen && (
            <div className="absolute left-0 right-0 top-full mt-1 z-10 py-1 shadow-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
              {CONTENT_TYPES.map((ct) => {
                const Icon = ct.icon;
                return (
                  <button
                    key={ct.value}
                    onClick={() => { setContentType(ct.value); setTypeOpen(false); }}
                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5"
                    style={{ color: contentType === ct.value ? "var(--accent)" : "var(--text-primary)" }}
                  >
                    <Icon size={12} style={{ color: contentType === ct.value ? "var(--accent)" : "rgba(255,255,255,0.3)" }} />
                    <span className="flex-1">{ct.label}</span>
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>{ct.platforms}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Brief */}
        <div>
          <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>
            Brief, décris ce que tu veux dire
          </label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="Ex: nouveau produit qui sort cette semaine, ambiance été, promo early-bird..."
            className="w-full text-sm bg-transparent outline-none resize-none px-2.5 py-2 rounded-sm"
            rows={3}
            style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          />
        </div>

        {/* Tone + Length row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Ton</label>
            <button
              onClick={() => setToneOpen(!toneOpen)}
              className="flex items-center gap-2 w-full px-2.5 py-2 text-xs rounded-sm"
              style={{ border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
            >
              <span className="flex-1 text-left">{tone}</span>
              <ChevronDown size={10} className={toneOpen ? "rotate-180" : ""} style={{ transition: "transform 0.2s", color: "rgba(255,255,255,0.3)" }} />
            </button>
            {toneOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 z-10 py-1 shadow-xl" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}>
                {TONES.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTone(t); setToneOpen(false); }}
                    className="flex items-center w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5 capitalize"
                    style={{ color: tone === t ? "var(--accent)" : "var(--text-primary)" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider mb-1.5 block" style={{ color: "rgba(255,255,255,0.3)" }}>Longueur</label>
            <div className="flex gap-1">
              {LENGTHS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => setLength(l.value)}
                  className="flex-1 px-2 py-2 text-[10px] rounded-sm transition-all"
                  style={{
                    border: `1px solid ${length === l.value ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.08)"}`,
                    background: length === l.value ? "rgba(199,91,57,0.06)" : "transparent",
                    color: length === l.value ? "var(--accent)" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate button */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Coût : <span style={{ color: "var(--accent)" }}>3 crédits</span> · 3 variations
          </span>
          <button
            onClick={handleGenerate}
            disabled={generating || !brief.trim()}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-opacity hover:opacity-80 disabled:opacity-30 rounded-sm"
            style={{ background: "var(--accent)", color: "var(--text-primary)" }}
          >
            {generating ? <Loader size={12} className="animate-spin" /> : <Sparkles size={12} />}
            {generating ? "Génération en cours..." : "Générer 3 variations"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 px-3 py-2 text-xs rounded-sm" style={{ background: "rgba(229,72,77,0.08)", border: "1px solid rgba(229,72,77,0.2)", color: "var(--danger)" }}>
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              3 variations générées · {result.credits_remaining !== undefined ? (result.credits_remaining === -1 ? "∞ crédits restants" : `${result.credits_remaining} crédits restants`) : ""}
            </p>
          </div>
          {result.variations.map((v, i) => (
            <VariationCard
              key={i}
              variation={v}
              index={i}
              onUse={() => {
                // Envoyer au composer via localStorage + redirect
                localStorage.setItem("composer-import-text", v.text);
                window.location.href = "/studio/composer";
              }}
              onRegenerate={async () => {
                const res = await fetch("/api/studio/generate/text", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    brief: `${brief}, reformulation de : "${v.text.slice(0, 100)}..."`,
                    type: contentType, platform, tone, length, count: 1,
                  }),
                });
                const data = await res.json();
                if (data.variations?.[0]) {
                  const newResult = { ...result };
                  newResult.variations[i] = data.variations[0];
                  setResult(newResult);
                }
              }}
              onSaveTemplate={() => {
                localStorage.setItem("template-draft", JSON.stringify({
                  text: v.text, type: contentType, platform, tone,
                }));
              }}
            />
          ))}
        </div>
      )}

      {/* Express modal */}
      <ExpressModal open={expressOpen} onClose={() => setExpressOpen(false)} />
    </div>
  );
}
