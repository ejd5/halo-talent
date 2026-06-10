"use client";

import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { Sparkles } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function DemoBadge() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <span
      className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium rounded-sm"
      style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent)" }}
    >
      <Sparkles size={10} />
      {t("admin_dashboard.demo_badge", l)}
    </span>
  );
}
