"use client";

import { useState, useMemo } from "react";
import { Sparkles, Image, MessageCircle, Hash, Clock, AlertCircle } from "lucide-react";
import type { PlatformType, ComposerMedia, ComposerCaption, ComposerConfig } from "@/lib/studio/types";
import { PLATFORM_LABELS } from "@/lib/studio/types";

interface PreviewPanelProps {
  platforms: { platform: PlatformType; subType: string }[];
  media: ComposerMedia[];
  caption: ComposerCaption;
  config: ComposerConfig;
}

interface ScoreCriterion {
  icon: React.ElementType;
  label: string;
  score: number;
  maxScore: number;
  tip: string;
}

function computeScore(caption: string, hashtags: string[], mediaCount: number, config: ComposerConfig): ScoreCriterion[] {
  const captionLen = caption.length;
  const captionScore = captionLen === 0 ? 0 : captionLen < 120 ? 40 : captionLen <= 300 ? 100 : captionLen <= 500 ? 80 : 60;

  const hashtagCount = hashtags.length;
  const hashtagScore = hashtagCount === 0 ? 0 : hashtagCount < 3 ? 40 : hashtagCount <= 10 ? 100 : 70;

  const visualScore = mediaCount === 0 ? 0 : mediaCount >= 1 ? 90 : 50;

  const timingScore = config.scheduledAt ? 90 : 20;

  const engagementScore = (captionScore * 0.3 + visualScore * 0.5 + hashtagScore * 0.2);

  return [
    { icon: Image, label: "Visuel", score: visualScore, maxScore: 100, tip: visualScore < 50 ? "Ajoute au moins un visuel" : "Bon visuel" },
    { icon: MessageCircle, label: "Caption", score: captionScore, maxScore: 100, tip: captionScore < 100 ? "Idéal : 120-300 caractères" : "Caption parfait" },
    { icon: Hash, label: "Hashtags", score: hashtagScore, maxScore: 100, tip: hashtagScore < 100 ? "Entre 3 et 10 hashtags" : "Bon nombre de hashtags" },
    { icon: Clock, label: "Timing", score: timingScore, maxScore: 100, tip: timingScore < 50 ? "Programme ton contenu" : "Programmé ✅" },
    { icon: Sparkles, label: "Engagement", score: Math.round(engagementScore), maxScore: 100, tip: engagementScore < 50 ? "Améliore les autres critères" : "Bon potentiel d'engagement" },
  ];
}

function getPreviewStyle(platform: PlatformType, subType: string) {
  switch (platform) {
    case "instagram":
      if (subType === "story") return { aspectRatio: "9/16", maxWidth: 180 };
      if (subType === "reel") return { aspectRatio: "9/16", maxWidth: 160 };
      return { aspectRatio: "1/1", maxWidth: 200 };
    case "tiktok":
      return { aspectRatio: "9/16", maxWidth: 160 };
    case "youtube":
      return { aspectRatio: "16/9", maxWidth: 240 };
    case "twitter":
    case "threads":
    case "bluesky":
    default:
      return { aspectRatio: "16/9", maxWidth: 240 };
  }
}

export function PreviewPanel({ platforms, media, caption, config }: PreviewPanelProps) {
  const [activePreview, setActivePreview] = useState(0);
  const current = platforms[activePreview];
  const previewStyle = current ? getPreviewStyle(current.platform, current.subType) : null;

  const criteria = useMemo(
    () => computeScore(caption.text, caption.hashtags, media.length, config),
    [caption.text, caption.hashtags, media.length, config]
  );

  const overall = useMemo(
    () => Math.round(criteria.reduce((sum, c) => sum + c.score, 0) / criteria.length),
    [criteria]
  );

  return (
    <div
      className="h-full flex flex-col"
      style={{ borderLeft: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Preview header */}
      <div className="p-4 pb-2">
        <p className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
          Aperçu
        </p>
      </div>

      {/* Platform preview tabs */}
      {platforms.length > 0 && (
        <div className="flex gap-1 px-3 pb-2 overflow-x-auto">
          {platforms.map((p, i) => (
            <button
              key={i}
              onClick={() => setActivePreview(i)}
              className="text-[10px] px-2 py-1 rounded-sm whitespace-nowrap transition-all"
              style={{
                background: i === activePreview ? "rgba(199,91,57,0.1)" : "transparent",
                color: i === activePreview ? "var(--accent)" : "rgba(255,255,255,0.3)",
                border: i === activePreview
                  ? "1px solid rgba(199,91,57,0.2)"
                  : "1px solid transparent",
              }}
            >
              {PLATFORM_LABELS[p.platform]} · {p.subType}
            </button>
          ))}
        </div>
      )}

      {/* Live preview mockup */}
      <div className="flex-1 flex items-center justify-center px-4">
        {current && previewStyle ? (
          <div
            className="w-full flex flex-col items-center justify-center rounded-sm overflow-hidden"
            style={{
              aspectRatio: previewStyle.aspectRatio,
              maxWidth: previewStyle.maxWidth,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--border-default)",
            }}
          >
            {media.length > 0 ? (
              <img
                src={media[0].previewUrl}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <Image size={20} style={{ color: "rgba(255,255,255,0.1)" }} />
                <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>
                  Aucun média
                </p>
              </div>
            )}
            <div
              className="w-full p-1.5 text-[7px] leading-tight truncate"
              style={{
                background: "rgba(0,0,0,0.5)",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {caption.text || "Caption..."}
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
            Sélectionne une plateforme
            <br />pour voir l'aperçu
          </p>
        )}
      </div>

      {/* Optimization score */}
      <div
        className="p-4 shrink-0 space-y-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
            Score d'optimisation
          </p>
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full text-xs font-semibold"
            style={{
              background: `conic-gradient(var(--accent) ${overall}%, rgba(255,255,255,0.06) ${overall}%)`,
              color: "var(--text-primary)",
            }}
          >
            {overall}%
          </div>
        </div>

        <div className="space-y-1.5">
          {criteria.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="flex items-center gap-2">
                <Icon size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
                <span className="text-[10px] w-16 shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {c.label}
                </span>
                <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${c.score}%`, background: c.score < 50 ? "var(--danger)" : c.score < 80 ? "var(--warning)" : "var(--accent)" }}
                  />
                </div>
                {c.score < 100 && (
                  <span title={c.tip}>
                    <AlertCircle size={8} style={{ color: "rgba(255,255,255,0.2)" }} />
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {criteria.some((c) => c.score < 80) && (
          <div className="space-y-0.5">
            <p className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
              Suggestions
            </p>
            {criteria.filter((c) => c.score < 80).slice(0, 3).map((c) => (
              <p key={c.label} className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                · {c.tip}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
