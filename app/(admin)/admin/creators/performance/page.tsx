"use client";

import { TrendingUp, Construction } from "lucide-react";

export default function CreatorsPerformancePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3" style={{ backgroundColor: "var(--accent-soft)" }}>
            <TrendingUp size={32} style={{ color: "var(--accent)" }} />
          </div>
        </div>
        <h1 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          Performances créateurs
        </h1>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(245,240,235,0.4)" }}>
          Analyse détaillée des performances individuelles et comparatives des créateurs.
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px]" style={{ color: "rgba(245,240,235,0.2)" }}>
          <Construction size={12} /> Bientôt disponible
        </div>
      </div>
    </div>
  );
}
