"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  Puzzle,
  Camera,
  MessageCircle,
  BarChart3,
  Shield,
  CreditCard,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const BEFORE_TOOLS = [
  { icon: Puzzle, label: "Canva" },
  { icon: Camera, label: "CapCut" },
  { icon: MessageCircle, label: "CRM" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Shield, label: "Juridique" },
  { icon: CreditCard, label: "Finances" },
  { icon: FileText, label: "Scripts" },
];

const AFTER_FEATURES = [
  "Création IA",
  "CRM Fans",
  "Analytics",
  "Chatting",
  "Juridique",
  "Publication",
  "Management",
];

export function SolutionSection() {
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
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 md:py-36" style={{ backgroundColor: "var(--bg-primary)" }}>
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
            {t("home.solution.title", l)}
          </h2>
        </div>

        {/* Before / After layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-6 items-center max-w-5xl mx-auto">
          {/* ─── BEFORE ─── */}
          <div
            className="transition-all duration-800"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-30px)",
              transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s, opacity 0.8s ease 0.1s`,
            }}
          >
            <div
              className="p-6 md:p-8"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* Before label */}
              <p
                className="text-center text-[0.65rem] font-medium uppercase tracking-[0.1em] mb-6"
                style={{ color: "var(--danger)" }}
              >
                {t("home.solution.before_label", l)}
              </p>

              {/* Floating tool icons */}
              <div className="grid grid-cols-4 gap-3 justify-items-center">
                {BEFORE_TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.label}
                      className="flex flex-col items-center gap-1.5 transition-all duration-300"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? "translateY(0)" : "translateY(12px)",
                        transitionDelay: `${200 + BEFORE_TOOLS.indexOf(tool) * 60}ms`,
                        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <div
                        className="w-11 h-11 flex items-center justify-center rounded-sm"
                        style={{ backgroundColor: "var(--bg-hover)" }}
                      >
                        <Icon size={16} style={{ color: "var(--text-tertiary)" }} strokeWidth={1.5} />
                      </div>
                      <span
                        className="text-[0.55rem] font-medium text-center"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {tool.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Messy connection lines */}
              <div className="mt-5 space-y-1">
                {[40, 65, 30, 55, 45, 70].map((w, i) => (
                  <div
                    key={i}
                    className="h-px rounded-full transition-all duration-700"
                    style={{
                      width: visible ? `${w}%` : "0%",
                      backgroundColor: "var(--border-default)",
                      marginLeft: `${(i * 7) % 40}%`,
                      transitionDelay: `${400 + i * 50}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ─── ARROW ─── */}
          <div
            className="flex items-center justify-center transition-all duration-500"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "scale(1)" : "scale(0.5)",
              transitionDelay: "0.5s",
            }}
          >
            <div
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <ArrowRight size={18} style={{ color: "var(--accent-text, #fff)" }} strokeWidth={2} />
            </div>
          </div>

          {/* ─── AFTER ─── */}
          <div
            className="transition-all duration-800"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(30px)",
              transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, opacity 0.8s ease 0.3s`,
            }}
          >
            <div
              className="p-6 md:p-8 text-center"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              {/* After label */}
              <p
                className="text-center text-[0.65rem] font-medium uppercase tracking-[0.1em] mb-6"
                style={{ color: "var(--success)" }}
              >
                {t("home.solution.after_label", l)}
              </p>

              {/* Central Halo icon */}
              <div
                className="w-14 h-14 flex items-center justify-center rounded-full mx-auto mb-6"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <Sparkles size={20} style={{ color: "var(--accent-text, #fff)" }} strokeWidth={1.5} />
              </div>

              {/* Feature pills in a circle arrangement */}
              <div className="grid grid-cols-2 gap-2 max-w-[260px] mx-auto">
                {AFTER_FEATURES.map((feature, i) => (
                  <div
                    key={feature}
                    className="px-2.5 py-1.5 text-[0.65rem] font-medium rounded-sm text-center transition-all duration-500"
                    style={{
                      backgroundColor: "var(--accent-soft)",
                      color: "var(--accent)",
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(10px)",
                      transitionDelay: `${500 + i * 80}ms`,
                      gridColumn: i === AFTER_FEATURES.length - 1 ? "span 2" : undefined,
                    }}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
