"use client";

import { useState } from "react";
import { X, Play, Clock, Maximize } from "lucide-react";
import { VIDEO_TEMPLATES } from "./template-data";
import type { VideoTemplate } from "./editor-types";

interface Props {
  onSelect: (template: VideoTemplate) => void;
  onClose: () => void;
}

export function TemplateLibrary({ onSelect, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={onClose}
    >
      <div
        className="w-[640px] max-h-[640px] flex flex-col rounded-sm"
        style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <h3 className="text-sm" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Templates vidéo</h3>
            <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Choisis un template, personnalise-le avec tes médias</p>
          </div>
          <button onClick={onClose} className="p-1 transition-colors hover:bg-white/10 rounded-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={14} />
          </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-3">
            {VIDEO_TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className="text-left rounded-sm transition-all hover:bg-white/5 group"
                style={{ border: "1px solid var(--border-default)" }}
              >
                {/* Preview */}
                <div
                  className="relative aspect-[9/16] flex items-center justify-center overflow-hidden"
                  style={{ background: "var(--bg-card)" }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">{template.icon}</span>
                    <div
                      className="flex items-center gap-1.5 px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: "rgba(199,91,57,0.2)" }}
                    >
                      <Play size={10} style={{ color: "var(--accent)" }} />
                      <span className="text-[9px]" style={{ color: "var(--accent)" }}>Preview</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <div className="text-[11px] font-medium mb-1 truncate" style={{ color: "var(--text-primary)" }}>
                    {template.name}
                  </div>
                  <p className="text-[9px] mb-2 line-clamp-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {template.description}
                  </p>
                  <div className="flex items-center gap-2 text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    <span className="flex items-center gap-0.5">
                      <Clock size={8} /> {template.duration}s
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Maximize size={8} /> {template.aspectRatio}
                    </span>
                    <span>{template.scenes.length} scènes</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
