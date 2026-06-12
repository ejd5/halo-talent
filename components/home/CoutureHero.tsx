"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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

export function CoutureHero() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, 120]);

  return (
    <header
      ref={ref}
      className="relative min-h-screen flex overflow-hidden"
      style={{ backgroundColor: "var(--creme, #F9F6EF)" }}
    >
      {/* ══════════ Ambient light sweep ══════════ */}
      {/* Ambient light sweep — disabled via CSS prefers-reduced-motion */}
      <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(216,169,91,0.04) 0%, transparent 60%)",
            animation: "couture-light-sweep 8s ease-in-out infinite",
          }}
        />

      {/* ══════════ A. Side rail — BIG, visible, starts at navbar bottom ══════════ */}
      <div
        className="hidden lg:flex flex-col items-center justify-center relative z-30 flex-shrink-0"
        style={{
          width: 80,
          backgroundColor: "#090806",
          borderRight: "1px solid rgba(216,169,91,0.15)",
          paddingTop: 72, // clears navbar
        }}
      >
        {/* Fleur de lys at top */}
        <div className="mb-auto mt-12">
          <CoutureEmblem size={14} color="var(--or)" />
        </div>

        {/* 4 capitales — large, bright, vertical */}
        <div
          className="flex flex-col items-center gap-8 my-auto"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            fontFamily: "var(--font-util), monospace",
            fontSize: 9,
            letterSpacing: "0.44em",
            textTransform: "uppercase",
            color: "rgba(244,238,227,0.72)",
            fontWeight: 500,
          }}
        >
          {RAIL_LABELS.map((city, i) => (
            <span key={city} className="flex flex-col items-center gap-6">
              {i > 0 && (
                <span style={{ color: "var(--or)", fontSize: 5, opacity: 0.6 }}>·</span>
              )}
              {city}
            </span>
          ))}
        </div>

        {/* Gold line bottom */}
        <div className="mb-auto mt-12 w-8 h-px" style={{ background: "var(--or)", opacity: 0.3 }} />
      </div>

      {/* ══════════ B + C. Content: text left + image right ══════════ */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-screen" style={{ paddingTop: 72 }}>
        {/* B. Zone texte — left/center, lots of breathing room */}
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-16 xl:px-24 py-12 lg:py-20">
          <div className="max-w-[540px]">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mb-10"
            >
              <span
                className="inline-flex items-center gap-2.5 text-[9px] uppercase tracking-[0.3em]"
                style={{
                  fontFamily: "var(--font-util), monospace",
                  color: "var(--or)",
                }}
              >
                <span className="w-5 h-px" style={{ background: "var(--or)", opacity: 0.4 }} />
                {HERO_BADGE}
              </span>
            </motion.div>

            {/* H1 — Playfair Display, haute couture */}
            <motion.h1
              className="mb-10"
              style={{
                fontFamily: "var(--font-couture), Georgia, serif",
                fontWeight: 700,
                fontSize: "clamp(44px, 6vw, 88px)",
                lineHeight: 1.04,
                letterSpacing: "-0.01em",
                color: "#0C0A08",
              }}
            >
              {[HERO_TITLE.line1, HERO_TITLE.line2, HERO_TITLE.line3, HERO_TITLE.line4].map((line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.9,
                    delay: 0.15 + i * 0.13,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </motion.span>
              ))}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.65, ease: "easeOut" }}
              className="mb-5"
              style={{
                color: "#9C9183",
                fontSize: "clamp(14px, 1.3vw, 16px)",
                lineHeight: 1.75,
                fontFamily: "var(--font-body), sans-serif",
                maxWidth: 460,
              }}
            >
              {HERO_SUBTITLE}
            </motion.p>

            {/* Micro-copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.75, ease: "easeOut" }}
              className="mb-10"
              style={{
                color: "#9C9183",
                fontSize: 13,
                fontStyle: "italic",
                opacity: 0.75,
                maxWidth: 420,
              }}
            >
              {HERO_MICRO}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.85, ease: "easeOut" }}
              className="flex flex-wrap gap-4 mb-14"
            >
              {HERO_CTAS.map((cta) =>
                cta.variant === "fill" ? (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex items-center gap-2.5 px-8 py-4 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      fontFamily: "var(--font-util), monospace",
                      backgroundColor: "#0C0A08",
                      color: "#F4EEE3",
                      border: "1px solid #0C0A08",
                    }}
                  >
                    {cta.label} &rarr;
                  </Link>
                ) : cta.variant === "outline" ? (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex items-center gap-2.5 px-8 py-4 text-[11px] uppercase tracking-[0.2em] transition-all duration-300"
                    style={{
                      fontFamily: "var(--font-util), monospace",
                      border: "1px solid #0C0A08",
                      color: "#0C0A08",
                      background: "transparent",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#0C0A08";
                      e.currentTarget.style.color = "#F9F6EF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#0C0A08";
                    }}
                  >
                    {cta.label}
                  </Link>
                ) : (
                  <Link
                    key={cta.href}
                    href={cta.href}
                    className="inline-flex items-center gap-2.5 text-[11px] uppercase tracking-[0.2em] py-4 transition-colors duration-300"
                    style={{
                      fontFamily: "var(--font-util), monospace",
                      color: "#9C9183",
                    }}
                  >
                    {cta.label}
                  </Link>
                )
              )}
            </motion.div>

            {/* Reassurance */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 0.45 } : {}}
              transition={{ duration: 0.8, delay: 1.0 }}
              style={{
                fontFamily: "var(--font-util), monospace",
                fontSize: 9,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#9C9183",
              }}
            >
              {HERO_REASSURANCE}
            </motion.p>
          </div>
        </div>

        {/* C. Zone image — déborde dans la navbar, pleine hauteur, couverture magazine */}
        <div className="hidden lg:block relative flex-1 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            style={{
              top: -72, // déborde au-dessus dans la navbar
              y: imageY,
            }}
          >
            <Image
              src="/images/heropic.png"
              alt=""
              fill
              priority
              sizes="50vw"
              className="object-cover"
              style={{
                objectFit: "cover",
                objectPosition: "center 15%",
                filter: "grayscale(100%) contrast(1.08) brightness(0.9)",
              }}
            />
          </motion.div>

          {/* Magazine-cover gradient: blends left edge into ivoire */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to right, #F4EFE7 0%, transparent 12%, transparent 80%, rgba(12,10,8,0.1) 100%)",
            }}
          />

          {/* Golden ambient glow behind image — disabled via CSS prefers-reduced-motion */}
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: "10%",
              right: "10%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(216,169,91,0.08) 0%, transparent 70%)",
              animation: "breathe 6s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* ══════════ Editorial bottom line ══════════ */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 hidden md:flex items-center justify-center py-5"
        style={{
          borderTop: "1px solid rgba(0,0,0,0.05)",
          background: "rgba(249,246,239,0.9)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="flex items-center gap-0">
          {HERO_EDITORIAL_STEPS.map((step, i) => (
            <div key={step.num} className="flex items-center">
              <span
                style={{
                  fontFamily: "var(--font-util), monospace",
                  fontSize: 9,
                  color: "var(--or)",
                  letterSpacing: "0.12em",
                  fontWeight: 500,
                }}
              >
                {step.num}
              </span>
              <span
                className="mx-3"
                style={{
                  fontFamily: "var(--font-couture), Georgia, serif",
                  fontSize: 11,
                  color: "#0C0A08",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {step.label}
              </span>
              {i < HERO_EDITORIAL_STEPS.length - 1 && (
                <span
                  className="mx-6"
                  style={{
                    display: "inline-block",
                    width: 44,
                    height: 1,
                    background: "rgba(0,0,0,0.08)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
