"use client";

import { Send, DollarSign, Eye, Megaphone, Clock } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import type { ContentAsset, UsageEvent } from "@/lib/mock/content-vault";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const EVENT_ICONS: Record<string, React.ElementType> = {
  send: Send,
  purchase: DollarSign,
  preview: Eye,
  campaign_include: Megaphone,
};

const EVENT_LABEL_KEYS: Record<string, string> = {
  send: "content_vault.usage.send",
  purchase: "content_vault.usage.purchase",
  preview: "content_vault.usage.preview",
  campaign_include: "content_vault.usage.campaign",
};

function timeAgo(dateStr: string): string {
  const days = Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 30) return `il y a ${days}j`;
  const months = Math.floor(days / 30);
  return `il y a ${months}mois`;
}

interface ContentUsageHistoryProps {
  asset: ContentAsset;
}

export function ContentUsageHistory({ asset }: ContentUsageHistoryProps) {
  const locale = useLocale();
  const l = norm(locale);

  if (asset.usageHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 text-center">
        <Clock size={28} style={{ color: "rgba(255,255,255,0.06)" }} />
        <p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("content_vault.usage.empty", l)}
        </p>
      </div>
    );
  }

  const sorted = [...asset.usageHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
        {t("content_vault.usage.title", l)} ({sorted.length})
      </p>
      <div className="space-y-1 max-h-[320px] overflow-y-auto">
        {sorted.map((event) => (
          <UsageEventRow key={event.id} event={event} locale={l} />
        ))}
      </div>
    </div>
  );
}

function UsageEventRow({ event, locale: l }: { event: UsageEvent; locale: Locale }) {
  const Icon = EVENT_ICONS[event.type] || Send;
  const labelKey = EVENT_LABEL_KEYS[event.type] || "content_vault.usage.send";

  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-sm"
      style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div className="p-1.5 rounded-sm shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
        <Icon size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
            {t(labelKey, l)}
          </span>
          <span className="text-[8px] uppercase px-1 py-px rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.25)" }}>
            {event.platform}
          </span>
        </div>
        <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>
          {timeAgo(event.date)}
          {event.fanName && ` · ${event.fanName}`}
        </p>
      </div>
      {event.revenue > 0 && (
        <span className="text-[11px] font-medium shrink-0" style={{ color: "var(--success)" }}>
          {event.revenue}€
        </span>
      )}
    </div>
  );
}
