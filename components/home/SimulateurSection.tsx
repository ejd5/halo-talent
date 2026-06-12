"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const TIERS: [number, number, number][] = [
  [0, 5000, 0.30],
  [5000, 20000, 0.25],
  [20000, 50000, 0.20],
  [50000, 150000, 0.15],
  [150000, Infinity, 0.10],
];

function fmt(n: number): string {
  return n.toLocaleString("fr-FR");
}

export function SimulateurSection() {
  const [revenue, setRevenue] = useState(12000);
  const revRef = useRef<HTMLDivElement>(null);
  const effRef = useRef<HTMLSpanElement>(null);
  const feeRef = useRef<HTMLSpanElement>(null);
  const keepRef = useRef<HTMLSpanElement>(null);
  const saveRef = useRef<HTMLSpanElement>(null);
  const sliderRef = useRef<HTMLInputElement>(null);
  const tiersRef = useRef<HTMLDivElement>(null);

  const calculate = useCallback((r: number) => {
    let fee = 0;
    for (const [a, b, t] of TIERS) {
      if (r > a) {
        fee += (Math.min(r, b) - a) * t;
      }
    }
    if (revRef.current) revRef.current.textContent = fmt(r);
    if (effRef.current) effRef.current.textContent = ((fee / r) * 100).toFixed(1).replace(".", ",") + "%";
    if (feeRef.current) feeRef.current.textContent = fmt(Math.round(fee)) + " €";
    if (keepRef.current) keepRef.current.textContent = fmt(Math.round(r - fee)) + " €";
    if (saveRef.current) saveRef.current.textContent = "+" + fmt(Math.round(r * 0.5 - fee)) + " €";
    if (tiersRef.current) {
      tiersRef.current.querySelectorAll(".tier").forEach((el) => {
        el.classList.toggle("active", r > parseFloat((el as HTMLElement).dataset.min || "0"));
      });
    }
  }, []);

  const handleSlider = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const r = +e.target.value;
      e.target.style.setProperty("--p", ((r - 1000) / (200000 - 1000)) * 100 + "%");
      setRevenue(r);
      calculate(r);
    },
    [calculate]
  );

  useEffect(() => {
    calculate(revenue);
    if (sliderRef.current) {
      sliderRef.current.style.setProperty(
        "--p",
        ((revenue - 1000) / (200000 - 1000)) * 100 + "%"
      );
    }
  }, [revenue, calculate]);

  // Scroll reveal
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
    const el = document.getElementById("simu-section");
    if (el) el.querySelectorAll(".rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="commissions" className="simu-section sec-eco" style={{ backgroundColor: "var(--fumee, #15110D)" }}>
      <div className="wrap-eco simu-grid">
        <div className="rv">
          <span className="eyebrow">Commissions transparentes</span>
          <h2 className="display-small" style={{ margin: "18px 0 24px" }}>
            Plus vous gagnez, <span className="serif-i">moins on prend.</span>
          </h2>
          <p style={{ color: "var(--pierre, #9C9183)", marginBottom: "34px" }}>
            Notre bar&egrave;me est marginal, comme l&apos;imp&ocirc;t : chaque tranche a son taux, et le taux baisse &agrave; mesure que votre revenu monte. Il est public. C&apos;est notre manifeste autant que notre mod&egrave;le.
          </p>
          <div className="tiers" ref={tiersRef}>
            <div className="tier" data-min="0"><span>0 &mdash; 5 000 €</span><span className="rate">30%</span></div>
            <div className="tier" data-min="5000"><span>5 000 &mdash; 20 000 €</span><span className="rate">25%</span></div>
            <div className="tier" data-min="20000"><span>20 000 &mdash; 50 000 €</span><span className="rate">20%</span></div>
            <div className="tier" data-min="50000"><span>50 000 &mdash; 150 000 €</span><span className="rate">15%</span></div>
            <div className="tier" data-min="150000"><span>150 000 € +</span><span className="rate">10%</span></div>
          </div>
        </div>
        <div className="simu-card rv rv-d1">
          <span className="eyebrow">Simulateur</span>
          <div className="simu-rev">
            <span ref={revRef} id="rev">{fmt(revenue)}</span> €<em> / mois</em>
          </div>
          <input
            ref={sliderRef}
            type="range"
            className="simu-slider"
            min="1000"
            max="200000"
            step="500"
            value={revenue}
            onChange={handleSlider}
            aria-label="Revenu mensuel"
          />
          <div className="simu-out">
            <div>
              <div className="v gold"><span ref={effRef}>&mdash;</span></div>
              <div className="k">Taux effectif Halo</div>
            </div>
            <div>
              <div className="v"><span ref={feeRef}>&mdash;</span></div>
              <div className="k">Commission Halo</div>
            </div>
            <div>
              <div className="v green"><span ref={keepRef}>&mdash;</span></div>
              <div className="k">Vous gardez</div>
            </div>
            <div>
              <div className="v" style={{ color: "var(--cuivre, #E2702E)" }}><span ref={saveRef}>&mdash;</span></div>
              <div className="k">&Eacute;conomis&eacute; vs agence &agrave; 50%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
