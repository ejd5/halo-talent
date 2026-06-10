"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { WALLET } from "@/lib/mock/studio-dashboard";
import { Coins, KeyRound, ArrowUpRight } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const CONSUMPTION_TYPES: { key: string; labelKey: string; color: string }[] = [
  { key: "text", labelKey: "studio_dashboard.credits.consumption.text", color: "#3B82F6" },
  { key: "image", labelKey: "studio_dashboard.credits.consumption.image", color: "var(--accent)" },
  { key: "video", labelKey: "studio_dashboard.credits.consumption.video", color: "#8B5CF6" },
  { key: "audio", labelKey: "studio_dashboard.credits.consumption.audio", color: "var(--success)" },
];

export function CreditUsageWidget() {
  const locale = useLocale();
  const l = norm(locale);
  const used = WALLET.monthlyQuota - WALLET.balance;
  const usagePct = Math.round((used / WALLET.monthlyQuota) * 100);
  const remainingDays = Math.max(1, Math.round(WALLET.balance / (used / 20))); // ~20 days into month

  return (
    <div>
      <h2 className="text-[13px] font-display font-bold mb-3" style={{ color: "var(--text-primary)" }}>
        {t("studio_dashboard.credits.title", l)}
      </h2>
      <div
        className="p-4"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
      >
        {/* Balance + Tier */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Coins size={14} style={{ color: "#F59E0B" }} />
            <span className="text-[18px] font-bold" style={{ color: "var(--text-primary)" }}>
              {WALLET.balance.toLocaleString()}
            </span>
          </div>
          <span className="text-[8px] px-1.5 py-0.5" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}>
            {t("studio_dashboard.credits.tier", l).replace("{tier}", WALLET.tier)}
          </span>
        </div>

        {/* Monthly progress */}
        <div className="mb-3">
          <div className="flex justify-between text-[8px] mb-1">
            <span style={{ color: "rgba(255,255,255,0.4)" }}>{t("studio_dashboard.credits.used", l)}</span>
            <span style={{ color: "rgba(255,255,255,0.4)" }}>
              {used.toLocaleString()} / {WALLET.monthlyQuota.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full transition-all"
              style={{ width: `${usagePct}%`, background: usagePct > 80 ? "var(--danger)" : "var(--accent)" }}
            />
          </div>
        </div>

        {/* Consumption breakdown */}
        <div className="space-y-1 mb-3">
          {CONSUMPTION_TYPES.map((ct) => {
            const val = WALLET.consumptionByType[ct.key as keyof typeof WALLET.consumptionByType];
            return (
              <div key={ct.key} className="flex items-center gap-2">
                <span className="text-[8px] w-8" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {t(ct.labelKey, l)}
                </span>
                <div className="flex-1 h-1" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full" style={{ width: `${val}%`, background: ct.color }} />
                </div>
                <span className="text-[7px] w-6 text-right" style={{ color: "rgba(255,255,255,0.3)" }}>
                  {val}%
                </span>
              </div>
            );
          })}
        </div>

        {/* Days remaining */}
        <p className="text-[8px] mb-3" style={{ color: "rgba(255,255,255,0.25)" }}>
          {t("studio_dashboard.credits.days_left", l).replace("{n}", String(remainingDays))}
        </p>

        {/* Links */}
        <div className="flex gap-2">
          {WALLET.byokEnabled && (
            <Link
              href="/studio/api-keys"
              className="flex items-center gap-1 text-[8px] px-2 py-1 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.4)" }}
            >
              <KeyRound size={8} />
              {t("studio_dashboard.credits.byok", l)}
            </Link>
          )}
          <Link
            href="/studio/credits"
            className="flex items-center gap-1 text-[8px] px-2 py-1 transition-colors"
            style={{ background: "rgba(199,91,57,0.1)", color: "var(--accent)" }}
          >
            <ArrowUpRight size={8} />
            {t("studio_dashboard.credits.upgrade", l)}
          </Link>
        </div>
      </div>
    </div>
  );
}
