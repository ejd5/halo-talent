"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Plus } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const suggestions = [
  "Comment optimiser mes prix sur OnlyFans ?",
  "Quelles tendances suivre ce mois-ci ?",
  "Comment améliorer mon engagement Instagram ?",
  "Analyse mes revenus du trimestre",
];

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages, conversationId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la génération");

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      if (data.conversationId) setConversationId(data.conversationId);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2" style={{ fontFamily: "var(--font-display)" }}>
            <Bot size={20} style={{ color: "var(--color-accent)" }} />
            Assistant IA
          </h1>
          <p className="text-xs opacity-40 mt-1">Conseils marketing, stratégie et analytics</p>
        </div>
        <button onClick={handleNewConversation} className="flex items-center gap-1.5 text-[11px] font-medium opacity-40 hover:opacity-100 transition-opacity">
          <Plus size={12} /> Nouvelle conversation
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="p-3 border border-[var(--color-border)] mb-4" style={{ backgroundColor: "var(--color-card)" }}>
              <Bot size={24} style={{ color: "var(--color-accent)" }} />
            </div>
            <p className="text-xs opacity-40 mb-6 max-w-md">
              Posez une question sur votre stratégie, vos revenus, ou demandez des conseils personnalisés.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setInput(s)}
                  className="px-3 py-2 text-[11px] border border-[var(--color-border)] opacity-40 hover:opacity-100 hover:border-[var(--color-accent)]/50 transition-all"
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 border border-[var(--color-border)] flex items-center justify-center shrink-0 mt-1" style={{ backgroundColor: "var(--color-card)" }}>
                <Bot size={14} style={{ color: "var(--color-accent)" }} />
              </div>
            )}
            <div className={`max-w-xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
              msg.role === "user"
                ? "text-white"
                : "border border-[var(--color-border)]"
            }`} style={msg.role === "user" ? { backgroundColor: "var(--color-accent)" } : { backgroundColor: "var(--color-card)" }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 border border-[var(--color-border)] flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-card)" }}>
              <Bot size={14} style={{ color: "var(--color-accent)" }} />
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

        {error && <div className="p-3 border border-[#C44536]/30 text-xs text-[#C44536]" style={{ backgroundColor: "#C4453610" }}>{error}</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Posez votre question..."
            disabled={loading}
            className="flex-1 bg-transparent border-b border-[var(--color-border)] py-2 text-sm placeholder:opacity-30 focus:outline-none focus:border-[var(--color-accent)] transition-colors disabled:opacity-40"
          />
          <button onClick={handleSend} disabled={!input.trim() || loading}
            className="opacity-40 hover:opacity-100 transition-opacity disabled:opacity-20" style={{ color: "var(--color-accent)" }}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
