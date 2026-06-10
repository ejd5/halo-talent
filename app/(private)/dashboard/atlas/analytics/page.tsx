"use client";

import { useState } from "react";
import { BarChart3, DollarSign, GitBranch, CalendarDays, TrendingUp, Calculator, Download } from "lucide-react";
import OverviewTab from "./components/OverviewTab";
import RevenueTab from "./components/RevenueTab";
import AttributionTab from "./components/AttributionTab";
import CohortsTab from "./components/CohortsTab";
import ChannelsTab from "./components/ChannelsTab";
import ROITab from "./components/ROITab";

const TABS = [
  { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
  { id: "revenue", label: "Revenus", icon: DollarSign },
  { id: "attribution", label: "Attribution", icon: GitBranch },
  { id: "cohorts", label: "Cohortes", icon: CalendarDays },
  { id: "channels", label: "Canaux", icon: TrendingUp },
  { id: "roi", label: "ROI", icon: Calculator },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AtlasAnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch("/api/atlas/analytics/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: ["overview", "revenue", "roi", "channels"] }),
      });
      const data = await res.json();
      if (data.html) {
        const blob = new Blob([data.html], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `atlas-report-${new Date().toISOString().slice(0, 10)}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {} finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[2.2rem] font-semibold" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
            Analytics Atlas
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-ink-secondary)" }}>
            Mesure le ROI de chaque action marketing
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium transition-opacity hover:opacity-70 disabled:opacity-40"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
        >
          <Download size={14} />
          {exporting ? "Export..." : "Export PDF"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1" style={{ borderBottom: "1px solid rgba(245,240,235,0.06)" }}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all whitespace-nowrap"
              style={{
                color: isActive ? "var(--accent)" : "var(--color-ink-tertiary)",
                borderBottom: isActive ? "1px solid var(--accent)" : "1px solid transparent",
                marginBottom: -1,
              }}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="animate-slide-up">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "revenue" && <RevenueTab />}
        {activeTab === "attribution" && <AttributionTab />}
        {activeTab === "cohorts" && <CohortsTab />}
        {activeTab === "channels" && <ChannelsTab />}
        {activeTab === "roi" && <ROITab />}
      </div>
    </div>
  );
}
