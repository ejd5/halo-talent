"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { REASSURANCE_ITEMS } from "@/lib/marketing/couture-homepage";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, delay: d, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function CoutureReassurance() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section
      ref={ref}
      className="py-32 md:py-48"
      style={{ backgroundColor: "var(--creme, #F9F6EF)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="mb-24 md:mb-32 max-w-[600px]"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span 
            className="block mb-6 text-[10px] uppercase tracking-[0.34em]"
            style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
          >
            Standards
          </span>
          <h2
            style={{
              fontFamily: "var(--font-couture), Georgia, serif",
              fontSize: "clamp(36px, 4vw, 56px)",
              color: "var(--encre)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em"
            }}
          >
            Ce que Halo <span style={{ fontStyle: "italic", color: "var(--or)" }}>apporte.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col md:flex-row flex-wrap gap-16 md:gap-24 lg:gap-32">
          {REASSURANCE_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              className="flex-1 min-w-[280px]"
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.1 * i}
            >
              <div
                className="mb-8"
                style={{
                  width: 1,
                  height: 64,
                  background: "var(--or)",
                  opacity: 0.6,
                }}
              />
              <h3
                className="mb-6"
                style={{
                  fontFamily: "var(--font-couture), Georgia, serif",
                  fontSize: "clamp(24px, 2.5vw, 32px)",
                  fontWeight: 400,
                  color: "var(--encre)",
                  lineHeight: 1.2
                }}
              >
                {item.title}
              </h3>
              <p className="text-[15px] leading-relaxed max-w-[340px]" style={{ color: "rgba(12,10,8,0.6)" }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
