"use client";

import { TrendingUp, Euro, BarChart3, Download } from "lucide-react";

export default function RevenuesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Mes revenus</h1>
        <p className="text-base mt-1" style={{ color: "#FFFFFF" }}>Suivez vos revenus et commissions en temps réel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center gap-2 mb-2"><Euro size={16} style={{ color: "#FFFFFF" }} /><span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#FFFFFF" }}>Ce mois</span></div>
          <div className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>12 450 €</div>
          <div className="text-base text-[#A8D08D] mt-1.5">+18% vs mois dernier</div>
        </div>
        <div className="p-5 border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center gap-2 mb-2"><TrendingUp size={16} style={{ color: "#FFFFFF" }} /><span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#FFFFFF" }}>Cumul annuel</span></div>
          <div className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>64 950 €</div>
          <div className="text-base text-[#A8D08D] mt-1.5">+32% vs N-1</div>
        </div>
        <div className="p-5 border border-[var(--color-border)] card-accent" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center gap-2 mb-2"><BarChart3 size={16} style={{ color: "#FFFFFF" }} /><span className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#FFFFFF" }}>Commission</span></div>
          <div className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>25%</div>
          <div className="text-base mt-1.5" style={{ color: "#FFFFFF" }}>Palier Croissance</div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="p-8 border border-[var(--color-border)] flex items-center justify-center" style={{ backgroundColor: "var(--color-card)", minHeight: 320 }}>
        <div className="text-center">
          <BarChart3 size={32} className="mx-auto mb-3" style={{ color: "#FFFFFF" }} />
          <div className="text-base" style={{ color: "#FFFFFF" }}>Graphique détaillé des revenus (12 mois)</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-4 py-2 text-base font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors" style={{ color: "#FFFFFF" }}>
          <Download size={14} /> Exporter
        </button>
      </div>
    </div>
  );
}
