"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  EDITORIAL_INTRO_TITLE,
  EDITORIAL_INTRO_TEXT,
} from "@/lib/marketing/couture-homepage";

export function CoutureEditorialIntro() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section
      ref={ref}
      className="couture-section couture-section-ivoire"
      style={{ backgroundColor: "var(--creme, #F9F6EF)" }}
    >
      <div className="wrap-eco text-center">
        {/* Ornament */}
        <motion.div
          className="couture-ornament mb-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 0.5, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 140, width: "auto" }} />
        </motion.div>

        {/* Title */}
        <motion.h2
          className="display-medium mx-auto"
          style={{ maxWidth: 800, color: "var(--encre)" }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
        >
          {EDITORIAL_INTRO_TITLE}
        </motion.h2>

        {/* Text */}
        <motion.p
          className="mx-auto text-[16px] leading-relaxed"
          style={{
            maxWidth: 640,
            color: "var(--encre)",
            opacity: 0.7,
            fontFamily: "var(--font-body), sans-serif",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 0.7, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
        >
          {EDITORIAL_INTRO_TEXT}
        </motion.p>
      </div>
    </section>
  );
}
