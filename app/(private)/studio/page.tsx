"use client";

import { KpiRow } from "./components/KpiRow";
import { QuickStartGrid } from "./components/QuickStartGrid";
import { InspirationFeed } from "./components/InspirationFeed";
import { DraftsRow } from "./components/DraftsRow";
import { CreditsWidget } from "./components/CreditsWidget";
import { Sparkles } from "lucide-react";

export default function StudioPage() {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
    <div className="max-w-7xl mx-auto flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1
          className="text-[2.2rem] font-semibold mb-1"
          style={{ fontFamily: "var(--font-display)", color: "#F5F0EB" }}
        >
          Bonjour,
        </h1>
        <p className="text-sm" style={{ color: "var(--color-ink-secondary)" }}>
          Votre Studio créatif est ouvert.
        </p>
      </div>

      {/* Trend banner */}
      <div
        className="flex items-center gap-3 p-3"
        style={{
          border: "1px solid rgba(199,91,57,0.1)",
          backgroundColor: "rgba(199,91,57,0.06)",
        }}
      >
        <span style={{ color: "#C75B39", fontSize: 14 }}>✦</span>
        <p className="text-xs" style={{ color: "#C75B39" }}>
          <span style={{ color: "#C75B39" }}>Tendance du jour</span> — Les contenus
          &laquo; jour dans la vie &raquo; génèrent 2.3× plus d&apos;engagement
          dans votre niche cette semaine.
        </p>
      </div>

      {/* KPI Row */}
      <KpiRow />

      {/* Quick Start */}
      <QuickStartGrid />

      {/* Two columns: Inspiration + Credits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <InspirationFeed />
        </div>
        <div>
          <CreditsWidget />
        </div>
      </div>

      {/* Drafts */}
      <DraftsRow />
      </div>
    </div>
  );
}
