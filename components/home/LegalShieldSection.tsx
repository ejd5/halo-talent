"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ChevronRight, AlertTriangle } from "lucide-react";
import { t, translateClauseLabel } from "@/lib/i18n/legal";
import { useLocale } from "@/lib/i18n/use-locale";

export function LegalShieldSection() {
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{ background: "var(--color-dark)" }}
      className="py-32 md:py-44 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-16 md:gap-12 items-center">
          {/* ─── Colonne gauche : texte (3/5) ─── */}
          <div
            className="md:col-span-3 space-y-6"
            style={{
              transform: visible ? "translateX(0)" : "translateX(-30px)",
              opacity: visible ? 1 : 0,
              transition:
                "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Micro-label */}
            <span
              className="inline-block text-[0.65rem] font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              <ShieldCheck
                size={12}
                strokeWidth={2.5}
                className="inline mr-1.5 -mt-0.5"
                style={{ color: "var(--color-accent)" }}
              />
              {t("home.badge", locale)}
            </span>

            {/* Title */}
            <h2
              className="font-display text-4xl md:text-[2.5rem] leading-[1.1] font-bold uppercase tracking-tight"
              style={{ color: "var(--color-dark-text)" }}
            >
{t("home.title", locale).split("\n").map((line, i) => (
                <span key={i}>{i > 0 && <br />}{line}</span>
              ))}
            </h2>

            {/* Description */}
            <p
              className="font-sans text-base md:text-lg leading-relaxed max-w-lg"
              style={{ color: "var(--color-dark-muted)" }}
            >
              {t("home.description", locale)}
            </p>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href="/protection"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold tracking-wider uppercase transition-all hover:opacity-90"
                style={{
                  background: "var(--color-accent)",
                  color: "#F5F0EB",
                }}
              >
                {t("home.cta", locale)}
                <ChevronRight size={16} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* ─── Colonne droite : mockup (2/5) ─── */}
          <div
            className="md:col-span-2 flex justify-center md:justify-end"
            style={{
              transform: visible
                ? "translateX(0) rotate(0deg)"
                : "translateX(40px) rotate(0deg)",
              opacity: visible ? 1 : 0,
              transition:
                "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          >
            <div
              className="w-full max-w-sm"
              style={{
                transform: "rotate(2deg)",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.5), 0 8px 20px rgba(0,0,0,0.3)",
              }}
            >
              <div
                className="p-5 md:p-6 space-y-4"
                style={{
                  background: "var(--color-dark-surface)",
                  border: "1px solid var(--color-border-on-dark)",
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-[0.6rem] font-semibold tracking-[0.15em] uppercase"
                    style={{ color: "var(--color-dark-muted)" }}
                  >
                    {t("home.mockup.title", locale)}
                  </span>
                  <div
                    className="flex items-center gap-1 px-2 py-0.5"
                    style={{
                      background: "rgba(196, 69, 54, 0.12)",
                    }}
                  >
                    <AlertTriangle
                      size={10}
                      style={{ color: "var(--color-alert)" }}
                    />
                    <span
                      className="text-[0.55rem] font-bold tracking-wider uppercase"
                      style={{ color: "var(--color-alert)" }}
                    >
                    {t("home.mockup.badge", locale)}
                    </span>
                  </div>
                </div>

                {/* Clause checkboxes */}
                <div className="space-y-2.5">
                  {[
                    { label: "Clause d'exclusivité totale", checked: true },
                    { label: "Propriété des comptes", checked: true },
                    { label: "Renouvellement automatique", checked: true },
                    { label: "Commission à vie", checked: false },
                  ].map((item) => (
                    <label
                      key={item.label}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <div
                        className="w-4 h-4 flex items-center justify-center shrink-0"
                        style={{
                          background: item.checked
                            ? "var(--color-accent)"
                            : "transparent",
                          border: item.checked
                            ? "1px solid var(--color-accent)"
                            : "1px solid rgba(245,240,235,0.2)",
                        }}
                      >
                        {item.checked && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M2 5L4.5 7.5L8 2.5"
                              stroke="#F5F0EB"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className="text-xs"
                        style={{
                          color: item.checked
                            ? "var(--color-dark-text)"
                            : "rgba(245,240,235,0.35)",
                          textDecoration: item.checked ? "none" : "line-through",
                        }}
                      >
                        {translateClauseLabel(item.label, locale)}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Score gauge */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-[0.6rem] font-semibold tracking-[0.1em] uppercase"
                      style={{ color: "var(--color-dark-muted)" }}
                    >
                      {t("home.mockup.score_label", locale)}
                    </span>
                    <span
                      className="text-xs font-bold font-display"
                      style={{ color: "var(--color-alert)" }}
                    >
                      18/25
                    </span>
                  </div>
                  <div
                    className="h-1.5 w-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-full transition-all duration-1000"
                      style={{
                        width: "72%",
                        background:
                          "linear-gradient(90deg, #D4A24C, var(--color-alert))",
                      }}
                    />
                  </div>
                </div>

                {/* Footer link */}
                <div className="pt-1">
                  <Link
                    href="/protection"
                    className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-wider uppercase transition-opacity hover:opacity-80"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {t("home.mockup.view_diagnostic", locale)}
                    <ChevronRight size={12} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
