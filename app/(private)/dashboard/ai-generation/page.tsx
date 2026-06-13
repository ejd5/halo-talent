"use client";

import { useState } from "react";
import {
  Sparkles, Camera, Play, AtSign, FileText, Image as ImageIcon,
  MessageSquare, Mic, Copy, RefreshCw, Download,
  Wand2, Film, Hash,
} from "lucide-react";

// ── Types & config ────────────────────────────────────────
type ContentType = "caption" | "script" | "post" | "hashtags" | "hook" | "thread";
type Platform = "instagram" | "tiktok" | "youtube" | "twitter";

const CONTENT_TYPES: { id: ContentType; label: string; icon: React.ElementType; desc: string; emoji: string }[] = [
  { id: "caption", label: "Caption", icon: FileText, desc: "Texte accrocheur pour votre post", emoji: "✍️" },
  { id: "script", label: "Script vidéo", icon: Film, desc: "Script complet pour vos vidéos", emoji: "🎬" },
  { id: "post", label: "Post texte", icon: MessageSquare, desc: "Publication complète réseaux sociaux", emoji: "📝" },
  { id: "hashtags", label: "Hashtags", icon: Hash, desc: "Hashtags optimisés pour votre niche", emoji: "#️⃣" },
  { id: "hook", label: "Hook d'accroche", icon: Mic, desc: "Première phrase qui retient l'attention", emoji: "🎯" },
  { id: "thread", label: "Thread", icon: AtSign, desc: "Thread multi-tweets percutant", emoji: "🧵" },
];

const PLATFORMS: { id: Platform; label: string; color: string }[] = [
  { id: "instagram", label: "Instagram", color: "#E1306C" },
  { id: "tiktok", label: "TikTok", color: "#69C9D0" },
  { id: "youtube", label: "YouTube", color: "#FF0000" },
  { id: "twitter", label: "Twitter/X", color: "#1DA1F2" },
];

const TONES = ["Authentique", "Provocateur", "Inspirant", "Humoristique", "Sensuel", "Professionnel"];
const NICHES = ["Lifestyle", "Fitness", "Mode", "Beauty", "Voyage", "Cuisine", "Gaming", "Finance"];

// ── Mock generated examples ────────────────────────────────
const GENERATED_EXAMPLES: Record<ContentType, string> = {
  caption: `✨ Parce que certains moments méritent d'être vécus pleinement, pas juste photographiés.

Cette semaine j'ai décidé de poser mon téléphone et de simplement être présente. Résultat ? La plus belle journée de l'année 🌿

On oublie souvent que le meilleur contenu vient de la vraie vie, pas d'un script.

Qu'est-ce qui vous force à déconnecter ? 👇`,
  script: `[INTRO — 0 à 3s]
Bam ! Ouvre avec cette question : "Et si je te disais que tu pouvais gagner 10x plus en travaillant moitié moins ?"

[DÉVELOPPEMENT — 3 à 45s]
Voilà ce que j'ai découvert après 2 ans dans cette industrie...
(Transition visuelle)
Étape 1 : Arrête de créer pour tout le monde, crée pour TA communauté.
(B-roll de ton travail)
Étape 2 : L'algorithme récompense la régularité, pas la perfection.

[CTA — 45 à 60s]
Rejoins mes 12K abonnés qui ont transformé leur approche. Lien en bio 🔥`,
  post: `🚨 Thread : Ce que personne ne te dit sur la création de contenu en 2026.

J'ai analysé 200+ comptes qui ont explosé cette année. Voilà le pattern qu'ils ont tous en commun ⬇️

1/ La niche ultra-spécifique bat toujours la niche large.
Pas "fitness" → "fitness pour mamans de 30 ans qui ont 20 min par jour"

2/ Le premier commentaire que tu laisses sur ton propre post change ton reach.
Pose une question. L'algorithme l'adore.

3/ Publier à 19h30 est mort. Tes analytics te disent quand publier. Lis-les.

Sauvegarde ce post, tu me remercieras dans 30 jours 💎`,
  hashtags: `#createur #contentcreator #lifestyle #influencer #france
#creation #socialmedia #tendance #viral #instagram
#strategy #growth #engagement #community #niche
#ofm #talentmanagement #creator2026 #digitallife`,
  hook: `"J'ai fait une erreur qui m'a coûté 3000€ — et voilà pourquoi j'en suis reconnaissant·e..."

(variante 2) "Stop. Tu regardes encore ton téléphone par habitude, pas par envie. Et si c'était différent ?"

(variante 3) "Ce matin j'ai supprimé toutes mes stories. Voilà ce qui s'est passé ensuite..."`,
  thread: `Thread 🧵 : Comment j'ai doublé mon revenu OnlyFans en 60 jours sans burn-out.

1/ Arrêter de poster par quantité pour passer à la qualité ciblée.
Moins de posts, plus d'impact.

2/ Analyser les 3 posts qui ont généré 80% de mon revenu.
Reproduire le format, pas le contenu.

3/ Investir 30 min/jour dans les DMs personnalisés de mes top fans.
Résultat : x3 sur les tips spontanés.

4/ Créer une offre PPV mensuelle récurrente.
Revenu prévisible = moins de stress créatif.

→ Sauve ce thread. Partage si ça t'a aidé 🔥`,
};

export default function AiGenerationPage() {
  const [selectedType, setSelectedType] = useState<ContentType>("caption");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("instagram");
  const [selectedTone, setSelectedTone] = useState("Authentique");
  const [selectedNiche, setSelectedNiche] = useState("Lifestyle");
  const [prompt, setPrompt] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setGenerated(null);
    setTimeout(() => {
      setGenerated(GENERATED_EXAMPLES[selectedType]);
      setLoading(false);
    }, 1800);
  };

  const handleCopy = () => {
    if (generated) {
      navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Génération IA
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
            Créez du contenu optimisé pour votre audience et vos plateformes
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 border" style={{ borderColor: "rgba(199,91,57,0.3)", backgroundColor: "var(--accent-soft)" }}>
          <Sparkles size={12} style={{ color: "var(--color-accent)" }} />
          <span className="text-[10px] font-semibold" style={{ color: "var(--color-accent)" }}>Modèle Halo IA v2</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left panel: Config */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Content type */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.4)" }}>
              Type de contenu
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CONTENT_TYPES.map((ct) => {
                const Icon = ct.icon;
                return (
                  <button
                    key={ct.id}
                    onClick={() => setSelectedType(ct.id)}
                    className="flex items-start gap-2 p-2.5 border text-left transition-all"
                    style={{
                      borderColor: selectedType === ct.id ? "var(--color-accent)" : "rgba(245,240,235,0.08)",
                      backgroundColor: selectedType === ct.id ? "var(--accent-soft)" : "var(--color-card)",
                    }}
                  >
                    <span className="text-sm mt-0.5">{ct.emoji}</span>
                    <div>
                      <div className="text-[10px] font-semibold" style={{ color: selectedType === ct.id ? "var(--color-accent)" : "var(--text-primary)" }}>{ct.label}</div>
                      <div className="text-[9px] mt-0.5" style={{ color: "rgba(245,240,235,0.3)" }}>{ct.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.4)" }}>
              Plateforme cible
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className="px-2.5 py-1.5 text-[10px] font-semibold border transition-all"
                  style={{
                    borderColor: selectedPlatform === p.id ? p.color : "rgba(245,240,235,0.08)",
                    color: selectedPlatform === p.id ? p.color : "rgba(245,240,235,0.4)",
                    backgroundColor: selectedPlatform === p.id ? `${p.color}15` : "transparent",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.4)" }}>
              Ton de voix
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {TONES.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTone(t)}
                  className="px-2.5 py-1.5 text-[10px] border transition-all"
                  style={{
                    borderColor: selectedTone === t ? "var(--color-accent)" : "rgba(245,240,235,0.08)",
                    color: selectedTone === t ? "var(--color-accent)" : "rgba(245,240,235,0.4)",
                    backgroundColor: selectedTone === t ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Niche */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.4)" }}>
              Niche / Thématique
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {NICHES.map((n) => (
                <button
                  key={n}
                  onClick={() => setSelectedNiche(n)}
                  className="px-2.5 py-1.5 text-[10px] border transition-all"
                  style={{
                    borderColor: selectedNiche === n ? "var(--color-accent)" : "rgba(245,240,235,0.08)",
                    color: selectedNiche === n ? "var(--color-accent)" : "rgba(245,240,235,0.4)",
                    backgroundColor: selectedNiche === n ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: "rgba(245,240,235,0.4)" }}>
              Contexte / Instructions (optionnel)
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex : post sur ma routine matin, style décontracté, mentionner mon nouveau programme..."
              rows={3}
              className="w-full px-3 py-2.5 text-xs resize-none outline-none"
              style={{
                backgroundColor: "var(--color-card)",
                border: "1px solid rgba(245,240,235,0.08)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all"
            style={{
              backgroundColor: loading ? "rgba(199,91,57,0.4)" : "var(--color-accent)",
              color: "#fff",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Wand2 size={14} />
                Générer avec l'IA
              </>
            )}
          </button>
        </div>

        {/* Right panel: Output */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Output header */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(245,240,235,0.3)" }}>
              Résultat généré
            </span>
            {generated && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold border transition-all hover:bg-[var(--color-surface)]"
                  style={{ borderColor: "rgba(245,240,235,0.1)", color: "rgba(245,240,235,0.5)" }}
                >
                  <Copy size={10} />
                  {copied ? "Copié !" : "Copier"}
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold border transition-all hover:bg-[var(--color-surface)]"
                  style={{ borderColor: "rgba(245,240,235,0.1)", color: "rgba(245,240,235,0.5)" }}
                >
                  <RefreshCw size={10} />
                  Régénérer
                </button>
                <button
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold border transition-all"
                  style={{ borderColor: "rgba(199,91,57,0.3)", color: "var(--color-accent)", backgroundColor: "var(--accent-soft)" }}
                >
                  <Download size={10} />
                  Sauvegarder
                </button>
              </div>
            )}
          </div>

          {/* Output area */}
          <div
            className="flex-1 border min-h-[420px] p-5 relative"
            style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}
          >
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--color-accent)", borderTopColor: "transparent" }} />
                <div className="text-xs" style={{ color: "rgba(245,240,235,0.3)" }}>L'IA génère votre contenu...</div>
                <div className="flex gap-1 mt-2">
                  {TONES.slice(0, 3).map((t, i) => (
                    <div
                      key={t}
                      className="text-[9px] px-1.5 py-0.5 border animate-pulse"
                      style={{ borderColor: "rgba(199,91,57,0.2)", color: "rgba(199,91,57,0.4)", animationDelay: `${i * 200}ms` }}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && !generated && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="p-4 border" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "var(--color-surface)" }}>
                  <Sparkles size={24} style={{ color: "rgba(245,240,235,0.15)" }} />
                </div>
                <div className="text-xs text-center max-w-xs" style={{ color: "rgba(245,240,235,0.25)" }}>
                  Configurez votre type de contenu et cliquez sur "Générer" pour créer du contenu personnalisé avec l'IA
                </div>
              </div>
            )}

            {!loading && generated && (
              <div className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                {generated}
              </div>
            )}
          </div>

          {/* Quick actions */}
          {generated && !loading && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Planifier dans Composer", emoji: "📅" },
                { label: "Sauvegarder en brouillon", emoji: "📄" },
                { label: "Copier dans le presse-papier", emoji: "📋" },
              ].map((a) => (
                <button
                  key={a.label}
                  className="flex items-center gap-2 px-3 py-2.5 border text-left text-xs font-medium hover:bg-[var(--color-surface)] transition-colors"
                  style={{ borderColor: "rgba(245,240,235,0.08)", backgroundColor: "var(--color-card)", color: "var(--text-primary)" }}
                >
                  <span className="text-sm">{a.emoji}</span>
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
