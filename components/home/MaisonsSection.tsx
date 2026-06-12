"use client";

import { useEffect, useRef } from "react";

export function MaisonsSection() {
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
      ref.current.querySelectorAll(".rv").forEach((el) => io.observe(el));
    }
    return () => io.disconnect();
  }, []);

  return (
    <section id="maisons" className="sec-eco" style={{ backgroundColor: "var(--encre, #0C0A08)" }}>
      <div className="wrap-eco">
        <div className="sec-head rv" ref={ref}>
          <span className="eyebrow">Une maison, trois &eacute;tages</span>
          <h2 className="display-medium">
            Tout ce qu&apos;une agence fait pour vous. <span className="serif-i">Sans l&apos;opacit&eacute;.</span>
          </h2>
          <p>Management humain, studio de cr&eacute;ation IA et CRM fans &mdash; r&eacute;unis dans une seule plateforme dont vous gardez les cl&eacute;s.</p>
        </div>
        <div className="maisons-grid">
          <article className="maison rv">
            <div className="glow-corner" />
            <span className="num">I &mdash; Management</span>
            <h3>La repr&eacute;sentation</h3>
            <p>Une &eacute;quipe d&eacute;di&eacute;e qui n&eacute;gocie, planifie et prot&egrave;ge votre carri&egrave;re &mdash; pay&eacute;e au r&eacute;sultat, jamais &agrave; l&apos;opacit&eacute;.</p>
            <ul>
              <li>Commission d&eacute;gressive 30% &rarr; 10%</li>
              <li>Contrat public, lisible en 10 minutes</li>
              <li>Sortie en 30 jours, sans p&eacute;nalit&eacute;</li>
              <li>Vos comptes restent les v&ocirc;tres</li>
            </ul>
          </article>
          <article className="maison rv rv-d1">
            <div className="glow-corner" />
            <span className="num">II &mdash; Studio</span>
            <h3>La cr&eacute;ation IA</h3>
            <p>Texte, image, vid&eacute;o, audio et avatars &mdash; un studio complet pour produire chaque jour sans &eacute;quipe de production.</p>
            <ul>
              <li>G&eacute;n&eacute;ration multi-format int&eacute;gr&eacute;e</li>
              <li>Calendrier multi-cr&eacute;ateurs</li>
              <li>D&eacute;clinaison par plateforme en 1 clic</li>
              <li>Votre voix, votre style, vos droits</li>
            </ul>
          </article>
          <article className="maison rv rv-d2">
            <div className="glow-corner" />
            <span className="num">III &mdash; Atlas</span>
            <h3>Le CRM fans</h3>
            <p>Connaissez chaque fan : scoring, segmentation, campagnes et automatisations &mdash; vous gardez le contr&ocirc;le des conversations.</p>
            <ul>
              <li>Scoring &amp; segmentation des fans</li>
              <li>Chat Copilot IA supervis&eacute; par vous</li>
              <li>Analytics unifi&eacute;s toutes plateformes</li>
              <li>Export complet CSV / JSON / PDF</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
