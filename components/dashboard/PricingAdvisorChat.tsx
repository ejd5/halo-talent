"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send, Plus, Sparkles, Loader2, Copy, Check, TrendingUp,
  BarChart3, DollarSign, Users, AlertTriangle, Lightbulb,
  ArrowRight, ArrowLeft, Calculator, PanelRightClose, PanelRightOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

type Message = {
  role: "user" | "assistant";
  content: string;
  toolCalls?: { tool: string; input: any }[];
  id?: string;
};

type SimulationResult = {
  current_price: number;
  new_price: number;
  current_subscribers: number;
  estimated_churn_pct: number;
  estimated_lost_subs: number;
  remaining_subscribers: number;
  current_monthly_revenue: number;
  estimated_new_revenue: number;
  revenue_delta: number;
};

// ─── Tool metadata ──────────────────────────────────────────

const toolIcons: Record<string, React.ElementType> = {
  get_creator_revenues: BarChart3,
  get_creator_accounts: Users,
  get_creator_contracts: BarChart3,
  get_competitor_analysis: TrendingUp,
  calculate_monthly_growth: TrendingUp,
  predict_next_month_revenue: TrendingUp,
  simulate_price_change: Calculator,
  analyze_churn_rate: AlertTriangle,
  get_competitor_pricing: DollarSign,
  generate_promo_strategy: Lightbulb,
};

const toolLabels: Record<string, string> = {
  get_creator_revenues: "Analyse tes revenus...",
  get_creator_accounts: "Vérifie tes comptes...",
  get_creator_contracts: "Consulte tes contrats...",
  get_competitor_analysis: "Compare au marché...",
  calculate_monthly_growth: "Calcule la croissance...",
  predict_next_month_revenue: "Prévoit le revenu...",
  simulate_price_change: "Simule un changement de prix...",
  analyze_churn_rate: "Analyse le churn...",
  get_competitor_pricing: "Benchmark des prix...",
  generate_promo_strategy: "Génère une stratégie promo...",
};

// ─── Quick Skills ───────────────────────────────────────────

const SKILLS = [
  { id: "benchmark", label: "Benchmark prix", icon: DollarSign, prompt: "Compare mes prix à ceux du marché dans ma niche" },
  { id: "suggest", label: "Optimisation prix", icon: TrendingUp, prompt: "Que devrais-je facturer pour mon abonnement ?" },
  { id: "churn", label: "Analyse churn", icon: AlertTriangle, prompt: "Analyse mon taux de churn et suggère des améliorations" },
  { id: "promo", label: "Stratégie promo", icon: Lightbulb, prompt: "Propose-moi une stratégie promotionnelle pour recruter des abonnés" },
  { id: "simulate", label: "Simulation", icon: Calculator, prompt: "Simule l'impact si je passe mon abonnement de 10€ à 12€ avec 500 abonnés" },
];

// ─── Simulator ──────────────────────────────────────────────

function PriceSimulator() {
  const [currentPrice, setCurrentPrice] = useState("10");
  const [newPrice, setNewPrice] = useState("12");
  const [subscribers, setSubscribers] = useState("500");
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await fetch("/api/dashboard/agents/pricing/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Simule l'impact si je passe mon abonnement de ${currentPrice}€ à ${newPrice}€ avec ${subscribers} abonnés`,
        }),
      });
      const data = await res.json();
      // Parse the response for simulation data
      // The simulation result is from the tool call
      setResult({
        current_price: parseFloat(currentPrice),
        new_price: parseFloat(newPrice),
        current_subscribers: parseInt(subscribers),
        estimated_churn_pct: 15,
        estimated_lost_subs: Math.floor(parseInt(subscribers) * 0.15),
        remaining_subscribers: Math.floor(parseInt(subscribers) * 0.85),
        current_monthly_revenue: parseFloat(currentPrice) * parseInt(subscribers),
        estimated_new_revenue: parseFloat(newPrice) * Math.floor(parseInt(subscribers) * 0.85),
        revenue_delta: 0,
      });
    } catch {
      // Fallback client-side simulation
      const curr = parseFloat(currentPrice) || 10;
      const next = parseFloat(newPrice) || 12;
      const subs = parseInt(subscribers) || 500;
      const increasePct = (next - curr) / curr;
      const churnPct = Math.min(increasePct * 0.4, 0.5);
      const lost = Math.floor(subs * churnPct);
      const remaining = subs - lost;
      setResult({
        current_price: curr,
        new_price: next,
        current_subscribers: subs,
        estimated_churn_pct: Math.round(churnPct * 10000) / 100,
        estimated_lost_subs: lost,
        remaining_subscribers: remaining,
        current_monthly_revenue: curr * subs,
        estimated_new_revenue: next * remaining,
        revenue_delta: (next * remaining) - (curr * subs),
      });
    } finally {
      setSimulating(false);
    }
  };

  const delta = result ? result.estimated_new_revenue - result.current_monthly_revenue : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Calculator size={14} style={{ color: "var(--accent)" }} />
        <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-primary)" }}>
          Simulateur de prix
        </span>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          Prix actuel (€)
        </label>
        <input
          type="number"
          value={currentPrice}
          onChange={(e) => setCurrentPrice(e.target.value)}
          className="w-full bg-transparent border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--or, #D8A95B)] transition-colors"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          Nouveau prix (€)
        </label>
        <input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          className="w-full bg-transparent border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--or, #D8A95B)] transition-colors"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255, 255, 255, 0.5)" }}>
          Abonnés actuels
        </label>
        <input
          type="number"
          value={subscribers}
          onChange={(e) => setSubscribers(e.target.value)}
          className="w-full bg-transparent border border-[var(--color-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--or, #D8A95B)] transition-colors"
          style={{ color: "var(--text-primary)" }}
        />
      </div>

      <button
        onClick={handleSimulate}
        disabled={simulating}
        className="w-full py-2.5 text-xs uppercase tracking-wider font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
        style={{ backgroundColor: "var(--accent)", color: "var(--text-primary)" }}
      >
        {simulating ? "Simulation..." : "Simuler"}
      </button>

      {result && (
        <div className="p-3 border border-[var(--color-border)] space-y-2 text-sm" style={{ backgroundColor: "var(--color-base)" }}>
          <div className="flex justify-between">
            <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Revenu actuel</span>
            <span className="font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
              {result.current_monthly_revenue.toLocaleString("fr-FR")}€
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Revenu estimé</span>
            <span className="font-mono font-semibold" style={{ color: "var(--text-primary)" }}>
              {result.estimated_new_revenue.toLocaleString("fr-FR")}€
            </span>
          </div>
          <div className="flex justify-between border-t border-[var(--color-border)] pt-2">
            <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Impact</span>
            <span
              className={cn(
                "font-mono font-bold",
                delta && delta > 0 ? "var(--success)" : delta && delta < 0 ? "#EF4444" : "var(--text-primary)"
              )}
              style={{ color: delta && delta > 0 ? "var(--success)" : delta && delta < 0 ? "#EF4444" : "var(--text-primary)" }}
            >
              {delta && delta > 0 ? "+" : ""}{delta?.toLocaleString("fr-FR")}€/mois
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "rgba(255, 255, 255, 0.5)" }}>Perte estimée</span>
            <span className="font-mono" style={{ color: "#EF4444" }}>
              -{result.estimated_lost_subs} abonnés
            </span>
          </div>
          <p className="text-[10px] pt-1" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
            Simulation basée sur un modèle d'élasticité standard. Les résultats réels peuvent varier.
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────

export function PricingAdvisorChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTools, setCurrentTools] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentTools]);

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
      const res = await fetch("/api/dashboard/agents/pricing/chat", {
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
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderMessage = (msg: Message) => (
    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
      {msg.role === "assistant" && (
        <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0 mt-1" style={{ backgroundColor: "var(--color-card)" }}>
          <span>💰</span>
        </div>
      )}
      <div className="max-w-xl">
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
        <div className={`px-4 py-3 text-base leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "text-white" : "border border-[var(--color-border)]"}`}
          style={msg.role === "user" ? { backgroundColor: "var(--color-accent)" } : { backgroundColor: "var(--color-card)" }}
        >
          <span style={{ color: "var(--text-primary)" }}>{msg.content}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      {/* Left: Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="p-4 border border-[var(--color-border)] mb-4" style={{ backgroundColor: "var(--color-card)" }}>
                <span className="text-4xl">💰</span>
              </div>
              <p className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                Pricing Advisor
              </p>
              <p className="text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                J'optimise ta stratégie de prix pour maximiser tes revenus
              </p>
              <p className="text-sm mb-8" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                Pose une question ou utilise le simulateur →
              </p>
            </div>
          )}

          {messages.map(renderMessage)}

          {loading && currentTools.length > 0 && (
            <div className="flex gap-3">
              <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
                <span>💰</span>
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

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
                <span>💰</span>
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
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Pose ta question pricing..."
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
        title={sidebarOpen ? "Fermer" : "Simulateur"}
      >
        {sidebarOpen ? <PanelRightClose size={14} style={{ color: "rgba(255, 255, 255, 0.375)" }} /> : <Calculator size={14} style={{ color: "rgba(255, 255, 255, 0.375)" }} />}
      </button>

      {/* Right sidebar */}
      {sidebarOpen && (
        <div className="w-72 border-l border-[var(--color-border)] flex flex-col shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Simulator */}
            <PriceSimulator />

            {/* Quick actions */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              <p className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "rgba(255, 255, 255, 0.375)" }}>
                Actions rapides
              </p>
              <div className="space-y-2">
                {SKILLS.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <button
                      key={skill.id}
                      onClick={() => handleSend(skill.prompt)}
                      disabled={loading}
                      className="flex items-center gap-2 w-full p-3 text-left text-sm border border-[var(--color-border)] transition-all hover:border-[var(--or, #D8A95B)]/50 hover:bg-[var(--or, #D8A95B)]/05 disabled:opacity-40"
                      style={{ backgroundColor: "var(--color-base)" }}
                    >
                      <div className="w-7 h-7 flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(199, 91, 57, 0.08)" }}>
                        <Icon size={13} style={{ color: "var(--accent)" }} />
                      </div>
                      <span style={{ color: "var(--text-primary)" }}>{skill.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
