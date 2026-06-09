"use client";

import { Camera, Music2, Video, MessageCircle, Briefcase, Lock } from "lucide-react";
import type { PlatformType, PlatformSubType, PlatformConfig } from "@/lib/studio/types";
import { PLATFORMS, PLATFORM_LABELS } from "@/lib/studio/types";

const ICON_MAP: Record<string, React.ElementType> = {
  Camera,
  Music2,
  Video,
  MessageCircle,
  Briefcase,
  Lock,
};

interface PlatformSelectorProps {
  platforms: PlatformConfig[];
  onToggle: (platform: PlatformType) => void;
  onSubtypeChange: (platform: PlatformType, subType: PlatformSubType) => void;
}

export function PlatformSelector({ platforms, onToggle, onSubtypeChange }: PlatformSelectorProps) {
  return (
    <div
      className="h-full flex flex-col"
      style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="p-4 pb-2">
        <p className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
          Plateformes
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
          Sélectionne une ou plusieurs plateformes
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-0.5">
        {PLATFORMS.map((def) => {
          const config = platforms.find((p) => p.platform === def.type);
          const enabled = !!config;
          const Icon = ICON_MAP[def.icon] || MessageCircle;

          return (
            <div key={def.type}>
              <button
                onClick={() => onToggle(def.type)}
                className="flex items-center gap-2.5 w-full text-left px-2.5 py-2 text-xs rounded transition-all"
                style={{
                  color: enabled ? "#F5F0EB" : "rgba(255,255,255,0.3)",
                  background: enabled ? "rgba(199,91,57,0.08)" : "transparent",
                  border: enabled
                    ? "1px solid rgba(199,91,57,0.2)"
                    : "1px solid transparent",
                }}
              >
                <Icon size={14} style={{ color: enabled ? "#C75B39" : "rgba(255,255,255,0.2)" }} />
                <span className="flex-1">{def.label}</span>
                {enabled && (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#C75B39" }}
                  />
                )}
              </button>

              {enabled && def.subtypes.length > 1 && (
                <div className="flex gap-1 ml-7 mt-1 mb-1.5">
                  {def.subtypes.map((st) => {
                    const isActive = config.subType === st.value;
                    return (
                      <button
                        key={st.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSubtypeChange(def.type, st.value);
                        }}
                        className="text-[10px] px-1.5 py-0.5 rounded transition-all"
                        style={{
                          color: isActive ? "#C75B39" : "rgba(255,255,255,0.3)",
                          background: isActive ? "rgba(199,91,57,0.1)" : "transparent",
                          border: isActive
                            ? "1px solid rgba(199,91,57,0.2)"
                            : "1px solid transparent",
                        }}
                      >
                        {st.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {platforms.length > 0 && (
        <div
          className="p-3 text-[10px] leading-relaxed shrink-0"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          {platforms.length} plateforme{platforms.length > 1 ? "s" : ""} sélectionnée
          {platforms.length > 1 ? "s" : ""}
          <br />
          {platforms.map((p) => PLATFORM_LABELS[p.platform]).join(", ")}
        </div>
      )}
    </div>
  );
}
