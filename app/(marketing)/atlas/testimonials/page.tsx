"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Star,
  ArrowRight,
  Camera,
  Music2,
  Play,
} from "lucide-react";

/* ─── Testimonials data ─── */
const testimonials = [
  {
    initials: "AC",
    name: "Alexandre Charpentier",
    role: "Créateur contenu tech",
    platform: "YouTube",
    platformIcon: Play,
    platformColor: "#FF0000",
    quote:
      "Avant Atlas, je passais 15h par semaine à gérer mes emails et mes DM. Maintenant c'est automatisé, et mes fans reçoivent des réponses 10x plus rapides. Le ROI est immédiat.",
    rating: 5,
  },
  {
    initials: "SL",
    name: "Sarah Lefèvre",
    role: "Influenceuse lifestyle",
    platform: "Instagram",
    platformIcon: Camera,
    platformColor: "#E4405F",
    quote:
      "Ce qui m'a convaincue, c'est la conformité. Je pouvais pas dormir à cause du risque de ban. Avec Atlas, je lance des campagnes SMS sans peur. Et mes stats ont explosé.",
    rating: 5,
  },
  {
    initials: "MK",
    name: "Mehdi Khelifi",
    role: "Streamer & créateur",
    platform: "TikTok",
    platformIcon: Music2,
    platformColor: "#000000",
    quote:
      "Le moteur de règles 'Si-Alors' est une tuerie. J'ai automatisé mon welcome funnel, mes relances, et même ma modération. Je gagne 15h par mois, facile.",
    rating: 5,
  },
  {
    initials: "CB",
    name: "Camille Bouchard",
    role: "Créatrice mode & beauté",
    platform: "Instagram",
    platformIcon: Camera,
    platformColor: "#E4405F",
    quote:
      "La segmentation dynamique d'Atlas m'a ouvert les yeux. Je croyais connaître mon audience, mais je n'imaginais pas à quel point mes fans chauds étaient réactifs aux SMS.",
    rating: 4,
  },
  {
    initials: "TR",
    name: "Thomas Rivière",
    role: "Podcasteur & auteur",
    platform: "YouTube",
    platformIcon: Play,
    platformColor: "#FF0000",
    quote:
      "J'ai testé HubSpot, Mailchimp, et même des solutions custom. Rien n'est aussi bien pensé pour les créateurs. Atlas comprend nos contraintes, nos risques, nos objectifs.",
    rating: 5,
  },
  {
    initials: "LN",
    name: "Léa Nguyen",
    role: "Créatrice bien-être",
    platform: "TikTok",
    platformIcon: Music2,
    platformColor: "#000000",
    quote:
      "La garantie 'Zero ban' m'a fait signer. Je viens d'une communauté où 3 copines se sont fait bannir à cause d'outils automatiques. Avec Atlas, je suis sereine.",
    rating: 5,
  },
];

/* ─── Platform icon mapping ─── */
function PlatformIcon({ icon: Icon, color }: { icon: React.ElementType; color: string }) {
  return <Icon size={14} color={color} />;
}

/* ─── Testimonial card ─── */
function TestimonialCard({
  testimonial,
  index,
  visible,
}: {
  testimonial: (typeof testimonials)[0];
  index: number;
  visible: boolean;
}) {
  const PlatformIconComponent = testimonial.platformIcon;

  return (
    <div
      className="card-accent p-8 md:p-10 flex flex-col"
      style={{
        background: "var(--color-dark-surface)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease-out ${index * 80}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 80}ms`,
      }}
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < testimonial.rating ? "var(--color-accent)" : "none"}
            color={i < testimonial.rating ? "var(--color-accent)" : "rgba(245, 240, 235, 0.15)"}
          />
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-sm md:text-base leading-relaxed flex-1 mb-6" style={{ color: "rgba(245, 240, 235, 0.8)" }}>
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4 pt-5 border-t" style={{ borderColor: "rgba(245, 240, 235, 0.06)" }}>
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0"
          style={{
            background: "var(--color-accent-muted)",
            color: "var(--color-accent)",
          }}
        >
          {testimonial.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: "var(--color-dark-text)" }}>
            {testimonial.name}
          </p>
          <p className="text-xs truncate" style={{ color: "rgba(245, 240, 235, 0.4)" }}>
            {testimonial.role}
          </p>
        </div>
        <PlatformIconComponent size={16} color={testimonial.platformColor} />
      </div>
    </div>
  );
}

/* ─── Stats ─── */
const stats = [
  { value: "98%", label: "Satisfaction" },
  { value: "15K+", label: "Créateurs utilisent Atlas" },
  { value: "0", label: "Ban causé par Atlas" },
];

/* ─── Page ─── */
export default function TestimonialsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const headerRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const [gridVisible, setGridVisible] = useState(false);

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setGridVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStatsVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  return (
    <div style={{ background: "#1A1614" }}>
      {/* ════════════════════════════════════════ */}
      {/* HEADER                                   */}
      {/* ════════════════════════════════════════ */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, #C75B39 0%, transparent 70%)",
          }}
        />

        <div ref={headerRef} className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 text-center">
          <p
            className="text-[0.65rem] font-sans font-semibold uppercase tracking-[0.12em] mb-6"
            style={{
              color: "var(--color-accent)",
              opacity: headerVisible ? 1 : 0,
              transition: "opacity 0.6s ease-out",
            }}
          >
            Atlas
          </p>
          <h1
            className="font-display text-[2.5rem] md:text-[4.5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]"
            style={{
              color: "var(--color-dark-text)",
              clipPath: headerVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Ils utilisent Atlas
          </h1>
          <p
            className="text-base md:text-lg mt-4 max-w-xl mx-auto"
            style={{
              color: "rgba(245, 240, 235, 0.55)",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease-out 0.3s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
            }}
          >
            Des créateurs comme vous, de toutes les plateformes et de tous les
            niveaux, font confiance à Atlas pour automatiser leur croissance.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* TESTIMONIALS GRID                        */}
      {/* ════════════════════════════════════════ */}
      <section ref={gridRef} className="pb-20 md:pb-28">
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={testimonial.name}
                testimonial={testimonial}
                index={i}
                visible={gridVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* STATS BAR                                */}
      {/* ════════════════════════════════════════ */}
      <section ref={statsRef} className="py-16 md:py-20" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="text-center"
                style={{
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s ease-out ${i * 150}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${i * 150}ms`,
                }}
              >
                <p
                  className="font-display text-[2.5rem] md:text-[3.2rem] font-bold leading-none tabular-nums"
                  style={{ color: "var(--color-accent)" }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[0.7rem] font-sans font-semibold uppercase tracking-[0.1em] mt-3"
                  style={{ color: "rgba(245, 240, 235, 0.4)" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* CTA                                      */}
      {/* ════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 text-center">
          <h2
            className="font-display text-[1.8rem] md:text-[2.8rem] font-bold uppercase tracking-[-0.02em] leading-[1.1]"
            style={{ color: "var(--color-dark-text)" }}
          >
            Rejoignez-les
          </h2>
          <p
            className="text-base md:text-lg mt-4 max-w-md mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Créez votre compte Atlas en 2 minutes. Aucune carte bancaire requise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <Link
              href="/dashboard/atlas/onboarding"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "var(--color-accent)",
                color: "#F5F0EB",
              }}
            >
              Commencer gratuitement
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/atlas/pricing"
              className="inline-flex items-center justify-center px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300"
              style={{
                border: "2px solid rgba(245, 240, 235, 0.15)",
                color: "var(--color-dark-text)",
              }}
            >
              Voir les offres
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
