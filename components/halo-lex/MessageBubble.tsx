"use client";

import { Bot, User, BookOpen } from "lucide-react";
import { useState } from "react";
import type { LexMessage, SourceCitation, SuggestedAction } from "@/lib/halo-lex/types";
import { SourcesModal } from "./SourcesModal";

interface MessageBubbleProps {
  message: LexMessage;
  sources?: SourceCitation[];
  actions?: SuggestedAction[];
  onAction?: (action: string) => void;
  onEdit?: () => void;
}

export function MessageBubble({ message, sources = [], actions = [], onAction, onEdit }: MessageBubbleProps) {
  const [showSources, setShowSources] = useState(false);
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: isUser ? "var(--accent)" : "rgba(255,255,255,0.08)" }}
      >
        {isUser ? <User size={14} style={{ color: "var(--text-primary)" }} /> : <Bot size={14} style={{ color: "var(--text-secondary)" }} />}
      </div>

      {/* Content */}
      <div className={`max-w-[80%] space-y-2 ${isUser ? "items-end" : ""}`}>
        {/* Name */}
        <p className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
          {isUser ? "Vous" : "Lex"}
        </p>

        {/* Bubble */}
        <div
          className="px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap"
          style={{
            background: isUser ? "var(--accent)" : "var(--bg-card)",
            border: isUser ? "none" : "1px solid var(--border-default)",
            color: isUser ? "var(--text-primary)" : "var(--text-primary)",
          }}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        {message.timestamp && (
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            {new Date(message.timestamp).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </p>
        )}

        {/* Sources button */}
        {!isUser && sources.length > 0 && (
          <button
            onClick={() => setShowSources(true)}
            className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
            style={{ color: "var(--accent)" }}
          >
            <BookOpen size={12} />
            {sources.length} source{sources.length > 1 ? "s" : ""}
          </button>
        )}

        {/* Action buttons */}
        {!isUser && actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={() => onAction?.(a.action)}
                className="px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
                style={{ background: "rgba(199,91,57,0.1)", border: "1px solid rgba(199,91,57,0.3)", color: "var(--accent)" }}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        {/* Edit button for user messages */}
        {isUser && onEdit && (
          <button onClick={onEdit} className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-secondary)" }}>
            Modifier
          </button>
        )}
      </div>

      {/* Sources modal */}
      {showSources && <SourcesModal sources={sources} onClose={() => setShowSources(false)} />}
    </div>
  );
}
