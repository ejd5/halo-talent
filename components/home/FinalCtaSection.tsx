"use client";

import Link from "next/link";

export function FinalCtaSection() {
  return (
    <section className="final-section" style={{ backgroundColor: "var(--encre, #0C0A08)" }}>
      <div className="halo-glow" />
      <div className="halo-ring" />
      <div className="wrap-eco">
        <h2>
          Entrez dans <span className="serif-i">la maison.</span>
        </h2>
        <p>
          Commencez gratuitement avec le Bouclier L&eacute;gal, ou candidatez pour rejoindre le roster.
        </p>
        <div className="hero-cta" style={{ justifyContent: "center", opacity: 1, animation: "none" }}>
          <Link href="/apply" className="btn-eco btn-eco-fill">
            Commencer gratuitement &rarr;
          </Link>
          <Link href="/apply" className="btn-eco btn-eco-gold">
            Candidater au management
          </Link>
        </div>
      </div>
    </section>
  );
}
