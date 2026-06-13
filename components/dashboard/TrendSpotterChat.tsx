"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp, Flame, AlertTriangle, Clock, ExternalLink,
  Search, ThumbsUp, MessageCircle, Eye, Bookmark,
  Check, X, Sparkles, Zap, Filter, ChevronDown,
  Play, Bell, Tag, Share2, Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

type Trend = {
  id: string;
  title: string;
  description?: string;
  source: string;
  platform: string;
  relevance_score: number;
  urgency: "high" | "medium" | "low";
  url?: string;
  metrics?: { label: string; value: string }[];
  tags?: string[];
  saved?: boolean;
  dismissed?: boolean;
};

// ─── Mock Trends ────────────────────────────────────────────

const MOCK_TRENDS: Trend[] = [
  {
    id: "t-1", title: "Format 'Day in the Life' explose sur TikTok", description: "Les vidéos montrant une journée complète de créateur font 3.5x plus de vues que la moyenne. Ta niche fitness est particulièrement portée.", source: "TikTok", platform: "tiktok", relevance_score: 92, urgency: "high",
    metrics: [{ label: "Vues moy.", value: "245K" }, { label: "Croissance", value: "+180%" }], tags: ["fitness", "vlog"],
  },
  {
    id: "t-2", title: "Search intent 'abonnement OF' en hausse de 120%", description: "Google Trends montre un pic massif pour 'abonnement OnlyFans + fitness'. Opportunité SEO énorme pour ton profil.", source: "Google Trends", platform: "google", relevance_score: 88, urgency: "high",
    metrics: [{ label: "Volume", value: "12.4K" }, { label: "Croissance", value: "+120%" }], tags: ["seo", "onlyfans"],
  },
  {
    id: "t-3", title: "Les Reels avant/après fitness cartonnent sur Instagram", description: "Tes concurrents directs utilisent ce format et gagnent 40% plus d'engagement que les posts standards.", source: "Instagram", platform: "instagram", relevance_score: 85, urgency: "high",
    metrics: [{ label: "Engagement", value: "6.2%" }, { label: "Concurrents", value: "+5" }], tags: ["fitness", "reels"],
  },
  {
    id: "t-4", title: "Nouveau son viral 'Summer Body Reset' sur TikTok", description: "Ce son cumule déjà 890K utilisations. Les vidéos fitness avec ce son font 2x plus de vues.", source: "TikTok", platform: "tiktok", relevance_score: 78, urgency: "medium",
    metrics: [{ label: "Utilisations", value: "890K" }, { label: "Multiplicateur", value: "2.1x" }], tags: ["fitness", "sound"],
  },
  {
    id: "t-5", title: "Hashtag #SummerBody en croissance de 200% sur TikTok", description: "Le hashtag #SummerBody cumule 2.4M vidéos avec une croissance de 200% sur 30 jours. Créateurs fitness : opportunité énorme de contenu saisonnier.", source: "TikTok", platform: "tiktok", relevance_score: 86, urgency: "high",
    metrics: [{ label: "Vidéos", value: "2.4M" }, { label: "Croissance", value: "+200%" }], tags: ["fitness", "seasonal"],
  },
  {
    id: "t-6", title: "Le YouTube Shorts dépasse les Reels en reach organique", description: "Les Shorts YouTube ont 3x plus de reach organique que les Reels Instagram depuis la mise à jour de l'algo d'avril.", source: "YouTube", platform: "youtube", relevance_score: 70, urgency: "medium",
    tags: ["youtube", "algo"],
  },
  {
    id: "t-7", title: "Collaboration cross-promo avec fitness girls sur Twitter", description: "Les threads de collaborations Twitter/X génèrent 500+ likes et des pics d'abonnés pour les créateurs fitness.", source: "Twitter", platform: "twitter", relevance_score: 55, urgency: "low",
    tags: ["twitter", "collab"],
  },
  {
    id: "t-8", title: "Query 'PPV fitness content' en croissance de 65%", description: "Les recherches pour contenu PPV fitness augmentent. Opportunité de créer un pack PPV dédié.", source: "Google Trends", platform: "google", relevance_score: 82, urgency: "high",
    metrics: [{ label: "Croissance", value: "+65%" }, { label: "Volume", value: "5.2K" }], tags: ["ppv", "fitness"],
  },
];

// ─── Platform config ────────────────────────────────────────

const PLATFORM_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  tiktok: { label: "TikTok", color: "#00F2EA", icon: Radio },
  youtube: { label: "YouTube", color: "#FF0000", icon: Play },
  instagram: { label: "Instagram", color: "#E4405F", icon: Eye },
  twitter: { label: "Twitter", color: "#1DA1F2", icon: Share2 },
  google: { label: "Google Trends", color: "#4285F4", icon: TrendingUp },
};

const URGENCY_CONFIG = {
  high: { label: "Haute", color: "#EF4444", icon: Flame },
  medium: { label: "Moyenne", color: "#F59E0B", icon: Clock },
  low: { label: "Basse", color: "var(--success)", icon: AlertTriangle },
};

// ─── Component ──────────────────────────────────────────────

export function TrendSpotterChat() {
  const router = useRouter();
  const [trends, setTrends] = useState<Trend[]>(MOCK_TRENDS);
  const [filter, setFilter] = useState<string>("all");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDigest, setShowDigest] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Filter trends
  const filteredTrends = trends
    .filter((t) => !t.dismissed)
    .filter((t) => filter === "all" || t.urgency === filter)
    .filter((t) => platformFilter === "all" || t.platform === platformFilter)
    .filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.tags?.some((tag) => tag.includes(search.toLowerCase())));

  const toggleSave = (id: string) => {
    setTrends((prev) => prev.map((t) => t.id === id ? { ...t, saved: !t.saved } : t));
  };

  const dismiss = (id: string) => {
    setTrends((prev) => prev.map((t) => t.id === id ? { ...t, dismissed: true } : t));
  };

  const highCount = trends.filter((t) => t.urgency === "high" && !t.dismissed).length;
  const savedCount = trends.filter((t) => t.saved).length;

  // Daily digest
  const dailyDigest = trends
    .filter((t) => t.urgency === "high" && !t.dismissed)
    .slice(0, 5);

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: chatInput.trim() }]);
    setLoading(true);
    setChatInput("");

    try {
      const res = await fetch("/api/dashboard/agents/trends/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput.trim() }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message || "Aucune réponse." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Désolé, je n'ai pas pu analyser les tendances." }]);
    } finally {
      setLoading(false);
    }
  };

  // ─── Trend Card ───────────────────────────────────────────

  const TrendCard = ({ trend }: { trend: Trend }) => {
    const platform = PLATFORM_CONFIG[trend.platform];
    const urgency = URGENCY_CONFIG[trend.urgency];
    const PlatformIcon = platform?.icon ?? TrendingUp;
    const UrgencyIcon = urgency?.icon ?? Clock;

    return (
      <div className="border border-[var(--color-border)] transition-all hover:border-[var(--or, #D8A95B)]/30" style={{ backgroundColor: "var(--color-card)" }}>
        {/* Header */}
        <div className="flex items-start gap-3 p-4">
          {/* Platform icon */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${platform?.color ?? "var(--text-primary)"}15` }}>
            <PlatformIcon size={18} style={{ color: platform?.color ?? "rgba(255, 255, 255, 0.5)" }} />
          </div>

          <div className="flex-1 min-w-0">
            {/* Meta row */}
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: platform?.color ?? "rgba(255, 255, 255, 0.375)" }}>
                {platform?.label ?? trend.source}
              </span>
              <span className={cn(
                "inline-flex items-center gap-1 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider",
              )}
                style={{ backgroundColor: `${urgency?.color ?? "var(--text-primary)"}15`, color: urgency?.color ?? "rgba(255, 255, 255, 0.375)" }}
              >
                <UrgencyIcon size={8} />
                {urgency?.label ?? "Basse"}
              </span>
              <span className="text-[9px] font-mono ml-auto" style={{ color: trend.relevance_score >= 80 ? "var(--success)" : trend.relevance_score >= 60 ? "#F59E0B" : "rgba(255, 255, 255, 0.375)" }}>
                {trend.relevance_score}/100
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold leading-snug mb-1" style={{ color: "var(--text-primary)" }}>
              {trend.title}
            </h3>

            {/* Description */}
            {trend.description && (
              <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {trend.description}
              </p>
            )}

            {/* Metrics */}
            {trend.metrics && trend.metrics.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-3">
                {trend.metrics.map((m, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-[9px] uppercase" style={{ color: "rgba(255, 255, 255, 0.375)" }}>{m.label}</span>
                    <span className="text-xs font-semibold font-mono" style={{ color: "var(--text-primary)" }}>{m.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            {trend.tags && trend.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {trend.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.03)", color: "rgba(255, 255, 255, 0.5)" }}>
                    <Tag size={7} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => toggleSave(trend.id)}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 text-[9px] font-medium uppercase tracking-wider transition-all",
                  trend.saved ? "border-0" : "border border-[var(--color-border)]"
                )}
                style={trend.saved ? { backgroundColor: "rgba(199, 91, 57, 0.08)", color: "var(--accent)" } : { color: "rgba(255, 255, 255, 0.5)" }}
              >
                <Bookmark size={10} />
                {trend.saved ? "Sauvegardé" : "Sauvegarder"}
              </button>
              <button
                onClick={() => {
                  const tag = trend.tags?.[0] || trend.title?.split(" ").slice(0, 2).join("") || "";
                  if (trend.platform === "tiktok") {
                    router.push(`/studio/composer?source=tiktok&hashtag=${encodeURIComponent(tag)}`);
                  } else {
                    router.push(`/studio/composer?query=${encodeURIComponent(trend.title)}`);
                  }
                }}
                className="flex items-center gap-1 px-2 py-1 text-[9px] font-medium uppercase tracking-wider border border-[var(--color-border)] transition-all hover:border-[var(--or, #D8A95B)]/50"
                style={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                <Zap size={10} />
                Créer un contenu
              </button>
              <button
                onClick={() => dismiss(trend.id)}
                className="flex items-center gap-1 px-2 py-1 text-[9px] font-medium uppercase tracking-wider ml-auto hover:opacity-70 transition-opacity"
                style={{ color: "rgba(255, 255, 255, 0.25)" }}
              >
                <X size={10} />
                Ignorer
              </button>
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="h-0.5 w-full" style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}>
          <div
            className="h-full transition-all duration-500"
            style={{
              width: `${trend.relevance_score}%`,
              backgroundColor: trend.relevance_score >= 80 ? "var(--success)" : trend.relevance_score >= 60 ? "#F59E0B" : "rgba(255, 255, 255, 0.125)",
            }}
          />
        </div>
      </div>
    );
  };

  // ─── Digest Panel ─────────────────────────────────────────

  const DigestPanel = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="border border-[var(--color-border)] w-full max-w-lg mx-4" style={{ backgroundColor: "var(--color-card)" }}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: "rgba(199, 91, 57, 0.08)" }}>
              <Bell size={15} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Daily Digest</h3>
              <p className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.375)" }}>{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
            </div>
          </div>
          <button onClick={() => setShowDigest(false)} className="text-lg" style={{ color: "rgba(255, 255, 255, 0.375)" }}>&times;</button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <p className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>Voici ce qui marche en ce moment dans ta niche :</p>
          {dailyDigest.map((trend) => (
            <div key={trend.id} className="flex items-start gap-3 p-3 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
              <Flame size={14} style={{ color: "#EF4444" }} className="mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{trend.title}</p>
                <p className="text-[10px] mt-1" style={{ color: "rgba(255, 255, 255, 0.375)" }}>{trend.description?.slice(0, 100)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ─── Main Render ──────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4">
      {/* Main Feed */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Tendances détectées</h2>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
              {highCount} alertes haute priorité · {savedCount} sauvegardées
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDigest(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-wider font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
            >
              <Bell size={11} /> Daily Digest
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {/* Urgency filter */}
          <div className="flex gap-1">
            {[{ id: "all", label: "Toutes" }, { id: "high", label: "Haute" }, { id: "medium", label: "Moyenne" }, { id: "low", label: "Basse" }].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-2.5 py-1 text-[9px] uppercase tracking-wider font-medium transition-all",
                  filter === f.id ? "border-b-2" : "opacity-50 hover:opacity-80"
                )}
                style={{ borderColor: filter === f.id ? "var(--accent)" : "transparent", color: "var(--text-primary)" }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="w-px h-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.125)" }} />

          {/* Platform filter */}
          <div className="flex gap-1">
            {[{ id: "all", label: "Toutes" }, { id: "tiktok", label: "TikTok" }, { id: "youtube", label: "YouTube" }, { id: "instagram", label: "Insta" }, { id: "google", label: "Trends" }].map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatformFilter(p.id)}
                className={cn(
                  "px-2 py-1 text-[9px] uppercase tracking-wider font-medium transition-all",
                  platformFilter === p.id ? "border-b-2" : "opacity-40 hover:opacity-70"
                )}
                style={{ borderColor: platformFilter === p.id ? "var(--accent)" : "transparent", color: "var(--text-primary)" }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative ml-auto">
            <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2" style={{ color: "rgba(255, 255, 255, 0.25)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-32 bg-transparent border border-[var(--color-border)] pl-6 pr-2 py-1 text-[10px] focus:outline-none focus:border-[var(--or, #D8A95B)] transition-colors"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredTrends.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Radio size={32} style={{ color: "rgba(255, 255, 255, 0.08)" }} />
              <p className="text-sm mt-3" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Aucune tendance trouvée</p>
              <p className="text-[10px] mt-1" style={{ color: "rgba(255, 255, 255, 0.19)" }}>Reviens plus tard ou ajuste les filtres</p>
            </div>
          ) : (
            filteredTrends.map((trend) => <TrendCard key={trend.id} trend={trend} />)
          )}
        </div>
      </div>

      {/* Right Panel: Chat + Quick Info */}
      <div className="w-72 flex flex-col shrink-0 space-y-3">
        {/* Mini chat */}
        <div className="border border-[var(--color-border)] flex flex-col flex-1" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="p-3 border-b border-[var(--color-border)]">
            <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-primary)" }}>Pose une question</p>
            <p className="text-[9px] mt-0.5" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Analyse une tendance spécifique</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <Search size={20} className="mx-auto mb-2" style={{ color: "rgba(255, 255, 255, 0.08)" }} />
                <p className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.25)" }}>Demande-moi d'analyser une tendance ou un sujet</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={cn("text-xs leading-relaxed", msg.role === "user" ? "font-medium" : "")}
                style={{ color: msg.role === "user" ? "var(--text-primary)" : "rgba(255, 255, 255, 0.8)" }}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 animate-pulse rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                <span className="w-1.5 h-1.5 animate-pulse rounded-full [animation-delay:150ms]" style={{ backgroundColor: "var(--accent)" }} />
                <span className="w-1.5 h-1.5 animate-pulse rounded-full [animation-delay:300ms]" style={{ backgroundColor: "var(--accent)" }} />
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="p-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder="Ta question..."
                className="flex-1 bg-transparent border-b border-[var(--color-border)] py-1.5 text-xs focus:outline-none focus:border-[var(--or, #D8A95B)] transition-colors"
                style={{ color: "var(--text-primary)" }}
              />
              <button onClick={handleChat} disabled={!chatInput.trim() || loading} className="opacity-40 hover:opacity-100 disabled:opacity-20 transition-opacity" style={{ color: "var(--accent)" }}>
                <Search size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* Stat card */}
        <div className="border border-[var(--color-border)] p-3" style={{ backgroundColor: "var(--color-card)" }}>
          <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Quota API aujourd'hui</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>YouTube</span>
              <span className="font-mono" style={{ color: "var(--text-primary)" }}>1/2 runs</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Reddit</span>
              <span className="font-mono" style={{ color: "var(--text-primary)" }}>2/2 runs</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>TikTok</span>
              <span className="font-mono" style={{ color: "var(--text-primary)" }}>Apify</span>
            </div>
          </div>
          <p className="text-[8px] mt-2" style={{ color: "rgba(255, 255, 255, 0.19)" }}>Limite free : 2 runs/jour. Passe Elite pour plus de crédits.</p>
        </div>
      </div>

      {/* Digest Modal */}
      {showDigest && <DigestPanel />}
    </div>
  );
}
