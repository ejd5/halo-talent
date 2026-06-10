"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { ACTIVITY_ITEMS } from "@/lib/mock/admin-dashboard";
import { UserPlus, TrendingUp, FileSignature, MessageCircle, ExternalLink } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string }> = {
  new_creator: { icon: UserPlus, color: "var(--success)" },
  revenue: { icon: TrendingUp, color: "#F59E0B" },
  message: { icon: MessageCircle, color: "#3B82F6" },
  contract: { icon: FileSignature, color: "#8B5CF6" },
};

export function ActivityFeed() {
  const locale = useLocale();
  const l = norm(locale);

  return (
    <div>
      <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>
        {t("admin_dashboard.activity.title", l)}
      </h2>
      <div
        className="divide-y"
        style={{
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-default)",
        }}
      >
        {ACTIVITY_ITEMS.map((item) => {
          const config = TYPE_CONFIG[item.type];
          const Icon = config?.icon || MessageCircle;
          const color = config?.color || "var(--text-tertiary)";

          return (
            <Link
              key={item.id}
              href={item.relatedHref}
              className="flex items-start gap-3 p-3 transition-colors hover:translate-y-[-1px]"
              style={{ color: "var(--text-primary)" }}
            >
              <div
                className="w-7 h-7 flex items-center justify-center rounded-sm shrink-0 mt-0.5"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon size={12} style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
                  {t(item.descriptionKey, l).replace("{user}", item.user)}
                </p>
                <span className="text-[8px]" style={{ color: "var(--text-tertiary)" }}>
                  {item.timestamp}
                </span>
              </div>
              <ExternalLink size={10} style={{ color: "var(--text-tertiary)", marginTop: 4 }} />
            </Link>
          );
        })}
      </div>
      <Link
        href="/admin/activity"
        className="text-[10px] font-medium mt-2 inline-flex items-center gap-1 transition-colors"
        style={{ color: "var(--accent)" }}
      >
        {t("admin_dashboard.activity.view_all", l)}
      </Link>
    </div>
  );
}
