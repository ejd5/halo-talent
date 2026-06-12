"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const o = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true);
          o.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    o.observe(el);
    return () => o.disconnect();
  }, []);

  return (
    <div style={{ background: "#1A1614" }}>
      {/* Header */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-full opacity-[0.03] pointer-events-none"
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
            Contact
          </p>
          <h1
            className="font-display text-[2.5rem] md:text-[4.5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]"
            style={{
              color: "var(--color-dark-text)",
              clipPath: headerVisible ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
              transition: "clip-path 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s",
            }}
          >
            Parlons de votre projet
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
            Une question sur Halo Talent, nos outils, ou votre activité de créateur ?
            Écrivez-nous. On répond sous 48h ouvrées.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-20 md:py-28" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 md:gap-20">
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div
                  className="w-12 h-12 flex items-center justify-center mb-4"
                  style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
                >
                  <Mail size={20} />
                </div>
                <h3
                  className="font-display text-lg font-bold mb-2"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  Par email
                </h3>
                <p style={{ color: "rgba(245, 240, 235, 0.55)" }} className="text-sm leading-relaxed">
                  contact@halotalent.com
                </p>
              </div>

              <div>
                <div
                  className="w-12 h-12 flex items-center justify-center mb-4"
                  style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
                >
                  <MessageSquare size={20} />
                </div>
                <h3
                  className="font-display text-lg font-bold mb-2"
                  style={{ color: "var(--color-dark-text)" }}
                >
                  Sur les réseaux
                </h3>
                <p style={{ color: "rgba(245, 240, 235, 0.55)" }} className="text-sm leading-relaxed">
                  Suivez-nous sur Instagram, TikTok et X pour les actualités de la maison.
                </p>
              </div>

              <div
                className="p-6"
                style={{
                  background: "rgba(199, 91, 57, 0.05)",
                  border: "1px solid rgba(199, 91, 57, 0.1)",
                }}
              >
                <p className="text-xs leading-relaxed" style={{ color: "rgba(245, 240, 235, 0.5)" }}>
                  Ce formulaire est destiné aux questions générales. Pour postuler à la maison,
                  utilisez le{" "}
                  <Link href="/apply" style={{ color: "var(--color-accent)", textDecoration: "underline" }}>
                    formulaire de candidature
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
