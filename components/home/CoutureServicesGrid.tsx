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
    transition: { duration: 0.9, delay: d, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function CoutureServicesGrid() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });

  return (
    <section
      ref={ref}
      className="py-32 md:py-48"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div
          className="mb-24 md:mb-40"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span 
            className="block text-[10px] uppercase tracking-[0.34em] mb-6"
            style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
          >
            Services
          </span>
          <h2 
            style={{ 
              fontFamily: "var(--font-couture), Georgia, serif", 
              fontSize: "clamp(42px, 5vw, 72px)", 
              color: "var(--ivoire)", 
              lineHeight: 1.05, 
              letterSpacing: "-0.02em",
              maxWidth: 800
            }}
          >
            Un écosystème complet pour{" "}
            <span style={{ fontStyle: "italic", color: "var(--or)" }}>créateurs ambitieux.</span>
          </h2>
        </motion.div>

        {/* Layout Asymétrique sans bordures SaaS */}
        <div className="flex flex-col gap-32 md:gap-48">
          {SERVICES.map((svc, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.div
                key={svc.id}
                className={`flex flex-col md:flex-row gap-12 md:gap-24 ${isEven ? "" : "md:flex-row-reverse"}`}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "show" : "hidden"}
                custom={0.1 * i}
              >
                {/* Block Titre & Desc */}
                <div className="flex-1 max-w-[500px]">
                  <h3
                    className="mb-6"
                    style={{
                      fontFamily: "var(--font-couture), Georgia, serif",
                      fontSize: "clamp(32px, 3.5vw, 48px)",
                      fontWeight: 400,
                      color: "var(--ivoire)",
                      lineHeight: 1.1
                    }}
                  >
                    {svc.title}
                  </h3>
                  <p
                    className="text-[15px] leading-relaxed mb-10"
                    style={{ color: "rgba(244, 238, 227, 0.6)" }}
                  >
                    {svc.desc}
                  </p>
                  <Link
                    href={svc.cta.href}
                    className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] transition-all duration-300 group"
                    style={{
                      fontFamily: "var(--font-util), monospace",
                      color: "var(--or)",
                    }}
                  >
                    <span 
                      className="block w-8 h-px transition-all duration-300 group-hover:w-16" 
                      style={{ background: "var(--or)" }}
                    />
                    {svc.cta.label}
                  </Link>
                </div>

                {/* Block Capacités (Capabilities) */}
                <div className="flex-1 max-w-[400px]">
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {svc.capabilities.map((c, j) => (
                      <li
                        key={c}
                        className="py-5 flex items-start gap-4 text-[14px]"
                        style={{
                          borderBottom: j < svc.capabilities.length - 1 ? "1px solid rgba(244, 238, 227, 0.08)" : "none",
                          color: "rgba(244, 238, 227, 0.8)",
                          lineHeight: 1.5
                        }}
                      >
                        <span 
                          className="mt-1"
                          style={{ 
                            color: "var(--or)", 
                            fontSize: 8,
                            fontFamily: "var(--font-util), monospace",
                          }}
                        >
                          {(j + 1).toString().padStart(2, "0")}
                        </span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
