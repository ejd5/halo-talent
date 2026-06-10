"use client";

import { X, Eye, Clock, ShieldCheck, Tag, Lightbulb } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { ContentAsset, SmartLabel, ContentType } from "@/lib/mock/content-vault";
import { CONTENT_TYPE_COLORS } from "@/lib/mock/content-vault";
import { ContentPerformancePanel } from "./ContentPerformancePanel";
import { ContentUsageHistory } from "./ContentUsageHistory";
import { ContentRightsPanel } from "./ContentRightsPanel";
import { ContentTagsManager } from "./ContentTagsManager";
import { ContentRecommendationPanel } from "./ContentRecommendationPanel";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

type DrawerTab = "overview" | "usage" | "rights" | "tags" | "reco";

const TABS: { key: DrawerTab; labelKey: string; icon: React.ElementType }[] = [
  { key: "overview", labelKey: "content_vault.drawer.tab.overview", icon: Eye },
  { key: "usage", labelKey: "content_vault.drawer.tab.usage", icon: Clock },
  { key: "rights", labelKey: "content_vault.drawer.tab.rights", icon: ShieldCheck },
  { key: "tags", labelKey: "content_vault.drawer.tab.tags", icon: Tag },
  { key: "reco", labelKey: "content_vault.drawer.tab.reco", icon: Lightbulb },
];

const TYPE_ICON: Record<ContentType, string> = {
  image: "📸",
  video: "🎬",
  audio: "🎧",
  text: "📝",
  bundle: "🎁",
};

interface ContentAssetDrawerProps {
  asset: ContentAsset;
  smartLabels: SmartLabel[];
  open: boolean;
  activeTab: DrawerTab;
  onTabChange: (tab: DrawerTab) => void;
  onClose: () => void;
  onAction: (action: string) => void;
  onTagsChange: (tags: string[]) => void;
}

export function ContentAssetDrawer({
  asset,
  smartLabels,
  open,
  activeTab,
  onTabChange,
  onClose,
  onAction,
  onTagsChange,
}: ContentAssetDrawerProps) {
  const locale = useLocale();
  const l = norm(locale);

  if (!open) return null;

  const typeColor = CONTENT_TYPE_COLORS[asset.type];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose} />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] lg:w-[560px] flex flex-col overflow-hidden"
        style={{ backgroundColor: "#1A1614", borderLeft: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Header */}
        <div className="shrink-0 px-4 py-3 flex items-center gap-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="w-10 h-10 rounded-sm flex items-center justify-center text-lg shrink-0"
            style={{ backgroundColor: `${typeColor}15` }}
          >
            {TYPE_ICON[asset.type]}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[12px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
              {asset.title}
            </h2>
            <span className="text-[9px]" style={{ color: typeColor }}>
              {asset.type}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-sm hover:opacity-70">
            <X size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
          </button>
        </div>

        {/* Smart labels row */}
        {smartLabels.length > 0 && (
          <div className="shrink-0 px-4 py-2 flex flex-wrap gap-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            {smartLabels.map((label) => {
              const labelColors: Record<string, { bg: string; text: string }> = {
                already_sent: { bg: "rgba(59,130,246,0.15)", text: "#3B82F6" },
                already_sold: { bg: "rgba(16,185,129,0.15)", text: "var(--success)" },
                fatigue_risk: { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" },
                reactivation_candidate: { bg: "rgba(139,92,246,0.15)", text: "#8B5CF6" },
                vip_candidate: { bg: "rgba(199,91,57,0.15)", text: "var(--accent)" },
                rights_issue: { bg: "rgba(229,72,77,0.15)", text: "var(--danger)" },
                sensitive: { bg: "rgba(229,72,77,0.15)", text: "var(--danger)" },
              };
              const c = labelColors[label.type] || labelColors.already_sent;
              return (
                <span
                  key={label.type}
                  className="text-[8px] px-1.5 py-0.5 rounded-sm font-medium uppercase tracking-wider"
                  style={{ backgroundColor: c.bg, color: c.text }}
                >
                  {t(label.labelKey, l)}
                </span>
              );
            })}
          </div>
        )}

        {/* Tabs */}
        <div className="shrink-0 flex" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2.5 text-[9px] font-medium uppercase tracking-wider transition-colors"
                style={{
                  color: isActive ? "var(--accent)" : "rgba(255,255,255,0.25)",
                  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                }}
              >
                <Icon size={11} />
                {t(tab.labelKey, l)}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === "overview" && <ContentPerformancePanel asset={asset} />}
          {activeTab === "usage" && <ContentUsageHistory asset={asset} />}
          {activeTab === "rights" && <ContentRightsPanel asset={asset} />}
          {activeTab === "tags" && (
            <ContentTagsManager tags={asset.tags} onTagsChange={onTagsChange} />
          )}
          {activeTab === "reco" && (
            <ContentRecommendationPanel
              asset={asset}
              smartLabels={smartLabels}
              onAction={onAction}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </>
  );
}
