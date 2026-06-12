"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { STATEMENT_TITLE, STATEMENT_TEXT } from "@/lib/marketing/couture-homepage";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";

export function CoutureStatement() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <section
      ref={ref}
      className="couture-section couture-section-noir relative overflow-hidden"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      {/* Ambient ring */}
      <div
        className="halo-ring"
        style={{
          width: 600,
          height: 600,
          right: -240,
          top: "50%",
          transform: "translateY(-50%)",
          opacity: 0.3,
        }}
      />

      <div className="wrap-eco relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: Statement */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="couture-ornament mb-8" style={{ justifyContent: "flex-start" }}>
              <CoutureEmblem size={24} color="var(--or)" />
            </div>
            <h2
              className="display-small mb-8"
              style={{ color: "var(--ivoire)" }}
            >
              {STATEMENT_TITLE}
            </h2>
            <p
              className="mb-10 text-[15px] leading-relaxed"
              style={{ color: "var(--pierre)" }}
            >
              {STATEMENT_TEXT}
            </p>
            <Link href="/contact" className="btn-eco btn-eco-gold">
              Rejoindre Halo &rarr;
            </Link>
          </motion.div>

          {/* Right: Abstract visual */}
          <motion.div
            className="hidden md:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            aria-hidden="true"
          >
            <div
              style={{
                width: "100%",
                maxWidth: 400,
                aspectRatio: "4/5",
                background: "linear-gradient(180deg, rgba(216,169,91,0.04), transparent 60%)",
                border: "1px solid var(--ligne)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <CoutureEmblem size={48} color="var(--or)" />
              <div
                className="absolute left-8 right-8 h-px"
                style={{ background: "linear-gradient(90deg, transparent, var(--or), transparent)", opacity: 0.2, top: "50%" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
