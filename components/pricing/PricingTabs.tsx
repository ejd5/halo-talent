"use client";

import { useState } from "react";

export type PricingTab = "commission" | "studio" | "atlas" | "comparison";

export const TABS: { id: PricingTab; label: string; description: string }[] = [
  { id: "commission", label: "Commission", description: "Management progressif" },
  { id: "studio", label: "Studio IA", description: "Création & publication" },
  { id: "atlas", label: "Atlas CRM", description: "Marketing & automations" },
  { id: "comparison", label: "Comparatif", description: "Tous les plans" },
];

export function PricingTabs({
  active,
  onChange,
}: {
  active: PricingTab;
  onChange: (t: PricingTab) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 mb-10">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-left transition-all"
            style={{
              backgroundColor: isActive ? "var(--accent)" : "var(--bg-card)",
              color: isActive ? "var(--accent-text, #fff)" : "var(--text-secondary)",
              border: isActive ? "none" : "1px solid var(--border-default)",
            }}
          >
            <span className="text-sm font-semibold">{tab.label}</span>
            <span className="text-[10px] hidden sm:inline" style={{ opacity: 0.7 }}>
              {tab.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
