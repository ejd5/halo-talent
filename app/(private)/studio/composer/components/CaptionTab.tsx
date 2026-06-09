"use client";

import { useState } from "react";
import { Sparkles, Hash, AtSign, Repeat2, Languages, ChevronDown } from "lucide-react";
import type { PlatformType, ComposerCaption } from "@/lib/studio/types";
import { CHAR_LIMITS, PLATFORM_LABELS } from "@/lib/studio/types";

interface CaptionTabProps {
  caption: ComposerCaption;
  platforms: { platform: PlatformType }[];
  onCaptionChange: (text: string) => void;
  onHashtagsChange: (hashtags: string[]) => void;
  onMentionsChange: (mentions: string[]) => void;
}

export function CaptionTab({
  caption,
  platforms,
  onCaptionChange,
  onHashtagsChange,
  onMentionsChange,
}: CaptionTabProps) {
  const [aiOpen, setAiOpen] = useState(false);

  const hashtagText = caption.hashtags.join(" ");
  const mentionsText = caption.mentions.join(" ");

  return (
    <div className="p-4 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-1 flex-wrap pb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button className="px-2 py-1 text-xs font-bold rounded-sm hover:bg-white/5 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>G</button>
        <button className="px-2 py-1 text-xs italic rounded-sm hover:bg-white/5 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>I</button>
        <button className="px-2 py-1 text-xs underline rounded-sm hover:bg-white/5 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>U</button>
        <span className="w-px h-4 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        <button className="px-2 py-1 text-xs rounded-sm hover:bg-white/5 transition-colors" style={{ color: "rgba(255,255,255,0.5)" }}>🔗</button>
      </div>

      {/* Caption textarea */}
      <textarea
        value={caption.text}
        onChange={(e) => onCaptionChange(e.target.value)}
        placeholder="Écris ton caption ici..."
        className="w-full resize-none text-sm leading-relaxed bg-transparent outline-none"
        rows={8}
        style={{ color: "#F5F0EB" }}
      />

      {/* Character counters per platform */}
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
          Compteurs par plateforme
        </p>
        {platforms.length === 0 ? (
          <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Sélectionne une plateforme pour voir les limites
          </p>
        ) : (
          platforms.map((p) => {
            const limit = CHAR_LIMITS[p.platform];
            const used = caption.text.length;
            const pct = Math.min((used / limit) * 100, 100);
            const isOver = used > limit;
            return (
              <div key={p.platform} className="flex items-center gap-2">
                <span className="text-[10px] w-20 shrink-0" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {PLATFORM_LABELS[p.platform]}
                </span>
                <div className="flex-1 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pct}%`,
                      background: isOver ? "#E5484D" : "#C75B39",
                    }}
                  />
                </div>
                <span
                  className="text-[10px] w-16 text-right shrink-0 tabular-nums"
                  style={{ color: isOver ? "#E5484D" : "rgba(255,255,255,0.4)" }}
                >
                  {used}/{limit}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* Hashtags */}
      <div>
        <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Hash size={10} /> Hashtags
        </label>
        <input
          value={hashtagText}
          onChange={(e) => onHashtagsChange(e.target.value.split(" ").filter(Boolean))}
          placeholder="#hashtag #tags"
          className="w-full text-xs px-2.5 py-1.5 rounded-sm bg-transparent outline-none"
          style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
        />
      </div>

      {/* Mentions */}
      <div>
        <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>
          <AtSign size={10} /> Mentions
        </label>
        <input
          value={mentionsText}
          onChange={(e) => onMentionsChange(e.target.value.split(" ").filter(Boolean))}
          placeholder="@compte @createur"
          className="w-full text-xs px-2.5 py-1.5 rounded-sm bg-transparent outline-none"
          style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
        />
      </div>

      {/* AI Actions */}
      <div className="relative">
        <button
          onClick={() => setAiOpen(!aiOpen)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs w-full transition-all rounded-sm"
          style={{
            border: "1px solid rgba(199,91,57,0.2)",
            color: "#C75B39",
          }}
        >
          <Sparkles size={12} />
          Actions IA
          <ChevronDown size={10} className={`ml-auto transition-transform ${aiOpen ? "rotate-180" : ""}`} />
        </button>

        {aiOpen && (
          <div
            className="absolute left-0 right-0 top-full mt-1 z-10 py-1 shadow-xl"
            style={{
              background: "#1A1614",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {[
              { icon: Sparkles, label: "Générer un caption" },
              { icon: Repeat2, label: "Reformuler" },
              { icon: Hash, label: "Suggérer des hashtags" },
              { icon: Languages, label: "Traduire" },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/5"
                  style={{ color: "#F5F0EB" }}
                >
                  <Icon size={12} style={{ color: "#C75B39" }} />
                  {action.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
