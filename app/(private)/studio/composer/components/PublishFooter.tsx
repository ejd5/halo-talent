"use client";

import { Save, Clock, Send, Play, CheckCircle, Loader, AlertTriangle } from "lucide-react";
import type { PublishStatus } from "@/lib/studio/types";

interface PublishFooterProps {
  isDirty: boolean;
  lastSaved: Date | null;
  hasPlatforms: boolean;
  hasMedia: boolean;
  publishStatus: PublishStatus;
  onSaveDraft: () => void;
  onSchedule: () => void;
  onPublish: () => void;
  onTest: () => void;
}

export function PublishFooter({
  isDirty,
  lastSaved,
  hasPlatforms,
  hasMedia,
  publishStatus,
  onSaveDraft,
  onSchedule,
  onPublish,
  onTest,
}: PublishFooterProps) {
  const canPublish = hasPlatforms && hasMedia && publishStatus !== "publishing";

  const statusLabel = () => {
    if (publishStatus === "publishing") return "Publication en cours...";
    if (publishStatus === "done") return "Publié avec succès";
    if (publishStatus === "error") return "Erreur de publication";
    if (isDirty) return "Modifications non sauvegardées";
    if (lastSaved) {
      const diff = Math.round((Date.now() - lastSaved.getTime()) / 1000);
      if (diff < 60) return "Sauvegardé à l'instant";
      return `Sauvegardé il y a ${diff}s`;
    }
    return "";
  };

  const StatusIcon = publishStatus === "done" ? CheckCircle : publishStatus === "error" ? AlertTriangle : isDirty ? null : CheckCircle;

  return (
    <div
      className="flex items-center gap-3 px-4 md:px-6 shrink-0"
      style={{
        height: 48,
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "#0A0908",
      }}
    >
      {/* Auto-save status */}
      <div className="flex items-center gap-1.5">
        {publishStatus === "publishing" ? (
          <Loader size={10} className="animate-spin" style={{ color: "#C75B39" }} />
        ) : StatusIcon ? (
          <StatusIcon size={10} style={{ color: publishStatus === "done" ? "#22C55E" : publishStatus === "error" ? "#E5484D" : "rgba(255,255,255,0.3)" }} />
        ) : null}
        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          {statusLabel()}
        </span>
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <button
        onClick={onSaveDraft}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors hover:bg-white/5 rounded-sm"
        style={{
          color: "#F5F0EB",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Save size={12} />
        Brouillon
      </button>

      <button
        onClick={onSchedule}
        disabled={!canPublish}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors rounded-sm disabled:opacity-30"
        style={{
          color: "#F5F0EB",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Clock size={12} />
        Programmer
      </button>

      <button
        onClick={onTest}
        disabled={!canPublish}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] transition-colors rounded-sm disabled:opacity-30"
        style={{
          color: "#F5F0EB",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Play size={12} />
        Test
      </button>

      <button
        onClick={onPublish}
        disabled={!canPublish}
        className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-medium transition-opacity hover:opacity-80 disabled:opacity-30 rounded-sm"
        style={{
          background: "#C75B39",
          color: "#FFFFFF",
        }}
      >
        {publishStatus === "publishing" ? (
          <Loader size={12} className="animate-spin" />
        ) : (
          <Send size={12} />
        )}
        Publier
      </button>
    </div>
  );
}
