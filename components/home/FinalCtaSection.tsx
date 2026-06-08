"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [imgOffset, setImgOffset] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parallax
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * 0.12;
      setImgOffset(Math.max(-40, Math.min(40, offset)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[500px] overflow-hidden bg-dark"
    >
      {/* Image avec parallax */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1400&q=80&auto=format&fit=crop)",
          transform: `translateY(${imgOffset}px)`,
          filter: "brightness(0.35) saturate(0.65)",
        }}
      />
      {/* Overlay progressif */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/50" />
      <div className="absolute inset-0 bg-amber-900/10 mix-blend-overlay pointer-events-none" />

      {/* Contenu */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-xl">
          <h2
            className="font-display text-[36px] md:text-[48px] font-bold text-white tracking-tight leading-[1.1]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease-out 0.1s, transform 0.7s cubic-bezier(0.77, 0, 0.18, 1) 0.1s",
            }}
          >
            Prêt à changer les règles&nbsp;?
          </h2>
          <p
            className="text-lg text-white/80 leading-relaxed mt-4 mx-auto max-w-[500px]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease-out 0.2s, transform 0.7s cubic-bezier(0.77, 0, 0.18, 1) 0.2s",
            }}
          >
            Candidatures ouvertes pour les créateurs établis. Processus de
            sélection en 10 jours.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 mt-10 justify-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease-out 0.35s, transform 0.6s ease-out 0.35s",
            }}
          >
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-10 py-4 bg-accent text-white text-[13px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-accent-hover"
            >
              Postuler maintenant
            </Link>
            <Link
              href="/saas"
              className="inline-flex items-center justify-center px-10 py-4 border border-white/30 text-white text-[13px] font-sans font-semibold uppercase tracking-[0.08em] hover:bg-white/10 transition-colors"
            >
              Découvrir l&apos;option SaaS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
