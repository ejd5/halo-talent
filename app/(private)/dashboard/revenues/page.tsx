"use client";

import { TrendingUp, Euro, BarChart3, Download } from "lucide-react";

export default function RevenuesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold" style={{ fontFamily: "var(--font-display)" }}>Mes revenus</h1>
        <p className="text-xs opacity-40 mt-1">Suivez vos revenus et commissions en temps réel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center gap-2 mb-1"><Euro size={14} className="opacity-40" /><span className="text-[10px] font-semibold uppercase tracking-wider opacity-40">Ce mois</span></div>
          <div className="text-xl font-semibold font-mono" style={{ fontFamily: "var(--font-display)" }}>12 450 €</div>
          <div className="text-[11px] text-[#7A9A65] mt-1">+18% vs mois dernier</div>
        </div>
        <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center gap-2 mb-1"><TrendingUp size={14} className="opacity-40" /><span className="text-[10px] font-semibold uppercase tracking-wider opacity-40">Cumul annuel</span></div>
          <div className="text-xl font-semibold font-mono" style={{ fontFamily: "var(--font-display)" }}>64 950 €</div>
          <div className="text-[11px] text-[#7A9A65] mt-1">+32% vs N-1</div>
        </div>
        <div className="p-4 border border-[var(--color-border)]" style={{ backgroundColor: "var(--color-card)" }}>
          <div className="flex items-center gap-2 mb-1"><BarChart3 size={14} className="opacity-40" /><span className="text-[10px] font-semibold uppercase tracking-wider opacity-40">Commission</span></div>
          <div className="text-xl font-semibold font-mono" style={{ fontFamily: "var(--font-display)" }}>25%</div>
          <div className="text-[11px] opacity-40 mt-1">Palier Croissance</div>
        </div>
      </div>

      {/* Chart placeholder */}
      <div className="p-8 border border-[var(--color-border)] flex items-center justify-center" style={{ backgroundColor: "var(--color-card)", minHeight: 280 }}>
        <div className="text-center">
          <BarChart3 size={24} className="opacity-10 mx-auto mb-2" />
          <div className="text-xs opacity-20">Graphique détaillé des revenus (12 mois)</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--color-border)] hover:bg-[var(--color-card)] transition-colors">
          <Download size={12} /> Exporter
        </button>
      </div>
    </div>
  );
}
