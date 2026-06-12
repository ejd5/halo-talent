"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { REASSURANCE_ITEMS } from "@/lib/marketing/couture-homepage";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d, ease: "easeOut" as const },
  }),
};

export function CoutureReassurance() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  return (
    <section
      ref={ref}
      className="couture-section couture-section-ivoire"
      style={{ backgroundColor: "var(--creme, #F9F6EF)" }}
    >
      <div className="wrap-eco">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="couture-ornament mb-6">
            <CoutureEmblem size={22} color="var(--or)" />
          </div>
          <h2
            className="display-medium"
            style={{ color: "var(--encre)" }}
          >
            Ce que Halo <span className="serif-i">apporte.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "rgba(0,0,0,0.06)" }}>
          {REASSURANCE_ITEMS.map((item, i) => (
            <motion.div
              key={item.title}
              className="p-10"
              style={{
                backgroundColor: "var(--creme, #F9F6EF)",
                transition: "background 0.3s",
              }}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.08 * i}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(216,169,91,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--creme, #F9F6EF)";
              }}
            >
              <div
                className="mb-5"
                style={{
                  width: 1,
                  height: 28,
                  background: "var(--or)",
                  opacity: 0.5,
                }}
              />
              <h3
                className="mb-2"
                style={{
                  fontFamily: "var(--font-display-alt), serif",
                  fontSize: "clamp(18px, 1.6vw, 24px)",
                  fontWeight: 400,
                  color: "var(--encre)",
                }}
              >
                {item.title}
              </h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6 }}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
