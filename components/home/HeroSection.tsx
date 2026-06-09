"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const heroLines = [
  { text: "VOUS CRÉEZ.", delay: 300 },
  { text: "NOUS PROTÉGEONS.", delay: 600 },
  { text: "VOUS GARDEZ.", delay: 900 },
];

export function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section className="relative min-h-screen -mt-20 pt-20 grid grid-cols-1 md:grid-cols-[5fr_7fr] bg-base overflow-hidden">
      {/* ─── GAUCHE — Texte ─── */}
      <div className="flex items-center order-2 md:order-1">
        <div className="w-full pl-6 pr-6 md:pl-20 md:pr-16 py-20 md:py-0">
          {/* Micro-label */}
          <p
            className="label-uppercase mb-8"
            style={{
              transform: mounted ? "translateX(0)" : "translateX(-30px)",
              opacity: mounted ? 1 : 0,
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Maison de management créatif
          </p>

          {/* Titre — clip-path reveal par ligne */}
          <h1>
            {heroLines.map((line) => (
              <span
                key={line.text}
                className="block font-display font-bold text-ink uppercase leading-[1.1] tracking-[-0.02em] text-[2.5rem] md:text-[4rem]"
                style={{
                  clipPath:
                    mounted
                      ? "inset(0 0% 0 0)"
                      : "inset(0 100% 0 0)",
                  transition: `clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${line.delay}ms`,
                }}
              >
                {line.text}
              </span>
            ))}
          </h1>

          {/* Sous-titre */}
          <p
            className="text-lg md:text-xl font-sans font-normal text-ink-secondary leading-relaxed mt-8 max-w-[420px]"
            style={{
              transform: mounted ? "translateY(0)" : "translateY(20px)",
              opacity: mounted ? 1 : 0,
              transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.2s, opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 1.2s",
            }}
          >
            Une maison qui rééquilibre le rapport entre créateurs et management.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 mt-10"
            style={{
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              opacity: mounted ? 1 : 0,
              transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.5s, opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.5s",
            }}
          >
            <Link
              href="/apply"
              className="inline-flex items-center justify-center px-10 py-4 bg-accent text-white text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02] hover:bg-accent-hover"
            >
              Postuler à la maison
            </Link>
            <Link
              href="/manifeste"
              className="inline-flex items-center justify-center px-10 py-4 border-2 border-ink text-ink text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:bg-ink/5"
            >
              Découvrir notre approche
            </Link>
          </div>
        </div>
      </div>

      {/* ─── DROITE — Image plein cadre ─── */}
      <div className="relative h-[60vh] md:h-screen overflow-hidden order-1 md:order-2">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(/images/heropic.png)",
            filter: "saturate(0.85) contrast(1.05)",
          }}
        />
        {/* Grain texture subtile */}
        <div
          className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </section>
  );
}
