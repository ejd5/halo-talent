"use client";

import { useState, useMemo } from "react";
import { MessageCircle, Download, FileDown, Calendar, Filter } from "lucide-react";
import { ChatAnalyticsKPIs } from "@/components/chat-analytics/ChatAnalyticsKPIs";
import { ChatRevenueChart } from "@/components/chat-analytics/ChatRevenueChart";
import { TopMessages } from "@/components/chat-analytics/TopMessages";
import { AIInsightsPanel } from "@/components/chat-analytics/AIInsights";
import { ChatterPerformanceTable } from "@/components/chat-analytics/ChatterPerformanceTable";
import { ActivityHeatmap } from "@/components/chat-analytics/ActivityHeatmap";
import {
  mockAnalyticsKPIs,
  mockRevenueDays,
  mockTopMessages,
  mockAIInsights,
  mockChatterPerformance,
  generateHeatmapData,
} from "@/lib/mock/chat-analytics";

const heatmapData = generateHeatmapData();

// Simulate agency mode toggle (always true for Phase 1)
const AGENCY_MODE = true;

export default function ChatAnalyticsPage() {
  const [period, setPeriod] = useState("this_month");
  const [platform, setPlatform] = useState("all");
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);

  // Compute total revenue for the period
  const totalRevenue = useMemo(
    () => mockRevenueDays.reduce((s, d) => s + d.ppv + d.tips + d.resubs, 0),
    [],
  );

  const handleExportPdf = async () => {
    setExportingPdf(true);
    // Simulate PDF export
    await new Promise((r) => setTimeout(r, 800));
    setExportingPdf(false);
  };

  const handleExportCsv = async () => {
    setExportingCsv(true);
    // Simulate CSV export
    await new Promise((r) => setTimeout(r, 600));
    setExportingCsv(false);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--accent-soft)" }}
          >
            <MessageCircle size={16} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              Chat Analytics
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: "var(--text-tertiary)" }}>
              Analyse détaillée des performances de votre messagerie
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPdf}
            disabled={exportingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium rounded transition-opacity hover:opacity-70 disabled:opacity-40"
            style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
          >
            <FileDown size={12} />
            {exportingPdf ? "Export..." : "Export PDF"}
          </button>
          <button
            onClick={handleExportCsv}
            disabled={exportingCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium rounded transition-opacity hover:opacity-70 disabled:opacity-40"
            style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border-default)" }}
          >
            <Download size={12} />
            {exportingCsv ? "Export..." : "Export CSV"}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Calendar size={11} style={{ color: "var(--text-tertiary)" }} />
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-[10px] font-medium px-2 py-1 rounded outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <option value="this_month">Ce mois</option>
            <option value="last_month">Mois dernier</option>
            <option value="last_quarter">3 derniers mois</option>
          </select>
        </div>
        <div className="flex items-center gap-1.5">
          <Filter size={11} style={{ color: "var(--text-tertiary)" }} />
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="text-[10px] font-medium px-2 py-1 rounded outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-default)",
            }}
          >
            <option value="all">Toutes plateformes</option>
            <option value="onlyfans">OnlyFans</option>
            <option value="fansly">Fansly</option>
            <option value="mym">MyM</option>
          </select>
        </div>
        {AGENCY_MODE && (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-medium rounded"
            style={{ backgroundColor: "rgba(122, 154, 101, 0.15)", color: "var(--success)" }}
          >
            Mode agence
          </span>
        )}
      </div>

      {/* ROW 1, KPI Cards */}
      <ChatAnalyticsKPIs data={mockAnalyticsKPIs} />

      {/* ROW 2, Revenue Chart */}
      <ChatRevenueChart data={mockRevenueDays} />

      {/* ROW 3, Two columns: Top Messages + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <TopMessages messages={mockTopMessages} />
        </div>
        <div className="lg:col-span-2">
          <AIInsightsPanel insights={mockAIInsights} />
        </div>
      </div>

      {/* ROW 4, Chatter Performance Table (agency mode) */}
      {AGENCY_MODE && <ChatterPerformanceTable data={mockChatterPerformance} />}

      {/* ROW 5, Activity Heatmap */}
      <ActivityHeatmap data={heatmapData} />
    </div>
  );
}
