"use client";

import { useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

type Period = "7d" | "30d" | "90d" | "12m" | "custom";

const PERIODS: Period[] = ["7d", "30d", "90d", "12m", "custom"];

interface PeriodSelectorProps {
  onChange?: (period: Period) => void;
}

export function PeriodSelector({ onChange }: PeriodSelectorProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [active, setActive] = useState<Period>("12m");

  return (
    <div
      className="inline-flex rounded-sm overflow-hidden"
      style={{ backgroundColor: "var(--bg-hover)", border: "1px solid var(--border-default)" }}
    >
      {PERIODS.map((p) => {
        const isActive = p === active;
        return (
          <button
            key={p}
            onClick={() => {
              setActive(p);
              onChange?.(p);
            }}
            className="text-[10px] px-2.5 py-1 font-medium transition-all duration-150"
            style={{
              backgroundColor: isActive ? "var(--accent)" : "transparent",
              color: isActive ? "var(--accent-text, #fff)" : "var(--text-secondary)",
            }}
          >
            {t(`admin_dashboard.period.${p}`, l)}
          </button>
        );
      })}
    </div>
  );
}
