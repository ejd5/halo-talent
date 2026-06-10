"use client";

import { useState } from "react";
import { Search, BookOpen, PlayCircle, Clock, Users, ChevronRight, Bookmark, Heart, Star, GraduationCap, Calendar, ArrowRight, MessageCircle, Sparkles, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock Data ──────────────────────────────────────────────

const TRACKS = [
  { id: "t1", title: "Maîtriser OnlyFans en 30 jours", description: "De la configuration à la monétisation avancée — un programme complet pour maximiser tes revenus.", modules: 12, duration: "30 jours", level: "Débutant", progress: 65, cover: "🎯", color: "var(--accent)" },
  { id: "t2", title: "Stratégie Instagram pour créateurs", description: "Algorithme, Reels, Stories, collaborations — maîtrise toutes les ficelles d'Instagram.", modules: 8, duration: "3 semaines", level: "Intermédiaire", progress: 30, cover: "📸", color: "#E4405F" },
  { id: "t3", title: "Gestion financière du créateur", description: "Budget, épargne, optimisation fiscale et préparation de la retraite pour travailleurs indépendants.", modules: 6, duration: "2 semaines", level: "Tous niveaux", progress: 0, cover: "💰", color: "var(--success)" },
  { id: "t4", title: "Santé mentale et créateur", description: "Prévenir le burnout, gérer la pression des réseaux, construire une carrière durable.", modules: 10, duration: "4 semaines", level: "Tous niveaux", progress: 0, cover: "🌱", color: "#8B5CF6" },
  { id: "t5", title: "Optimisation fiscale", description: "Déclarations, charges, TVA, statuts juridiques — tout pour optimiser ta fiscalité.", modules: 5, duration: "1 semaine", level: "Avancé", progress: 0, cover: "📊", color: "#3B82F6" },
];

const ARTICLES = [
  { id: "a1", title: "Comment créer un PPV qui convertit", excerpt: "Les 5 éléments d'un PPV irrésistible — analyse de 1000 posts performants.", category: "Stratégie", level: "Intermédiaire", duration: "8 min", likes: 47, saved: false },
  { id: "a2", title: "Guide complet des hashtags 2026", excerpt: "Quels hashtags utiliser selon ta niche et ta taille de compte.", category: "Instagram", level: "Débutant", duration: "5 min", likes: 32, saved: true },
  { id: "a3", title: "Optimiser son profil OnlyFans", excerpt: "Bio, cover, prix — chaque détail compte pour convertir un visiteur en abonné.", category: "OnlyFans", level: "Débutant", duration: "10 min", likes: 89, saved: false },
  { id: "a4", title: "Faire ses propres photos sans photographe", excerpt: "Matos, lumière, posing — des résultats pros avec un budget serré.", category: "Production", level: "Débutant", duration: "12 min", likes: 56, saved: false },
  { id: "a5", title: "Stratégie de cross-pub multi-plateformes", excerpt: "Comment utiliser chaque plateforme pour en nourrir une autre.", category: "Stratégie", level: "Avancé", duration: "15 min", likes: 23, saved: true },
  { id: "a6", title: "Gérer son stress avant un live", excerpt: "Exercices de respiration et préparation mentale pour les lives.", category: "Wellness", level: "Débutant", duration: "4 min", likes: 71, saved: false },
];

const WEBINARS = [
  { id: "w1", title: "Maximiser ses revenus OnlyFans en 2026", date: "2026-06-15", time: "18:00", speaker: "Sophie Martin — Top 0.1% OF", spots: 45, max_spots: 100, type: "upcoming" },
  { id: "w2", title: "Instagram Reels : les nouvelles règles", date: "2026-06-22", time: "14:00", speaker: "Thomas Petit — Social Media Expert", spots: 72, max_spots: 100, type: "upcoming" },
  { id: "w3", title: "Gestion fiscale pour créateurs", date: "2026-06-10", time: "11:00", speaker: "Marie Dubois — Experte-comptable", spots: 100, max_spots: 100, type: "replay", replay_url: "#" },
  { id: "w4", title: "Prévenir le burnout du créateur", date: "2026-06-03", time: "19:00", speaker: "Dr. Laurent Blanc — Psychologue", spots: 100, max_spots: 100, type: "replay", replay_url: "#" },
];

const CATEGORIES = ["Tout", "Stratégie", "OnlyFans", "Instagram", "TikTok", "Production", "Wellness", "Business"];
const LEVELS = ["Tous niveaux", "Débutant", "Intermédiaire", "Avancé"];

export default function LearnPage() {
  const [activeSection, setActiveSection] = useState<"tracks" | "articles" | "webinars">("tracks");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tout");
  const [levelFilter, setLevelFilter] = useState("Tous niveaux");
  const [savedArticles, setSavedArticles] = useState<string[]>(ARTICLES.filter((a) => a.saved).map((a) => a.id));
  const [mentorInput, setMentorInput] = useState("");
  const [mentorMessages, setMentorMessages] = useState<{ role: string; content: string }[]>([]);
  const [mentorOpen, setMentorOpen] = useState(false);

  const toggleSave = (id: string) => {
    setSavedArticles((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const filteredArticles = ARTICLES
    .filter((a) => categoryFilter === "Tout" || a.category === categoryFilter)
    .filter((a) => levelFilter === "Tous niveaux" || a.level === levelFilter)
    .filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase()));

  const handleMentor = () => {
    if (!mentorInput.trim()) return;
    setMentorMessages((prev) => [...prev, { role: "user", content: mentorInput.trim() }]);
    const q = mentorInput.trim().toLowerCase();
    let response = "";
    if (q.includes("parcours") || q.includes("track") || q.includes("recommande")) {
      const track = TRACKS.find((t) => t.title.toLowerCase().includes(q)) ?? TRACKS[0];
      response = `Je te recommande le parcours "${track.title}" — ${track.description} Il contient ${track.modules} modules sur ${track.duration}.`;
    } else if (q.includes("article") || q.includes("ressource")) {
      const article = ARTICLES.find((a) => a.title.toLowerCase().includes(q.replace("article", "").trim())) ?? ARTICLES[0];
      response = `L'article "${article.title}" est parfait pour toi : ${article.excerpt} (${article.duration} de lecture).`;
    } else {
      response = "Je suis ton Mentor IA ! Je peux te recommander un parcours selon ton profil, suggérer des articles sur un sujet, ou t'aiguiller vers les bonnes ressources. Que veux-tu apprendre ?";
    }
    setMentorMessages((prev) => [...prev, { role: "assistant", content: response }]);
    setMentorInput("");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>Apprentissage</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-primary)" }}>Ressources, formations et webinars pour booster ta carrière</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255, 255, 255, 0.25)" }} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Recherche une ressource, un parcours..."
          className="w-full bg-transparent border border-[var(--color-border)] pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      {/* Section tabs */}
      <div className="flex gap-4 border-b border-[var(--color-border)]">
        {[
          { id: "tracks" as const, label: "Parcours", icon: GraduationCap },
          { id: "articles" as const, label: "Articles", icon: BookOpen },
          { id: "webinars" as const, label: "Webinaires", icon: PlayCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={cn(
              "flex items-center gap-2 pb-3 text-sm font-medium transition-all border-b-2 -mb-[1px]",
              activeSection === tab.id ? "border-[var(--accent)]" : "border-transparent opacity-50 hover:opacity-80"
            )}
            style={{ color: "var(--text-primary)" }}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── SECTION: Tracks ────────────────────────────── */}
      {activeSection === "tracks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TRACKS.map((track) => (
            <div key={track.id} className="border border-[var(--color-border)] card-accent flex flex-col" style={{ backgroundColor: "var(--color-card)" }}>
              {/* Cover */}
              <div className="h-28 flex items-center justify-center text-4xl" style={{ backgroundColor: `${track.color}12` }}>
                {track.cover}
              </div>
              {/* Body */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{track.title}</h3>
                <p className="text-xs leading-relaxed mb-3 flex-1" style={{ color: "rgba(255, 255, 255, 0.8)" }}>{track.description}</p>
                <div className="flex items-center gap-3 mb-3 text-[10px]" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                  <span className="flex items-center gap-1"><BookOpen size={11} /> {track.modules} modules</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {track.duration}</span>
                  <span className="flex items-center gap-1"><Star size={11} /> {track.level}</span>
                </div>
                {/* Progress */}
                {track.progress > 0 ? (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span style={{ color: "rgba(255, 255, 255, 0.375)" }}>Progression</span>
                      <span className="font-mono" style={{ color: "var(--accent)" }}>{track.progress}%</span>
                    </div>
                    <div className="h-1.5 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-base)" }}>
                      <div className="h-full transition-all" style={{ width: `${track.progress}%`, backgroundColor: "var(--accent)" }} />
                    </div>
                  </div>
                ) : null}
                <button
                  className="w-full py-2 text-[10px] uppercase tracking-wider font-semibold transition-opacity hover:opacity-80"
                  style={{ backgroundColor: track.progress > 0 ? "#C75B3920" : "var(--accent)", color: track.progress > 0 ? "var(--accent)" : "var(--text-primary)" }}
                >
                  {track.progress > 0 ? "Continuer" : "Commencer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── SECTION: Articles ──────────────────────────── */}
      {activeSection === "articles" && (
        <>
          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex gap-1">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <button key={cat} onClick={() => setCategoryFilter(cat)}
                  className={cn("px-2.5 py-1 text-[9px] uppercase tracking-wider font-medium transition-all",
                    categoryFilter === cat ? "border-b-2" : "opacity-50 hover:opacity-80")}
                  style={{ borderColor: categoryFilter === cat ? "var(--accent)" : "transparent", color: "var(--text-primary)" }}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="w-px h-4" style={{ backgroundColor: "rgba(255, 255, 255, 0.125)" }} />
            <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-transparent border border-[var(--color-border)] px-2 py-1 text-[9px] uppercase tracking-wider focus:outline-none"
              style={{ color: "var(--text-primary)" }}>
              {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
            {savedArticles.length > 0 && (
              <button onClick={() => setCategoryFilter("Tout")}
                className="text-[9px] px-2 py-1" style={{ color: "var(--accent)" }}>
                {savedArticles.length} sauvegardé{savedArticles.length > 1 ? "s" : ""}
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <BookOpen size={32} className="mx-auto mb-2" style={{ color: "rgba(255, 255, 255, 0.08)" }} />
                <p className="text-sm" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Aucun article trouvé</p>
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div key={article.id} className="border border-[var(--color-border)] card-accent group" style={{ backgroundColor: "var(--color-card)" }}>
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] px-1.5 py-0.5 font-mono uppercase" style={{ backgroundColor: "rgba(199, 91, 57, 0.08)", color: "var(--accent)" }}>
                        {article.category}
                      </span>
                      <span className="text-[9px]" style={{ color: "rgba(255, 255, 255, 0.375)" }}>{article.level}</span>
                      <span className="text-[9px] ml-auto" style={{ color: "rgba(255, 255, 255, 0.25)" }}>{article.duration}</span>
                    </div>
                    {/* Title */}
                    <h3 className="text-sm font-semibold mb-1.5 group-hover:opacity-80 transition-opacity" style={{ color: "var(--text-primary)" }}>{article.title}</h3>
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "rgba(255, 255, 255, 0.8)" }}>{article.excerpt}</p>
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-2 py-1 text-[9px] uppercase tracking-wider border border-[var(--color-border)] transition-all hover:border-[var(--accent)]/50" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                        Lire <ChevronRight size={10} />
                      </button>
                      <button onClick={() => toggleSave(article.id)}
                        className="p-1.5 transition-opacity hover:opacity-70"
                        style={{ color: savedArticles.includes(article.id) ? "var(--accent)" : "rgba(255, 255, 255, 0.25)" }}>
                        <Bookmark size={12} fill={savedArticles.includes(article.id) ? "var(--accent)" : "none"} />
                      </button>
                      <button className="p-1.5 transition-opacity hover:opacity-70 flex items-center gap-1 text-[9px]" style={{ color: "rgba(255, 255, 255, 0.25)" }}>
                        <Heart size={11} /> {article.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* ─── SECTION: Webinars ──────────────────────────── */}
      {activeSection === "webinars" && (
        <div className="space-y-6">
          {/* Upcoming */}
          <div>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Calendar size={15} style={{ color: "var(--accent)" }} /> À venir
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WEBINARS.filter((w) => w.type === "upcoming").map((w) => (
                <div key={w.id} className="border border-[var(--color-border)] card-accent p-4" style={{ backgroundColor: "var(--color-card)" }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{w.title}</p>
                  <div className="space-y-1 text-[10px] mb-3" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    <p>📅 {new Date(w.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })} à {w.time}</p>
                    <p>👤 {w.speaker}</p>
                    <p>👥 {w.spots}/{w.max_spots} places</p>
                  </div>
                  <button
                    className={cn(
                      "w-full py-2 text-[10px] uppercase tracking-wider font-semibold transition-opacity hover:opacity-80",
                      w.spots >= w.max_spots ? "opacity-40 cursor-not-allowed" : ""
                    )}
                    style={{ backgroundColor: w.spots < w.max_spots ? "var(--accent)" : "rgba(255, 255, 255, 0.08)", color: "var(--text-primary)" }}
                    disabled={w.spots >= w.max_spots}
                  >
                    {w.spots < w.max_spots ? "S'inscrire" : "Complet"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Replays */}
          <div>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <PlayCircle size={15} style={{ color: "var(--accent)" }} /> Replays disponibles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WEBINARS.filter((w) => w.type === "replay").map((w) => (
                <div key={w.id} className="border border-[var(--color-border)] flex items-center gap-4 p-4" style={{ backgroundColor: "var(--color-card)" }}>
                  <div className="w-12 h-12 flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(199, 91, 57, 0.08)" }}>
                    <PlayCircle size={22} style={{ color: "var(--accent)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{w.title}</p>
                    <p className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.375)" }}>{w.speaker} · {new Date(w.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <button className="text-[9px] px-3 py-1.5 uppercase tracking-wider font-medium border border-[var(--color-border)] hover:border-[var(--accent)]/50 transition-all" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
                    Voir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── AI Mentor (floating) ────────────────────────── */}
      {mentorOpen && (
        <div className="fixed bottom-6 right-6 w-80 border border-[var(--color-border)] shadow-2xl z-50" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)]" style={{ backgroundColor: "#C75B3910" }}>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: "var(--accent)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>Mentor IA</span>
            </div>
            <button onClick={() => setMentorOpen(false)} className="text-sm" style={{ color: "rgba(255, 255, 255, 0.375)" }}>&times;</button>
          </div>
          <div className="h-64 overflow-y-auto p-3 space-y-2">
            {mentorMessages.length === 0 ? (
              <div className="text-center py-6">
                <GraduationCap size={24} className="mx-auto mb-2" style={{ color: "rgba(255, 255, 255, 0.08)" }} />
                <p className="text-[10px]" style={{ color: "rgba(255, 255, 255, 0.25)" }}>Demande-moi une recommandation de parcours ou d&apos;article</p>
              </div>
            ) : (
              mentorMessages.map((m, i) => (
                <div key={i} className={cn("text-xs leading-relaxed", m.role === "user" ? "font-medium" : "")}
                  style={{ color: m.role === "user" ? "var(--text-primary)" : "rgba(255, 255, 255, 0.8)" }}>
                  {m.content}
                </div>
              ))
            )}
          </div>
          <div className="p-3 border-t border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={mentorInput}
                onChange={(e) => setMentorInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMentor()}
                placeholder="Quel parcours me conseilles-tu ?"
                className="flex-1 bg-transparent border-b border-[var(--color-border)] py-1.5 text-xs focus:outline-none focus:border-[var(--accent)]"
                style={{ color: "var(--text-primary)" }}
              />
              <button onClick={handleMentor} disabled={!mentorInput.trim()} className="opacity-40 hover:opacity-100 disabled:opacity-20 transition-opacity" style={{ color: "var(--accent)" }}>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB for mentor */}
      {!mentorOpen && (
        <button
          onClick={() => setMentorOpen(true)}
          className="fixed bottom-6 right-6 w-12 h-12 flex items-center justify-center shadow-lg z-50 hover:scale-105 transition-transform"
          style={{ backgroundColor: "var(--accent)" }}
          title="Mentor IA"
        >
          <Sparkles size={20} className="text-white" />
        </button>
      )}
    </div>
  );
}
