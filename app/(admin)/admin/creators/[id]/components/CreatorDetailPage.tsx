"use client";

import { useState } from "react";
import Link from "next/link";
import type { Creator } from "../../types";
import { tierConfig } from "../../data";
import { ArrowLeft, Settings, Target, UserPlus, PauseCircle, Archive, Trash2 } from "lucide-react";
import { OverviewTab } from "./tabs/OverviewTab";
import { PlatformsTab } from "./tabs/PlatformsTab";
import { RevenueTab } from "./tabs/RevenueTab";
import { ContractsTab } from "./tabs/ContractsTab";
import { CommunicationsTab } from "./tabs/CommunicationsTab";
import { CalendarTab } from "./tabs/CalendarTab";
import { AIAnalysisTab } from "./tabs/AIAnalysisTab";
import { NotesDocumentsTab } from "./tabs/NotesDocumentsTab";

type Props = { creator: Creator };

const tabs = [
  { key: "overview", label: "Vue d'ensemble" },
  { key: "platforms", label: "Plateformes" },
  { key: "revenue", label: "Revenus & Commissions" },
  { key: "contracts", label: "Contrats" },
  { key: "comms", label: "Communications" },
  { key: "calendar", label: "Calendrier" },
  { key: "ai", label: "Analyse IA" },
  { key: "docs", label: "Notes & Documents" },
];

const statusLabels: Record<string, { label: string; color: string }> = {
  active: { label: "Actif", color: "#7A9A65" },
  pause: { label: "Pause", color: "#C75B39" },
  alert: { label: "Alerte", color: "#C44536" },
};

export function CreatorDetailPage({ creator }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showActions, setShowActions] = useState(false);

  const tier = tierConfig[creator.tier];
  const st = statusLabels[creator.status];

  return (
    <div className="max-w-[1400px]">
      {/* Back link */}
      <Link
        href="/admin/creators"
        className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium uppercase tracking-[0.1em] mb-4 transition-colors hover:opacity-70"
        style={{ color: "#7A736B" }}
      >
        <ArrowLeft size={14} strokeWidth={1.5} />
        Retour au roster
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-5">
          <div
            className="w-16 h-16 flex items-center justify-center text-2xl font-display font-bold shrink-0"
            style={{ background: "rgba(199,91,57,0.15)", color: "#C75B39" }}
          >
            {creator.full_name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-[28px] font-bold" style={{ color: "#F5F0EB" }}>
                {creator.full_name}
              </h1>
              <span
                className="text-[10px] font-sans font-semibold uppercase tracking-[0.08em] px-2 py-0.5"
                style={{ background: `${st.color}15`, color: st.color }}
              >
                {st.label}
              </span>
              <span
                className="text-[10px] font-sans font-semibold uppercase tracking-[0.1em] px-2 py-0.5"
                style={{ background: `${tier.color}15`, color: tier.color, border: `1px solid ${tier.color}33` }}
              >
                {tier.label}
              </span>
            </div>
            <p className="text-sm font-sans mt-1" style={{ color: "#7A736B" }}>
              {creator.department} · Manager : {creator.manager_name}
            </p>
          </div>
        </div>

        {/* Actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="px-4 py-2 text-[11px] font-sans font-semibold uppercase tracking-[0.1em] transition-colors hover:bg-white/5"
            style={{ color: "#9A9590", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            Actions
          </button>
          {showActions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
              <div
                className="absolute right-0 top-full mt-1 w-48 py-1 z-50"
                style={{ background: "#1A1614", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {[
                  { icon: Settings, label: "Éditer le profil" },
                  { icon: Target, label: "Changer de palier" },
                  { icon: UserPlus, label: "Changer de manager" },
                  { icon: PauseCircle, label: "Mettre en pause" },
                  { icon: Archive, label: "Archiver" },
                  { icon: Trash2, label: "Supprimer", danger: true },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={() => setShowActions(false)}
                    className={`flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs font-sans transition-colors hover:bg-white/5 ${action.danger ? "" : ""}`}
                    style={{ color: action.danger ? "#C44536" : "#D0CCC6" }}
                  >
                    <action.icon size={14} strokeWidth={1.5} />
                    {action.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-0 overflow-x-auto mb-6"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className="px-4 py-3.5 text-[11px] font-sans font-medium uppercase tracking-[0.08em] whitespace-nowrap transition-colors"
            style={{
              color: activeTab === t.key ? "#C75B39" : "#7A736B",
              borderBottom: activeTab === t.key ? "2px solid #C75B39" : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab creator={creator} />}
      {activeTab === "platforms" && <PlatformsTab creator={creator} />}
      {activeTab === "revenue" && <RevenueTab creator={creator} />}
      {activeTab === "contracts" && <ContractsTab creatorId={creator.id} />}
      {activeTab === "comms" && <CommunicationsTab creatorId={creator.id} />}
      {activeTab === "calendar" && <CalendarTab creatorId={creator.id} />}
      {activeTab === "ai" && <AIAnalysisTab creatorId={creator.id} />}
      {activeTab === "docs" && <NotesDocumentsTab creatorId={creator.id} />}
    </div>
  );
}
