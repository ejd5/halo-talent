"use client";

import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { DNA_COMPLETION, WALLET } from "@/lib/mock/studio-dashboard";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

function formatDate(locale: string): string {
  const d = new Date();
  return d.toLocaleDateString(locale === "pt" ? "pt-BR" : locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function GreetingHeader() {
  const locale = useLocale();
  const l = norm(locale);
  const dateStr = formatDate(locale);
  const credits = WALLET.balance.toLocaleString("fr-FR");

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1
          className="text-[1.6rem] font-semibold leading-tight mb-1"
          style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
        >
          Bonjour Alex
        </h1>
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          {dateStr}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/onboarding/dna"
          className="text-[10px] font-medium transition-colors hover:opacity-70"
          style={{ color: "var(--accent)" }}
        >
          ADN Créatif : {DNA_COMPLETION}%
        </Link>
        <Link
          href="/studio/credits"
          className="text-[9px] px-2 py-1 rounded-full transition-colors"
          style={{
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }}
        >
          {credits} crédits IA
        </Link>
      </div>
    </div>
  );
}
