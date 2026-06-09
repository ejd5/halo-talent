"use client";

import { useState, useRef, useEffect } from "react";
import {
  Heart, Moon, Sun, Coffee, Activity, Brain,
  Wind, Footprints, MessageCircle, Send,
  Sparkles, AlertTriangle, ChevronRight,
  PanelRightClose, PanelRightOpen,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
  id?: string;
};

const QUICK_ACTIONS = [
  { icon: Heart, label: "Check-in quotidien", prompt: "Check-in quotidien : je me sens 7/10, bien dormi, 6h de travail" },
  { icon: Activity, label: "Mon score bien-être", prompt: "Quel est mon score bien-être aujourd'hui ?" },
  { icon: Coffee, label: "Pause suggérée", prompt: "Suggère-moi une pause de 15 minutes" },
  { icon: Moon, label: "Analyse sommeil", prompt: "Analyse mon sommeil de cette semaine" },
  { icon: Wind, label: "Déconnexion", prompt: "Je me sens fatigué, donne-moi des conseils" },
  { icon: Footprints, label: "Burnout check", prompt: "Est-ce que je risque le burnout ? Analyse mon rythme" },
];

export function WellnessCoachChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: msg, id: crypto.randomUUID() }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/dashboard/agents/wellness/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.message || "Prends soin de toi 🌱", id: crypto.randomUUID() }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Désolé, je n'ai pas pu répondre. N'oublie pas de faire une pause 🌱", id: crypto.randomUUID() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)]">
      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="p-4 border border-[var(--color-border)] mb-4" style={{ backgroundColor: "var(--color-card)" }}>
                <span className="text-4xl">🌱</span>
              </div>
              <p className="text-base font-semibold mb-2" style={{ color: "#FFFFFF" }}>Wellness Coach</p>
              <p className="text-sm mb-1" style={{ color: "#FFFFFF" }}>
                Je veille sur ton équilibre. Comment te sens-tu aujourd&apos;hui ?
              </p>
              <p className="text-sm mb-6" style={{ color: "#FFFFFF60" }}>
                Fais un check-in rapide ou demande un conseil
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0 mt-1" style={{ backgroundColor: "var(--color-card)" }}>
                  <span>🌱</span>
                </div>
              )}
              <div className={`px-4 py-3 text-base leading-relaxed whitespace-pre-wrap max-w-xl ${
                msg.role === "user" ? "text-white" : "border border-[var(--color-border)]"
              }`}
                style={msg.role === "user" ? { backgroundColor: "var(--color-accent)" } : { backgroundColor: "var(--color-card)" }}
              >
                <span style={{ color: "#FFFFFF" }}>{msg.content}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 border border-[var(--color-border)] flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
                <span>🌱</span>
              </div>
              <div className="border border-[var(--color-border)] px-4 py-3" style={{ backgroundColor: "var(--color-card)" }}>
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 animate-pulse rounded-full" style={{ backgroundColor: "#10B981" }} />
                  <span className="w-1.5 h-1.5 animate-pulse rounded-full [animation-delay:150ms]" style={{ backgroundColor: "#10B981" }} />
                  <span className="w-1.5 h-1.5 animate-pulse rounded-full [animation-delay:300ms]" style={{ backgroundColor: "#10B981" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className="mt-2 pt-4 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Comment te sens-tu ?"
              disabled={loading}
              className="flex-1 bg-transparent border-b border-[var(--color-border)] py-3 text-lg placeholder:opacity-30 focus:outline-none focus:border-[#10B981] transition-colors disabled:opacity-40"
              style={{ color: "#FFFFFF" }}
            />
            <button onClick={() => handleSend()} disabled={!input.trim() || loading} className="opacity-40 hover:opacity-100 transition-opacity disabled:opacity-20" style={{ color: "#10B981" }}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="border-l border-[var(--color-border)] px-2 flex items-center hover:opacity-70 transition-opacity" style={{ backgroundColor: "var(--color-card)" }}>
        {sidebarOpen ? <PanelRightClose size={14} style={{ color: "#FFFFFF60" }} /> : <PanelRightOpen size={14} style={{ color: "#FFFFFF60" }} />}
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 border-l border-[var(--color-border)] flex flex-col shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="p-4 border-b border-[var(--color-border)]" style={{ backgroundColor: "#10B98108" }}>
            <div className="flex items-center gap-2 mb-1">
              <Brain size={14} style={{ color: "#10B981" }} />
              <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "#FFFFFF" }}>Actions rapides</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={() => handleSend(action.prompt)}
                  disabled={loading}
                  className="flex items-center gap-2.5 w-full p-2.5 text-left text-xs border border-[var(--color-border)] transition-all hover:border-[#10B981]/40 disabled:opacity-40"
                  style={{ backgroundColor: "var(--color-base)" }}
                >
                  <div className="w-7 h-7 flex items-center justify-center shrink-0 rounded-full" style={{ backgroundColor: "#10B98115" }}>
                    <Icon size={13} style={{ color: "#10B981" }} />
                  </div>
                  <span style={{ color: "#FFFFFF" }}>{action.label}</span>
                </button>
              );
            })}
          </div>
          <div className="p-3 border-t border-[var(--color-border])">
            <p className="text-[8px]" style={{ color: "#FFFFFF30" }}>
              En cas d&apos;urgence : 3114 (prévention suicide) · 15 (SAMU) · 09 72 39 40 50 (SOS Amitié)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
