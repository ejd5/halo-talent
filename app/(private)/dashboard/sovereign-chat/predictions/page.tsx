"use client";

import { TrendingUp, Construction } from "lucide-react";

export default function PredictionsPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <div className="p-3" style={{ backgroundColor: "var(--accent-soft)" }}>
            <TrendingUp size={32} style={{ color: "var(--accent)" }} />
          </div>
        </div>
        <h1 className="text-lg font-semibold mb-2" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
          LTV & Churn
        </h1>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(245,240,235,0.4)" }}>
          Prédictions de valeur à vie et analyse du churn de vos fans.
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px]" style={{ color: "rgba(245,240,235,0.2)" }}>
          <Construction size={12} /> Bientôt disponible
        </div>
      </div>
    </div>
  );
}
