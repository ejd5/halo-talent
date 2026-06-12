"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export function BouclierSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    if (ref.current) {
      ref.current.querySelectorAll(".rv, .scan-card").forEach((el) => io.observe(el));
    }
    return () => io.disconnect();
  }, []);

  return (
    <section id="bouclier" className="bouclier-section sec-eco" style={{ backgroundColor: "var(--fumee, #15110D)" }}>
      <div className="halo-ring" />
      <div className="wrap-eco bouclier-in">
        <div className="rv">
          <span className="eyebrow">Bouclier L&eacute;gal &mdash; gratuit</span>
          <h2 className="display-small" style={{ margin: "18px 0 24px" }}>
            Votre contrat d&apos;agence cache peut-&ecirc;tre <span className="serif-i">des clauses abusives.</span>
          </h2>
          <p style={{ color: "var(--pierre, #9C9183)", marginBottom: "40px" }}>
            Importez votre contrat. Notre analyse d&eacute;tecte les clauses d&apos;exclusivit&eacute; abusives, les p&eacute;nalit&eacute;s de sortie d&eacute;guis&eacute;es et les transferts de propri&eacute;t&eacute; de comptes. En 2 minutes, sans engagement, m&ecirc;me si vous ne signez jamais chez nous.
          </p>
          <Link href="/protection" className="btn-eco btn-eco-fill">
            Analyser mon contrat &rarr;
          </Link>
        </div>
        <div className="scan-card rv rv-d1">
          <div className="eyebrow" style={{ marginBottom: "20px" }}>Analyse &middot; contrat_agence.pdf</div>
          <div className="scan-line">
            <span>Clause d&apos;exclusivit&eacute; 36 mois</span>
            <span className="flag">&#9888; Abusive</span>
          </div>
          <div className="scan-line">
            <span>P&eacute;nalit&eacute; de sortie 15 000 €</span>
            <span className="flag">&#9888; Abusive</span>
          </div>
          <div className="scan-line">
            <span>Propri&eacute;t&eacute; des comptes &rarr; agence</span>
            <span className="flag">&#9888; Critique</span>
          </div>
          <div className="scan-line">
            <span>Reversement sous 30 jours</span>
            <span className="safe">&#10003; Conforme</span>
          </div>
          <div className="scan-bar"><i /></div>
          <div style={{ marginTop: "14px", color: "var(--pierre, #9C9183)", fontSize: "11px", letterSpacing: "0.1em" }}>
            SCORE DE RISQUE : &Eacute;LEV&Eacute; &mdash; 3 CLAUSES &Agrave; REN&Eacute;GOCIER
          </div>
        </div>
      </div>
    </section>
  );
}
