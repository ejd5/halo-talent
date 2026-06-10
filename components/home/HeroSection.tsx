"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

/** legal.ts uses "pt", common.ts uses "pt-BR" — normalize at call site */
function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function HeroSection() {
  const locale = useLocale();
  const l = norm(locale);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen -mt-20 pt-20 grid grid-cols-1 md:grid-cols-[5fr_7fr] bg-base overflow-hidden">
      {/* ─── GAUCHE — Texte ─── */}
      <div className="flex items-center order-2 md:order-1">
        <div className="w-full pl-6 pr-6 md:pl-20 md:pr-16 py-20 md:py-0">
          {/* H1 — clip-path reveal */}
          <h1
            className="font-display font-bold text-ink leading-[1.1] tracking-[-0.02em] text-[1.75rem] sm:text-[2.25rem] md:text-[3.2rem] lg:text-[4rem] xl:text-[4.2rem] max-w-[640px]"
            style={{
              clipPath: mounted
                ? "inset(0 0% 0 0)"
                : "inset(0 100% 0 0)",
              transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            {t("home.hero.title", l)}
          </h1>

          {/* Sous-titre */}
          <p
            className="text-base sm:text-lg md:text-xl font-sans font-normal text-ink-secondary leading-relaxed mt-6 md:mt-8 max-w-[500px]"
            style={{
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              opacity: mounted ? 1 : 0,
              transition:
                "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.8s, opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
            }}
          >
            {t("home.hero.subtitle", l)}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10"
            style={{
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              opacity: mounted ? 1 : 0,
              transition:
                "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.1s, opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.1s",
            }}
          >
            <Link
              href="/protection"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-4 bg-accent text-white text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] hover:bg-accent-hover whitespace-nowrap"
            >
              {t("home.hero.cta_analyze", l)}
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-4 border-2 border-ink text-ink text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:bg-ink/5 whitespace-nowrap"
            >
              {t("home.hero.cta_demo", l)}
            </Link>
          </div>

          {/* Micro-proofs */}
          <p
            className="text-xs sm:text-sm font-sans text-ink-tertiary mt-6 md:mt-8 max-w-[460px] leading-relaxed"
            style={{
              transform: mounted ? "translateY(0)" : "translateY(12px)",
              opacity: mounted ? 1 : 0,
              transition:
                "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.4s, opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.4s",
            }}
          >
            {t("home.hero.micro_proofs", l)}
          </p>
        </div>
      </div>

      {/* ─── DROITE — Image plein cadre ─── */}
      <div className="relative h-[50vh] sm:h-[60vh] md:h-screen overflow-hidden order-1 md:order-2">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/heropic.png)",
            filter: "saturate(0.85) contrast(1.05)",
          }}
        />
        {/* Grain texture subtile */}
        <div
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </section>
  );
}
