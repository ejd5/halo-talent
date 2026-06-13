"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FAQ_HOMEPAGE } from "@/lib/marketing/couture-homepage";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function CoutureFAQ() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="couture-section"
      style={{ backgroundColor: "var(--creme, #F9F6EF)", paddingTop: 100, paddingBottom: 100 }}
    >
      <div className="wrap-eco" style={{ maxWidth: 720 }}>
        <motion.p
          className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-4 text-center"
          style={{ color: "var(--or, #D8A95B)", fontFamily: "var(--font-util), monospace" }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Questions fréquentes
        </motion.p>
        <motion.h2
          className="display-medium mb-12 text-center"
          style={{ color: "var(--encre, #0C0A08)" }}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
        >
          Ce que vous voulez savoir
        </motion.h2>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        >
          {FAQ_HOMEPAGE.map((faq, i) => (
            <div
              key={i}
              style={{
                border: "1px solid rgba(12,10,8,0.08)",
                background: openIndex === i ? "rgba(12,10,8,0.03)" : "white",
                transition: "background 0.2s",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
                style={{ background: "none", border: "none", cursor: "pointer" }}
                aria-expanded={openIndex === i}
              >
                <span
                  className="text-[15px] font-medium"
                  style={{ color: "var(--encre, #0C0A08)", fontFamily: "var(--font-body), sans-serif" }}
                >
                  {faq.q}
                </span>
                <ChevronDown
                  size={16}
                  style={{
                    transform: openIndex === i ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                    color: "var(--or, #D8A95B)",
                    flexShrink: 0,
                  }}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p
                    className="text-[14px] leading-relaxed"
                    style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}
                  >
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </motion.div>

        <motion.p
          className="text-center mt-10 text-[14px]"
          style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.5 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Vous avez d'autres questions ?{" "}
          <Link
            href="/contact"
            style={{ color: "var(--or, #D8A95B)", textDecoration: "underline" }}
          >
            Contactez-nous
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
