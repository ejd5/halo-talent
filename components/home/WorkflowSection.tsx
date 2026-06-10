"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

export function WorkflowSection() {
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

  const steps = [
    { labelKey: "home.workflow.step1_label", descKey: "home.workflow.step1_desc" },
    { labelKey: "home.workflow.step2_label", descKey: "home.workflow.step2_desc" },
    { labelKey: "home.workflow.step3_label", descKey: "home.workflow.step3_desc" },
    { labelKey: "home.workflow.step4_label", descKey: "home.workflow.step4_desc" },
    { labelKey: "home.workflow.step5_label", descKey: "home.workflow.step5_desc" },
    { labelKey: "home.workflow.step6_label", descKey: "home.workflow.step6_desc" },
    { labelKey: "home.workflow.step7_label", descKey: "home.workflow.step7_desc" },
    { labelKey: "home.workflow.step8_label", descKey: "home.workflow.step8_desc" },
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
            {t("home.workflow.title", l)}
          </h2>
          <p className="text-base md:text-lg text-ink-secondary mt-5 max-w-xl mx-auto leading-relaxed">
            {t("home.workflow.subtitle", l)}
          </p>
        </div>

        {/* Desktop: horizontal stepper */}
        <div className="hidden md:block max-w-6xl mx-auto">
          <div className="grid grid-cols-8 gap-3">
            {steps.map((step, i) => (
              <div
                key={step.labelKey}
                className="text-center transition-all duration-600"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(20px)",
                  transitionDelay: `${300 + i * 100}ms`,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="w-12 h-12 rounded-full bg-ink text-white font-display font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <p className="font-display font-semibold text-ink text-sm mb-1">
                  {t(step.labelKey, l)}
                </p>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  {t(step.descKey, l)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: vertical list */}
        <div className="md:hidden space-y-0 max-w-md mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.labelKey}
              className="flex items-start gap-4 py-5 border-l-2 border-ink/10 pl-6 relative transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(-8px)",
                transitionDelay: `${200 + i * 80}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div className="absolute -left-[14px] top-5 w-7 h-7 rounded-full bg-accent text-white font-display font-bold text-xs flex items-center justify-center">
                {i + 1}
              </div>
              <div>
                <p className="font-display font-semibold text-ink text-sm">
                  {t(step.labelKey, l)}
                </p>
                <p className="text-sm text-ink-secondary mt-1 leading-relaxed">
                  {t(step.descKey, l)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-12 md:mt-20 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "1200ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Link
            href="/apply"
            className="inline-flex items-center justify-center px-10 py-4 bg-accent text-white text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] hover:bg-accent-hover"
          >
            {t("home.workflow.cta", l)}
          </Link>
        </div>
      </div>
    </section>
  );
}
