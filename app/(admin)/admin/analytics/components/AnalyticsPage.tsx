"use client";

import { useState } from "react";
import type { AnalyticsTab } from "../types";
import { TAB_LABELS } from "../types";
import { BusinessTab } from "./BusinessTab";
import { CreatorsTab } from "./CreatorsTab";
import { WebTab } from "./WebTab";
import { AcquisitionTab } from "./AcquisitionTab";
import { CohortsTab } from "./CohortsTab";
import { AIAgentChat } from "./AIAgentChat";

const TABS: AnalyticsTab[] = ["business", "creators", "web", "acquisition", "cohorts"];

export function AnalyticsPage() {
  const [tab, setTab] = useState<AnalyticsTab>("business");

  return (
    <div className="flex flex-col h-full card-accent" style={{ background: "var(--bg-primary)" }}>
      {/* Tabs */}
      <div className="flex border-b border-[var(--color-border)] px-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-xs font-medium border-b-2 transition-colors -mb-[1px] ${
              tab === t
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === "business" && <BusinessTab />}
        {tab === "creators" && <CreatorsTab />}
        {tab === "web" && <WebTab />}
        {tab === "acquisition" && <AcquisitionTab />}
        {tab === "cohorts" && <CohortsTab />}
      </div>

      {/* AI Agent Chat */}
      <AIAgentChat />
    </div>
  );
}
