"use client";

import { useEffect, useRef } from "react";

export function ComparisonSection() {
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
    <section className="sec-eco" ref={ref} style={{ backgroundColor: "var(--encre, #0C0A08)" }}>
      <div className="wrap-eco">
        <div className="sec-head rv">
          <span className="eyebrow">Ce que Halo fait mieux</span>
          <h2 className="display-medium">
            Pas de magie. <span className="serif-i">Une approche diff&eacute;rente.</span>
          </h2>
        </div>
        <div className="compare-grid">
          {/* Col 1 */}
          <div className="compare-col rv">
            <h4>Agence traditionnelle</h4>
            <span className="tag">Le mod&egrave;le opaque</span>
            <ul>
              <li>30 &agrave; 70% de commission, souvent opaque</li>
              <li>Le contrat prot&egrave;ge l&apos;agence, pas vous</li>
              <li>3 &agrave; 12 mois d&apos;engagement + p&eacute;nalit&eacute;s</li>
              <li>L&apos;agence contr&ocirc;le souvent vos comptes</li>
              <li className="ok">Une &eacute;quipe g&egrave;re tout &agrave; votre place</li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="compare-col rv rv-d1">
            <h4>Stack OFM classique</h4>
            <span className="tag">5 &agrave; 7 outils &agrave; recoller</span>
            <ul>
              <li>500 &agrave; 1 200 € / mois d&apos;outils</li>
              <li>Canva + CapCut + ChatGPT s&eacute;par&eacute;ment</li>
              <li>Analytics &eacute;clat&eacute;s par plateforme</li>
              <li>Aucune protection juridique</li>
              <li className="ok">0% de commission (flat fee)</li>
            </ul>
          </div>

          {/* Col 3 — featured */}
          <div className="compare-col featured rv rv-d2">
            <h4>Halo Talent</h4>
            <span className="tag">Une maison, un seul outil</span>
            <ul>
              <li className="ok">30% &rarr; 10% d&eacute;gressif, bar&egrave;me public</li>
              <li className="ok">Cr&eacute;ation IA texte &middot; image &middot; vid&eacute;o &middot; audio</li>
              <li className="ok">Atlas CRM + Chat Copilot supervis&eacute;</li>
              <li className="ok">Bouclier L&eacute;gal + base juridique</li>
              <li className="ok">Sortie 30 jours &middot; export total des donn&eacute;es</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
