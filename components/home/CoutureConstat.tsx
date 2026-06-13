"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CONSTAT_TITLE, CONSTAT_SUBTITLE, CONSTAT_ITEMS } from "@/lib/marketing/couture-homepage";

export function CoutureConstat() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--creme, #F9F6EF)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco">
        <motion.p
          className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-4"
          style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Le diagnostic
        </motion.p>
        <motion.h2
          className="display-medium mb-4"
          style={{ color: "var(--encre, #0C0A08)", maxWidth: 800 }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          {CONSTAT_TITLE}
        </motion.h2>
        <motion.p
          className="text-[16px] leading-relaxed mb-14"
          style={{ color: "var(--encre)", opacity: 0.6, maxWidth: 620, fontFamily: "var(--font-body), sans-serif" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 0.6, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {CONSTAT_SUBTITLE}
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONSTAT_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              className="p-6"
              style={{
                border: "1px solid rgba(12,10,8,0.08)",
                background: "rgba(12,10,8,0.02)",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 + i * 0.07 }}
            >
              <h3
                className="text-[0.65rem] font-bold uppercase tracking-[0.14em] mb-3"
                style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
              >
                {item.label}
              </h3>
              <p
                className="text-[14px] leading-relaxed"
                style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}
              >
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
