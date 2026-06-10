"use client";

import { X } from "lucide-react";
import type { TransitionType, EffectFilter } from "./editor-types";

interface Props {
  onSelectTransition: (t: TransitionType) => void;
  onSelectFilter: (f: EffectFilter) => void;
  currentTransition: TransitionType;
  currentFilter: EffectFilter;
  onClose: () => void;
}

export function EffectsPicker({ onSelectTransition, onSelectFilter, currentTransition, currentFilter, onClose }: Props) {
  const transitions: { value: TransitionType; label: string; icon: string }[] = [
    { value: "none", label: "Aucune", icon: "⬜" },
    { value: "fade", label: "Fondu", icon: "🌫️" },
    { value: "dissolve", label: "Dissoudre", icon: "💠" },
    { value: "slideLeft", label: "Glisse gauche", icon: "⬅️" },
    { value: "slideRight", label: "Glisse droite", icon: "➡️" },
    { value: "zoomIn", label: "Zoom avant", icon: "🔍" },
  ];

  const filters: { value: EffectFilter; label: string; icon: string }[] = [
    { value: "none", label: "Normal", icon: "🎨" },
    { value: "grayscale", label: "Noir & blanc", icon: "⚫" },
    { value: "sepia", label: "Sépia", icon: "🟫" },
    { value: "vintage", label: "Vintage", icon: "📟" },
    { value: "contrast", label: "Contrasté", icon: "◼️" },
    { value: "bright", label: "Lumineux", icon: "☀️" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div
        className="w-[400px] p-4 rounded-sm"
        style={{ background: "var(--bg-primary)", border: "1px solid var(--border-default)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm" style={{ fontFamily: "var(--font-studio)", color: "var(--text-primary)" }}>Effets & Transitions</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider mb-2 block" style={{ color: "rgba(255,255,255,0.3)" }}>
              Transition
            </label>
            <div className="grid grid-cols-3 gap-1">
              {transitions.map((t) => (
                <button
                  key={t.value}
                  onClick={() => onSelectTransition(t.value)}
                  className="flex flex-col items-center gap-1 px-2 py-2 text-[9px] rounded-sm transition-all"
                  style={{
                    border: `1px solid ${currentTransition === t.value ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                    background: currentTransition === t.value ? "rgba(199,91,57,0.06)" : "transparent",
                    color: currentTransition === t.value ? "var(--accent)" : "rgba(255,255,255,0.4)",
                  }}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider mb-2 block" style={{ color: "rgba(255,255,255,0.3)" }}>
              Filtre
            </label>
            <div className="grid grid-cols-3 gap-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onSelectFilter(f.value)}
                  className="flex flex-col items-center gap-1 px-2 py-2 text-[9px] rounded-sm transition-all"
                  style={{
                    border: `1px solid ${currentFilter === f.value ? "rgba(199,91,57,0.3)" : "rgba(255,255,255,0.06)"}`,
                    background: currentFilter === f.value ? "rgba(199,91,57,0.06)" : "transparent",
                    color: currentFilter === f.value ? "var(--accent)" : "rgba(255,255,255,0.4)",
                  }}
                >
                  <span>{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-2.5 py-2 text-[9px] rounded-sm" style={{ background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.2)" }}>
            Les filtres s&apos;appliquent au clip sélectionné dans la timeline
          </div>
        </div>
      </div>
    </div>
  );
}
