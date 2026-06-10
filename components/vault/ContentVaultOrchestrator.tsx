"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { Package, Search, Loader2, Archive, AlertTriangle } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  contentVaultAssets,
  computeSmartLabels,
  type ContentAsset,
  type ContentType,
  type RightsStatus,
  type SensitivityLevel,
  type SmartLabel,
  CONTENT_TYPE_LABELS,
  RIGHTS_STATUS_COLORS,
} from "@/lib/mock/content-vault";
import { ContentVaultGrid } from "./ContentVaultGrid";
import { ContentAssetDrawer } from "./ContentAssetDrawer";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

type DrawerTab = "overview" | "usage" | "rights" | "tags" | "reco";

type FilterType = ContentType | "all";
type FilterRights = RightsStatus | "all";
type FilterSensitivity = SensitivityLevel | "all";

export function ContentVaultOrchestrator() {
  const locale = useLocale();
  const l = norm(locale);

  // Data
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);

  // Selection
  const [selectedAsset, setSelectedAsset] = useState<ContentAsset | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<DrawerTab>("overview");

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [rightsFilter, setRightsFilter] = useState<FilterRights>("all");
  const [sensitivityFilter, setSensitivityFilter] = useState<FilterSensitivity>("all");

  // Action feedback
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Load mock data
  useEffect(() => {
    const timer = setTimeout(() => {
      setAssets(contentVaultAssets);
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Filtered assets
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.tags.some((tag) => tag.includes(q))) return false;
      }
      if (typeFilter !== "all" && a.type !== typeFilter) return false;
      if (rightsFilter !== "all" && a.rightsStatus !== rightsFilter) return false;
      if (sensitivityFilter !== "all" && a.sensitivityLevel !== sensitivityFilter) return false;
      return true;
    });
  }, [assets, search, typeFilter, rightsFilter, sensitivityFilter]);

  // Smart labels for selected asset
  const smartLabels = useMemo((): SmartLabel[] => {
    if (!selectedAsset) return [];
    return computeSmartLabels(selectedAsset);
  }, [selectedAsset]);

  // Handlers
  const handleSelectAsset = useCallback((asset: ContentAsset) => {
    setSelectedAsset(asset);
    setActiveTab("overview");
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedAsset(null);
  }, []);

  const handleTabChange = useCallback((tab: DrawerTab) => {
    setActiveTab(tab);
  }, []);

  const handleTagsChange = useCallback((newTags: string[]) => {
    setSelectedAsset((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, tags: newTags };
      // Also update in the main list
      setAssets((all) => all.map((a) => (a.id === updated.id ? updated : a)));
      return updated;
    });
  }, []);

  const showFeedback = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleAction = useCallback(
    (action: string, asset?: ContentAsset) => {
      const target = asset || selectedAsset;
      if (!target) return;

      const canUse = target.rightsStatus === "validated" && target.sensitivityLevel === "standard";

      if ((action === "campaign" || action === "ppv") && !canUse) {
        showFeedback(t("content_vault.action.blocked", l));
        return;
      }

      const feedbackMap: Record<string, string> = {
        campaign: t("content_vault.action.campaign_ok", l),
        ppv: t("content_vault.action.ppv_ok", l),
        variant: t("content_vault.action.variant_ok", l),
        archive: t("content_vault.action.archived", l),
        mark_sensitive: t("content_vault.action.marked_sensitive", l),
      };

      showFeedback(feedbackMap[action] || "✓");
    },
    [selectedAsset, l],
  );

  const activeRestrictionCount = assets.filter((a) => a.restrictions.some((r) => r.isActive)).length;

  // Filter chip groups
  const types: FilterType[] = ["all", "image", "video", "audio", "text", "bundle"];
  const rights: FilterRights[] = ["all", "validated", "pending", "expired", "disputed"];
  const sensitivities: FilterSensitivity[] = ["all", "standard", "sensitive", "restricted"];

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top bar */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-4 md:px-6 py-3 flex-wrap" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <h1 className="text-[13px] font-display font-bold" style={{ color: "var(--text-primary)" }}>
            {t("content_vault.page.title", l)}
          </h1>
          <span className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
            {assets.length}
          </span>
          {activeRestrictionCount > 0 && (
            <span
              className="flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded-sm"
              style={{ backgroundColor: "rgba(229,72,77,0.1)", color: "var(--danger)" }}
            >
              <AlertTriangle size={8} />
              {activeRestrictionCount} restriction{activeRestrictionCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {actionFeedback && (
          <span
            className="text-[9px] px-2 py-1 rounded-sm animate-pulse"
            style={{ backgroundColor: "rgba(16,185,129,0.1)", color: "var(--success)" }}
          >
            {actionFeedback}
          </span>
        )}
      </div>

      {/* Search + filters */}
      <div className="shrink-0 px-4 md:px-6 py-2.5 space-y-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Search */}
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.2)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("content_vault.filter.search", l)}
            className="w-full text-[10px] bg-transparent pl-7 pr-2 py-1.5 rounded-sm outline-none"
            style={{ color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.06)" }}
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-1.5">
          {/* Type filter */}
          {types.map((typ) => (
            <FilterChip
              key={typ}
              label={typ === "all" ? t("content_vault.filter.all", l) : t(CONTENT_TYPE_LABELS[typ as ContentType], l)}
              active={typeFilter === typ}
              onClick={() => setTypeFilter(typ)}
            />
          ))}

          <Divider />

          {/* Rights filter */}
          {rights.map((r) => (
            <FilterChip
              key={r}
              label={r === "all" ? t("content_vault.filter.all", l) : t(`content_vault.filter.${r === "pending" ? "pending_rights" : r === "validated" ? "validated" : "issues"}`, l)}
              active={rightsFilter === r}
              color={r !== "all" ? RIGHTS_STATUS_COLORS[r as RightsStatus] : undefined}
              onClick={() => setRightsFilter(r)}
            />
          ))}

          <Divider />

          {/* Sensitivity filter */}
          {sensitivities.map((s) => (
            <FilterChip
              key={s}
              label={s === "all" ? t("content_vault.filter.all", l) : t(`content_vault.filter.${s}`, l)}
              active={sensitivityFilter === s}
              color={s !== "all" && s !== "standard" ? "var(--danger)" : undefined}
              onClick={() => setSensitivityFilter(s)}
            />
          ))}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {loading ? (
          /* Skeleton grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-sm animate-pulse"
                style={{ backgroundColor: "rgba(255,255,255,0.03)", height: 240 }}
              />
            ))}
          </div>
        ) : assets.length === 0 ? (
          /* Empty vault */
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <Package size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-[12px] mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("content_vault.filter.vault_empty_title", l)}
            </p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
              {t("content_vault.filter.vault_empty_desc", l)}
            </p>
          </div>
        ) : filteredAssets.length === 0 ? (
          /* No results */
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <Search size={32} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-[12px] mt-4" style={{ color: "rgba(255,255,255,0.2)" }}>
              {t("content_vault.filter.no_results_title", l)}
            </p>
            <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
              {t("content_vault.filter.no_results_desc", l)}
            </p>
          </div>
        ) : (
          <ContentVaultGrid
            assets={filteredAssets}
            onSelectAsset={(asset) => {
              handleSelectAsset(asset);
            }}
          />
        )}
      </div>

      {/* Drawer */}
      {selectedAsset && (
        <ContentAssetDrawer
          asset={selectedAsset}
          smartLabels={smartLabels}
          open={drawerOpen}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onClose={handleCloseDrawer}
          onAction={(action) => handleAction(action)}
          onTagsChange={handleTagsChange}
        />
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  const chipColor = color || "var(--accent)";
  return (
    <button
      onClick={onClick}
      className="text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider transition-colors"
      style={{
        backgroundColor: active ? `${chipColor}15` : "rgba(255,255,255,0.04)",
        color: active ? chipColor : "rgba(255,255,255,0.3)",
      }}
    >
      {label}
    </button>
  );
}

function Divider() {
  return <span className="w-px self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />;
}
