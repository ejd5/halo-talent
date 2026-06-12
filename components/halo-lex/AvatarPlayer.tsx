"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";
import type { AvatarState } from "@/lib/halo-lex/avatar/types";

interface AvatarPlayerProps {
  sessionToken: string;
  onMessage?: (text: string) => void;
  onStateChange?: (state: AvatarState) => void;
  voiceEnabled?: boolean;
  className?: string;
}

export function AvatarPlayer({
  sessionToken,
  onMessage,
  onStateChange,
  voiceEnabled = true,
  className = "",
}: AvatarPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<AvatarState>("connecting");
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateState = useCallback(
    (newState: AvatarState) => {
      setState(newState);
      onStateChange?.(newState);
    },
    [onStateChange]
  );

  useEffect(() => {
    if (!sessionToken) {
      updateState("idle");
      return;
    }

    let anam: { disconnect: () => void } | null = null;

    async function connect() {
      try {
        const { createClient } = await import("@anam-ai/js-sdk");
        const AnamEvent = (await import("@anam-ai/js-sdk")).AnamEvent as any;
        const client: any = createClient(sessionToken);

        client.addListener(AnamEvent.CONNECTION_ESTABLISHED, () => updateState("idle"));
        client.addListener(AnamEvent.AVATAR_STARTED_SPEAKING, () => updateState("speaking"));
        client.addListener(AnamEvent.AVATAR_STOPPED_SPEAKING, () => updateState("idle"));
        client.addListener(AnamEvent.USER_STARTED_SPEAKING, () => updateState("listening"));

        client.addListener(AnamEvent.MESSAGE_HISTORY_UPDATED, (history: { role: string; content: string }[]) => {
          const last = history[history.length - 1];
          if (last?.role === "assistant") onMessage?.(last.content);
        });

        if (videoRef.current && audioRef.current) {
          client.streamToVideoAndAudioElements(videoRef.current, audioRef.current);
        }

        anam = client;
      } catch (err) {
        console.warn("Anam.ai connection failed, using fallback:", err);
        updateState("idle");
      }
    }

    connect();

    return () => {
      anam?.disconnect();
    };
  }, [sessionToken, updateState, onMessage]);

  const stateLabel = {
    connecting: "Connexion…",
    idle: "En direct",
    listening: "Lex écoute",
    speaking: "Lex parle",
    thinking: "Lex réfléchit",
  }[state];

  const stateColor = {
    connecting: "#D4A24C",
    idle: "rgb(34,197,94)",
    listening: "var(--accent)",
    speaking: "var(--accent)",
    thinking: "#D4A24C",
  }[state];

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
    >
      {/* Video element */}
      <video ref={videoRef} autoPlay playsInline muted={muted} className="w-full h-full object-cover" />
      <audio ref={audioRef} autoPlay style={{ display: voiceEnabled && !muted ? "block" : "none" }} />

      {/* Status badge */}
      <div
        className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 text-xs font-medium"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: stateColor,
            animation: state === "speaking" || state === "listening" ? "pulse 1.5s infinite" : "none",
          }}
        />
        <span style={{ color: "var(--text-primary)" }}>{stateLabel}</span>
      </div>

      {/* Identity badge */}
      <div
        className="absolute bottom-3 left-3 px-3 py-2"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
          Lex
        </div>
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Conseiller juridique IA
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-3 right-3 flex gap-2">
        <button
          onClick={() => setMuted(!muted)}
          className="p-2 transition-opacity hover:opacity-80"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        >
          {muted ? <VolumeX size={16} style={{ color: "var(--text-secondary)" }} /> : <Volume2 size={16} style={{ color: "var(--text-primary)" }} />}
        </button>
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              containerRef.current?.requestFullscreen();
              setFullscreen(true);
            } else {
              document.exitFullscreen();
              setFullscreen(false);
            }
          }}
          className="p-2 transition-opacity hover:opacity-80"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
        >
          {fullscreen ? <Minimize2 size={16} style={{ color: "var(--text-secondary)" }} /> : <Maximize2 size={16} style={{ color: "var(--text-primary)" }} />}
        </button>
      </div>

      {/* Connecting overlay */}
      {state === "connecting" && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--bg-card)" }}>
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Connexion de Lex…</span>
          </div>
        </div>
      )}
    </div>
  );
}
