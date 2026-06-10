"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Image, DollarSign, FileText, Mic, Settings2 } from "lucide-react";
import { ToneGuardBadge } from "./ToneGuardBadge";
import { ToneGuardBanner } from "./ToneGuardBanner";
import type { ToneCheckResult } from "@/lib/chat-copilot/types";

export function ChatInput({
  onSendMessage,
  onAttachMedia,
  onSendPPV,
  onUseScript,
  onRecordAudio,
  onOpenToneGuardSettings,
  disabled,
  autoFocus,
  toneCheck,
}: {
  onSendMessage: (text: string) => void;
  onAttachMedia: () => void;
  onSendPPV: () => void;
  onUseScript: () => void;
  onRecordAudio: () => void;
  onOpenToneGuardSettings?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
  toneCheck?: ToneCheckResult | null;
}) {
  const [text, setText] = useState("");
  const [bannerOverride, setBannerOverride] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
    }
  }, [text]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    // Block send if tone check is blocking (overrides not allowed for blocking)
    if (toneCheck?.overall === "blocking") return;
    onSendMessage(trimmed);
    setText("");
    setBannerOverride(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--bg-surface)",
    border: "1px solid var(--border-default)",
    color: "var(--text-primary)",
    borderRadius: "10px",
    fontSize: "13px",
  };

  return (
    <div className="px-3 py-2" style={{ borderTop: "1px solid var(--border-default)" }}>
      {/* Action buttons above input */}
      <div className="flex items-center gap-1 mb-1.5">
        <ActionButton icon={Image} label="Media" onClick={onAttachMedia} disabled={disabled} />
        <ActionButton icon={DollarSign} label="PPV" onClick={onSendPPV} disabled={disabled} />
        <ActionButton icon={FileText} label="Script" onClick={onUseScript} disabled={disabled} />
        <ActionButton icon={Mic} label="Audio" onClick={onRecordAudio} disabled={disabled} />
      </div>

      {/* Tone Guard banner */}
      {toneCheck && toneCheck.overall !== "pass" && !bannerOverride && (
        <ToneGuardBanner
          result={toneCheck}
          onDismiss={() => setBannerOverride(true)}
          onOverride={() => {
            if (toneCheck.overall === "warning") {
              setBannerOverride(true);
            }
          }}
        />
      )}

      {/* Settings toggle + Input row */}
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Chargement..." : "Écrivez votre message..."}
          rows={1}
          disabled={disabled}
          className="flex-1 resize-none outline-none px-3 py-2 leading-relaxed"
          style={inputStyle}
        />
        <div className="flex items-center gap-1">
          {onOpenToneGuardSettings && (
            <button
              onClick={onOpenToneGuardSettings}
              className="flex items-center justify-center shrink-0 transition-opacity"
              style={{
                width: 28,
                height: 28,
                borderRadius: "6px",
                color: "var(--text-tertiary)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--bg-hover)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
              title="Paramètres Tone Guard"
            >
              <Settings2 size={11} />
            </button>
          )}
          <ToneGuardBadge result={toneCheck || null} messageText={text} />
          <button
            onClick={handleSend}
            disabled={!text.trim() || disabled || toneCheck?.overall === "blocking"}
            className="flex items-center justify-center shrink-0 transition-opacity"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              backgroundColor: text.trim() && !disabled && toneCheck?.overall !== "blocking" ? "var(--accent)" : "var(--border-default)",
              color: text.trim() && !disabled && toneCheck?.overall !== "blocking" ? "#fff" : "var(--text-tertiary)",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium transition-colors"
      style={{
        color: disabled ? "var(--text-tertiary)" : "var(--text-secondary)",
        borderRadius: "6px",
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = "var(--bg-hover)";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Icon size={12} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
