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
      className="py-32 md:py-48"
      style={{ backgroundColor: "var(--creme, #F9F6EF)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col gap-0">
          {VIGNETTES.map((v, i) => (
            <motion.div
              key={v.id}
              className="group relative border-b"
              style={{ borderColor: "rgba(12,10,8,0.1)" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHovered(v.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link href={v.href} className="block py-16 md:py-24 no-underline">
                <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-16">
                  {/* Numero */}
                  <span
                    className="flex-shrink-0 text-[10px] uppercase tracking-[0.34em]"
                    style={{
                      fontFamily: "var(--font-util), monospace",
                      color: hovered === v.id ? "var(--or)" : "var(--pierre)",
                      transition: "color 0.4s ease",
                      width: "80px",
                    }}
                  >
                    {v.num}
                  </span>

                  {/* Titre Geant */}
                  <h3
                    className="flex-grow transition-colors duration-500"
                    style={{
                      fontFamily: "var(--font-couture), Georgia, serif",
                      fontSize: "clamp(32px, 5vw, 64px)",
                      fontWeight: 900,
                      letterSpacing: "-0.02em",
                      color: hovered === v.id ? "var(--or)" : "var(--encre)",
                      lineHeight: 1.1,
                    }}
                  >
                    {v.title}
                  </h3>

                  {/* Desc */}
                  <div className="md:w-[320px] lg:w-[400px] flex-shrink-0">
                    <p
                      className="text-[14px] leading-relaxed transition-opacity duration-500"
                      style={{ 
                        color: "var(--encre)", 
                        opacity: hovered === v.id ? 1 : 0.6 
                      }}
                    >
                      {v.desc}
                    </p>
                    <span
                      className="inline-block mt-8 text-[10px] uppercase tracking-[0.2em] transition-all duration-500"
                      style={{
                        fontFamily: "var(--font-util), monospace",
                        color: hovered === v.id ? "var(--or)" : "var(--pierre)",
                        transform: hovered === v.id ? "translateX(8px)" : "none",
                      }}
                    >
                      Découvrir &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
