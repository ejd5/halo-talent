"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export function HeroSection() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Counter animation for stats
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const end = parseFloat(el.dataset.count || "0");
        const suffix = el.dataset.suffix || "";
        let t0: number | null = null;
        const step = (ts: number) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / 1200, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });

    if (statsRef.current) {
      statsRef.current.querySelectorAll("[data-count]").forEach((el) => cio.observe(el));
    }

    return () => cio.disconnect();
  }, []);

  return (
    <header className="hero-section" style={{ backgroundColor: "var(--encre, #0C0A08)" }}>
      <div className="halo-glow" />
      <div className="halo-ring" />
      <div className="wrap-eco hero-grid">
        <div className="hero-badge">
          <span className="dot" />
          Nouveau &mdash; Bouclier L&eacute;gal gratuit &middot; analysez votre contrat d&apos;agence
        </div>
        <h1 className="hero-title display-large" style={{ maxWidth: "14ch" }}>
          <span className="line"><span>Les autres agences</span></span>
          <span className="line"><span>prennent 50%.</span></span>
          <span className="line"><span><span className="serif-i">Nous, on vous donne</span></span></span>
          <span className="line"><span><span className="serif-i">les outils.</span></span></span>
        </h1>
        <p className="hero-sub">
          Halo remplace 7 outils par une seule maison : cr&eacute;ation IA, CRM fans, analytics, protection juridique et management transparent. Commission d&eacute;gressive de 30% &agrave; 10% &mdash; publique, sans frais d&apos;entr&eacute;e, sortie en 30 jours.
        </p>
        <div className="hero-cta">
          <Link href="/protection" className="btn-eco btn-eco-fill">
            Analyser mon contrat gratuitement &rarr;
          </Link>
          <Link href="/#maisons" className="btn-eco btn-eco-gold">
            D&eacute;couvrir la maison
          </Link>
        </div>
        <div className="hero-stats" ref={statsRef}>
          <div className="hstat">
            <div className="n"><span data-count="10" data-suffix="%">10%</span></div>
            <div className="l">Commission plancher</div>
          </div>
          <div className="hstat">
            <div className="n"><span data-count="7">7</span> <em>en 1</em></div>
            <div className="l">Outils remplac&eacute;s</div>
          </div>
          <div className="hstat">
            <div className="n"><span data-count="30">30</span> <em>jours</em></div>
            <div className="l">Sortie sans p&eacute;nalit&eacute;</div>
          </div>
          <div className="hstat">
            <div className="n"><span data-count="6">6</span> <em>langues</em></div>
            <div className="l">FR &middot; EN &middot; ES &middot; DE &middot; PT &middot; IT</div>
          </div>
        </div>
      </div>
    </header>
  );
}
