"use client";

import { useState } from "react";
import {
  BookOpen, Search, ChevronRight, Star, Clock, TrendingUp,
  Play, FileText, Video, Headphones, ExternalLink, Filter,
  Sparkles, Award, Zap, Heart, Shield, BarChart3,
} from "lucide-react";

// ── Types & Mock data ─────────────────────────────────────
type Category = "all" | "strategie" | "monetisation" | "contenu" | "bien-etre" | "juridique" | "analytics";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: Category;
  type: "article" | "video" | "podcast" | "guide";
  duration: string;
  level: "débutant" | "intermédiaire" | "avancé";
  rating: number;
  views: number;
  emoji: string;
  featured?: boolean;
  new?: boolean;
}

const CATEGORIES: { id: Category; label: string; icon: React.ElementType; color: string }[] = [
  { id: "all", label: "Tout", icon: BookOpen, color: "var(--color-accent)" },
  { id: "strategie", label: "Stratégie", icon: TrendingUp, color: "#4A90D9" },
  { id: "monetisation", label: "Monétisation", icon: Zap, color: "#F5C842" },
  { id: "contenu", label: "Contenu", icon: Sparkles, color: "#E1306C" },
  { id: "bien-etre", label: "Bien-être", icon: Heart, color: "#A8D08D" },
  { id: "juridique", label: "Juridique", icon: Shield, color: "#9B59B6" },
  { id: "analytics", label: "Analytics", icon: BarChart3, color: "#69C9D0" },
];

const TYPE_ICONS: Record<Article["type"], React.ElementType> = {
  article: FileText,
  video: Video,
  podcast: Headphones,
  guide: BookOpen,
};

const TYPE_LABELS: Record<Article["type"], string> = {
  article: "Article",
  video: "Vidéo",
  podcast: "Podcast",
  guide: "Guide",
};

const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Doubler son LTV en 90 jours : la méthode Halo",
    excerpt: "Découvrez la stratégie complète utilisée par nos top créateurs pour multiplier leur valeur client à long terme sans augmenter leur charge de travail.",
    category: "monetisation",
    type: "guide",
    duration: "12 min",
    level: "intermédiaire",
    rating: 4.9,
    views: 2840,
    emoji: "💎",
    featured: true,
  },
  {
    id: "a2",
    title: "Algorithme 2026 : ce qui a vraiment changé",
    excerpt: "Analyse complète des changements d'algorithme sur Instagram, TikTok et YouTube pour vous adapter et maximiser votre reach organique.",
    category: "strategie",
    type: "article",
    duration: "8 min",
    level: "intermédiaire",
    rating: 4.7,
    views: 5620,
    emoji: "📊",
    new: true,
  },
  {
    id: "a3",
    title: "PPV pricing : trouver le prix parfait",
    excerpt: "Comment utiliser les données de comportement de vos fans pour fixer le prix optimal de vos contenus PPV et maximiser les conversions.",
    category: "monetisation",
    type: "video",
    duration: "18 min",
    level: "avancé",
    rating: 4.8,
    views: 1920,
    emoji: "💰",
  },
  {
    id: "a4",
    title: "Script Reel : la structure en 3 actes",
    excerpt: "La formule narrative qui fonctionne sur tous les formats courts. Exemples réels, templates inclus.",
    category: "contenu",
    type: "guide",
    duration: "6 min",
    level: "débutant",
    rating: 4.6,
    views: 3100,
    emoji: "🎬",
  },
  {
    id: "a5",
    title: "Burnout créateur : reconnaître les signaux",
    excerpt: "Témoignages et conseils pour maintenir un rythme de création sain sans sacrifier sa santé mentale.",
    category: "bien-etre",
    type: "podcast",
    duration: "34 min",
    level: "débutant",
    rating: 4.9,
    views: 890,
    emoji: "🧘",
  },
  {
    id: "a6",
    title: "Droits à l'image : ce que vous devez savoir",
    excerpt: "Guide juridique complet sur la protection de votre contenu, les contrats avec les marques, et vos droits en tant que créateur.",
    category: "juridique",
    type: "guide",
    duration: "20 min",
    level: "intermédiaire",
    rating: 4.8,
    views: 1450,
    emoji: "⚖️",
    new: true,
  },
  {
    id: "a7",
    title: "Lire ses analytics : les 5 métriques qui comptent",
    excerpt: "On vous explique pourquoi les vues et likes ne sont pas les métriques clés, et comment lire vos dashboards pour prendre de vraies décisions.",
    category: "analytics",
    type: "article",
    duration: "10 min",
    level: "débutant",
    rating: 4.5,
    views: 4200,
    emoji: "📈",
  },
  {
    id: "a8",
    title: "Segmenter sa communauté pour personnaliser",
    excerpt: "Comment créer des micro-segments de fans et adapter votre communication pour multiplier votre engagement et vos revenus.",
    category: "strategie",
    type: "video",
    duration: "22 min",
    level: "avancé",
    rating: 4.7,
    views: 1630,
    emoji: "🎯",
  },
];

const LEVEL_COLORS: Record<Article["level"], string> = {
  débutant: "#A8D08D",
  intermédiaire: "#F5C842",
  avancé: "#E05C5C",
};

export default function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | Article["type"]>("all");

  const filtered = ARTICLES.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || a.category === category;
    const matchType = typeFilter === "all" || a.type === typeFilter;
    return matchSearch && matchCat && matchType;
  });

  const featured = ARTICLES.find((a) => a.featured);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Knowledge Base
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(245,240,235,0.4)" }}>
          Guides, tutoriels et ressources pour optimiser votre activité
        </p>
      </div>

      {/* Featured article */}
      {featured && (
        <div
          className="p-6 border relative overflow-hidden cursor-pointer group"
          style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(199,91,57,0.25)", background: "linear-gradient(135deg, rgba(199,91,57,0.12) 0%, transparent 60%)" }}
        >
          <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: "var(--color-accent)" }} />
          <div className="flex items-start gap-4">
            <span className="text-3xl">{featured.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-semibold px-1.5 py-0.5" style={{ backgroundColor: "var(--accent-soft)", color: "var(--color-accent)", border: "1px solid rgba(199,91,57,0.2)" }}>
                  ⭐ FEATURED
                </span>
                <span className="text-[9px] font-semibold px-1.5 py-0.5" style={{ color: LEVEL_COLORS[featured.level], border: `1px solid ${LEVEL_COLORS[featured.level]}40` }}>
                  {featured.level}
                </span>
              </div>
              <h2 className="text-base font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>{featured.title}</h2>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(245,240,235,0.5)" }}>{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-[10px]" style={{ color: "rgba(245,240,235,0.35)" }}>
                <span className="flex items-center gap-1"><Clock size={10} />{featured.duration}</span>
                <span className="flex items-center gap-1"><Star size={10} style={{ color: "#F5C842" }} />{featured.rating}</span>
                <span>{featured.views.toLocaleString()} vues</span>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold shrink-0 transition-all group-hover:opacity-80" style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}>
              <Play size={12} />Lire
            </button>
          </div>
        </div>
      )}

      {/* Search & filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-48 px-3 py-2 border" style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}>
          <Search size={12} style={{ color: "rgba(245,240,235,0.3)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher dans la knowledge base..."
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </div>
        <div className="flex gap-1">
          {(["all", "article", "video", "podcast", "guide"] as const).map((t) => {
            const Icon = t === "all" ? Filter : TYPE_ICONS[t];
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className="flex items-center gap-1 px-2 py-1.5 text-[9px] font-semibold border uppercase tracking-wider transition-all"
                style={{
                  borderColor: typeFilter === t ? "var(--color-accent)" : "rgba(245,240,235,0.08)",
                  color: typeFilter === t ? "var(--color-accent)" : "rgba(245,240,235,0.35)",
                  backgroundColor: typeFilter === t ? "var(--accent-soft)" : "transparent",
                }}
              >
                <Icon size={9} />
                {t === "all" ? "Tous" : TYPE_LABELS[t]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-semibold border whitespace-nowrap transition-all shrink-0"
              style={{
                borderColor: category === cat.id ? cat.color : "rgba(245,240,235,0.08)",
                color: category === cat.id ? cat.color : "rgba(245,240,235,0.4)",
                backgroundColor: category === cat.id ? `${cat.color}15` : "transparent",
              }}
            >
              <Icon size={11} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.filter((a) => !a.featured || category !== "all").map((article) => {
          const TypeIcon = TYPE_ICONS[article.type];
          return (
            <div
              key={article.id}
              className="border p-4 flex flex-col gap-3 cursor-pointer hover:border-[var(--color-accent)]/30 transition-all card-accent"
              style={{ backgroundColor: "var(--color-card)", borderColor: "rgba(245,240,235,0.08)" }}
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{article.emoji}</span>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <TypeIcon size={10} style={{ color: "rgba(245,240,235,0.35)" }} />
                      <span className="text-[9px]" style={{ color: "rgba(245,240,235,0.35)" }}>{TYPE_LABELS[article.type]}</span>
                      {article.new && (
                        <span className="text-[8px] px-1 py-0.5 font-bold" style={{ backgroundColor: "var(--accent-soft)", color: "var(--color-accent)" }}>NEW</span>
                      )}
                    </div>
                  </div>
                </div>
                <span
                  className="text-[8px] font-semibold px-1.5 py-0.5 shrink-0"
                  style={{ color: LEVEL_COLORS[article.level], border: `1px solid ${LEVEL_COLORS[article.level]}30` }}
                >
                  {article.level}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xs font-semibold mb-1.5 line-clamp-2" style={{ color: "var(--text-primary)" }}>{article.title}</h3>
                <p className="text-[10px] leading-relaxed line-clamp-2" style={{ color: "rgba(245,240,235,0.4)" }}>{article.excerpt}</p>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
                <div className="flex items-center gap-3 text-[9px]" style={{ color: "rgba(245,240,235,0.3)" }}>
                  <span className="flex items-center gap-1"><Clock size={9} />{article.duration}</span>
                  <span className="flex items-center gap-1">
                    <Star size={9} fill="#F5C842" style={{ color: "#F5C842" }} />
                    {article.rating}
                  </span>
                  <span>{article.views.toLocaleString()}</span>
                </div>
                <button className="flex items-center gap-1 text-[9px] font-semibold transition-opacity hover:opacity-80" style={{ color: "var(--color-accent)" }}>
                  Lire <ChevronRight size={9} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center border border-dashed" style={{ borderColor: "rgba(245,240,235,0.06)" }}>
          <BookOpen size={24} className="mx-auto mb-3" style={{ color: "rgba(245,240,235,0.15)" }} />
          <div className="text-sm" style={{ color: "rgba(245,240,235,0.3)" }}>Aucun résultat trouvé</div>
        </div>
      )}
    </div>
  );
}
