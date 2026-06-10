"use client";

import { useState, useMemo, useCallback } from "react";
import { Save, Send, FileDown, BarChart3, FlaskConical, ShieldCheck, TrendingUp, ChevronLeft, Package, Users, Loader2 } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  getRecommendations,
  runGuardrails,
  generateABVariants,
  generateForecast,
  type PPVProduct,
  type PPVRecommendation,
} from "@/lib/mock/atlas-ppv";
import { mockFans, computeSegments, type FanSegment } from "@/lib/mock/atlas-fans";
import { PPVContentSelector } from "./PPVContentSelector";
import { PPVRecommendationCard } from "./PPVRecommendationCard";
import { PPVGuardrails } from "./PPVGuardrails";
import { PPVABTestPanel } from "./PPVABTestPanel";
import { PPVRevenueForecast } from "./PPVRevenueForecast";
import { FanSegmentCards } from "./FanSegmentCards";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

type TabId = "reco" | "guardrails" | "abtest" | "forecast";

const TABS: { id: TabId; labelKey: string; icon: React.ElementType }[] = [
  { id: "reco", labelKey: "ppv_pricing.tab.reco", icon: TrendingUp },
  { id: "guardrails", labelKey: "ppv_pricing.tab.guardrails", icon: ShieldCheck },
  { id: "abtest", labelKey: "ppv_pricing.tab.abtest", icon: FlaskConical },
  { id: "forecast", labelKey: "ppv_pricing.tab.forecast", icon: BarChart3 },
];

export function PPVPricingLab() {
  const locale = useLocale();
  const l = norm(locale);
  const [selectedProduct, setSelectedProduct] = useState<PPVProduct | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<FanSegment | null>(null);
  const [customPrice, setCustomPrice] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("reco");
  const [isSaving, setIsSaving] = useState(false);
  const [showMobilePanel, setShowMobilePanel] = useState<"content" | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const segments = useMemo(() => computeSegments(mockFans), []);

  const recommendations = useMemo((): PPVRecommendation[] => {
    if (!selectedProduct || !selectedSegment) return [];
    return getRecommendations(selectedProduct, selectedSegment.fanIds);
  }, [selectedProduct, selectedSegment]);

  const guardrails = useMemo(() => {
    if (!selectedProduct || !selectedSegment || recommendations.length === 0) return [];
    return runGuardrails(selectedProduct, recommendations, selectedSegment.fanIds);
  }, [selectedProduct, selectedSegment, recommendations]);

  const abVariants = useMemo(() => {
    if (recommendations.length === 0) return [];
    return generateABVariants(recommendations);
  }, [recommendations]);

  const forecast = useMemo(() => {
    return generateForecast(recommendations, abVariants);
  }, [recommendations, abVariants]);

  const hasBlockOrWarn = useMemo(
    () => guardrails.some((c) => c.status === "warn" || (c.status === "block" && c.category !== "disclaimer")),
    [guardrails],
  );

  const hasBlock = useMemo(
    () => guardrails.some((c) => c.status === "block" && c.category !== "disclaimer"),
    [guardrails],
  );

  const hasSelection = selectedProduct !== null && selectedSegment !== null;

  const handleSelectProduct = useCallback((product: PPVProduct) => {
    setSelectedProduct(product);
    setCustomPrice(null);
    setShowMobilePanel(null);
  }, []);

  const handleSegmentClick = useCallback((segment: FanSegment) => {
    setSelectedSegment(segment);
    setCustomPrice(null);
  }, []);

  const handleClearSegment = useCallback(() => {
    setSelectedSegment(null);
    setCustomPrice(null);
  }, []);

  const handlePriceChange = useCallback((price: number) => {
    setCustomPrice(price);
  }, []);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    showFeedback(t("ppv_pricing.actions.saved", l));
  };

  const handleCreateCampaign = async () => {
    if (hasBlock) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSaving(false);
    showFeedback(t("ppv_pricing.actions.creating", l));
  };

  const handleExport = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    showFeedback(t("ppv_pricing.actions.exporting", l));
  };

  const canCreateCampaign = hasSelection && recommendations.length > 0 && !hasBlock;

  return (
    <div className="flex h-full">
      {/* Content panel - left sidebar */}
      <div
        className={`${showMobilePanel === "content" ? "fixed inset-0 z-40" : "hidden"} lg:relative lg:flex lg:w-[280px] lg:shrink-0`}
        style={{ backgroundColor: "#1A1614" }}
      >
        {/* Mobile close */}
        {showMobilePanel === "content" && (
          <button
            onClick={() => setShowMobilePanel(null)}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-sm lg:hidden"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            <ChevronLeft size={18} />
          </button>
        )}
        <PPVContentSelector
          selectedProduct={selectedProduct}
          onSelectProduct={handleSelectProduct}
        />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="shrink-0 px-4 md:px-6 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobilePanel("content")}
              className="lg:hidden p-1.5 rounded-sm"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <Package size={16} />
            </button>
            <div className="min-w-0">
              <h1 className="text-[13px] font-display font-bold" style={{ color: "var(--text-primary)" }}>
                {t("ppv_pricing.title", l)}
              </h1>
              <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
                {selectedProduct ? `${selectedProduct.name} · ${selectedSegment?.name || t("ppv_pricing.segment.select_prompt", l)}` : t("ppv_pricing.subtitle", l)}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Feedback toast */}
            {actionFeedback && (
              <span className="text-[9px] px-2 py-1 rounded-sm animate-pulse" style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--success)" }}>
                {actionFeedback}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasSelection}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[10px] font-medium transition-opacity disabled:opacity-30"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {isSaving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              <span className="hidden sm:inline">{t("ppv_pricing.actions.save", l)}</span>
            </button>
            <button
              onClick={handleCreateCampaign}
              disabled={!canCreateCampaign}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[10px] font-medium transition-opacity disabled:opacity-30"
              style={{
                backgroundColor: hasBlock ? "rgba(229,72,77,0.15)" : "rgba(199,91,57,0.15)",
                color: hasBlock ? "var(--danger)" : "var(--accent)",
                border: `1px solid ${hasBlock ? "rgba(229,72,77,0.2)" : "rgba(199,91,57,0.2)"}`,
              }}
              title={hasBlock ? t("ppv_pricing.actions.campaign_blocked", l) : undefined}
            >
              <Send size={12} />
              <span className="hidden sm:inline">{t("ppv_pricing.actions.create_campaign", l)}</span>
            </button>
            <button
              onClick={handleExport}
              disabled={!hasSelection}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-[10px] font-medium transition-opacity disabled:opacity-30"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <FileDown size={12} />
              <span className="hidden sm:inline">{t("ppv_pricing.actions.export_report", l)}</span>
            </button>
          </div>
        </div>

        {/* Segment selector */}
        <div className="shrink-0 px-4 md:px-6 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {selectedSegment ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>
                {t("ppv_pricing.segment.selected", l)}
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)" }}>
                {selectedSegment.name}
              </span>
              <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                {selectedSegment.fanIds.length} {t("ppv_pricing.segment.fans", l)}
              </span>
              <button
                onClick={handleClearSegment}
                className="text-[9px] ml-1 px-1.5 py-0.5 rounded-sm"
                style={{ color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                ✕
              </button>
            </div>
          ) : (
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("ppv_pricing.segment.select_prompt", l)}
            </p>
          )}
        </div>

        {/* FanSegmentCards */}
        <div className="shrink-0 px-4 md:px-6 py-3 overflow-x-auto">
          <FanSegmentCards
            segments={segments}
            activeSegmentId={selectedSegment?.id || null}
            onSegmentClick={handleSegmentClick}
            onClearSegment={handleClearSegment}
          />
        </div>

        {/* Tabs */}
        <div className="shrink-0 flex items-center gap-1 px-4 md:px-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-medium transition-colors relative"
                style={{
                  color: isActive ? "var(--text-primary)" : "rgba(255,255,255,0.3)",
                }}
              >
                <Icon size={12} />
                {t(tab.labelKey, l)}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: "var(--accent)" }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {!hasSelection ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <BarChart3 size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
              <p className="text-[12px] mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                {t("ppv_pricing.no_selection", l)}
              </p>
              <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
                {t("ppv_pricing.no_selection_desc", l)}
              </p>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <Users size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
              <p className="text-[12px] mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                {t("ppv_pricing.reco.segment_empty", l)}
              </p>
            </div>
          ) : (
            <>
              {activeTab === "reco" && (
                <PPVRecommendationCard
                  product={selectedProduct}
                  selectedSegmentName={selectedSegment?.name || null}
                  recommendations={recommendations}
                  customPrice={customPrice}
                  onPriceChange={handlePriceChange}
                />
              )}
              {activeTab === "guardrails" && (
                <PPVGuardrails
                  checks={guardrails}
                  hasWarnOrBlock={hasBlockOrWarn}
                />
              )}
              {activeTab === "abtest" && (
                <PPVABTestPanel
                  variants={abVariants}
                  hasSelection={hasSelection}
                />
              )}
              {activeTab === "forecast" && (
                <PPVRevenueForecast
                  forecast={forecast}
                  hasSelection={hasSelection}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
