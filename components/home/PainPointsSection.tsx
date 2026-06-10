"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { Users, FolderSearch, TrendingUp, Landmark } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const icons = { Users, FolderSearch, TrendingUp, Landmark };

export function PainPointsSection() {
  const locale = useLocale();
  const l = norm(locale);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cards = [
    { icon: "Users" as const, titleKey: "home.pain.card1_title", descKey: "home.pain.card1_desc" },
    { icon: "FolderSearch" as const, titleKey: "home.pain.card2_title", descKey: "home.pain.card2_desc" },
    { icon: "TrendingUp" as const, titleKey: "home.pain.card3_title", descKey: "home.pain.card3_desc" },
    { icon: "Landmark" as const, titleKey: "home.pain.card4_title", descKey: "home.pain.card4_desc" },
  ];

  return (
    <section ref={ref} className="py-24 md:py-36 bg-ink text-base">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="font-display font-bold text-white text-[1.75rem] sm:text-[2.25rem] md:text-[3rem] leading-[1.15] tracking-[-0.02em]">
            {t("home.pain.title", l)}
          </h2>
          <p className="text-base md:text-lg text-white/60 mt-5 max-w-xl mx-auto leading-relaxed">
            {t("home.pain.subtitle", l)}
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {cards.map((card, i) => {
            const Icon = icons[card.icon];
            return (
              <div
                key={card.titleKey}
                className="bg-white/[0.06] border border-white/[0.08] p-6 md:p-8 transition-all duration-700"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${200 + i * 120}ms`,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <Icon className="w-8 h-8 text-accent mb-5" strokeWidth={1.5} />
                <h3 className="font-display font-semibold text-white text-lg md:text-xl mb-3">
                  {t(card.titleKey, l)}
                </h3>
                <p className="text-white/55 text-sm md:text-base leading-relaxed">
                  {t(card.descKey, l)}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-12 md:mt-16 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "700ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Link
            href="/demo"
            className="inline-flex items-center justify-center px-8 sm:px-10 py-4 border-2 border-white/30 text-white text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:border-white hover:bg-white/10"
          >
            {t("home.pain.cta", l)}
          </Link>
        </div>
      </div>
    </section>
  );
}
