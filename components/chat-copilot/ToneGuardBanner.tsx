"use client";

import { AlertTriangle, Ban, RefreshCw, ShieldCheck } from "lucide-react";
import type { ToneCheckResult } from "@/lib/chat-copilot/types";

export function ToneGuardBanner({
  result,
  onDismiss,
  onOverride,
}: {
  result: ToneCheckResult | null;
  onDismiss: () => void;
  onOverride: () => void;
}) {
  if (!result || result.overall === "pass") return null;

  const isBlocking = result.overall === "blocking";
  const firstWarning = result.warnings[0];

  return (
    <div
      className="flex items-start gap-2 px-3 py-1.5 text-[10px] leading-relaxed animate-in slide-in-from-bottom-1"
      style={{
        backgroundColor: isBlocking ? "var(--danger-bg, #2d1b1b)" : "var(--warning-bg, #2d2515)",
        borderTop: `1px solid ${isBlocking ? "var(--danger, #c44536)" : "var(--warning, #d4a017)"}`,
        color: isBlocking ? "var(--danger-text, #f5a5a5)" : "var(--warning-text, #f5d98a)",
      }}
    >
      {isBlocking ? <Ban size={12} className="shrink-0 mt-0.5" /> : <AlertTriangle size={12} className="shrink-0 mt-0.5" />}

      <div className="flex-1 min-w-0">
        <p className="font-medium text-[10px]">
          {isBlocking ? "Message bloqué" : "Attention vérification"}
        </p>
        {result.warnings.length === 1 ? (
          <p className="mt-0.5 opacity-90">{firstWarning.message}</p>
        ) : (
          <ul className="mt-0.5 space-y-0.5 list-disc list-inside opacity-90">
            {result.warnings.map((w, i) => (
              <li key={i}>{w.message}</li>
            ))}
          </ul>
        )}
        {result.scores && firstWarning?.score !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            <div
              className="h-1 rounded-full flex-1 max-w-[100px]"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <div
                className="h-1 rounded-full"
                style={{
                  width: `${firstWarning.score}%`,
                  backgroundColor: firstWarning.score < 30 ? "var(--danger, #c44536)"
                    : firstWarning.score < 60 ? "var(--warning, #d4a017)"
                    : "var(--success, #7a9a65)",
                }}
              />
            </div>
            <span className="text-[8px] opacity-70">Score : {firstWarning.score}%</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {!isBlocking && (
          <button
            onClick={onOverride}
            className="flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium rounded transition-opacity"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: isBlocking ? "var(--danger-text)" : "var(--warning-text)",
            }}
          >
            <ShieldCheck size={9} />
            Envoyer quand même
          </button>
        )}
        <button
          onClick={onDismiss}
          className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] rounded transition-opacity"
          style={{ color: isBlocking ? "var(--danger-text)" : "var(--warning-text)", opacity: 0.6 }}
        >
          <RefreshCw size={9} />
          Modifier
        </button>
      </div>
    </div>
  );
}
