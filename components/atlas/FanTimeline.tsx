"use client";

import { MessageCircle, DollarSign, ArrowUpCircle, ClipboardList, ShieldCheck } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { timeAgo } from "@/lib/mock/atlas-fans";
import type { FanIntelEvent } from "@/lib/mock/atlas-fans";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface FanTimelineProps {
  events: FanIntelEvent[];
}

const EVENT_ICONS: Record<string, React.ElementType> = {
  message: MessageCircle,
  purchase: DollarSign,
  tier_change: ArrowUpCircle,
  note: ClipboardList,
  consent_change: ShieldCheck,
};

const EVENT_COLORS: Record<string, string> = {
  message: "#3B82F6",
  purchase: "var(--success)",
  tier_change: "#8B5CF6",
  note: "rgba(255,255,255,0.4)",
  consent_change: "#F59E0B",
};

const EVENT_LABEL_KEYS: Record<string, string> = {
  message: "fan_intel.timeline.message",
  purchase: "fan_intel.timeline.purchase",
  tier_change: "fan_intel.timeline.tier_change",
  note: "fan_intel.timeline.note",
  consent_change: "fan_intel.timeline.consent_change",
};

export function FanTimeline({ events }: FanTimelineProps) {
  const locale = useLocale();
  const l = norm(locale);

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <MessageCircle size={28} style={{ color: "rgba(255,255,255,0.08)" }} />
        <p className="text-[11px] mt-3" style={{ color: "rgba(255,255,255,0.2)" }}>
          {t("fan_intel.timeline.no_activity", l)}
        </p>
      </div>
    );
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  );

  return (
    <div className="p-4">
      <div className="relative pl-6">
        {/* Vertical line */}
        <div
          className="absolute left-[7px] top-1 bottom-1 w-px"
          style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
        />

        <div className="space-y-4">
          {sorted.map((event) => {
            const Icon = EVENT_ICONS[event.type] || MessageCircle;
            const color = EVENT_COLORS[event.type] || "rgba(255,255,255,0.3)";
            const labelKey = EVENT_LABEL_KEYS[event.type] || "";
            const label = labelKey ? t(labelKey, l) : event.type;

            return (
              <div key={event.id} className="relative">
                {/* Dot */}
                <div
                  className="absolute -left-[23px] top-1 w-[13px] h-[13px] rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${color}20`, border: `1.5px solid ${color}` }}
                >
                  <Icon size={6} style={{ color }} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>
                      {label}
                    </span>
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                      {timeAgo(event.occurredAt)}
                    </span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {event.detail || event.description}
                  </p>
                  {event.amount && (
                    <span className="text-[10px] font-medium mt-0.5 inline-block" style={{ color: "var(--success)" }}>
                      €{event.amount}
                    </span>
                  )}
                  {event.channel && (
                    <span
                      className="text-[9px] ml-1 px-1 py-px rounded-sm"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
                    >
                      {event.channel}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
