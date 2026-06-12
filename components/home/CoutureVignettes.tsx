"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { VIGNETTES } from "@/lib/marketing/couture-homepage";

export function CoutureVignettes() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      <div className="wrap-eco">
        <div className="couture-vignette-grid">
          {VIGNETTES.map((v, i) => (
            <motion.div
              key={v.id}
              className="couture-vignette-card group cursor-pointer"
              style={{
                background: hovered === v.id ? "var(--fumee)" : "transparent",
              }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.08 * i, ease: "easeOut" }}
              onMouseEnter={() => setHovered(v.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link href={v.href} className="no-underline" style={{ color: "inherit" }}>
                <span
                  className="block mb-6 text-[10px] uppercase tracking-[0.34em]"
                  style={{
                    fontFamily: "var(--font-util), monospace",
                    color: "var(--or)",
                  }}
                >
                  {v.num}
                </span>
                <h3
                  className="mb-3 transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-display-alt), serif",
                    fontSize: "clamp(20px, 2vw, 28px)",
                    fontWeight: 400,
                    color: hovered === v.id ? "var(--or)" : "var(--ivoire)",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-[14px] leading-relaxed"
                  style={{ color: "var(--pierre)" }}
                >
                  {v.desc}
                </p>
                <span
                  className="inline-block mt-5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-util), monospace",
                    color: hovered === v.id ? "var(--or)" : "var(--pierre)",
                    transform: hovered === v.id ? "translateX(4px)" : "none",
                  }}
                >
                  Explorer &rarr;
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
