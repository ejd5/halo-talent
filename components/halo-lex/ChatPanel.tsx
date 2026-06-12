"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, Loader2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { useVoiceInput } from "./useVoiceInput";
import type { LexMessage, SourceCitation, SuggestedAction } from "@/lib/halo-lex/types";

interface ChatPanelProps {
  locale?: string;
  onSendMessage: (text: string) => void;
  messages: LexMessage[];
  isStreaming: boolean;
  streamingText?: string;
  onAction?: (action: string) => void;
}

export function ChatPanel({
  locale = "fr",
  onSendMessage,
  messages,
  isStreaming,
  streamingText,
  onAction,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, toggleListening, supported: voiceSupported } = useVoiceInput({
    locale: locale === "en" ? "en-US" : "fr-FR",
    onResult: (text) => setInput(text),
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingText]);

  useEffect(() => {
    if (messages.length > 1) {
      setSuggestions([]);
    } else {
      setSuggestions(
        locale === "en"
          ? ["What are my rights if my account is suspended?", "Is my agency contract fair?", "How do I challenge a platform decision?"]
          : ["Quels sont mes droits si mon compte est suspendu ?", "Mon contrat d'agence est-il équitable ?", "Comment contester une décision plateforme ?"]
      );
    }
  }, [messages.length, locale]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    onSendMessage(text);
  }, [input, isStreaming, onSendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            message={msg}
            onAction={onAction}
          />
        ))}

        {/* Streaming indicator */}
        {isStreaming && streamingText && (
          <MessageBubble
            message={{ role: "assistant", content: streamingText }}
          />
        )}

        {/* Typing indicator */}
        {isStreaming && !streamingText && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
              <Loader2 size={14} className="animate-spin" style={{ color: "var(--text-secondary)" }} />
            </div>
            <div className="px-4 py-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-secondary)" }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-secondary)", animationDelay: "0.2s" }} />
                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "var(--text-secondary)", animationDelay: "0.4s" }} />
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !isStreaming && (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              {locale === "en" ? "Ask Lex a legal question to get started" : "Posez une question juridique à Lex pour commencer"}
            </p>
          </div>
        )}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length <= 1 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestions.map((q) => (
              <button
                key={q}
                onClick={() => onSendMessage(q)}
                className="shrink-0 px-3 py-1.5 text-xs transition-colors hover:opacity-80"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="p-4" style={{ borderTop: "1px solid var(--border-default)" }}>
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={locale === "en" ? "Ask Lex a legal question..." : "Posez votre question juridique à Lex..."}
            rows={1}
            className="flex-1 px-4 py-3 text-sm outline-none resize-none"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
          />

          {voiceSupported && (
            <button
              onClick={toggleListening}
              className="w-12 h-12 flex items-center justify-center transition-opacity hover:opacity-80"
              style={{
                background: isListening ? "var(--accent)" : "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              {isListening ? <MicOff size={18} style={{ color: "var(--text-primary)" }} /> : <Mic size={18} style={{ color: "var(--text-secondary)" }} />}
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="w-12 h-12 flex items-center justify-center transition-opacity hover:opacity-90 disabled:opacity-30"
            style={{ background: "var(--accent)" }}
          >
            {isStreaming ? (
              <Loader2 size={18} className="animate-spin" style={{ color: "var(--text-primary)" }} />
            ) : (
              <Send size={18} style={{ color: "var(--text-primary)" }} />
            )}
          </button>
        </div>

        <div className="flex justify-between mt-2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
          <span>
            {voiceSupported && isListening
              ? (locale === "en" ? "Voice mode active" : "Mode vocal actif")
              : ""}
          </span>
          <span>{input.length} / 2000</span>
        </div>
      </div>
    </div>
  );
}
