"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Stats count-up ─── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <p className="font-display text-[28px] font-bold text-ink leading-none transition-all duration-700"
         style={{ transform: visible ? "translateY(0)" : "translateY(12px)", opacity: visible ? 1 : 0 }}>
        {value}
      </p>
      <p className="text-[12px] font-sans font-medium text-ink-muted uppercase tracking-[0.1em] mt-1.5">
        {label}
      </p>
    </div>
  );
}

/* ─── Hero ─── */
const lines = ["Vous créez.", "Nous protégeons.", "Vous gardez."];
const heroImages = [
  "/images/heropic3.png",
  "/images/heropic.png",
  "/images/heropic6.png",
  "/images/heropic2.png",
  "/images/heropic7.png",
  "/images/heropic4.png",
  "/images/heropic5.png",
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [mounted]);

  return (
    <section className="relative min-h-screen bg-base flex flex-col md:flex-row">
      {/* ─── GAUCHE — 6/12 colonnes ─── */}
      <div className="md:w-6/12 flex items-center z-10 order-2 md:order-1">
        <div className="px-6 md:px-12 lg:px-16 py-16 md:py-0 w-full">
          {/* Eyebrow */}
          <p className={cn(
            "text-[12px] font-sans font-medium text-accent uppercase tracking-[0.12em] mb-6 transition-all duration-700 delay-100",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Maison de management créatif
          </p>

          {/* H1 */}
          <h1 className="break-words max-w-full">
            {lines.map((line, i) => (
              <span
                key={i}
                className={cn(
                  "block font-display font-extrabold text-ink uppercase leading-[1.1] tracking-[-0.02em]",
                  "text-[28px] md:text-[34px] lg:text-[40px]",
                  line === "Vous gardez." && "text-accent",
                )}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Sous-titre */}
          <p className={cn(
            "text-[18px] font-sans font-normal text-ink-muted leading-relaxed max-w-[420px] mt-7 transition-all duration-700 delay-500",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            Une maison qui rééquilibre le rapport entre créateurs et management.
          </p>

          {/* Boutons */}
          <div className={cn(
            "flex flex-col sm:flex-row gap-4 mt-10 transition-all duration-700 delay-600",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-8 py-3 bg-accent text-white text-[13px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-accent-hover"
            >
              Postuler à la maison
            </Link>
            <Link
              href="/manifeste"
              className="inline-flex items-center justify-center px-8 py-3 border border-ink text-ink text-[13px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-ink hover:text-base"
            >
              Découvrir notre approche
            </Link>
          </div>

          {/* Stats */}
          <div className={cn(
            "grid grid-cols-3 gap-8 mt-16 pt-12 border-t border-ink/10 transition-all duration-700 delay-700",
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <AnimatedStat value="30%→10%" label="Commission dégressive" />
            <AnimatedStat value="5" label="Départements" />
            <AnimatedStat value="100%" label="Souveraineté garantie" />
          </div>
        </div>
      </div>

      {/* ─── DROITE — 6/12 colonnes : IMAGE CARROUSEL ─── */}
      <div className="md:w-6/12 min-h-[40vh] md:min-h-screen relative overflow-hidden order-1 md:order-2">
        {/* Images en crossfade avec zoom subtil */}
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${src})`,
              opacity: i === current ? 1 : 0,
              transform: i === current ? "scale(1)" : "scale(1.08)",
              transition: "opacity 1s ease, transform 6s ease-out",
              zIndex: i === current ? 1 : 0,
            }}
          />
        ))}

        {/* Warm overlay + grain */}
        <div className="absolute inset-0 bg-amber-900/5 mix-blend-overlay pointer-events-none z-10" />
        <div className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none z-10"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />
        {/* White fade vignette — contours fondus */}
        <div className="absolute inset-0 pointer-events-none z-10"
             style={{ boxShadow: "inset 0 0 100px 40px var(--color-base)" }} />
      </div>
    </section>
  );
}
