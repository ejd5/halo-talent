"use client";

import { Puzzle, Construction } from "lucide-react";

export default function SettingsIntegrationsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3" style={{ backgroundColor: "rgba(199,91,57,0.08)" }}>
            <Puzzle size={32} style={{ color: "#C75B39" }} />
          </div>
        </div>
        <h1 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}>
          Intégrations
        </h1>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(245,240,235,0.4)" }}>
          Connecteurs et intégrations tierces : API, webhooks, synchronisation avec vos outils.
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px]" style={{ color: "rgba(245,240,235,0.2)" }}>
          <Construction size={12} /> Bientôt disponible
        </div>
      </div>
    </div>
  );
}
