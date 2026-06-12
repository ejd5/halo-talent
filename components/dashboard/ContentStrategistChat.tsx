"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Plus, Sparkles, Loader2, Copy, Check, X,
  Lightbulb, PenLine, TrendingUp, Clock, BarChart3,
  MessageCircle, Save, Eye, ChevronRight, ChevronLeft,
  Zap, PanelRightOpen, PanelRightClose,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

type Message = {
  role: "user" | "assistant";
  content: string;
  toolCalls?: { tool: string; input: any }[];
  id?: string;
};

type SavedIdea = {
  id: string;
  title: string;
  description: string;
  platform: string;
  status: string;
  created_at: string;
};

type DraftedPost = {
  id: string;
  platform: string;
  caption: string;
  scheduled_for: string;
  status: string;
};

// ─── Tool metadata ──────────────────────────────────────────

const toolIcons: Record<string, React.ElementType> = {
  get_creator_profile: Eye,
  get_creator_posts: BarChart3,
  get_creator_accounts: Eye,
  generate_content_ideas: Lightbulb,
  generate_caption: PenLine,
  get_content_suggestions: Sparkles,
  get_content_history: BarChart3,
  generate_hook: Zap,
  suggest_posting_time: Clock,
  save_content_idea: Save,
  schedule_draft: PenLine,
  analyze_post_performance: TrendingUp,
  schedule_post: Clock,
};

const toolLabels: Record<string, string> = {
  get_creator_profile: "Consulte ton profil...",
  get_creator_posts: "Analyse tes posts...",
  get_creator_accounts: "Vérifie tes comptes...",
  generate_content_ideas: "Génère des idées...",
  generate_caption: "Rédige un caption...",
  get_content_suggestions: "Optimise le contenu...",
  get_content_history: "Historique des posts...",
  generate_hook: "Crée des hooks...",
  suggest_posting_time: "Analyse le timing...",
  save_content_idea: "Sauvegarde l'idée...",
  schedule_draft: "Planifie le post...",
  analyze_post_performance: "Analyse la perf...",
  schedule_post: "Planifie...",
};

// ─── Artifact parser ────────────────────────────────────────

function parseArtifacts(content: string): { type: "idea" | "caption" | "hook" | "analysis"; items: string[] } | null {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      const first = parsed[0];
      if (first?.title && first?.description) return { type: "idea", items: parsed.map((i: any) => `${i.title}${i.description ? ` — ${i.description}` : ""}`) };
      if (typeof first === "string" && first.length < 200) return { type: "hook", items: parsed };
    }
    if (parsed?.hooks && Array.isArray(parsed.hooks)) return { type: "hook", items: parsed.hooks };
    if (parsed?.ideas && Array.isArray(parsed.ideas)) return { type: "idea", items: parsed.ideas.map((i: any) => typeof i === "string" ? i : i.title || "") };
    if (parsed?.caption) return { type: "caption", items: [parsed.caption] };
    if (parsed?.strengths || parsed?.recommendation) return { type: "analysis", items: [content] };
  } catch {}
  return null;
}

function isGeneratedContent(msg: Message): boolean {
  const genTools = ["generate_content_ideas", "generate_caption", "generate_hook", "analyze_post_performance"];
  return msg.toolCalls?.some((tc) => genTools.includes(tc.tool)) ?? false;
}

// ─── Skills List ────────────────────────────────────────────

const SKILLS = [
  { id: "ideas", label: "Idées de contenu", icon: Lightbulb, prompt: "Donne-moi 5 idées de contenu pour cette semaine" },
  { id: "hook", label: "Hooks accrocheurs", icon: Zap, prompt: "Génère 5 hooks pour mon prochain post" },
  { id: "caption", label: "Caption optimisé", icon: PenLine, prompt: "Rédige un caption optimisé pour mon prochain post" },
  { id: "timing", label: "Meilleur moment", icon: Clock, prompt: "Quand devrais-je poster pour maximiser l'engagement ?" },
  { id: "analyze", label: "Analyse performance", icon: TrendingUp, prompt: "Analyse la performance de mes derniers posts" },
  { id: "history", label: "Mon historique", icon: BarChart3, prompt: "Montre-moi l'historique de mes publications" },
];

// ─── Component ──────────────────────────────────────────────

export function ContentStrategistChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTools, setCurrentTools] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [draftedPosts, setDraftedPosts] = useState<DraftedPost[]>([]);
  const [sidebarTab, setSidebarTab] = useState<"ideas" | "drafts" | "skills">("skills");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const supabase = createClient();

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentTools]);

  // Load sidebar data
  const loadSidebarData = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: ideas } = await supabase
      .from("content_ideas")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (ideas) setSavedIdeas(ideas as SavedIdea[]);

    const { data: posts } = await supabase
      .from("scheduled_posts")
      .select("*")
      .eq("creator_id", user.id)
      .order("scheduled_for", { ascending: true })
      .limit(10);
    if (posts) setDraftedPosts(posts as DraftedPost[]);
  }, [supabase]);

  useEffect(() => { loadSidebarData(); }, [loadSidebarData]);

  // ─── Send message ─────────────────────────────────────────

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { role: "user", content: msg, id: crypto.randomUUID() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setError(null);
    setCurrentTools([]);
    setShowSuggestions(false);

    try {
      const res = await fetch("/api/dashboard/agents/content/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la génération");

      if (data.toolCalls?.length > 0) {
        setCurrentTools(data.toolCalls.map((tc: any) => tc.tool));
        setTimeout(() => setCurrentTools([]), 800);
      }

      setMessages((prev) => [...prev, {
        role: "assistant",
        content: data.message,
        toolCalls: data.toolCalls,
        id: crypto.randomUUID(),
      }]);

      // Refresh sidebar data after save/draft tools
      const toolNames = data.toolCalls?.map((tc: any) => tc.tool) ?? [];
      if (toolNames.includes("save_content_idea") || toolNames.includes("schedule_draft")) {
        loadSidebarData();
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Copy to clipboard ────────────────────────────────────

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // ─── Render artifact card ─────────────────────────────────

  const renderArtifact = (content: string, msgId: string) => {
    const artifact = parseArtifacts(content);
    if (!artifact) return null;

    const accentColor = artifact.type === "caption" ? "var(--accent)"
      : artifact.type === "hook" ? "#8B5CF6"
      : artifact.type === "idea" ? "var(--success)"
      : "#3B82F6";

    const typeLabel = artifact.type === "caption" ? "Caption généré"
      : artifact.type === "hook" ? "Hooks générés"
      : artifact.type === "idea" ? "Idées de contenu"
      : "Analyse";

    return (
      <div className="mt-3 border" style={{ borderColor: `${accentColor}30`, backgroundColor: `${accentColor}08` }}>
        <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: `${accentColor}15` }}>
          <div className="flex items-center gap-2">
            <Sparkles size={12} style={{ color: accentColor }} />
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: accentColor }}>
              {typeLabel}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 font-mono" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              AI
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => copyToClipboard(artifact.items.join("\n\n"), `copy-${msgId}`)}
              className="p-1 hover:opacity-70 transition-opacity"
              title="Copier"
            >
              {copiedId === `copy-${msgId}` ? <Check size={12} style={{ color: accentColor }} /> : <Copy size={12} style={{ color: "rgba(255, 255, 255, 0.5)" }} />}
            </button>
          </div>
        </div>
        <div className="p-4 space-y-3">
          {artifact.items.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              {artifact.type === "hook" && (
                <span className="text-lg mt-[-2px]">🧵</span>
              )}
              {artifact.type === "idea" && (
                <span className="text-lg mt-[-2px]">💡</span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {item}
                </p>
              </div>
            </div>
          ))}
        </div>
        {(artifact.type === "caption" || artifact.type === "hook" || artifact.type === "idea") && (
          <div className="px-4 py-2 border-t flex items-center gap-2" style={{ borderColor: `${accentColor}15` }}>
            <button
              onClick={() => copyToClipboard(artifact.items.join("\n\n"), `use-${msgId}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: accentColor, color: "var(--text-primary)" }}
            >
              <Copy size={11} />
              Utiliser
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: "rgba(255, 255, 255, 0.125)", color: "var(--text-primary)" }}>
              <Save size={11} />
              Sauvegarder
            </button>
          </div>
        )}
      </div>
    );
  };

  // ─── Render message ───────────────────────────────────────

  const renderMessage = (msg: Message) => {
    const isGenContent = isGeneratedContent(msg);
    const hasArtifact = isGenContent && parseArtifacts(msg.content);

    return (
      <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
        {msg.role === "assistant" && (
          <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0 mt-1" style={{ backgroundColor: "var(--color-card)" }}>
            <span>📝</span>
          </div>
        )}

        <div className="max-w-xl">
          {/* Tool calls indicator */}
          {msg.toolCalls && msg.toolCalls.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {msg.toolCalls.map((tc, j) => {
                const Icon = toolIcons[tc.tool] ?? Sparkles;
                return (
                  <span key={j} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
                    <Icon size={8} style={{ color: "rgba(199, 91, 57, 0.5)" }} />
                    <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>{toolLabels[tc.tool] ?? tc.tool}</span>
                  </span>
                );
              })}
            </div>
          )}

          {/* Message bubble */}
          <div className={`px-4 py-3 text-base leading-relaxed whitespace-pre-wrap ${
            msg.role === "user" ? "text-white" : "border border-[var(--color-border)]"
          }`}
            style={msg.role === "user"
              ? { backgroundColor: "var(--color-accent)" }
              : { backgroundColor: "var(--color-card)" }
            }
          >
            <span style={{ color: msg.role === "user" ? "var(--text-primary)" : "var(--text-primary)" }}>
              {msg.content}
            </span>
          </div>

          {/* Artifact card */}
          {hasArtifact && renderArtifact(msg.content, msg.id!)}
        </div>
      </div>
    );
  };

  // ─── Quick skill button ───────────────────────────────────

  const SkillButton = ({ skill }: { skill: typeof SKILLS[0] }) => {
    const Icon = skill.icon;
    return (
      <button
        onClick={() => handleSend(skill.prompt)}
        disabled={loading}
        className="flex items-center gap-2 w-full p-3 text-left text-sm border border-[var(--color-border)] transition-all hover:border-[var(--or, #D8A95B)]/50 hover:bg-[var(--or, #D8A95B)]/05 disabled:opacity-40"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="w-7 h-7 flex items-center justify-center" style={{ backgroundColor: "rgba(199, 91, 57, 0.08)" }}>
          <Icon size={13} style={{ color: "var(--accent)" }} />
        </div>
        <span style={{ color: "var(--text-primary)" }}>{skill.label}</span>
      </button>
    );
  };

  // ─── Sidebar ──────────────────────────────────────────────

  const renderSidebar = () => {
    if (!sidebarOpen) return null;

    return (
      <div className="w-72 border-l border-[var(--color-border)] flex flex-col shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
        {/* Tabs */}
        <div className="flex border-b border-[var(--color-border)]">
          {(["skills", "ideas", "drafts"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSidebarTab(tab)}
              className={cn(
                "flex-1 py-2.5 text-[10px] uppercase tracking-wider font-medium transition-colors",
                sidebarTab === tab ? "border-b-2" : "opacity-40 hover:opacity-70"
              )}
              style={{ borderColor: sidebarTab === tab ? "var(--accent)" : "transparent", color: "var(--text-primary)" }}
            >
              {tab === "skills" ? "Actions" : tab === "ideas" ? "Idées" : "Brouillons"}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sidebarTab === "skills" && (
            <>
              <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                Actions rapides
              </p>
              <div className="space-y-2">
                {SKILLS.map((skill) => (
                  <SkillButton key={skill.id} skill={skill} />
                ))}
              </div>
            </>
          )}

          {sidebarTab === "ideas" && (
            <>
              <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                Idées sauvegardées ({savedIdeas.length})
              </p>
              {savedIdeas.length === 0 ? (
                <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Aucune idée sauvegardée</p>
              ) : (
                savedIdeas.map((idea) => (
                  <div key={idea.id} className="p-3 border border-[var(--color-border)] text-sm" style={{ backgroundColor: "var(--color-base)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 font-mono uppercase" style={{ backgroundColor: "rgba(199, 91, 57, 0.08)", color: "var(--accent)" }}>
                        {idea.platform}
                      </span>
                    </div>
                    <p className="font-medium text-sm" style={{ color: "var(--text-primary)" }}>{idea.title}</p>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "rgba(255, 255, 255, 0.5)" }}>{idea.description}</p>
                  </div>
                ))
              )}
            </>
          )}

          {sidebarTab === "drafts" && (
            <>
              <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                Posts planifiés ({draftedPosts.length})
              </p>
              {draftedPosts.length === 0 ? (
                <p className="text-xs" style={{ color: "rgba(255, 255, 255, 0.375)" }}>Aucun brouillon</p>
              ) : (
                draftedPosts.map((post) => (
                  <div key={post.id} className="p-3 border border-[var(--color-border)] text-sm" style={{ backgroundColor: "var(--color-base)" }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] px-1.5 py-0.5 font-mono uppercase" style={{ backgroundColor: "rgba(199, 91, 57, 0.08)", color: "var(--accent)" }}>
                        {post.platform}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5" style={{ backgroundColor: "rgba(255, 255, 255, 0.06)", color: "rgba(255, 255, 255, 0.375)" }}>
                        {post.status}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2" style={{ color: "var(--text-primary)" }}>{post.caption}</p>
                    <p className="text-[10px] mt-1" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                      {new Date(post.scheduled_for).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  // ─── Main Render ──────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      {/* Left: Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="p-4 border border-[var(--color-border)] mb-4" style={{ backgroundColor: "var(--color-card)" }}>
                <span className="text-4xl">📝</span>
              </div>
              <p className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Content Strategist
              </p>
              <p className="text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                Je t&apos;aide à planifier, optimiser et programmer tes contenus
              </p>
              <p className="text-sm mb-8" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                Pose-moi une question ou clique sur une action rapide →
              </p>
            </div>
          )}

          {messages.map(renderMessage)}

          {/* Live tool calls */}
          {loading && currentTools.length > 0 && (
            <div className="flex gap-3">
              <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
                <span>📝</span>
              </div>
              <div className="space-y-1">
                {currentTools.map((tool, i) => {
                  const Icon = toolIcons[tool] ?? Sparkles;
                  return (
                    <div key={i} className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium border border-[var(--color-border)] animate-pulse" style={{ backgroundColor: "var(--color-card)" }}>
                      <Icon size={10} style={{ color: "rgba(199, 91, 57, 0.5)" }} />
                      <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>{toolLabels[tool] ?? tool}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Loading dots */}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
                <span>📝</span>
              </div>
              <div className="border border-[var(--color-border)] px-4 py-3" style={{ backgroundColor: "var(--color-card)" }}>
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 animate-pulse rounded-full" style={{ backgroundColor: "var(--accent)" }} />
                  <span className="w-1.5 h-1.5 animate-pulse rounded-full [animation-delay:150ms]" style={{ backgroundColor: "var(--accent)" }} />
                  <span className="w-1.5 h-1.5 animate-pulse rounded-full [animation-delay:300ms]" style={{ backgroundColor: "var(--accent)" }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 border border-[#C44536]/30 text-sm" style={{ backgroundColor: "#C4453610", color: "var(--danger)" }}>
              {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="mt-2 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Pose ta question..."
              disabled={loading}
              className="flex-1 bg-transparent border-b border-[var(--color-border)] py-3 text-lg placeholder:opacity-30 focus:outline-none focus:border-[var(--or, #D8A95B)] transition-colors disabled:opacity-40"
              style={{ color: "var(--text-primary)" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="opacity-40 hover:opacity-100 transition-opacity disabled:opacity-20"
              style={{ color: "var(--accent)" }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="border-l border-[var(--color-border)] px-2 flex items-center hover:opacity-70 transition-opacity"
        style={{ backgroundColor: "var(--color-card)" }}
        title={sidebarOpen ? "Fermer le panneau" : "Ouvrir le panneau"}
      >
        {sidebarOpen ? <PanelRightClose size={14} style={{ color: "rgba(255, 255, 255, 0.375)" }} /> : <PanelRightOpen size={14} style={{ color: "rgba(255, 255, 255, 0.375)" }} />}
      </button>

      {/* Right sidebar */}
      {renderSidebar()}
    </div>
  );
}
