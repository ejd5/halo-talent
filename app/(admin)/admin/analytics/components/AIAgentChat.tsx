"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, X, Sparkles, MessageSquare } from "lucide-react";

const SUGGESTIONS = [
  "Quel est mon créateur le plus rentable ce trimestre ?",
  "Compare les revenus Music vs Sport",
  "Quelle plateforme génère le plus de revenus ?",
  "Quels créateurs sont en baisse ce mois-ci ?",
];

type Message = {
  role: "user" | "assistant";
  content: string;
};

export function AIAgentChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/analytics/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer || "Désolé, je n'ai pas pu traiter votre demande." }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Erreur de connexion. Veuillez réessayer." }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* FAB button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-3 text-white shadow-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          <MessageSquare size={18} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[380px] h-[520px] border border-[var(--color-border)] flex flex-col shadow-xl card-accent"
          style={{ backgroundColor: "var(--color-base)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-2">
              <Bot size={14} className="text-[var(--color-accent)]" />
              <span className="text-xs font-semibold">Agent Analytics IA</span>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 hover:bg-[var(--color-card)] transition-colors">
              <X size={14} />
            </button>
          </div>

          {/* Welcome / Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <Sparkles size={24} className="mx-auto mb-2 opacity-20" />
                <p className="text-xs opacity-40 mb-3">Posez une question sur vos données analytics</p>
                <div className="space-y-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="block w-full text-left px-3 py-2 text-[11px] border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors opacity-70 hover:opacity-100"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "text-white"
                      : "border border-[var(--color-border)]"
                  }`}
                  style={m.role === "user" ? { backgroundColor: "var(--color-accent)" } : {}}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 text-xs border border-[var(--color-border)]">
                  <span className="opacity-40">Réflexion</span>
                  <span className="animate-pulse opacity-40">...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[var(--color-border)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Posez une question..."
                className="flex-1 px-3 py-2 text-xs border border-[var(--color-border)] bg-transparent rounded-[0px] focus:outline-none focus:border-[var(--color-accent)]"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="p-2 text-white disabled:opacity-30 transition-opacity"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
