"use client";

import { useState } from "react";
import { Calendar, Clock, MapPin, AtSign, Eye, Zap } from "lucide-react";
import type { ComposerConfig as ComposerConfigType, ComposerGeo } from "@/lib/studio/types";

interface ConfigTabProps {
  config: ComposerConfigType;
  onSetScheduledAt: (date: Date | null) => void;
  onSetVisibility: (visibility: ComposerConfigType["visibility"]) => void;
  onSetGeo: (geo: ComposerGeo | null) => void;
  onSetConfig: (config: Partial<ComposerConfigType>) => void;
}

export function ConfigTab({
  config,
  onSetScheduledAt,
  onSetVisibility,
  onSetGeo,
  onSetConfig,
}: ConfigTabProps) {
  const [geoInput, setGeoInput] = useState(config.geo?.place || "");

  const dateStr = config.scheduledAt
    ? config.scheduledAt.toISOString().slice(0, 16)
    : "";

  const VISIBILITY_OPTIONS: { value: ComposerConfigType["visibility"]; label: string; desc: string }[] = [
    { value: "public", label: "Public", desc: "Visible par tout le monde" },
    { value: "followers", label: "Abonnés", desc: "Visible par les abonnés uniquement" },
    { value: "private", label: "Privé", desc: "Visible seulement par toi" },
  ];

  return (
    <div className="p-4 space-y-5">
      {/* Scheduling */}
      <section>
        <h3 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Calendar size={10} /> Planification
        </h3>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Clock size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
            <input
              type="datetime-local"
              value={dateStr}
              onChange={(e) => onSetScheduledAt(e.target.value ? new Date(e.target.value) : null)}
              className="w-full text-xs px-2.5 py-2 pl-7 rounded-sm bg-transparent outline-none"
              style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
            />
          </div>
          <button
            onClick={() => {
              const best = new Date();
              best.setHours(best.getHours() + 3, 0, 0, 0);
              onSetScheduledAt(best);
            }}
            className="flex items-center gap-1 px-2 py-2 text-[10px] rounded-sm shrink-0 transition-colors"
            style={{
              border: "1px solid rgba(199,91,57,0.2)",
              color: "#C75B39",
            }}
          >
            <Zap size={10} />
            Meilleur moment
          </button>
        </div>
      </section>

      {/* Visibility */}
      <section>
        <h3 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          <Eye size={10} /> Visibilité
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {VISIBILITY_OPTIONS.map((opt) => {
            const isActive = config.visibility === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onSetVisibility(opt.value)}
                className="text-left px-2.5 py-2 text-xs rounded-sm transition-all"
                style={{
                  border: isActive
                    ? "1px solid rgba(199,91,57,0.3)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: isActive ? "rgba(199,91,57,0.06)" : "transparent",
                  color: isActive ? "#C75B39" : "rgba(255,255,255,0.4)",
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Geo */}
      <section>
        <h3 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          <MapPin size={10} /> Localisation
        </h3>
        <div className="relative">
          <MapPin size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            value={geoInput}
            onChange={(e) => setGeoInput(e.target.value)}
            onBlur={() => {
              if (geoInput.trim()) {
                onSetGeo({ lat: 0, lng: 0, place: geoInput.trim() });
              } else {
                onSetGeo(null);
              }
            }}
            placeholder="Ajouter un lieu..."
            className="w-full text-xs px-2.5 py-2 pl-7 rounded-sm bg-transparent outline-none"
            style={{ border: "1px solid rgba(255,255,255,0.08)", color: "#F5F0EB" }}
          />
        </div>
      </section>

      {/* Mentions */}
      <section>
        <h3 className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
          <AtSign size={10} /> Mentions
        </h3>
        <p className="text-[10px] mb-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          Les mentions se gèrent dans l'onglet Caption
        </p>
      </section>

      {/* Cross-promotion */}
      <section>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="w-3.5 h-3.5 rounded-sm"
            style={{ accentColor: "#C75B39" }}
          />
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
            Cross-poster sur toutes les plateformes sélectionnées
          </span>
        </label>
      </section>
    </div>
  );
}
