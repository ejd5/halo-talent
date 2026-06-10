"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { Bot, Inbox, BarChart3, Archive, Shield } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const icons = { Bot, Inbox, BarChart3, Archive, Shield };

export function ToolsSection() {
  const locale = useLocale();
  const l = norm(locale);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const cards = [
    { icon: "Bot" as const, titleKey: "home.tools.card1_title", descKey: "home.tools.card1_desc" },
    { icon: "Inbox" as const, titleKey: "home.tools.card2_title", descKey: "home.tools.card2_desc" },
    { icon: "BarChart3" as const, titleKey: "home.tools.card3_title", descKey: "home.tools.card3_desc" },
    { icon: "Archive" as const, titleKey: "home.tools.card4_title", descKey: "home.tools.card4_desc" },
    { icon: "Shield" as const, titleKey: "home.tools.card5_title", descKey: "home.tools.card5_desc" },
  ];

  return (
    <section ref={ref} className="py-24 md:py-36 bg-base">
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
          <h2 className="font-display font-bold text-ink text-[1.75rem] sm:text-[2.25rem] md:text-[3rem] leading-[1.15] tracking-[-0.02em]">
            {t("home.tools.title", l)}
          </h2>
          <p className="text-base md:text-lg text-ink-secondary mt-5 max-w-xl mx-auto leading-relaxed">
            {t("home.tools.subtitle", l)}
          </p>
        </div>

        {/* 5 cards — first prominent, then 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {cards.map((card, i) => {
            const Icon = icons[card.icon];
            const isFirst = i === 0;
            return (
              <div
                key={card.titleKey}
                className={`bg-white border border-ink/8 p-6 md:p-8 flex flex-col items-start gap-4 transition-all duration-700 ${isFirst ? "lg:col-span-2" : "lg:col-span-1"}`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${200 + i * 100}ms`,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <Icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                <h3 className="font-display font-semibold text-ink text-lg">
                  {t(card.titleKey, l)}
                </h3>
                <p className="text-ink-secondary text-sm leading-relaxed">
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
            transitionDelay: "750ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Link
            href="/demo"
            className="inline-flex items-center justify-center px-10 py-4 bg-accent text-white text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] hover:bg-accent-hover"
          >
            {t("home.tools.cta", l)}
          </Link>
        </div>
      </div>
    </section>
  );
}
