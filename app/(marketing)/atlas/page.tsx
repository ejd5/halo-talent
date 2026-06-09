"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Brain,
  MessageSquare,
  GitBranch,
  Zap,
  BarChart3,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Star,
} from "lucide-react";

/* ─── Feature data ─── */
const features = [
  {
    icon: Brain,
    title: "CRM Intelligent",
    desc: "Score, segmentez et fidélisez chaque fan avec un moteur de scoring propriétaire basé sur l'engagement réel.",
  },
  {
    icon: MessageSquare,
    title: "Multi-canal",
    desc: "Email, SMS, Push, DM en un clic. Orchestrez toutes vos communications depuis un tableau de bord unique.",
  },
  {
    icon: GitBranch,
    title: "Funnels automatisés",
    desc: "Welcome, lead capture, ventes — des séquences prêtes à l'emploi qui convertissent sans intervention.",
  },
  {
    icon: Zap,
    title: "Règles &quot;Si-Alors&quot;",
    desc: "Moteur d'automatisation Zapier-like. Créez des workflows sans code en quelques secondes.",
  },
  {
    icon: BarChart3,
    title: "Analytics & ROI",
    desc: "Mesurez chaque action, chaque campagne, chaque euro dépensé. Attribution multi-touch incluse.",
  },
  {
    icon: ShieldCheck,
    title: "100% Conforme",
    desc: "RGPD, anti-spam, règles des plateformes. Atlas est audité en continu pour vous protéger.",
  },
];

/* ─── Mock stats ─── */
const stats = [
  { value: "150K+", label: "Fans gérés" },
  { value: "2,4M", label: "Campagnes envoyées" },
  { value: "12M€", label: "Économisés en conformité" },
];

/* ─── Count-up hook ─── */
function useCountUp(value: string, active: boolean, delay: number): string {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => {
      const digits = value.replace(/[^0-9,.]/g, "");
      const suffix = value.slice(digits.length);
      const raw = digits.replace(/[,.]/g, "");
      const max = parseInt(raw, 10);
      if (isNaN(max)) {
        setDisplay(value);
        return;
      }
      const duration = 2000;
      const start = performance.now();
      let frame: number;
      const animate = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const current = Math.round(eased * max);
        // Format with K/M suffixes
        let formatted = current.toString();
        if (max >= 1000000) formatted = (current / 1000000).toFixed(1) + "M";
        else if (max >= 1000) formatted = (current / 1000).toFixed(0) + "K";
        setDisplay(`${formatted}${suffix}`);
        if (p < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }, delay);
    return () => clearTimeout(t);
  }, [active, delay, value]);
  return display;
}

/* ─── Feature card ─── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  index,
  visible,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className="card-accent p-8 md:p-10 flex flex-col"
      style={{
        background: "var(--color-dark-surface)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s ease-out ${index * 100}ms, transform 0.7s cubic-bezier(0.77, 0, 0.18, 1) ${index * 100}ms`,
      }}
    >
      <div
        className="w-12 h-12 flex items-center justify-center mb-6"
        style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
      >
        <Icon size={22} />
      </div>
      <h3 className="font-display text-xl font-semibold text-dark-text mb-3">
        {title}
      </h3>
      <p className="text-sm leading-relaxed flex-1" style={{ color: "var(--color-dark-muted)" }}>
        {desc}
      </p>
    </div>
  );
}

/* ─── Page ─── */
export default function AtlasLandingPage() {
  const [mounted, setMounted] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [testimonialVisible, setTestimonialVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = featuresRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFeaturesVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = testimonialRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTestimonialVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#1A1614" }}>
      {/* ════════════════════════════════════════ */}
      {/* HERO                                     */}
      {/* ════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Gradient accent */}
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.04] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, #C75B39 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-12 py-28 md:py-32">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[0.65rem] font-sans font-semibold uppercase tracking-[0.1em]"
            style={{
              color: "var(--color-success)",
              background: "rgba(122, 154, 101, 0.1)",
              border: "1px solid rgba(122, 154, 101, 0.2)",
              opacity: mounted ? 1 : 0,
              transition: "opacity 0.6s ease-out 0.2s",
            }}
          >
            <CheckCircle2 size={12} />
            Zero ban garanti
          </div>

          <h1
            className="font-display font-bold uppercase leading-[1.05] tracking-[-0.02em] text-[2.8rem] md:text-[5rem] lg:text-[6rem]"
            style={{
              color: "var(--color-dark-text)",
              clipPath: mounted ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Atlas
          </h1>
          <p
            className="font-display text-lg md:text-2xl mt-3 md:mt-4"
            style={{
              color: "var(--color-dark-muted)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease-out 0.5s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
            }}
          >
            L&apos;automatisation intelligente pour créateurs
          </p>

          <p
            className="text-base md:text-lg leading-relaxed mt-6 max-w-[540px]"
            style={{
              color: "rgba(245, 240, 235, 0.55)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease-out 0.7s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s",
            }}
          >
            CRM, campagnes multi-canaux, funnels automatisés, et modération IA.
            Le tout 100% conforme aux règles 2026.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-4 mt-10"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease-out 0.9s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.9s",
            }}
          >
            <Link
              href="/dashboard/atlas/onboarding"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "var(--color-accent)",
                color: "#F5F0EB",
              }}
            >
              Commencer
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/atlas/fonctionnalites"
              className="inline-flex items-center justify-center px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300"
              style={{
                border: "2px solid rgba(245, 240, 235, 0.15)",
                color: "var(--color-dark-text)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(245, 240, 235, 0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              Voir les fonctionnalités
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* FEATURES GRID (3x2)                       */}
      {/* ════════════════════════════════════════ */}
      <section ref={featuresRef} className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <div className="text-center mb-16 md:mb-20">
            <h2
              className="font-display text-[2rem] md:text-[3.2rem] font-bold uppercase tracking-[-0.02em]"
              style={{
                color: "var(--color-dark-text)",
                opacity: featuresVisible ? 1 : 0,
                transition: "opacity 0.7s ease-out",
              }}
            >
              Tout ce qu&apos;il vous faut
            </h2>
            <p
              className="text-sm md:text-base mt-4 max-w-xl mx-auto"
              style={{
                color: "rgba(245, 240, 235, 0.4)",
                opacity: featuresVisible ? 1 : 0,
                transition: "opacity 0.7s ease-out 0.1s",
              }}
            >
              Pas de superflu. Juste les outils qui transforment votre audience en
              communauté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {features.map((feat, i) => (
              <FeatureCard
                key={feat.title}
                icon={feat.icon}
                title={feat.title}
                desc={feat.desc}
                index={i}
                visible={featuresVisible}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* STATS BAR                                */}
      {/* ════════════════════════════════════════ */}
      <section ref={statsRef} className="py-16 md:py-20" style={{ background: "#2A2420" }}>
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {stats.map((stat, i) => {
              const count = useCountUp(stat.value, statsVisible, 300 * i);
              return (
                <div
                  key={stat.label}
                  className="text-center"
                  style={{
                    opacity: statsVisible ? 1 : 0,
                    transform: statsVisible ? "translateY(0)" : "translateY(24px)",
                    transition: `opacity 0.7s ease-out ${300 * i}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${300 * i}ms`,
                  }}
                >
                  <p
                    className="font-display text-[2.5rem] md:text-[3.2rem] font-bold leading-none tabular-nums"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {count}
                  </p>
                  <p
                    className="text-[0.7rem] font-sans font-semibold uppercase tracking-[0.1em] mt-3"
                    style={{ color: "rgba(245, 240, 235, 0.4)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* TESTIMONIAL                              */}
      {/* ════════════════════════════════════════ */}
      <section ref={testimonialRef} className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <div
            className="relative max-w-3xl mx-auto"
            style={{
              opacity: testimonialVisible ? 1 : 0,
              transform: testimonialVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.77, 0, 0.18, 1)",
            }}
          >
            {/* Big decorative quote */}
            <span
              className="absolute -top-10 -left-4 leading-none pointer-events-none select-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "120px",
                fontWeight: 700,
                color: "var(--color-accent)",
                opacity: 0.1,
              }}
            >
              &ldquo;
            </span>

            <div className="relative pl-8 md:pl-16">
              <blockquote
                className="text-lg md:text-xl italic leading-relaxed"
                style={{ color: "var(--color-dark-text)" }}
              >
                &ldquo;Atlas nous a permis de multiplier par 3 notre engagement
                sans jamais toucher à notre conformité. Le moteur de règles
                &quot;Si-Alors&quot; est un game-changer pour les createurs.&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-sm"
                  style={{
                    background: "var(--color-accent-muted)",
                    color: "var(--color-accent)",
                  }}
                >
                  ML
                </div>
                <div>
                  <p className="font-sans text-sm font-semibold" style={{ color: "var(--color-dark-text)" }}>
                    Marine L.
                  </p>
                  <p className="text-xs" style={{ color: "rgba(245, 240, 235, 0.4)" }}>
                    Creatrice lifestyle · 245K abonnés
                  </p>
                </div>
                <div className="flex gap-0.5 ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="var(--color-accent)" color="var(--color-accent)" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════ */}
      {/* FINAL CTA                                */}
      {/* ════════════════════════════════════════ */}
      <section ref={ctaRef} className="py-28 md:py-36" style={{ background: "#2A2420" }}>
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[0.65rem] font-sans font-semibold uppercase tracking-[0.1em]"
            style={{
              color: "var(--color-success)",
              background: "rgba(122, 154, 101, 0.1)",
              border: "1px solid rgba(122, 154, 101, 0.2)",
              opacity: ctaVisible ? 1 : 0,
              transition: "opacity 0.6s ease-out",
            }}
          >
            <ShieldCheck size={12} />
            Zero ban garanti
          </div>

          <h2
            className="font-display text-[2rem] md:text-[3.5rem] font-bold uppercase tracking-[-0.02em] leading-[1.1]"
            style={{
              color: "var(--color-dark-text)",
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease-out 0.1s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Prêt à passer à l&apos;échelle ?
          </h2>
          <p
            className="text-base md:text-lg mt-4 max-w-lg mx-auto"
            style={{
              color: "rgba(245, 240, 235, 0.55)",
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease-out 0.2s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            Rejoignez les createurs qui automatisent leur croissance sans risquer
            leur compte.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 mt-10 justify-center"
            style={{
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease-out 0.35s, transform 0.6s ease-out 0.35s",
            }}
          >
            <Link
              href="/dashboard/atlas/onboarding"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: "var(--color-accent)",
                color: "#F5F0EB",
              }}
            >
              Commencer maintenant
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/atlas/pricing"
              className="inline-flex items-center justify-center px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300"
              style={{
                border: "2px solid rgba(245, 240, 235, 0.15)",
                color: "var(--color-dark-text)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(245, 240, 235, 0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
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
