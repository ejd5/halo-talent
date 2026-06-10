"use client";

import { useState } from "react";
import { Image, Video, FileAudio, FileText, DollarSign } from "lucide-react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { timeAgo } from "@/lib/mock/atlas-fans";
import type { FanIntel } from "@/lib/mock/atlas-fans";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

interface FanContentHistoryProps {
  fan: FanIntel;
}

const MEDIA_ICONS: Record<string, React.ElementType> = {
  image: Image,
  video: Video,
  audio: FileAudio,
  document: FileText,
};

const MEDIA_LABELS: Record<string, string> = {
  image: "Image",
  video: "Vidéo",
  audio: "Audio",
  document: "Document",
};

type Tab = "purchased" | "sent";

export function FanContentHistory({ fan }: FanContentHistoryProps) {
  const locale = useLocale();
  const l = norm(locale);
  const [tab, setTab] = useState<Tab>("purchased");

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <button
          onClick={() => setTab("purchased")}
          className="flex-1 px-3 py-2.5 text-[11px] font-medium transition-colors"
          style={{
            color: tab === "purchased" ? "var(--accent)" : "rgba(255,255,255,0.3)",
            borderBottom: tab === "purchased" ? "2px solid var(--accent)" : "2px solid transparent",
          }}
        >
          {t("fan_intel.content.purchased", l)}
          <span className="ml-1.5 text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            {fan.purchasedContentIds.length}
          </span>
        </button>
        <button
          onClick={() => setTab("sent")}
          className="flex-1 px-3 py-2.5 text-[11px] font-medium transition-colors"
          style={{
            color: tab === "sent" ? "var(--accent)" : "rgba(255,255,255,0.3)",
            borderBottom: tab === "sent" ? "2px solid var(--accent)" : "2px solid transparent",
          }}
        >
          {t("fan_intel.content.sent", l)}
          <span className="ml-1.5 text-[9px]" style={{ color: "rgba(255,255,255,0.15)" }}>
            {fan.sentContentIds.length}
          </span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "purchased" ? (
          fan.purchasedContentIds.length === 0 ? (
            <EmptyState message={t("fan_intel.content.no_purchased", l)} />
          ) : (
            <div className="space-y-2">
              {fan.purchasedContentIds.map((content) => {
                const Icon = MEDIA_ICONS[content.type] || FileText;
                return (
                  <ContentCard
                    key={content.id}
                    icon={<Icon size={14} />}
                    title={content.title}
                    date={timeAgo(content.date)}
                    type={MEDIA_LABELS[content.type] || content.type}
                    amount={content.amount}
                  />
                );
              })}
            </div>
          )
        ) : fan.sentContentIds.length === 0 ? (
          <EmptyState message={t("fan_intel.content.no_sent", l)} />
        ) : (
          <div className="space-y-2">
            {fan.sentContentIds.map((content) => {
              const Icon = MEDIA_ICONS[content.type] || FileText;
              return (
                <ContentCard
                  key={content.id}
                  icon={<Icon size={14} />}
                  title={content.title}
                  date={timeAgo(content.date)}
                  type={content.isPPV ? "PPV" : "Gratuit"}
                  ppv={content.isPPV}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <Image size={24} style={{ color: "rgba(255,255,255,0.08)" }} />
      <p className="text-[11px] mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
        {message}
      </p>
    </div>
  );
}

function ContentCard({
  icon,
  title,
  date,
  type,
  amount,
  ppv,
}: {
  icon: React.ReactNode;
  title: string;
  date: string;
  type: string;
  amount?: number;
  ppv?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-sm"
      style={{ backgroundColor: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.04)" }}
    >
      <div
        className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0"
        style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
          {title}
        </p>
        <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
          {date}
        </p>
      </div>
      <div className="text-right shrink-0">
        <span
          className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium"
          style={{
            backgroundColor: ppv ? "rgba(16,185,129,0.1)" : type === "PPV" ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.06)",
            color: ppv ? "var(--success)" : type === "PPV" ? "var(--success)" : "rgba(255,255,255,0.35)",
          }}
        >
          {type}
        </span>
        {amount !== undefined && (
          <p className="text-[10px] mt-0.5 font-medium" style={{ color: "var(--success)" }}>
            <DollarSign size={8} className="inline mr-0.5" />
            {amount}
          </p>
        )}
      </div>
    </div>
  );
}
