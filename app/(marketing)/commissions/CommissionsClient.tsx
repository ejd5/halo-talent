"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, EyeOff, Globe, Sparkles, TrendingUp, Users } from "lucide-react";

function useReveal(amount = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}

const riseItem = {
  hidden: { opacity: 0, y: 32 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const, delay: d } }),
};
const fadeItem = {
  hidden: { opacity: 0, y: 16 },
  visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const, delay: d } }),
};

function SectionBlock({ label, title, children, bg = "encre" }: { label: string; title: string; children: React.ReactNode; bg?: "encre" | "creme" }) {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: bg === "creme" ? "var(--creme)" : "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          {label}
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: bg === "creme" ? "var(--encre)" : "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          {title}
        </motion.h2>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: bg === "creme" ? "var(--encre)" : "var(--pierre)", opacity: bg === "creme" ? 0.7 : 1, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          {children}
        </motion.div>
      </div>
    </section>
  );
}

function PhraseForte({ children, bg = "encre" }: { children: string; bg?: "encre" | "creme" }) {
  const { ref, inView } = useReveal(0.25);
  return (
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: bg === "creme" ? "var(--creme)" : "var(--encre)", paddingTop: 70, paddingBottom: 70 }}>
      <div className="wrap-eco" style={{ maxWidth: 680, margin: "0 auto" }}>
        <motion.blockquote className="display-medium mb-0" style={{ color: bg === "creme" ? "var(--encre)" : "var(--ivoire)", fontStyle: "normal" }} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.9, ease: "easeOut" }}>
          {children}
        </motion.blockquote>
      </div>
    </section>
  );
}

const TRANCHES = [
  { plafond: "0 € – 10 000 €", taux: "30%", cumul: "3 000 €" },
  { plafond: "10 001 € – 20 000 €", taux: "25%", cumul: "2 500 €" },
  { plafond: "20 001 € – 50 000 €", taux: "20%", cumul: "6 000 €" },
  { plafond: "50 001 € – 100 000 €", taux: "15%", cumul: "7 500 €" },
  { plafond: "> 100 000 €", taux: "10%", cumul: ", " },
];

const COMPARISON_ROWS = [
  { label: "Commission", agence: "40–60% fixe, peu lisible", freelance: "0 commission mais 0 accompagnement", halo: "10–30% marginal et progressif" },
  { label: "Transparence", agence: "Comptes flous, pas de détail mensuel", freelance: "Totale mais solitaire", halo: "Décompte mensuel, barème public" },
  { label: "Outils", agence: "Propriétaires, perdus au départ", freelance: "À vos frais, non intégrés", halo: "CRM, IA, Studio inclus dans la commission" },
  { label: "Accompagnement", agence: "Variable, turnover élevé", freelance: "Aucun, vous êtes seul", halo: "Équipe dédiée : manager, stratégie, direction artistique" },
  { label: "Protection juridique", agence: "Minimale, clauses floues", freelance: "Aucune", halo: "WTF Lex + Bouclier Légal inclus" },
  { label: "Données", agence: "Confisquées par l'agence", freelance: "100% à vous mais éparpillées", halo: "100% à vous, centralisées dans Atlas CRM" },
  { label: "Flexibilité", agence: "Contrats longs, clauses d'exclusivité", freelance: "Totale", halo: "Pas d'exclusivité, sortie documentée" },
  { label: "Scalabilité", agence: "Plafonnée par l'attention de l'agence", freelance: "Plafonnée par votre temps", halo: "Outils IA + équipe = capacité de croissance" },
];

const FAQ_ITEMS = [
  { q: "Pourquoi ne pas prendre une grosse commission tout compris ?", a: "Parce qu'une commission unique et élevée crée un désalignement : l'agence gagne plus quand le créateur gagne moins. Notre barème marginal aligne nos intérêts : plus vous gagnez, moins le taux est élevé. Nous sommes incités à vous faire croître, pas à prélever un maximum." },
  { q: "Puis-je choisir seulement certains outils ou services ?", a: "Oui. La commission de base couvre le management et l'accès aux outils essentiels. Les options (production avancée, juridique préparatoire approfondi, reporting personnalisé) sont modulables selon vos besoins. Vous ne payez que ce qui vous sert." },
  { q: "Les options juridiques remplacent-elles un avocat ?", a: "Non, et nous ne prétendons jamais le contraire. WTF Lex analyse, structure et prépare. Le Bouclier Légal documente les droits par plateforme. Mais la décision juridique finale revient toujours à un professionnel du droit que vous choisissez." },
  { q: "Est-ce adapté à un profil débutant ?", a: "Oui, à condition que le créateur ait déjà des revenus. Nous ne facturons pas de frais fixes aux petits revenus, la commission est proportionnelle. Si vous débutez et générez peu, vous payez peu. Si vous explosez, le taux baisse." },
  { q: "Est-ce adapté à une créatrice déjà lancée ?", a: "Oui. Pour les créateurs établis, nous apportons ce que l'agence classique ne fournit pas : des outils de scalabilité (IA, CRM, automatisation), une protection juridique structurée, et une vision internationale. Le barème marginal devient très compétitif au-delà de 50 000 € mensuels." },
];

const PROFILES = [
  { icon: Users, titre: "La créatrice autonome", revenus: "2 000 € – 8 000 € / mois", besoin: "Structurer sans se faire aspirer", solution: "Commission légère + CRM + CHATEENG pour gérer les conversations. Accompagnement humain ponctuel, outils en continu." },
  { icon: TrendingUp, titre: "L'influenceuse en croissance", revenus: "8 000 € – 30 000 € / mois", besoin: "Scaler sans perdre le contrôle", solution: "Management dédié + Studio IA + Stratégie de marque. Commission marginale qui baisse avec la croissance." },
  { icon: Sparkles, titre: "L'artiste ou le sportif", revenus: "Variable, projets", besoin: "Protéger l'image et monétiser sans pression", solution: "Protection juridique prioritaire + Brand deals + Direction artistique. Pas d'obligation de volume de contenu." },
  { icon: Globe, titre: "L'équipe déjà constituée", revenus: "30 000 € – 100 000 €+ / mois", besoin: "Optimiser, internationaliser, sécuriser", solution: "Équipe dédiée complète + Atlas CRM avancé + Veille juridique internationale. Taux marginal plancher." },
];

const INCLUS_ITEMS = [
  "Management de carrière personnalisé",
  "Accès complet à Atlas CRM",
  "Studio IA de création de contenu",
  "CHATEENG avec mémoire contextuelle",
  "Négociation de partenariats et brand deals",
  "Bouclier Légal (protection juridique préparatoire)",
  "Reporting mensuel détaillé",
  "Stratégie de marque et personal branding",
];

const REFUS_ITEMS = [
  "Imposer un pack inutile pour facturer plus",
  "Promettre des résultats ou des revenus garantis",
  "Cacher les outils ou les données côté agence",
  "Exiger une exclusivité qui enferme le créateur",
  "Prélever une commission sans rendre de comptes",
  "Pousser à produire du contenu dégradant pour plus de revenus",
  "Faire signer un contrat que le créateur ne comprend pas",
  "Confisquer les données en cas de départ",
];

export function CommissionsClient() {
  return (
    <main>
      {/* Hero */}
      <HeroSection />

      {/* 1. Le problème des commissions opaques */}
      <SectionBlock label="Le problème" title="Le problème des commissions opaques" bg="creme">
        <p>Dans l'économie des créateurs, la commission est le sujet le plus important, et le plus mal traité. Beaucoup d'agences affichent un pourcentage sans expliquer comment il est calculé, ce qu'il inclut, et ce qu'il exclut.</p>
        <p>Le résultat : des créateurs qui découvrent après six mois que leur agence prélève 50% sur tout, y compris sur les revenus qui n'ont rien à voir avec son travail. Des décomptes illisibles. Des frais additionnels qui apparaissent sans préavis.</p>
        <p>L'opacité n'est pas une erreur de communication. C'est un modèle économique. Une commission opaque peut être augmentée sans justification. Elle peut être appliquée à des revenus sur lesquels l'agence n'a eu aucun impact. Elle rend le créateur dépendant sans qu'il sache exactement de quoi.</p>
      </SectionBlock>

      <PhraseForte>Une commission juste n'a pas besoin d'être cachée.</PhraseForte>

      {/* 2. Pourquoi WTF préfère la transparence */}
      <SectionBlock label="Notre choix" title="Pourquoi nous publions notre barème">
        <p>Nous publions nos taux parce que nous n'avons rien à cacher. Notre commission est la même pour tous les créateurs au même niveau de revenus. Pas de traitement de faveur qui en cache un autre. Pas de négociation secrète dont vous ne voyez pas le résultat.</p>
        <p>Un barème public, c'est aussi une protection pour le créateur. Vous savez exactement combien vous payerez à chaque niveau de revenus. Vous pouvez comparer. Vous pouvez projeter. Vous pouvez décider en connaissance de cause.</p>
        <p>Et c'est enfin une discipline pour nous. Un barème public nous oblige à justifier notre valeur chaque mois. Si nous ne créons pas de valeur, cela se voit. Si nous en créons, cela se voit aussi. C'est plus exigeant, et c'est exactement ce que nous voulons.</p>
      </SectionBlock>

      {/* 3. Barème marginal */}
      <BarèmeSection />

      <PhraseForte bg="creme">Plus vous gagnez, moins nous prenons.</PhraseForte>

      {/* 4. Ce que la commission couvre */}
      <SectionBlock label="Inclus" title="Ce que la commission peut couvrir" bg="creme">
        <p>Notre commission inclut un accompagnement complet, de la stratégie à la production. Voici ce qui est couvert par défaut.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          {INCLUS_ITEMS.map((item) => (
            <div key={item} className="flex items-start gap-2 py-2">
              <Check size={14} className="shrink-0 mt-0.5" style={{ color: "var(--or)" }} />
              <span className="text-[14px]" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
            </div>
          ))}
        </div>
        <p className="mt-6">Des options complémentaires (production avancée, juridique préparatoire approfondi, reporting personnalisé, coordination internationale) sont disponibles selon vos besoins. Elles sont discutées, chiffrées et validées avec vous, jamais imposées.</p>
      </SectionBlock>

      {/* 5. Ce que WTF ne veut pas faire */}
      <SectionBlock label="Nos refus" title="Ce que WTF ne veut pas faire">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {REFUS_ITEMS.map((r, i) => (
            <motion.div key={i} className="flex items-start gap-3 p-4" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }} viewport={{ once: true }}>
              <EyeOff size={14} style={{ color: "var(--or)", flexShrink: 0, marginTop: 2 }} />
              <span className="text-[14px]" style={{ color: "var(--ivoire)", opacity: 0.75, fontFamily: "var(--font-body), sans-serif" }}>{r}</span>
            </motion.div>
          ))}
        </div>
      </SectionBlock>

      <PhraseForte>Nous ne facturons que ce que nous apportons.</PhraseForte>

      {/* 6. Tableau comparatif */}
      <TableauComparatifSection />

      {/* 7. Profils clients */}
      <ProfilsSection />

      {/* 8. FAQ */}
      <FAQSection />

      {/* 9. Continuer avec */}
      <ContinuerAvecSection />

      {/* CTA */}
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Tarification transparente
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Des commissions plus lisibles.<br />Un accompagnement plus modulable.
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Nous sommes payés uniquement quand vous l'êtes. Barème progressif, transparent, sans frais cachés.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#bareme" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir le barème</Link>
          <Link href="/demo" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Demander une démo <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function BarèmeSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} id="bareme" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 860, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Barème
        </motion.p>
        <motion.h2 className="display-medium mb-4 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Commission fixe, marginale et progressive
        </motion.h2>
        <motion.p className="text-center text-[14px] mb-10" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.16}>
          Le taux s'applique uniquement sur la tranche concernée, pas sur la totalité des revenus, comme l'impôt sur le revenu.
        </motion.p>

        {/* Tableau */}
        <motion.div className="overflow-x-auto mb-10" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.22}>
          <table className="w-full text-left border-collapse" style={{ minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--or)" }}>
                <th className="py-4 px-6 text-[0.65rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-util), monospace" }}>Tranche de revenus mensuels</th>
                <th className="py-4 px-6 text-[0.65rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-util), monospace" }}>Taux marginal</th>
                <th className="py-4 px-6 text-[0.65rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-util), monospace" }}>Commission max / tranche</th>
              </tr>
            </thead>
            <tbody>
              {TRANCHES.map((t, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(12,10,8,0.06)", background: i % 2 === 0 ? "white" : "rgba(12,10,8,0.01)" }}>
                  <td className="py-4 px-6 text-[15px] font-medium" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{t.plafond}</td>
                  <td className="py-4 px-6 text-[15px] font-bold" style={{ color: "var(--or)" }}>{t.taux}</td>
                  <td className="py-4 px-6 text-[14px] font-mono" style={{ color: "var(--encre)", opacity: 0.5 }}>{t.cumul}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Exemple concret */}
        <motion.div className="p-6 md:p-8 mb-8" style={{ border: "1px solid rgba(216,169,91,0.2)", background: "white" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.28}>
          <h3 className="text-[1rem] font-bold mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-display-alt), serif" }}>Exemple : 25 000 € de revenus mensuels</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: "Sur les premiers 10 000 € à 30%", montant: "3 000 €" },
              { label: "Sur les 10 000 € suivants à 25%", montant: "2 500 €" },
              { label: "Sur les 5 000 € restants à 20%", montant: "1 000 €" },
            ].map((l, i) => (
              <div key={i} className="flex justify-between py-1" style={{ borderBottom: "1px solid rgba(12,10,8,0.04)" }}>
                <span style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{l.label}</span>
                <span className="font-mono font-semibold" style={{ color: "var(--encre)" }}>{l.montant}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 mt-2" style={{ borderTop: "1px solid var(--or)" }}>
              <span className="font-semibold" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>Total commission WTF</span>
              <span className="font-mono font-bold text-lg" style={{ color: "var(--or)" }}>6 500 €</span>
            </div>
            <div className="flex justify-between py-1">
              <span style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>Taux effectif</span>
              <span className="font-mono font-semibold" style={{ color: "#5A7D4A" }}>26%</span>
            </div>
            <div className="flex justify-between py-1">
              <span style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>Ce qui vous reste</span>
              <span className="font-mono font-semibold" style={{ color: "var(--encre)" }}>18 500 €</span>
            </div>
          </div>
        </motion.div>

        {/* Comparaison */}
        <motion.div className="p-6 md:p-8" style={{ border: "1px solid rgba(12,10,8,0.08)", background: "rgba(12,10,8,0.02)" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.34}>
          <h3 className="text-[1rem] font-bold mb-3" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>Comparaison avec une agence à 50% fixe</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.1em] mb-2" style={{ color: "var(--encre)", opacity: 0.35, fontFamily: "var(--font-util), monospace" }}>Agence classique (50% fixe)</p>
              <p className="font-mono text-xl font-bold" style={{ color: "#C44536" }}>12 500 €</p>
              <p className="text-xs mt-1" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-body), sans-serif" }}>Commission prélevée</p>
            </div>
            <div>
              <p className="text-[0.6rem] uppercase tracking-[0.1em] mb-2" style={{ color: "var(--encre)", opacity: 0.35, fontFamily: "var(--font-util), monospace" }}>WTF (barème marginal)</p>
              <p className="font-mono text-xl font-bold" style={{ color: "#5A7D4A" }}>6 500 €</p>
              <p className="text-xs mt-1" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-body), sans-serif" }}>Commission prélevée</p>
            </div>
          </div>
          <p className="text-sm mt-6 font-semibold" style={{ color: "var(--or)" }}>Vous gardez 6 000 € de plus chaque mois avec WTF.</p>
        </motion.div>
      </div>
    </section>
  );
}

function TableauComparatifSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Comparaison
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Agence opaque / Freelance isolé / Where Talent Forms
        </motion.h2>
        <motion.div className="overflow-x-auto" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <table className="w-full text-left border-collapse" style={{ minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--or)" }}>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-util), monospace" }}>Critère</th>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }}>Agence opaque</th>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace" }}>Freelance isolé</th>
                <th className="py-4 px-5 text-[0.6rem] uppercase tracking-[0.1em] font-semibold" style={{ color: "#5A7D4A", fontFamily: "var(--font-util), monospace" }}>Where Talent Forms</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((r, i) => (
                <tr key={r.label} style={{ borderBottom: "1px solid rgba(12,10,8,0.06)", background: i % 2 === 0 ? "white" : "transparent" }}>
                  <td className="py-3 px-5 text-[13px] font-semibold" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{r.label}</td>
                  <td className="py-3 px-5 text-[13px]" style={{ color: "#C44536", fontFamily: "var(--font-body), sans-serif" }}>{r.agence}</td>
                  <td className="py-3 px-5 text-[13px]" style={{ color: "var(--encre)", opacity: 0.5, fontFamily: "var(--font-body), sans-serif" }}>{r.freelance}</td>
                  <td className="py-3 px-5 text-[13px] font-medium" style={{ color: "#5A7D4A", fontFamily: "var(--font-body), sans-serif" }}>{r.halo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}

function ProfilsSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Profils
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Une solution pour chaque profil
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROFILES.map((p, i) => (
            <motion.div key={p.titre} className="p-7" style={{ border: "1px solid rgba(12,10,8,0.08)", background: "white" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12 + i * 0.06}>
              <div className="flex items-center gap-3 mb-4">
                <p.icon size={20} style={{ color: "var(--or)", flexShrink: 0 }} />
                <h3 className="text-[1rem] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{p.titre}</h3>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-[12px]" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Revenus typiques</p>
                <p className="text-[14px] font-medium" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{p.revenus}</p>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-[12px]" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Besoin principal</p>
                <p className="text-[14px]" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{p.besoin}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[12px]" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Solution WTF</p>
                <p className="text-[14px]" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}>{p.solution}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { ref, inView } = useReveal(0.08);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 720, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que vous voulez savoir sur nos commissions
        </motion.h2>
        <motion.div className="space-y-2" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} style={{ border: "1px solid rgba(244,238,227,0.08)", background: openIndex === i ? "rgba(244,238,227,0.03)" : "transparent", transition: "background 0.2s" }}>
              <button onClick={() => setOpenIndex(openIndex === i ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left" style={{ background: "none", border: "none", cursor: "pointer" }} aria-expanded={openIndex === i}>
                <span className="text-[15px] font-medium" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{faq.q}</span>
                <ChevronDown size={16} style={{ transform: openIndex === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "var(--or)", flexShrink: 0 }} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-[14px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ContinuerAvecSection() {
  const { ref, inView } = useReveal(0.2);
  const links = [
    { label: "Simulateur de commissions", href: "/demo", desc: "Visualisez l'impact sur vos revenus." },
    { label: "Comparaisons", href: "/comparaisons", desc: "Agence traditionnelle vs WTF." },
    { label: "Tarifs", href: "/pricing", desc: "Nos formules et services." },
    { label: "FAQ Commissions", href: "/faq", desc: "Toutes les réponses sur notre modèle." },
  ];
  return (
    <section ref={ref} className="py-16" style={{ backgroundColor: "var(--creme)" }}>
      <div className="wrap-eco">
        <motion.p
          className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] mb-8 text-center"
          style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}
          variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"}
        >
          Continuer avec
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {links.map((link, i) => (
            <motion.div
              key={link.href}
              variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={i * 0.08}
            >
              <Link
                href={link.href}
                className="block p-5 h-full transition-all duration-300 hover:-translate-y-0.5"
                style={{ border: "1px solid var(--ligne-faible)", borderRadius: "2px" }}
              >
                <p className="text-[0.85rem] font-semibold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>
                  {link.label}
                </p>
                <p className="text-[0.75rem] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                  {link.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--creme)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.4, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Une commission juste, c'est possible.
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Barème progressif, transparence totale, pas de frais cachés.<br />Nous gagnons quand vous gagnez.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/pricing" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les tarifs</Link>
          <Link href="/demo" className="btn-eco" style={{ borderColor: "var(--or)", color: "var(--encre)" }}>Demander une démo <ArrowRight size={14} /></Link>
          <Link href="/contact" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--encre)" }}>Parler à WTF</Link>
        </motion.div>
      </div>
    </section>
  );
}
