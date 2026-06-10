"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { Puzzle, Percent, ShieldOff } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const COLUMNS = [
  {
    icon: Puzzle,
    titleKey: "home.problem.col1_title",
    descKey: "home.problem.col1_desc",
    statKey: "home.problem.col1_stat",
  },
  {
    icon: Percent,
    titleKey: "home.problem.col2_title",
    descKey: "home.problem.col2_desc",
    statKey: "home.problem.col2_stat",
  },
  {
    icon: ShieldOff,
    titleKey: "home.problem.col3_title",
    descKey: "home.problem.col3_desc",
    statKey: "home.problem.col3_stat",
  },
];

export function ProblemSection() {
  const locale = useLocale();
  const l = norm(locale);
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-36" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section title */}
        <div
          className="text-center max-w-2xl mx-auto mb-16 md:mb-20 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2
            className="font-display font-bold text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-[1.15] tracking-[-0.02em]"
            style={{ color: "var(--text-primary)" }}
          >
            {t("home.problem.title", l)}
          </h2>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {COLUMNS.map((col, i) => {
            const Icon = col.icon;
            return (
              <div
                key={col.titleKey}
                className="p-6 md:p-8 transition-all duration-700"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${i * 150}ms`,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-sm mb-5"
                  style={{ backgroundColor: "var(--accent-soft)" }}
                >
                  <Icon size={18} style={{ color: "var(--accent)" }} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3
                  className="font-display font-semibold text-lg md:text-xl mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t(col.titleKey, l)}
                </h3>

                {/* Description */}
                <p
                  className="text-sm md:text-base leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t(col.descKey, l)}
                </p>

                {/* Stat — accent color, prominent */}
                <p
                  className="mt-4 text-sm font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {t(col.statKey, l)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Transition phrase */}
        <div
          className="text-center max-w-2xl mx-auto mt-16 md:mt-20 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "600ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <p
            className="font-serif text-xl md:text-2xl leading-relaxed italic"
            style={{ color: "var(--text-secondary)" }}
          >
            &ldquo;{t("home.problem.transition", l)}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
