"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { QUICK_ACTIONS } from "@/lib/mock/studio-dashboard";
import {
  PenSquare, Sparkles, Video, Calendar, DollarSign, ShieldCheck,
} from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const ICON_MAP: Record<string, React.ElementType> = {
  PenSquare, Sparkles, Video, Calendar, DollarSign, ShieldCheck,
};

export function QuickActionGrid() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("studio_dashboard.quick.title", l)}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = ICON_MAP[action.icon];
          return (
            <Link
              key={action.id}
              href={action.href}
              className="flex flex-col gap-2 p-3 transition-all duration-200 hover:translate-y-[-1px] group"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                borderLeft: `2px solid ${action.color}`,
              }}
            >
              {Icon && <Icon size={16} style={{ color: action.color }} />}
              <div>
                <p className="text-[11px] font-medium mb-0.5" style={{ color: "var(--text-primary)" }}>
                  {t(action.labelKey, l)}
                </p>
                <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {t(action.descriptionKey, l)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
