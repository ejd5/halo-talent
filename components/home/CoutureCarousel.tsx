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
      className="couture-section couture-section-fumee"
      style={{ backgroundColor: "var(--fumee, #15110D)" }}
    >
      <div className="wrap-eco">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="eyebrow">Cas d&apos;usage</span>
          <h2 className="display-medium mt-4">
            Des scénarios de <span className="serif-i">croissance.</span>
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          className="couture-carousel-wrap relative"
          onMouseEnter={() => {}}
        >
          <motion.div
            key={slide.id}
            className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-10"
            style={{
              border: "1px solid var(--ligne-faible)",
              background: "var(--encre)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {/* Left: Info */}
            <div>
              <span
                className="inline-block mb-4 text-[10px] uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
              >
                {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
              </span>
              <h3
                className="mb-3"
                style={{
                  fontFamily: "var(--font-display-alt), serif",
                  fontSize: "clamp(28px, 3vw, 42px)",
                  fontWeight: 400,
                  color: "var(--ivoire)",
                }}
              >
                {slide.title}
              </h3>
              <p className="mb-8 text-[15px] leading-relaxed" style={{ color: "var(--pierre)" }}>
                {slide.subtitle}
              </p>

              <div className="space-y-4">
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] block mb-1"
                    style={{ fontFamily: "var(--font-util), monospace", color: "var(--terre)" }}
                  >
                    Problème
                  </span>
                  <p className="text-[14px]" style={{ color: "var(--pierre)" }}>{slide.problem}</p>
                </div>
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] block mb-1"
                    style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
                  >
                    Système Halo
                  </span>
                  <p className="text-[14px]" style={{ color: "var(--pierre)" }}>{slide.system}</p>
                </div>
                <div>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em] block mb-1"
                    style={{ fontFamily: "var(--font-util), monospace", color: "var(--sauge)" }}
                  >
                    Bénéfice
                  </span>
                  <p className="text-[14px]" style={{ color: "var(--ivoire)" }}>{slide.benefit}</p>
                </div>
              </div>
            </div>

            {/* Right: Abstract visual placeholder */}
            <div
              className="hidden md:flex items-center justify-center"
              style={{ minHeight: 320 }}
              aria-hidden="true"
            >
              <div
                style={{
                  width: 280,
                  height: 360,
                  background: "linear-gradient(135deg, rgba(216,169,91,0.06), rgba(226,112,46,0.03))",
                  border: "1px solid var(--ligne)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display-alt), serif",
                    fontSize: 72,
                    color: "var(--or)",
                    opacity: 0.12,
                    fontStyle: "italic",
                  }}
                >
                  {String(current + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={prev}
              className="couture-carousel-btn"
              aria-label="Slide précédent"
            >
              <span style={{ fontSize: 20 }}>&larr;</span>
            </button>

            <div className="flex items-center gap-3">
              {CAROUSEL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`couture-carousel-dot${i === current ? " active" : ""}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="couture-carousel-btn"
              aria-label="Slide suivant"
            >
              <span style={{ fontSize: 20 }}>&rarr;</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px]" style={{ color: "var(--pierre)", opacity: 0.4 }}>
          Scénarios illustratifs — aucun résultat n&apos;est garanti.
        </p>
      </div>
    </section>
  );
}
