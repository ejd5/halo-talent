"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { COMPARISON_TITLE, COMPARISON_SUBTITLE, COMPARISON_ROWS } from "@/lib/marketing/couture-homepage";

export function CoutureComparison() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--encre, #0C0A08)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco">
        <motion.p
          className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-4 text-center"
          style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Le choix
        </motion.p>
        <motion.h2
          className="display-medium mb-3 text-center"
          style={{ color: "var(--ivoire, #F4EEE3)" }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          {COMPARISON_TITLE}
        </motion.h2>
        <motion.p
          className="text-[16px] leading-relaxed mb-14 text-center mx-auto"
          style={{ color: "var(--pierre, #9C9183)", maxWidth: 560, fontFamily: "var(--font-body), sans-serif" }}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 0.6, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {COMPARISON_SUBTITLE}
        </motion.p>

        <motion.div
          className="overflow-x-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.25 }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ligne, rgba(216,169,91,0.18))" }}>
                <th
                  className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-util), monospace" }}
                >
                  Critère
                </th>
                <th
                  className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-util), monospace" }}
                >
                  Agence classique
                </th>
                <th
                  className="text-left py-4 px-4 text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
                >
                  Where Talent Forms
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr
                  key={row.label}
                  style={{
                    borderBottom: "1px solid var(--ligne-faible, rgba(244,238,227,0.08))",
                    background: i % 2 === 0 ? "rgba(244,238,227,0.02)" : "transparent",
                  }}
                >
                  <td
                    className="py-4 px-4 text-[13px]"
                    style={{ color: "var(--ivoire, #F4EEE3)", fontFamily: "var(--font-body), sans-serif", fontWeight: 500 }}
                  >
                    {row.label}
                  </td>
                  <td
                    className="py-4 px-4 text-[13px] leading-relaxed"
                    style={{ color: "var(--pierre, #9C9183)", fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {row.classic}
                  </td>
                  <td
                    className="py-4 px-4 text-[13px] leading-relaxed"
                    style={{ color: "var(--ivoire, #F4EEE3)", fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {row.halo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
