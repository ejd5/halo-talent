"use client";

import { useState, useRef, useEffect } from "react";
import { AlertTriangle, Ban, ShieldCheck } from "lucide-react";
import type { ToneCheckResult } from "@/lib/chat-copilot/types";

export function ToneGuardBadge({
  result,
  messageText,
}: {
  result: ToneCheckResult | null;
  messageText: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [override, setOverride] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip on click outside
  useEffect(() => {
    if (!showTooltip) return;
    const handler = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setShowTooltip(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showTooltip]);

  // Reset override and tooltip when message changes
  useEffect(() => {
    setOverride(false);
    setShowTooltip(false);
  }, [messageText]);

  if (!result || !messageText.trim()) return null;

  const isBlocking = result.overall === "blocking";

  // Pass state — show green verified badge
  if (result.overall === "pass" || override) {
    return (
      <div className="flex items-center gap-1">
        <ShieldCheck size={10} style={{ color: "var(--success)" }} />
        {result.overall === "pass" && (
          <span className="text-[8px]" style={{ color: "var(--success)" }}>
            ✓ Vérifié
          </span>
        )}
        {override && (
          <span className="text-[8px]" style={{ color: "var(--warning-text)" }}>
            Override
          </span>
        )}
      </div>
    );
  }

  // Blocking state — red badge, no override
  if (isBlocking) {
    return (
      <div className="relative" ref={tooltipRef}>
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="flex items-center gap-0.5 px-1 py-0.5 rounded transition-colors cursor-pointer"
          style={{
            backgroundColor: "var(--danger-bg, #2d1b1b)",
            color: "var(--danger-text, #f5a5a5)",
          }}
        >
          <Ban size={10} />
        </button>

        {showTooltip && (
          <div
            className="absolute bottom-full right-0 mb-1.5 w-56 p-2 text-[10px] leading-relaxed z-50"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
              borderRadius: "6px",
              color: "var(--text-primary)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
          >
            <p className="font-semibold mb-1" style={{ color: "var(--danger)" }}>
              Message bloqué
            </p>
            {result.warnings.filter(w => w.severity === "blocking").map((w, i) => (
              <p key={i} className="mb-0.5" style={{ color: "var(--text-secondary)" }}>
                • {w.message}
              </p>
            ))}
            <p className="mt-1 text-[8px]" style={{ color: "var(--text-tertiary)" }}>
              Modifiez le message pour pouvoir l'envoyer.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Warning state — orange badge with override
  return (
    <div className="relative" ref={tooltipRef}>
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="flex items-center gap-0.5 px-1 py-0.5 rounded transition-colors cursor-pointer"
        style={{
          backgroundColor: "var(--warning-bg)",
          color: "var(--warning-text)",
        }}
      >
        <AlertTriangle size={10} />
      </button>

      {showTooltip && (
        <div
          className="absolute bottom-full right-0 mb-1.5 w-56 p-2 text-[10px] leading-relaxed z-50"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            borderRadius: "6px",
            color: "var(--text-primary)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          <p className="font-semibold mb-1" style={{ color: "var(--warning)" }}>
            Attention Tone Guard
          </p>
          {result.warnings.map((w, i) => (
            <p key={i} className="mb-0.5" style={{ color: "var(--text-secondary)" }}>
              • {w.message}
              {w.score !== undefined && (
                <span className="ml-1 text-[8px]" style={{ color: "var(--text-tertiary)" }}>
                  (score {w.score}%)
                </span>
              )}
            </p>
          ))}
          <button
            onClick={() => setOverride(true)}
            className="mt-1.5 w-full text-center py-1 text-[10px] font-medium rounded"
            style={{
              backgroundColor: "var(--warning)",
              color: "#fff",
            }}
          >
            Envoyer quand même (override)
          </button>
        </div>
      )}
    </div>
  );
}
