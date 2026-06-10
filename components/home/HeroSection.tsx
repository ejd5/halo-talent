"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "@/lib/i18n/use-locale";
import { t, type Locale } from "@/lib/i18n/common";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

function norm(locale: string): Locale {
  return locale === "pt" ? "pt-BR" : (locale as Locale);
}

const PLATFORMS = [
  "OnlyFans",
  "Fansly",
  "MYM",
  "Instagram",
  "TikTok",
  "YouTube",
];

export function HeroSection() {
  const locale = useLocale();
  const l = norm(locale);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const fadeIn = (delay: number) => ({
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    opacity: mounted ? 1 : 0,
    transition: `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
  });

  return (
    <section className="relative min-h-screen -mt-20 pt-20 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 80% 60% at 50% -20%, var(--accent) 0%, transparent 70%)",
            "var(--bg-primary)",
          ].join(","),
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-12 min-h-[calc(100vh-80px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 w-full items-center">
          {/* ─── LEFT — Text content ─── */}
          <div className="py-16 md:py-20">
            <div className="max-w-[580px]">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.7rem] font-medium mb-8 transition-all duration-300 hover:scale-[1.02]"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent)",
                  transform: mounted ? "translateY(0)" : "translateY(-8px)",
                  opacity: mounted ? 1 : 0,
                  transition:
                    "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s, opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0s",
                }}
              >
                <Sparkles size={10} />
                <Link href="/protection" className="hover:underline">
                  {t("home.hero.badge", l)}
                </Link>
              </div>

              {/* H1 — Line 1 */}
              <h1
                className="font-display text-[2rem] sm:text-[2.75rem] md:text-[3.2rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] tracking-[-0.02em]"
                style={{
                  color: "var(--text-primary)",
                  fontWeight: 500,
                  ...fadeIn(0.15),
                }}
              >
                {t("home.hero.title_line1", l)}
              </h1>

              {/* H1 — Line 2 (accent, bold) */}
              <p
                className="font-display text-[2rem] sm:text-[2.75rem] md:text-[3.2rem] lg:text-[3.8rem] xl:text-[4rem] leading-[1.15] tracking-[-0.02em] mt-1"
                style={{
                  color: "var(--accent)",
                  fontWeight: 700,
                  ...fadeIn(0.3),
                }}
              >
                {t("home.hero.title_line2", l)}
              </p>

              {/* Subtitle */}
              <p
                className="text-base sm:text-lg md:text-xl leading-relaxed mt-6 md:mt-8 max-w-[520px]"
                style={{
                  color: "var(--text-secondary)",
                  ...fadeIn(0.45),
                }}
              >
                {t("home.hero.subtitle", l)}
              </p>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-10"
                style={fadeIn(0.6)}
              >
                <Link
                  href="/protection"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] whitespace-nowrap"
                  style={{
                    backgroundColor: "var(--accent)",
                    color: "var(--accent-text, #fff)",
                  }}
                >
                  {t("home.hero.cta_analyze", l)}
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center px-8 py-4 text-[0.8rem] font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] whitespace-nowrap"
                  style={{
                    border: "1px solid var(--border-default)",
                    color: "var(--text-primary)",
                  }}
                >
                  {t("home.hero.cta_discover", l)}
                </Link>
              </div>

              {/* Micro-proofs */}
              <p
                className="text-xs sm:text-sm leading-relaxed mt-6"
                style={{
                  color: "var(--text-tertiary)",
                  ...fadeIn(0.75),
                }}
              >
                {t("home.hero.micro_proofs", l)}
              </p>

              {/* Social proof */}
              <div
                className="mt-10 pt-6"
                style={{
                  borderTop: "1px solid var(--border-default)",
                  ...fadeIn(0.9),
                }}
              >
                <p
                  className="text-[0.65rem] font-medium uppercase tracking-[0.1em] mb-3"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  {t("home.hero.compatible", l)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((name) => (
                    <span
                      key={name}
                      className="text-[0.7rem] px-2.5 py-1 font-medium rounded-sm"
                      style={{
                        backgroundColor: "var(--bg-hover)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── RIGHT — Dashboard visual ─── */}
          <div className="hidden lg:flex items-center justify-center relative">
            {/* Radial glow behind the mockup */}
            <div
              className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, var(--accent-soft) 0%, transparent 70%)",
                opacity: 0.6,
              }}
            />

            {/* Dashboard mockup */}
            <div
              className="relative w-full max-w-[580px] rounded-lg overflow-hidden shadow-2xl"
              style={{
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                transform: mounted
                  ? "perspective(1200px) rotateY(-3deg) translateZ(0)"
                  : "perspective(1200px) rotateY(-10deg) translateZ(-50px)",
                opacity: mounted ? 1 : 0,
                transition:
                  "transform 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, opacity 0.8s ease 0.3s",
              }}
            >
              {/* Mockup header */}
              <div
                className="flex items-center gap-2 px-4 py-3 border-b"
                style={{ borderColor: "var(--border-default)" }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <div
                  className="flex items-center gap-2 ml-3 text-[0.6rem] font-medium px-2 py-1 rounded-sm"
                  style={{
                    backgroundColor: "var(--bg-hover)",
                    color: "var(--text-tertiary)",
                  }}
                >
                  <LayoutDashboard size={10} />
                  Studio — Vue d&apos;ensemble
                </div>
              </div>

              {/* Mockup body */}
              <div className="p-4 space-y-3">
                {/* KPI row */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Revenu", value: "€8 240", change: "+12.5%", up: true },
                    { label: "Abonnés", value: "90,1K", change: "+4.2%", up: true },
                    { label: "Engagement", value: "6,8%", change: "-0.3%", up: false },
                  ].map((kpi) => (
                    <div
                      key={kpi.label}
                      className="p-2 rounded-sm"
                      style={{ backgroundColor: "var(--bg-hover)" }}
                    >
                      <p
                        className="text-[0.55rem] uppercase tracking-wider"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        {kpi.label}
                      </p>
                      <p
                        className="text-sm font-semibold mt-0.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {kpi.value}
                      </p>
                      <p
                        className="text-[0.55rem] font-medium"
                        style={{
                          color: kpi.up ? "var(--success)" : "var(--danger)",
                        }}
                      >
                        {kpi.change}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Content row */}
                <div className="grid grid-cols-4 gap-2">
                  {[BarChart3, Users, ShieldCheck, Sparkles].map((Icon, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-center p-3 rounded-sm"
                      style={{ backgroundColor: "var(--bg-hover)" }}
                    >
                      <Icon size={14} style={{ color: "var(--text-tertiary)" }} />
                    </div>
                  ))}
                </div>

                {/* Activity line */}
                <div
                  className="h-2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--accent) 0%, var(--accent) 40%, var(--bg-hover) 40%, var(--bg-hover) 100%)",
                  }}
                />
                <div
                  className="h-2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--success) 0%, var(--success) 65%, var(--bg-hover) 65%, var(--bg-hover) 100%)",
                  }}
                />
                <div
                  className="h-2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, var(--bg-hover) 0%, var(--bg-hover) 25%, var(--accent) 25%, var(--accent) 55%, var(--bg-hover) 55%, var(--bg-hover) 100%)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
