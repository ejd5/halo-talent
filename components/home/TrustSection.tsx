"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import { Download, FileText, ShieldCheck, FileSignature, LogOut, Fingerprint, Trash2, Key } from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const icons: Record<string, React.ComponentType<any>> = {
  "home.trust.point1": Download,
  "home.trust.point2": FileText,
  "home.trust.point3": ShieldCheck,
  "home.trust.point4": FileSignature,
  "home.trust.point5": LogOut,
  "home.trust.point6": Fingerprint,
  "home.trust.point7": Trash2,
  "home.trust.point8": Key,
};

export function TrustSection() {
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

  const points = Array.from({ length: 8 }, (_, i) => `home.trust.point${i + 1}`);

  return (
    <section ref={ref} className="py-24 md:py-36 bg-ink text-base">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2 className="font-display font-bold text-white text-[1.75rem] sm:text-[2.25rem] md:text-[3rem] leading-[1.15] tracking-[-0.02em]">
            {t("home.trust.title", l)}
          </h2>
          <p className="text-base md:text-lg text-white/55 mt-5 max-w-xl mx-auto leading-relaxed">
            {t("home.trust.subtitle", l)}
          </p>
        </div>

        {/* Trust points */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 max-w-3xl mx-auto">
          {points.map((key, i) => {
            const Icon = icons[key];
            return (
              <div
                key={key}
                className="flex flex-col items-center text-center gap-3 transition-all duration-500"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transitionDelay: `${200 + i * 80}ms`,
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <Icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
                <span className="text-white/80 text-sm font-sans">
                  {t(key, l)}
                </span>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="text-center mt-14 md:mt-20 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transitionDelay: "1000ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <Link
            href="/security"
            className="inline-flex items-center justify-center px-10 py-4 border-2 border-white/30 text-white text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:border-white hover:bg-white/10"
          >
            {t("home.trust.cta", l)}
          </Link>
        </div>
      </div>
    </section>
  );
}
