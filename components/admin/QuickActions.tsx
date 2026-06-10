"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { FileText, FileSignature, Ban, TrendingDown, Bot, ChevronRight } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const ACTIONS = [
  {
    id: "candidatures",
    labelKey: "admin_dashboard.quick.candidatures",
    descKey: "admin_dashboard.quick.candidatures_desc",
    icon: FileText,
    count: 12,
    href: "/admin/applications",
    color: "var(--accent)",
  },
  {
    id: "contracts",
    labelKey: "admin_dashboard.quick.contracts",
    descKey: "admin_dashboard.quick.contracts_desc",
    icon: FileSignature,
    href: "/admin/contracts",
    color: "#8B5CF6",
  },
  {
    id: "payouts",
    labelKey: "admin_dashboard.quick.payouts",
    descKey: "admin_dashboard.quick.payouts_desc",
    icon: Ban,
    href: "/admin/payouts",
    color: "#DC2626",
  },
  {
    id: "creators",
    labelKey: "admin_dashboard.quick.creators",
    descKey: "admin_dashboard.quick.creators_desc",
    icon: TrendingDown,
    href: "/admin/creators",
    color: "#F59E0B",
  },
  {
    id: "copilot",
    labelKey: "admin_dashboard.quick.copilot",
    descKey: "admin_dashboard.quick.copilot_desc",
    icon: Bot,
    href: "/admin/copilot",
    color: "var(--success)",
  },
];

const MUTED = "var(--text-secondary)";
const MUTED_LIGHTER = "var(--text-tertiary)";

export function QuickActions() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        Actions rapides
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {ACTIONS.map((action) => {
          const isBig = action.count !== undefined;
          const Icon = action.icon;

          return (
            <Link
              key={action.id}
              href={action.href}
              className={`p-3 transition-all duration-200 hover:translate-y-[-2px] flex flex-col gap-2 ${isBig ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{
                backgroundColor: isBig ? "var(--accent-soft)" : "var(--bg-card)",
                border: isBig ? "1px solid var(--accent)" : "1px solid var(--border-default)",
                gridColumn: isBig ? undefined : undefined,
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 flex items-center justify-center rounded-sm"
                  style={{ backgroundColor: isBig ? "var(--accent)" : "var(--accent-soft)" }}
                >
                  <Icon size={13} color={isBig ? "var(--accent-text, #fff)" : action.color} />
                </div>
                <span className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>
                  {t(action.labelKey, l)}
                </span>
                {action.count && (
                  <span
                    className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-sm animate-pulse"
                    style={{ backgroundColor: "var(--accent)", color: "var(--accent-text, #fff)" }}
                  >
                    {action.count}
                  </span>
                )}
              </div>
              <p className="text-[9px] leading-relaxed" style={{ color: MUTED }}>
                {t(action.descKey, l).replace("{n}", String(action.count ?? ""))}
              </p>
              <span className="text-[8px] flex items-center gap-0.5 mt-auto" style={{ color: action.color }}>
                {t("admin_dashboard.quick.view_all", l)}
                <ChevronRight size={8} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
