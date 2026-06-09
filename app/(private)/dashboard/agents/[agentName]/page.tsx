"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bot, Send, Plus, ArrowLeft, Sparkles, Loader2,
  Database, Globe, PenLine, BarChart3, MessageCircle, TrendingUp,
} from "lucide-react";
import { AGENT_LABELS, AGENT_EMOJIS, AGENT_DESCRIPTIONS } from "@/lib/agents/constants";
import type { AgentName } from "@/lib/agents/constants";
import { ContentStrategistChat } from "@/components/dashboard/ContentStrategistChat";
import { PricingAdvisorChat } from "@/components/dashboard/PricingAdvisorChat";
import { EngagementHelperChat } from "@/components/dashboard/EngagementHelperChat";
import { TrendSpotterChat } from "@/components/dashboard/TrendSpotterChat";
import { WellnessCoachChat } from "@/components/dashboard/WellnessCoachChat";

const toolIcons: Record<string, React.ElementType> = {
  get_creator_profile: Database,
  get_creator_revenues: BarChart3,
  get_creator_accounts: Globe,
  get_creator_posts: PenLine,
  get_creator_contracts: Database,
  get_creator_messages: MessageCircle,
  get_creator_goals: TrendingUp,
  sync_platform_account: Globe,
  get_platform_insights: BarChart3,
  get_trending_topics: TrendingUp,
  generate_content_ideas: PenLine,
  generate_caption: PenLine,
  draft_dm_response: MessageCircle,
};

const toolLabels: Record<string, string> = {
  get_creator_profile: "Consulte votre profil...",
  get_creator_revenues: "Analyse tes revenus...",
  get_creator_accounts: "Vérifie tes plateformes...",
  get_creator_posts: "Regarde tes publications...",
  get_creator_messages: "Consulte tes messages...",
  get_creator_goals: "Vérifie tes objectifs...",
  sync_platform_account: "Sync plateforme...",
  get_platform_insights: "Analyse les performances...",
  get_trending_topics: "Cherche les tendances...",
  generate_content_ideas: "Génère des idées...",
  generate_caption: "Rédige un caption...",
  draft_dm_response: "Drafte une réponse...",
};

type Message = {
  role: "user" | "assistant";
  content: string;
  toolCalls?: { tool: string; input: any }[];
};

export default function AgentChatPage({
  params,
}: {
  params: Promise<{ agentName: string }>;
}) {
  const { agentName } = use(params);
  const router = useRouter();

  const validAgent = (["content", "analytics", "engagement", "trends", "pricing", "wellness"] as string[]).includes(agentName);
  const agent = agentName as AgentName;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentToolCalls, setCurrentToolCalls] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentToolCalls]);

  if (!validAgent) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Link href="/dashboard/agents" className="text-sm opacity-80 hover:opacity-100 flex items-center gap-1 mb-2">
            <ArrowLeft size={12} /> Retour aux agents
          </Link>
          <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Agent inconnu</h1>
          <p className="text-sm opacity-40 mt-1">Cet agent n&apos;existe pas.</p>
        </div>
      </div>
    );
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);
    setCurrentToolCalls([]);

    try {
      const res = await fetch(`/api/dashboard/agents/${agent}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, conversationId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la génération");

      // Show tool calls as they happen (simulated)
      if (data.toolCalls?.length > 0) {
        setCurrentToolCalls(data.toolCalls.map((tc: any) => tc.tool));
        // Clear after a delay
        setTimeout(() => setCurrentToolCalls([]), 1000);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          toolCalls: data.toolCalls,
        },
      ]);

      if (data.conversationId) {
        // The conversation ID is embedded in the agent, but we'd get it from agent.chat
        // For now, we use a simple approach — we can extend later
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const newConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  const suggestions = agent === "content"
    ? ["Donne-moi 5 idées de contenu pour cette semaine", "Optimise mon dernier post Instagram", "Quel est le meilleur moment pour poster ?"]
    : agent === "analytics"
    ? ["Analyse mes revenus du mois", "Quelle est ma croissance ?", "Prédis mon revenu du mois prochain"]
    : agent === "engagement"
    ? ["Drafte une réponse à ce DM", "Comment améliorer mon taux d'engagement ?", "Crée un template de bienvenue"]
    : agent === "trends"
    ? ["Quelles sont les tendances du moment ?", "Analyse mon concurrent", "Que postent les créateurs similaires ?"]
    : agent === "pricing"
    ? ["Que devrais-je facturer pour mon abonnement ?", "Optimise mes prix PPV", "Compare-moi au marché"]
    : ["Comment réduire mon stress ?", "Schedule une pause dans 2h", "Donne-moi des conseils équilibre"];

  // Specialized UI for Content Strategist
  if (agent === "content") {
    return <ContentStrategistChat />;
  }

  // Specialized UI for Pricing Advisor with simulator
  if (agent === "pricing") {
    return <PricingAdvisorChat />;
  }

  // Specialized UI for Engagement Helper with DM management
  if (agent === "engagement") {
    return <EngagementHelperChat />;
  }

  // Specialized UI for Trend Spotter with trend feed
  if (agent === "trends") {
    return <TrendSpotterChat />;
  }

  // Specialized UI for Wellness Coach
  if (agent === "wellness") {
    return <WellnessCoachChat />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <Link href="/dashboard/agents" className="text-sm flex items-center gap-1 mb-1 transition-colors" style={{ color: "#FFFFFF" }}>
            <ArrowLeft size={10} /> Tous les agents
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 border border-[var(--color-border)] flex items-center justify-center text-xl" style={{ backgroundColor: "var(--color-card)" }}>
              <span>{AGENT_EMOJIS[agent]}</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
                {AGENT_LABELS[agent]}
              </h1>
              <p className="text-base" style={{ color: "#FFFFFF" }}>{AGENT_DESCRIPTIONS[agent]}</p>
            </div>
          </div>
        </div>
        <button
          onClick={newConversation}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors" style={{ color: "#FFFFFF" }}
        >
          <Plus size={12} /> Nouvelle conversation
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-4 border border-[var(--color-border)] mb-4" style={{ backgroundColor: "var(--color-card)" }}>
              <span className="text-3xl">{AGENT_EMOJIS[agent]}</span>
            </div>
            <p className="text-sm mb-1 max-w-md" style={{ color: "#FFFFFF" }}>
              {AGENT_DESCRIPTIONS[agent]}
            </p>
            <p className="text-sm mb-6" style={{ color: "#FFFFFF" }}>Agent {AGENT_LABELS[agent]}</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); }}
                  className="px-3 py-2 text-sm border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-all" style={{ color: "#FFFFFF" }}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0 mt-1" style={{ backgroundColor: "var(--color-card)" }}>
                <span>{AGENT_EMOJIS[agent]}</span>
              </div>
            )}

            <div className="max-w-xl">
              {/* Tool calls indicator */}
              {msg.toolCalls && msg.toolCalls.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1.5">
                  {msg.toolCalls.map((tc, j) => {
                    const Icon = toolIcons[tc.tool] ?? Bot;
                    return (
                      <span key={j} className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-medium border border-[var(--color-border)] bg-[var(--color-card)]">
                        <Icon size={8} className="opacity-40" />
                        {toolLabels[tc.tool] ?? tc.tool}
                      </span>
                    );
                  })}
                </div>
              )}

              <div className={`px-4 py-3 text-base leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "text-white"
                  : "border border-[var(--color-border)]"
              }`}
                style={msg.role === "user" ? { backgroundColor: "var(--color-accent)" } : { backgroundColor: "var(--color-card)" }}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}

        {/* Live tool calls indicator */}
        {loading && currentToolCalls.length > 0 && (
          <div className="flex gap-3">
            <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
              <span>{AGENT_EMOJIS[agent]}</span>
            </div>
            <div className="space-y-1">
              {currentToolCalls.map((tool, i) => {
                const Icon = toolIcons[tool] ?? Bot;
                return (
                  <div key={i} className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium border border-[var(--color-border)] animate-pulse" style={{ backgroundColor: "var(--color-card)" }}>
                    <Icon size={10} className="opacity-40" />
                    {toolLabels[tool] ?? tool}
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
              <span>{AGENT_EMOJIS[agent]}</span>
            </div>
            <div className="border border-[var(--color-border)] px-4 py-3" style={{ backgroundColor: "var(--color-card)" }}>
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 opacity-40 animate-pulse" style={{ backgroundColor: "var(--color-accent)" }} />
                <span className="w-1.5 h-1.5 opacity-40 animate-pulse [animation-delay:150ms]" style={{ backgroundColor: "var(--color-accent)" }} />
                <span className="w-1.5 h-1.5 opacity-40 animate-pulse [animation-delay:300ms]" style={{ backgroundColor: "var(--color-accent)" }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 border border-[#C44536]/30 text-sm text-[#C44536]" style={{ backgroundColor: "#C4453610" }}>
            {error}
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={`Posez une question à ${AGENT_LABELS[agent]}...`}
            disabled={loading}
            className="flex-1 bg-transparent border-b border-[var(--color-border)] py-3 text-lg placeholder:opacity-30 focus:outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-40"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="opacity-40 hover:opacity-100 transition-opacity disabled:opacity-20"
            style={{ color: "var(--color-accent)" }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
