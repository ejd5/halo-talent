"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { CAROUSEL_SLIDES } from "@/lib/marketing/couture-homepage";

export function CoutureCarousel() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });
  const [current, setCurrent] = useState(0);

  const total = CAROUSEL_SLIDES.length;
  const prefersReduced = useRef(false);

  useEffect(() => {
    prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);

  // Autoplay (paused on reduced motion)
  useEffect(() => {
    if (prefersReduced.current) return;
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, [next]);

  const slide = CAROUSEL_SLIDES[current];

  return (
    <section
      ref={ref}
      className="py-32 md:py-48 overflow-hidden"
      style={{ backgroundColor: "var(--creme, #F9F6EF)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative">
        <motion.div
          className="mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <span 
            className="block mb-6 text-[10px] uppercase tracking-[0.34em]"
            style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
          >
            Cas d'usage
          </span>
          <h2 
            style={{
              fontFamily: "var(--font-couture), Georgia, serif",
              fontSize: "clamp(42px, 5vw, 72px)",
              color: "var(--encre)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em"
            }}
          >
            Des scénarios de <span style={{ fontStyle: "italic", color: "var(--or)" }}>croissance.</span>
          </h2>
        </motion.div>

        {/* Carousel (Editorial Layout) */}
        <div className="relative min-h-[500px] flex items-center">
          <motion.div
            key={slide.id}
            className="w-full flex flex-col md:flex-row gap-16 md:gap-32 items-start"
            initial={{ opacity: 0, filter: "blur(8px)", x: 40 }}
            animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Numero Geant */}
            <div className="flex-shrink-0 md:w-[120px]">
              <span
                style={{
                  fontFamily: "var(--font-couture), Georgia, serif",
                  fontSize: "clamp(80px, 10vw, 140px)",
                  color: "rgba(12,10,8,0.06)",
                  lineHeight: 0.8,
                  fontStyle: "italic",
                }}
              >
                {String(current + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Left: Info */}
            <div className="flex-1 max-w-[600px] mt-8 md:mt-16">
              <h3
                className="mb-6"
                style={{
                  fontFamily: "var(--font-couture), Georgia, serif",
                  fontSize: "clamp(36px, 4vw, 56px)",
                  fontWeight: 400,
                  color: "var(--encre)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em"
                }}
              >
                {slide.title}
              </h3>
              <p className="mb-16 text-[16px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7 }}>
                {slide.subtitle}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <span
                    className="text-[9px] uppercase tracking-[0.25em] block mb-3"
                    style={{ fontFamily: "var(--font-util), monospace", color: "rgba(12,10,8,0.4)" }}
                  >
                    Problème
                  </span>
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--encre)" }}>{slide.problem}</p>
                </div>
                <div>
                  <span
                    className="text-[9px] uppercase tracking-[0.25em] block mb-3"
                    style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
                  >
                    Système WTF
                  </span>
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--encre)" }}>{slide.system}</p>
                </div>
              </div>
              
              <div className="mt-12 pt-12" style={{ borderTop: "1px solid rgba(12,10,8,0.1)" }}>
                <span
                  className="text-[9px] uppercase tracking-[0.25em] block mb-3"
                  style={{ fontFamily: "var(--font-util), monospace", color: "rgba(12,10,8,0.4)" }}
                >
                  Bénéfice
                </span>
                <p 
                  className="text-[20px]" 
                  style={{ 
                    fontFamily: "var(--font-couture), Georgia, serif", 
                    color: "var(--encre)", 
                    fontStyle: "italic" 
                  }}
                >
                  {slide.benefit}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls - Minimalist Absolute Bottom Right */}
        <div className="flex items-center gap-12 mt-24 justify-end">
          <div className="flex items-center gap-4">
            {CAROUSEL_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === current ? 40 : 12,
                  height: 1,
                  background: i === current ? "var(--encre)" : "rgba(12,10,8,0.2)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all 0.5s ease"
                }}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={prev}
              className="group flex items-center justify-center w-12 h-12"
              style={{ border: "1px solid rgba(12,10,8,0.1)", background: "transparent", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--encre)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(12,10,8,0.1)" }}
              aria-label="Précédent"
            >
              <span style={{ color: "var(--encre)" }}>&larr;</span>
            </button>
            <button
              onClick={next}
              className="group flex items-center justify-center w-12 h-12"
              style={{ border: "1px solid rgba(12,10,8,0.1)", background: "transparent", cursor: "pointer", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--encre)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(12,10,8,0.1)" }}
              aria-label="Suivant"
            >
              <span style={{ color: "var(--encre)" }}>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
