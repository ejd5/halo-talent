"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { RelatedLink } from "@/lib/marketing/internal-linking";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return { ref, inView };
}

const riseItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export function ContinuerAvec({
  title = "Continuer avec",
  links,
}: {
  title?: string;
  links: RelatedLink[];
}) {
  const { ref, inView } = useReveal();

  return (
    <section ref={ref} className="py-16 md:py-20" style={{ backgroundColor: "var(--creme)" }}>
      <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={riseItem}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-6 text-center"
            style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          >
            {title}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {links.map((link, i) => (
            <motion.div
              key={link.href}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={riseItem}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
            >
              <Link
                href={link.href}
                className="block p-5 h-full transition-all duration-300 hover:-translate-y-0.5 group"
                style={{
                  border: "1px solid var(--ligne-faible)",
                  borderRadius: "2px",
                  backgroundColor: "transparent",
                }}
              >
                <p
                  className="text-[0.9rem] font-semibold mb-1.5 transition-colors duration-200 group-hover:opacity-80"
                  style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}
                >
                  {link.label}
                </p>
                <p
                  className="text-[0.8rem] leading-relaxed"
                  style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}
                >
                  {link.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
