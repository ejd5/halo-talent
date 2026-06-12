"use client";

import { useEffect, useRef } from "react";

const DEPARTMENTS = [
  { ix: "D·01", title: "Musique & Spectacle Vivant", desc: "Musiciens, chanteurs, performers — de la scène au stream." },
  { ix: "D·02", title: "Sport & Lifestyle", desc: "Athlètes, coachs, créateurs lifestyle — l'image au niveau de la performance." },
  { ix: "D·03", title: "Business & Leadership", desc: "Entrepreneurs, speakers, experts — une autorité qui se construit." },
  { ix: "D·04", title: "Créateurs Digitaux", desc: "Influenceurs, vidéastes, podcasteurs — multi-plateformes, une seule stratégie." },
  { ix: "D·05", title: "Talent Premium", desc: "Créateurs adultes — discrétion, protection juridique et croissance maîtrisée." },
];

export function DepartmentsSection() {
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
    <section id="departements" className="sec-eco" ref={ref} style={{ backgroundColor: "var(--encre, #0C0A08)" }}>
      <div className="wrap-eco">
        <div className="sec-head rv">
          <span className="eyebrow">Cinq d&eacute;partements</span>
          <h2 className="display-medium">
            Chaque univers a <span className="serif-i">sa propre maison.</span>
          </h2>
        </div>
        <div className="depts-list rv">
          {DEPARTMENTS.map((dept) => (
            <div key={dept.ix} className="dept-row">
              <span className="ix">{dept.ix}</span>
              <h3>{dept.title}</h3>
              <p>{dept.desc}</p>
              <span className="arr">&rarr;</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
