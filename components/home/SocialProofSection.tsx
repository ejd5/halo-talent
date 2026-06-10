"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Stats data ─── */
const stats = [
  { value: "30%→10%", label: "Commission dégressive" },
  { value: "5", label: "Départements spécialisés" },
  { value: "30 jours", label: "Sortie sans pénalité" },
  { value: "0", label: "Frais d'entrée" },
];

/* ─── Count-up hook ─── */
function useCountUp(
  targetStr: string,
  active: boolean,
  delay: number,
): string {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      if (targetStr.includes("→")) {
        // Animated range: count the first number (30%→10% → count 0→30)
        const match = targetStr.match(/^(\d+)/);
        if (!match) { setDisplay(targetStr); return; }
        const max = Number(match[1]);
        const suffix = targetStr.slice(match[1].length);
        const duration = 1200;
        const start = performance.now();
        let frame: number;
        const animate = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const current = Math.round(eased * max);
          setDisplay(`${current}${suffix}`);
          if (p < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
      }

      const match = targetStr.match(/^(\d+)/);
      if (!match) { setDisplay(targetStr); return; }
      const max = Number(match[1]);
      const suffix = targetStr.slice(match[1].length);
      const duration = 1000;
      const start = performance.now();
      let frame: number;
      const animate = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = Math.round(eased * max);
        setDisplay(`${current}${suffix}`);
        if (p < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }, delay);
    return () => clearTimeout(t);
  }, [active, delay, targetStr]);

  return display || "0";
}

/* ─── Section ─── */
export function SocialProofSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-32 md:py-44 bg-base overflow-hidden">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        {/* ════════════════════════════════════════ */}
        {/* CHIFFRES CLÉS                          */}
        {/* ════════════════════════════════════════ */}
        <div className="mt-28 md:mt-36">
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-ink/10">
            {stats.map((stat, i) => {
              const count = useCountUp(stat.value, visible, 200 * i + 300);

              return (
                <div
                  key={stat.label}
                  className={cn(
                    "py-10 md:py-14",
                    i < stats.length - 1 && "border-r border-ink/10",
                    "relative",
                  )}
                >
                  <div
                    className="text-center"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(16px)",
                      transition: `opacity 0.6s ease-out ${200 * i + 400}ms, transform 0.6s ease-out ${200 * i + 400}ms`,
                    }}
                  >
                    <p className="font-display text-[36px] md:text-[48px] font-bold text-ink leading-none tabular-nums">
                      {count}
                    </p>
                    <p className="text-[13px] font-sans font-semibold text-ink-muted uppercase tracking-[0.08em] mt-2">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════ */}
        {/* PARTIE 3 — CITATION                    */}
        {/* ════════════════════════════════════════ */}
        <div className="mt-28 md:mt-36 relative max-w-4xl mx-auto">
          {/* Guillemet décoratif géant */}
          <span
            className="absolute -top-10 -left-4 md:-left-8 leading-none pointer-events-none select-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "120px",
              fontWeight: 700,
              color: "var(--color-accent)",
              opacity: 0.12,
            }}
          >
            &ldquo;
          </span>

          <div
            className="relative pl-8 md:pl-16"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(40px)",
              transition: "opacity 0.8s ease-out 0.8s, transform 0.8s cubic-bezier(0.77, 0, 0.18, 1) 0.8s",
            }}
          >
            <blockquote className="font-accent text-xl md:text-2xl italic leading-relaxed text-ink">
              &ldquo;Je cherchais un management qui ne me traiterait pas comme
              un produit. Halo Talent est la première maison où j&apos;ai signé
              en ayant lu le contrat AVANT.&rdquo;
            </blockquote>
            <div
              className="mt-6"
              style={{
                opacity: visible ? 1 : 0,
                transition: "opacity 0.6s ease-out 1.2s",
              }}
            >
              <p className="font-sans text-sm font-semibold text-ink">
                — Créateur accompagné
              </p>
              <p className="font-sans text-sm text-ink-muted">
                Département Digital Creators
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Marquee keyframes ─── */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
