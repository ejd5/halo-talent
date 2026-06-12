"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";
import {
  RAIL_LABELS,
  HERO_BADGE,
  HERO_TITLE,
  HERO_SUBTITLE,
  HERO_MICRO,
  HERO_REASSURANCE,
  HERO_CTAS,
  HERO_EDITORIAL_STEPS,
} from "@/lib/marketing/couture-homepage";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: d, ease: "easeOut" as const },
  }),
};

const titleLine = {
  hidden: { y: "110%", opacity: 0 },
  show: (d = 0) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, delay: d, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const imgReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function CoutureHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <header
      ref={ref}
      className="relative min-h-screen flex overflow-hidden"
      style={{ backgroundColor: "var(--creme, #F9F6EF)" }}
    >
      {/* ── Side rail — noir couture (desktop only) ── */}
      <div
        className="hidden lg:flex flex-col items-center justify-center relative z-20 flex-shrink-0"
        style={{
          width: 56,
          backgroundColor: "var(--encre, #0C0A08)",
          borderRight: "1px solid var(--ligne)",
        }}
      >
        {/* Emblem top */}
        <div className="mb-auto mt-8">
          <CoutureEmblem size={14} color="var(--or)" />
        </div>

        {/* Cities */}
        <div
          className="flex flex-col items-center gap-5 my-auto"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontFamily: "var(--font-util), monospace",
            fontSize: 8,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--pierre)",
          }}
        >
          {RAIL_LABELS.map((city, i) => (
            <span key={city} className="flex flex-col items-center gap-4">
              {i > 0 && (
                <span style={{ color: "var(--or)", fontSize: 5, opacity: 0.6 }}>
                  ·
                </span>
              )}
              {city}
            </span>
          ))}
        </div>

        {/* Thin gold line at bottom */}
        <div className="mb-auto mt-8 w-4 h-px" style={{ background: "var(--or)", opacity: 0.3 }} />
      </div>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen" style={{ paddingTop: 72 }}>
        {/* LEFT: Editorial text */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-20 py-10 lg:py-16">
          <div className="max-w-[560px]">
            {/* Badge */}
            <motion.div
              className="mb-8 lg:mb-10"
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0}
            >
              <span
                className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.26em]"
                style={{
                  fontFamily: "var(--font-util), monospace",
                  color: "var(--or)",
                }}
              >
                <span
                  className="w-4 h-px"
                  style={{ background: "var(--or)", opacity: 0.5 }}
                />
                {HERO_BADGE}
              </span>
            </motion.div>

            {/* H1 — 4 lines, split typography */}
            <motion.h1
              className="mb-8 lg:mb-10"
              style={{
                fontFamily: "var(--font-display-alt), Fraunces, Georgia, serif",
                fontWeight: 300,
                fontSize: "clamp(38px, 5.6vw, 76px)",
                lineHeight: 1.06,
                letterSpacing: "-0.015em",
                color: "var(--encre, #0C0A08)",
              }}
            >
              {[HERO_TITLE.line1, HERO_TITLE.line2, HERO_TITLE.line3, HERO_TITLE.line4].map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    variants={titleLine}
                    initial="hidden"
                    animate={inView ? "show" : "hidden"}
                    custom={0.15 + i * 0.12}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mb-5"
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.6}
              style={{
                color: "var(--pierre, #9C9183)",
                fontSize: "clamp(14px, 1.4vw, 16px)",
                lineHeight: 1.7,
                fontFamily: "var(--font-body), sans-serif",
                maxWidth: 480,
              }}
            >
              {HERO_SUBTITLE}
            </motion.p>

            {/* Micro-copy */}
            <motion.p
              className="mb-10"
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.7}
              style={{
                color: "var(--pierre, #9C9183)",
                fontSize: 12,
                fontStyle: "italic",
                opacity: 0.8,
                maxWidth: 440,
              }}
            >
              {HERO_MICRO}
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-4 mb-14"
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.8}
            >
              {HERO_CTAS.map((cta) =>
                cta.variant === "fill" ? (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] rounded-[2px] transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-util), monospace",
                      backgroundColor: "var(--encre, #0C0A08)",
                      color: "var(--ivoire, #F4EEE3)",
                      border: "1px solid var(--encre, #0C0A08)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#2A2520";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--encre, #0C0A08)";
                    }}
                  >
                    {cta.label} &rarr;
                  </Link>
                ) : cta.variant === "outline" ? (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] rounded-[2px] transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-util), monospace",
                      border: "1px solid var(--encre, #0C0A08)",
                      color: "var(--encre, #0C0A08)",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--encre, #0C0A08)";
                      e.currentTarget.style.color = "var(--creme, #F9F6EF)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--encre, #0C0A08)";
                    }}
                  >
                    {cta.label}
                  </Link>
                ) : (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] py-3.5 transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-util), monospace",
                      color: "var(--pierre, #9C9183)",
                      borderBottom: "1px solid transparent",
                    }}
                  >
                    {cta.label}
                  </Link>
                )
              )}
            </motion.div>

            {/* Reassurance line */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={1.0}
              style={{
                fontFamily: "var(--font-util), monospace",
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--pierre, #9C9183)",
                opacity: 0.5,
              }}
            >
              {HERO_REASSURANCE}
            </motion.p>
          </div>
        </div>

        {/* RIGHT: Editorial model image */}
        <motion.div
          className="hidden lg:block relative flex-1 overflow-hidden"
          style={{ minHeight: "100%", backgroundColor: "var(--encre, #0C0A08)" }}
          variants={imgReveal}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {/* Use existing hero image or placeholder slot */}
          <Image
            src="/images/heropic.png"
            alt=""
            fill
            priority
            sizes="50vw"
            className="object-cover"
            style={{ filter: "grayscale(100%) contrast(1.08) brightness(0.95)" }}
          />
          {/* Subtle gradient overlay to blend with ivoire background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(to right, rgba(12,10,8,0.4) 0%, transparent 25%, transparent 70%, rgba(12,10,8,0.2) 100%)",
            }}
          />
        </motion.div>
      </div>

      {/* ── Editorial bottom line ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 hidden md:flex items-center justify-center gap-10 py-5"
        style={{
          borderTop: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(249,246,239,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        {HERO_EDITORIAL_STEPS.map((step, i) => (
          <div key={step.num} className="flex items-center gap-3">
            <span
              style={{
                fontFamily: "var(--font-util), monospace",
                fontSize: 10,
                color: "var(--or, #D8A95B)",
                letterSpacing: "0.1em",
              }}
            >
              {step.num}
            </span>
            <span
              style={{
                fontFamily: "var(--font-display-alt), Georgia, serif",
                fontSize: 12,
                color: "var(--encre, #0C0A08)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {step.label}
            </span>
            {i < HERO_EDITORIAL_STEPS.length - 1 && (
              <span
                className="mx-2"
                style={{
                  display: "inline-block",
                  width: 32,
                  height: 1,
                  background: "rgba(0,0,0,0.12)",
                  marginLeft: 12,
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 hidden md:block" style={{ bottom: 4 }}>
        <div
          style={{
            width: 1,
            height: 48,
            background: "linear-gradient(180deg, var(--or), transparent)",
            opacity: 0.35,
          }}
        />
      </div>

      {/* Mobile: model image shown below text (subtle, behind) */}
      <div
        className="lg:hidden absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{ backgroundColor: "var(--encre, #0C0A08)" }}
        aria-hidden="true"
      />
    </header>
  );
}
