"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { SERVICES } from "@/lib/marketing/couture-homepage";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (d: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: d, ease: "easeOut" as const },
  }),
};

export function CoutureServicesGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section
      ref={ref}
      className="couture-section couture-section-noir"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      <div className="wrap-eco">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="eyebrow">Services</span>
          <h2 className="display-medium mt-4" style={{ maxWidth: 700 }}>
            Un écosystème complet pour{" "}
            <span className="serif-i">créateurs ambitieux.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: "var(--ligne-faible)" }}>
          {SERVICES.map((svc, i) => (
            <motion.div
              key={svc.id}
              className="p-10 md:p-12 group"
              style={{
                background: "var(--encre)",
                transition: "background 0.4s",
              }}
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              custom={0.1 + i * 0.08}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--fumee)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--encre)";
              }}
            >
              <h3
                className="mb-3 transition-colors duration-300"
                style={{
                  fontFamily: "var(--font-display-alt), serif",
                  fontSize: "clamp(22px, 2vw, 30px)",
                  fontWeight: 400,
                  color: "var(--ivoire)",
                }}
              >
                {svc.title}
              </h3>
              <p
                className="mb-8 text-[14px] leading-relaxed"
                style={{ color: "var(--pierre)" }}
              >
                {svc.desc}
              </p>
              <ul style={{ listStyle: "none" }} className="mb-10">
                {svc.capabilities.map((c) => (
                  <li
                    key={c}
                    className="py-2.5 flex items-center gap-3 text-[13px]"
                    style={{
                      borderTop: "1px solid var(--ligne-faible)",
                      color: "var(--pierre)",
                    }}
                  >
                    <span style={{ color: "var(--or)", fontSize: 8 }}>&#9670;</span>
                    {c}
                  </li>
                ))}
              </ul>
              <Link
                href={svc.cta.href}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] transition-colors"
                style={{
                  fontFamily: "var(--font-util), monospace",
                  color: "var(--or)",
                }}
              >
                {svc.cta.label} &rarr;
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
