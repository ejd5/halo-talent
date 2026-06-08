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
        body: JSON.stringify({
          messages: updatedMessages,
          conversationId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la génération");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);

      if (data.conversationId) {
        setConversationId(data.conversationId);
      }
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
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
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-brand-ivory italic flex items-center gap-3">
            <Bot size={28} className="text-brand-gold" />
            Assistant IA
          </h1>
          <p className="text-brand-taupe text-sm mt-1">
            Conseils marketing, stratégie et analytics
          </p>
        </div>
        <button
          onClick={handleNewConversation}
          className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-brand-taupe hover:text-brand-ivory transition-colors"
        >
          <Plus size={14} />
          Nouvelle conversation
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center mb-5">
              <Bot size={28} className="text-brand-gold" />
            </div>
            <p className="text-brand-taupe mb-8 max-w-md">
              Posez une question sur votre stratégie, vos revenus, ou demandez
              des conseils personnalisés.
            </p>
            <div className="flex flex-wrap gap-3 justify-center max-w-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="px-4 py-2 text-xs border border-white/10 text-brand-taupe hover:border-brand-gold/50 hover:text-brand-ivory transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-brand-gold" />
              </div>
            )}
            <div
              className={`max-w-xl px-5 py-4 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-brand-espresso text-brand-ivory"
                  : "border border-white/5 text-brand-taupe"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-brand-gold" />
            </div>
            <div className="border border-white/5 px-5 py-4">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-gold/40 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-brand-gold/40 animate-pulse [animation-delay:150ms]" />
                <span className="w-2 h-2 rounded-full bg-brand-gold/40 animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="border border-brand-alert/30 bg-brand-alert/5 px-5 py-4">
            <p className="text-sm text-brand-alert">{error}</p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Posez votre question..."
            disabled={loading}
            className="flex-1 bg-transparent border-b border-white/10 py-3 text-brand-ivory placeholder:text-brand-taupe/50 text-sm focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-40"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="text-brand-gold hover:text-brand-gold-light transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
