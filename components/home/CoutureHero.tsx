"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RAIL_LABELS,
  HERO_BADGE,
  HERO_TITLE,
  HERO_SUBTITLE,
  HERO_MICRO,
  HERO_REASSURANCE,
  HERO_CTAS,
  FLOATING_CARD_LABELS,
} from "@/lib/marketing/couture-homepage";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const riseItem = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const fadeItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

export function CoutureHero() {
  const ref = useRef<HTMLElement>(null);
  return (
    <header
      ref={ref}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      {/* ── Ambient effects ── */}
      <div className="halo-glow halo-glow-lg" />
      <div className="halo-ring halo-ring-lg" style={{ opacity: 0.5 }} />

      {/* ── Side rail (desktop only) ── */}
      <div
        className="absolute left-0 top-0 bottom-0 hidden lg:flex flex-col justify-center items-center pointer-events-none z-20"
        style={{ width: 72 }}
      >
        <div
          className="couture-rail flex flex-col items-center gap-6"
          style={{
            writingMode: "vertical-rl",
            fontFamily: "var(--font-util), monospace",
            fontSize: 10,
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "var(--pierre)",
          }}
        >
          {RAIL_LABELS.map((city, i) => (
            <span key={city}>
              {i > 0 && (
                <span
                  className="block text-center my-3"
                  style={{ color: "var(--or)", fontSize: 8 }}
                >
                  ·
                </span>
              )}
              {city}
            </span>
          ))}
        </div>
      </div>

      {/* ── Floating cards ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
        {FLOATING_CARD_LABELS.map((card) => (
          <div
            key={card.label}
            className="absolute hidden lg:block"
            style={{
              left: card.x,
              top: card.y,
              animation: `chat-ai-float ${6 + card.delay}s ease-in-out infinite`,
              animationDelay: `${card.delay}s`,
            }}
          >
            <span
              className="inline-block px-3 py-1.5 text-[10px] font-medium whitespace-nowrap"
              style={{
                fontFamily: "var(--font-util), monospace",
                color: "var(--pierre)",
                background: "rgba(28,23,18,0.9)",
                border: "1px solid var(--ligne-faible)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ background: "var(--or)", boxShadow: "0 0 6px var(--or)" }}
              />
              {card.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="wrap-eco relative z-10 w-full" style={{ paddingTop: 120, paddingBottom: 100 }}>
        <motion.div
          className="text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={fadeItem} className="mb-10">
            <span
              className="inline-flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-[0.24em]"
              style={{
                fontFamily: "var(--font-util), monospace",
                color: "var(--or)",
                border: "1px solid var(--ligne)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--sauge)", boxShadow: "0 0 8px var(--sauge)" }}
              />
              {HERO_BADGE}
            </span>
          </motion.div>

          {/* H1 — Split typography, 4 lines */}
          <motion.h1
            className="display-large mb-8"
            style={{ maxWidth: "16ch", margin: "0 auto" }}
          >
            {[HERO_TITLE.line1, HERO_TITLE.line2, HERO_TITLE.line3, HERO_TITLE.line4].map((line) => (
              <span key={line} className="block overflow-hidden">
                <motion.span className="block" variants={riseItem}>
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeItem}
            className="mx-auto mb-6"
            style={{
              maxWidth: 620,
              color: "var(--pierre)",
              fontSize: "clamp(15px, 1.6vw, 18px)",
              lineHeight: 1.65,
              fontFamily: "var(--font-body), sans-serif",
            }}
          >
            {HERO_SUBTITLE}
          </motion.p>

          {/* Micro-copy */}
          <motion.p
            variants={fadeItem}
            className="mx-auto mb-10"
            style={{
              maxWidth: 500,
              color: "var(--pierre)",
              fontSize: 13,
              fontStyle: "italic",
              opacity: 0.7,
            }}
          >
            {HERO_MICRO}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeItem}
            className="flex flex-wrap justify-center gap-4 mb-14"
          >
            {HERO_CTAS.map((cta) =>
              cta.variant === "fill" ? (
                <Link key={cta.href} href={cta.href} className="btn-eco btn-eco-fill">
                  {cta.label} &rarr;
                </Link>
              ) : cta.variant === "outline" ? (
                <Link key={cta.href} href={cta.href} className="btn-eco btn-eco-gold">
                  {cta.label}
                </Link>
              ) : (
                <Link
                  key={cta.href}
                  href={cta.href}
                  className="btn-eco"
                  style={{ borderColor: "transparent" }}
                >
                  {cta.label}
                </Link>
              )
            )}
          </motion.div>

          {/* Reassurance line */}
          <motion.p
            variants={fadeItem}
            className="text-center"
            style={{
              fontFamily: "var(--font-util), monospace",
              fontSize: 10,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "var(--pierre)",
              opacity: 0.5,
            }}
          >
            {HERO_REASSURANCE}
          </motion.p>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div
          style={{
            width: 1,
            height: 60,
            background: "linear-gradient(180deg, var(--or), transparent)",
            opacity: 0.4,
          }}
        />
      </div>
    </header>
  );
}
