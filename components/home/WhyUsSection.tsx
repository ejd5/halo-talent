"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, LogOut, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";

const points = [
  {
    icon: FileText,
    title: "Commission publique",
    description: "Affichée avant signature. Pas de surprise, pas de petit caractère.",
  },
  {
    icon: LogOut,
    title: "Sortie 30 jours",
    description: "Sans pénalité. Si vous n'êtes pas satisfait, vous partez. Point.",
  },
  {
    icon: Eye,
    title: "Contrat téléchargeable",
    description: "Transparence totale. Lisez, faites lire, comparez.",
  },
  {
    icon: EyeOff,
    title: "L'IA propose, vous décidez",
    description: "Zéro ban guarantee. Nos outils suggèrent, vous validez. Toujours.",
  },
  {
    icon: ShieldCheck,
    title: "Bouclier Légal",
    description: (
      <>
        Analysez votre contrat d&rsquo;agence gratuitement. Détection de clauses abusives,
        diagnostic IA et génération de lettres juridiques.{" "}
        <Link
          href="/protection"
          className="text-accent underline underline-offset-2 hover:text-accent-hover transition-colors"
        >
          Découvrir l&rsquo;outil →
        </Link>
      </>
    ),
  },
];

export function WhyUsSection() {
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
    <section ref={ref} className="bg-base-alt py-32 md:py-44">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* ─── Colonne gauche — Citation ─── */}
          <div
            style={{
              transform: visible ? "translateX(0)" : "translateX(-30px)",
              opacity: visible ? 1 : 0,
              transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <blockquote className="font-serif text-2xl md:text-[2rem] leading-[1.4] text-ink">
              &ldquo;Les autres vous demandent 50%. Nous, on vous demande de grandir.&rdquo;
            </blockquote>
            <p className="font-sans text-base text-ink-secondary mt-6">
              — Halo Talent
            </p>
          </div>

          {/* ─── Colonne droite — 4 points ─── */}
          <div className="space-y-10">
            {points.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="flex gap-5"
                  style={{
                    transform: visible ? "translateY(0)" : "translateY(30px)",
                    opacity: visible ? 1 : 0,
                    transition: `transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${200 * i}ms, opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${200 * i}ms`,
                  }}
                >
                  <div className="shrink-0 mt-1">
                    <div className="w-10 h-10 flex items-center justify-center bg-accent-muted">
                      <Icon size={20} strokeWidth={1.5} className="text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink">
                      {point.title}
                    </h3>
                    <p className="font-sans text-base text-ink-secondary leading-relaxed mt-1">
                      {point.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
