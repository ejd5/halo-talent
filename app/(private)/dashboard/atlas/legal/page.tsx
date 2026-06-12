"use client";

import { useState, useEffect } from "react";
import {
  FileText, BookOpen, AlertTriangle, Eye,
} from "lucide-react";
import { t } from "@/lib/i18n/legal";
import { useLocale } from "@/lib/i18n/use-locale";
import { LegalDashboardHeader } from "@/components/atlas-legal/LegalDashboardHeader";
import { MonContratTab } from "@/components/atlas-legal/MonContratTab";
import { BaseJuridiqueTab } from "@/components/atlas-legal/BaseJuridiqueTab";
import { AlertesJuridiquesTab } from "@/components/atlas-legal/AlertesJuridiquesTab";
import { VeilleJuridiqueTab } from "@/components/atlas-legal/VeilleJuridiqueTab";

export default function AtlasLegalPage() {
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<string>("contrat");
  const [meta, setMeta] = useState<{
    changes_this_month: number;
    pending_count: number;
    last_scan_at: string | null;
    total_sources: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadMeta() {
      try {
        const res = await fetch("/api/legal/change-events?limit=1");
        const d = await res.json();
        if (!cancelled && d.meta) setMeta(d.meta);
      } catch {}
    }
    loadMeta();
    return () => { cancelled = true; };
  }, []);

  const TABS = [
    { id: "contrat", label: t("atlas.tab_contract", locale), icon: FileText },
    { id: "juridique", label: t("atlas.tab_knowledge", locale), icon: BookOpen },
    { id: "alertes", label: t("atlas.tab_alerts", locale), icon: AlertTriangle },
    { id: "veille", label: t("atlas.tab_veille", locale), icon: Eye },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in">
      <LegalDashboardHeader meta={meta} locale={locale} />

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
        {activeTab === "contrat" && <MonContratTab locale={locale} />}
        {activeTab === "juridique" && <BaseJuridiqueTab locale={locale} />}
        {activeTab === "alertes" && <AlertesJuridiquesTab locale={locale} />}
        {activeTab === "veille" && <VeilleJuridiqueTab locale={locale} />}
      </div>
    </div>
  );
}
