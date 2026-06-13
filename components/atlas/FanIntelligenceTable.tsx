"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown, ChevronUp, Eye, ExternalLink, Square, CheckSquare, X } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  type FanIntel,
  type FanSegment,
  sortFans,
  filterFans,
  formatCurrency,
  timeAgo,
  PLATFORM_LABELS,
  PLATFORM_COLORS,
  CHURN_RISK_COLORS,
} from "@/lib/mock/atlas-fans";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

type SortField = "pseudonyme" | "platform" | "totalSpend" | "spendLast30d" | "lastMessage" | "churnRisk" | "relationshipScore" | "commercialScore";

interface FanIntelligenceTableProps {
  fans: FanIntel[];
  activeSegment: FanSegment | null;
  onClearSegment: () => void;
  onSelectFan: (fan: FanIntel) => void;
  selectedFanIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function FanIntelligenceTable({
  fans,
  activeSegment,
  onClearSegment,
  onSelectFan,
  selectedFanIds,
  onSelectionChange,
}: FanIntelligenceTableProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [sortField, setSortField] = useState<SortField>("totalSpend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("");

  const sorted = useMemo(() => {
    const filtered = filterFans(fans, {
      search,
      tier: tierFilter || undefined,
      segmentFanIds: activeSegment?.fanIds,
    });
    return sortFans(filtered, sortField, sortDir);
  }, [fans, sortField, sortDir, search, tierFilter, activeSegment]);

  const allSelected = sorted.length > 0 && sorted.every((f) => selectedFanIds.includes(f.id));
  const someSelected = sorted.some((f) => selectedFanIds.includes(f.id));

  const toggleAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(sorted.map((f) => f.id));
    }
  };

  const toggleFan = (id: string) => {
    if (selectedFanIds.includes(id)) {
      onSelectionChange(selectedFanIds.filter((sid) => sid !== id));
    } else {
      onSelectionChange([...selectedFanIds, id]);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />;
  };

  const TIERS = ["vip", "whale", "engaged", "warm", "cold"];

  return (
    <div className="space-y-3">
      {/* Search + filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.2)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("fan_intel.search_placeholder", l)}
            className="w-full text-[11px] bg-transparent pl-8 pr-3 py-2 rounded-sm outline-none transition-colors"
            style={{
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              backgroundColor: "rgba(255,255,255,0.02)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--color-accent, var(--or, #D8A95B))";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
            }}
          />
        </div>

        {/* Tier filter chips */}
        <div className="flex items-center gap-1">
          {TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tierFilter === tier ? "" : tier)}
              className="text-[9px] px-2 py-1 rounded-sm font-medium uppercase tracking-wider transition-all"
              style={{
                backgroundColor: tierFilter === tier ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
                color: tierFilter === tier ? "var(--accent)" : "rgba(255,255,255,0.3)",
                border: `1px solid ${tierFilter === tier ? "rgba(199,91,57,0.2)" : "rgba(255,255,255,0.04)"}`,
              }}
            >
              {tier === "vip" ? "VIP" : tier === "whale" ? "Whale" : tier === "engaged" ? "Engagé" : tier === "warm" ? "Tède" : "Froid"}
            </button>
          ))}
        </div>
      </div>

      {/* Active segment chip */}
      {activeSegment && (
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] px-2 py-0.5 rounded-sm font-medium flex items-center gap-1 cursor-pointer"
            style={{ backgroundColor: "rgba(199,91,57,0.12)", color: "var(--accent)" }}
            onClick={onClearSegment}
          >
            {activeSegment.name}
            <X size={10} />
          </span>
        </div>
      )}

      {/* Batch actions bar */}
      {selectedFanIds.length > 0 && (
        <div
          className="flex items-center gap-3 px-3 py-2 rounded-sm"
          style={{ backgroundColor: "rgba(199,91,57,0.08)", border: "1px solid rgba(199,91,57,0.12)" }}
        >
          <span className="text-[10px]" style={{ color: "var(--accent)" }}>
            {selectedFanIds.length} sélectionné{selectedFanIds.length > 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              className="text-[10px] px-2 py-1 rounded-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            >
              Ajouter tag
            </button>
            <button
              className="text-[10px] px-2 py-1 rounded-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "rgba(199,91,57,0.2)", color: "var(--accent)" }}
            >
              Créer campagne
            </button>
            <button
              className="text-[10px] px-2 py-1 rounded-sm font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
            >
              Exporter
            </button>
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
        {sorted.length} fan{sorted.length !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
          <p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.15)" }}>
            {search || tierFilter || activeSegment ? t("fan_intel.table.no_results", l) : t("fan_intel.table.no_fans", l)}
          </p>
          <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.1)" }}>
            {search || tierFilter || activeSegment ? "Essayez d'ajuster vos filtres" : "Importe ou connecte tes plateformes pour voir tes fans apparaître"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          <table className="w-full text-[11px]">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <th className="text-left px-3 py-2.5 w-8">
                  <button onClick={toggleAll} className="p-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {allSelected ? <CheckSquare size={14} /> : someSelected ? (
                      <div style={{ width: 14, height: 14, border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 2 }} />
                    ) : <Square size={14} />}
                  </button>
                </th>
                <ThButton onClick={() => handleSort("pseudonyme")} active={sortField === "pseudonyme"}>
                  {t("fan_intel.table.fan", l)} <SortIcon field="pseudonyme" />
                </ThButton>
                <ThButton onClick={() => handleSort("platform")} active={sortField === "platform"}>
                  {t("fan_intel.table.platform", l)} <SortIcon field="platform" />
                </ThButton>
                <ThButton onClick={() => handleSort("totalSpend")} active={sortField === "totalSpend"}>
                  {t("fan_intel.table.total_spent", l)} <SortIcon field="totalSpend" />
                </ThButton>
                <ThButton onClick={() => handleSort("spendLast30d")} active={sortField === "spendLast30d"}>
                  {t("fan_intel.table.spend_30d", l)} <SortIcon field="spendLast30d" />
                </ThButton>
                <ThButton onClick={() => handleSort("relationshipScore")} active={sortField === "relationshipScore"}>
                  {t("fan_intel.table.score", l)} <SortIcon field="relationshipScore" />
                </ThButton>
                <ThButton onClick={() => handleSort("lastMessage")} active={sortField === "lastMessage"}>
                  {t("fan_intel.table.last_msg", l)} <SortIcon field="lastMessage" />
                </ThButton>
                <ThButton onClick={() => handleSort("churnRisk")} active={sortField === "churnRisk"}>
                  {t("fan_intel.table.churn_risk", l)} <SortIcon field="churnRisk" />
                </ThButton>
                <th className="text-right px-3 py-2.5 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {t("fan_intel.table.actions", l)}
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((fan) => {
                const isSelected = selectedFanIds.includes(fan.id);
                const platformColor = PLATFORM_COLORS[fan.platform] || "rgba(255,255,255,0.3)";
                const relationshipScore = fan.relationshipScore;
                const scoreColor = relationshipScore >= 70 ? "var(--success)" : relationshipScore >= 50 ? "#F59E0B" : "rgba(255,255,255,0.3)";

                return (
                  <tr
                    key={fan.id}
                    className="transition-colors"
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.03)",
                      backgroundColor: isSelected ? "rgba(199,91,57,0.04)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.015)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    {/* Checkbox */}
                    <td className="px-3 py-2.5">
                      <button onClick={() => toggleFan(fan.id)} className="p-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {isSelected ? <CheckSquare size={14} style={{ color: "var(--accent)" }} /> : <Square size={14} />}
                      </button>
                    </td>

                    {/* Fan name */}
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() => onSelectFan(fan)}
                        className="flex items-center gap-2.5 text-left hover:opacity-80 transition-opacity"
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-display font-bold shrink-0"
                          style={{ backgroundColor: "var(--color-accent, var(--or, #D8A95B))", color: "#fff" }}
                        >
                          {fan.pseudonyme.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                            {fan.pseudonyme}
                          </p>
                          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                            {fan.country}
                          </p>
                        </div>
                      </button>
                    </td>

                    {/* Platform */}
                    <td className="px-3 py-2.5">
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
                        style={{ backgroundColor: `${platformColor}20`, color: platformColor }}
                      >
                        {PLATFORM_LABELS[fan.platform] || fan.platform}
                      </span>
                    </td>

                    {/* Total spend */}
                    <td className="px-3 py-2.5">
                      <span className="font-medium" style={{ color: "var(--success)" }}>
                        {formatCurrency(fan.totalSpend)}
                      </span>
                    </td>

                    {/* 30d spend */}
                    <td className="px-3 py-2.5">
                      <span style={{ color: fan.spendLast30d > 0 ? "var(--success)" : "rgba(255,255,255,0.2)" }}>
                        {fan.spendLast30d > 0 ? formatCurrency(fan.spendLast30d) : ", "}
                      </span>
                    </td>

                    {/* Score */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-1 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                          <div
                            className="h-full rounded-sm"
                            style={{ width: `${relationshipScore}%`, backgroundColor: scoreColor }}
                          />
                        </div>
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {relationshipScore}
                        </span>
                      </div>
                    </td>

                    {/* Last message */}
                    <td className="px-3 py-2.5">
                      <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {timeAgo(fan.lastMessage)}
                      </span>
                    </td>

                    {/* Churn risk */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: CHURN_RISK_COLORS(fan.churnRisk) }}
                        />
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                          {fan.churnRisk}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectFan(fan)}
                          className="p-1 transition-opacity hover:opacity-70"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                          title="Aperçu rapide"
                        >
                          <Eye size={13} />
                        </button>
                        <Link
                          href={`/dashboard/atlas/fans/${fan.id}`}
                          className="p-1 transition-opacity hover:opacity-70"
                          style={{ color: "rgba(255,255,255,0.3)" }}
                          title="Fiche complète"
                        >
                          <ExternalLink size={12} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ThButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <th className="text-left px-3 py-2.5">
      <button
        onClick={onClick}
        className="flex items-center gap-1 font-medium text-[10px] uppercase tracking-wider transition-colors hover:opacity-70"
        style={{ color: active ? "var(--accent)" : "rgba(255,255,255,0.3)" }}
      >
        {children}
      </button>
    </th>
  );
}
