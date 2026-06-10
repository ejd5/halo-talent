"use client";

import { useState } from "react";
import { Search, Package } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  type PPVProduct,
  mockPPVProducts,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
} from "@/lib/mock/atlas-ppv";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface PPVContentSelectorProps {
  selectedProduct: PPVProduct | null;
  onSelectProduct: (product: PPVProduct) => void;
}

export function PPVContentSelector({ selectedProduct, onSelectProduct }: PPVContentSelectorProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  const filtered = mockPPVProducts.filter((p) => {
    if (categoryFilter && p.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  const categories = [...new Set(mockPPVProducts.map((p) => p.category))];

  return (
    <div
      className="flex flex-col h-full"
      style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Header */}
      <div className="shrink-0 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <h3 className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
          {t("ppv_pricing.content.selector_title", l)}
        </h3>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 py-2">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.2)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("ppv_pricing.content.search", l)}
            className="w-full text-[10px] bg-transparent pl-7 pr-2 py-1.5 rounded-sm outline-none transition-colors"
            style={{
              color: "rgba(255,255,255,0.5)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        </div>
      </div>

      {/* Category filter chips */}
      <div className="shrink-0 flex flex-wrap gap-1 px-3 pb-2">
        <button
          onClick={() => setCategoryFilter("")}
          className="text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider transition-colors"
          style={{
            backgroundColor: !categoryFilter ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
            color: !categoryFilter ? "var(--accent)" : "rgba(255,255,255,0.3)",
          }}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(categoryFilter === cat ? "" : cat)}
            className="text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider transition-colors"
            style={{
              backgroundColor: categoryFilter === cat ? "rgba(199,91,57,0.12)" : "rgba(255,255,255,0.04)",
              color: categoryFilter === cat ? "var(--accent)" : "rgba(255,255,255,0.3)",
            }}
          >
            {t(`ppv_pricing.content.${cat}`, l)}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Package size={24} style={{ color: "rgba(255,255,255,0.06)" }} />
            <p className="text-[10px] mt-2" style={{ color: "rgba(255,255,255,0.15)" }}>
              {t("ppv_pricing.content.no_content", l)}
            </p>
          </div>
        ) : (
          filtered.map((product) => {
            const isSelected = selectedProduct?.id === product.id;
            const color = CATEGORY_COLORS[product.category] || "rgba(255,255,255,0.3)";

            return (
              <button
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="w-full text-left p-2.5 rounded-sm transition-all"
                style={{
                  backgroundColor: isSelected ? "rgba(199,91,57,0.08)" : "rgba(255,255,255,0.02)",
                  border: `1px solid ${isSelected ? "rgba(199,91,57,0.2)" : "rgba(255,255,255,0.04)"}`,
                }}
              >
                {/* Thumbnail */}
                <div
                  className="w-full aspect-[16/9] rounded-sm mb-2 flex items-center justify-center text-[9px] font-medium"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {CATEGORY_LABELS[product.category] || product.category}
                </div>

                <p className="text-[11px] font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {product.name}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] font-medium" style={{ color: "var(--success)" }}>
                    {product.basePrice}€
                  </span>
                  <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {Math.round(product.unlockRate * 100)}% unlock
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
