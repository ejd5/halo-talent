"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";
import {
  FOOTER_WORDMARK,
  FOOTER_TAGLINE,
  FOOTER_LINKS,
  NEWSLETTER_TEXT,
  SIGNAL_WORDS,
} from "@/lib/marketing/couture-homepage";

export function CoutureFooter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const [email, setEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setNlStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setNlStatus("ok");
        setEmail("");
      } else {
        setNlStatus("error");
      }
    } catch {
      setNlStatus("error");
    }
  };

  return (
    <footer
      ref={ref}
      className="couture-section couture-section-noir relative overflow-hidden"
      style={{ backgroundColor: "var(--encre, #0C0A08)" }}
    >
      {/* Ambient ring */}
      <div
        className="halo-ring"
        style={{
          width: 700,
          height: 700,
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.15,
        }}
      />

      <div className="wrap-eco relative z-10">
        {/* Marquee strip */}
        <div className="couture-marquee mb-20">
          <div className="couture-marquee-track">
            {[...SIGNAL_WORDS, ...SIGNAL_WORDS, ...SIGNAL_WORDS].map((w, i) => (
              <span key={i} className="couture-marquee-item">
                {w}
              </span>
            ))}
          </div>
        </div>

        {/* Emblem + Wordmark */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="couture-ornament mb-8">
            <CoutureEmblem size={36} color="var(--or)" />
          </div>
          <h2
            className="mb-4"
            style={{
              fontFamily: "var(--font-display-alt), serif",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 400,
              color: "var(--ivoire)",
            }}
          >
            {FOOTER_WORDMARK}
          </h2>
          <p
            className="mx-auto text-[14px] leading-relaxed"
            style={{ maxWidth: 480, color: "var(--pierre)", opacity: 0.6 }}
          >
            {FOOTER_TAGLINE}
          </p>
        </motion.div>

        {/* Links grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          {/* Navigation */}
          <div>
            <span
              className="block mb-6 text-[10px] uppercase tracking-[0.22em]"
              style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
            >
              Navigation
            </span>
            <ul style={{ listStyle: "none" }} className="space-y-3">
              {FOOTER_LINKS.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] transition-colors duration-300"
                    style={{ color: "var(--pierre)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <span
              className="block mb-6 text-[10px] uppercase tracking-[0.22em]"
              style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
            >
              Légal
            </span>
            <ul style={{ listStyle: "none" }} className="space-y-3">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[14px] transition-colors duration-300"
                    style={{ color: "var(--pierre)" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <span
              className="block mb-6 text-[10px] uppercase tracking-[0.22em]"
              style={{ fontFamily: "var(--font-util), monospace", color: "var(--or)" }}
            >
              Newsletter
            </span>
            <p className="text-[13px] mb-4" style={{ color: "var(--pierre)", opacity: 0.6 }}>
              {NEWSLETTER_TEXT}
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="flex-1 px-4 py-2.5 text-[13px] bg-transparent outline-none"
                style={{
                  border: "1px solid var(--ligne-faible)",
                  color: "var(--ivoire)",
                }}
              />
              <button
                type="submit"
                disabled={nlStatus === "loading"}
                className="px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                style={{
                  fontFamily: "var(--font-util), monospace",
                  border: "1px solid var(--or)",
                  color: "var(--encre)",
                  backgroundColor: "var(--or)",
                  opacity: nlStatus === "loading" ? 0.6 : 1,
                }}
              >
                {nlStatus === "loading" ? "..." : nlStatus === "ok" ? "✓" : "OK"}
              </button>
            </form>
            {nlStatus === "ok" && (
              <p className="mt-2 text-[11px]" style={{ color: "var(--sauge)" }}>
                Inscription confirmée.
              </p>
            )}
            {nlStatus === "error" && (
              <p className="mt-2 text-[11px]" style={{ color: "var(--terre)" }}>
                Erreur — réessayez.
              </p>
            )}
          </div>
        </motion.div>

        {/* Divider */}
        <div
          className="h-px mb-8"
          style={{ background: "linear-gradient(90deg, transparent, var(--ligne), transparent)" }}
        />

        {/* Bottom bar */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-4 text-[11px]"
          style={{ color: "var(--pierre)", opacity: 0.4 }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.4 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <span>
            &copy; {new Date().getFullYear()} Halo Talent. Tous droits réservés.
          </span>
          <span>
            PARIS · NEW YORK · MILAN · TOKYO
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
