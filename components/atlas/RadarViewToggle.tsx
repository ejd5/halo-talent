"use client";

import { List, Columns } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function RadarViewToggle({
  view,
  onViewChange,
}: {
  view: "list" | "kanban";
  onViewChange: (v: "list" | "kanban") => void;
}) {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div className="flex items-center gap-0">
      <button
        onClick={() => onViewChange("list")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium transition-colors rounded-l-md"
        style={{
          backgroundColor: view === "list" ? "var(--accent)" : "var(--bg-card)",
          color: view === "list" ? "#fff" : "var(--text-secondary)",
          border: "1px solid var(--border-default)",
        }}
      >
        <List size={12} />
        {t("revenue_radar.view_list", l)}
      </button>
      <button
        onClick={() => onViewChange("kanban")}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium transition-colors rounded-r-md"
        style={{
          backgroundColor: view === "kanban" ? "var(--accent)" : "var(--bg-card)",
          color: view === "kanban" ? "#fff" : "var(--text-secondary)",
          border: "1px solid var(--border-default)",
          borderLeft: "none",
        }}
      >
        <Columns size={12} />
        {t("revenue_radar.view_kanban", l)}
      </button>
    </div>
  );
}
