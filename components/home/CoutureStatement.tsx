"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { STATEMENT_TITLE, STATEMENT_TEXT } from "@/lib/marketing/couture-homepage";

export function CoutureStatement() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  return (
    <section
      ref={ref}
      className="py-40 md:py-64 relative overflow-hidden flex items-center justify-center"
      style={{ backgroundColor: "var(--encre, #0C0A08)", minHeight: "80vh" }}
    >
      <div className="max-w-[1000px] mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <span 
            className="block mb-12 text-[10px] uppercase tracking-[0.34em]"
            style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
          >
            Notre Engagement
          </span>
          <h2
            className="mb-12"
            style={{ 
              fontFamily: "var(--font-couture), Georgia, serif", 
              fontSize: "clamp(48px, 6vw, 80px)",
              color: "var(--ivoire)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em"
            }}
          >
            {STATEMENT_TITLE}
          </h2>
          <p
            className="mb-16 text-[16px] leading-relaxed mx-auto max-w-[600px]"
            style={{ color: "rgba(244, 238, 227, 0.6)" }}
          >
            {STATEMENT_TEXT}
          </p>
          <Link 
            href="/contact" 
            className="inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] transition-all duration-300 group"
            style={{
              fontFamily: "var(--font-util), monospace",
              color: "var(--or)",
            }}
          >
            <span 
              className="block w-12 h-px transition-all duration-300 group-hover:w-20" 
              style={{ background: "var(--or)" }}
            />
            Rejoindre Halo
            <span 
              className="block w-12 h-px transition-all duration-300 group-hover:w-20" 
              style={{ background: "var(--or)" }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
