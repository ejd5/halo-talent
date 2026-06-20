"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Calculator, FileText, Sparkles, MessageCircle, ClipboardCheck } from "lucide-react";

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

const OUTILS_GRATUITS = [
  { icon: Shield, nom: "Bouclier Légal", description: "Analysez vos contrats d'agence clause par clause. Identifiez les abus, générez des lettres de mise en demeure, et obtenez des reformulations saines.", href: "/protection", couleur: "var(--or)" },
  { icon: Calculator, nom: "Simulateur de Commission", description: "Calculez votre commission WTF en temps réel. Visualisez les tranches marginales, comparez avec le modèle 50%, et projetez vos revenus sur 12 mois.", href: "/pricing", couleur: "#5A7D4A" },
  { icon: FileText, nom: "Média Kit Generator", description: "Générez un kit de présentation professionnel en 2 minutes. Statistiques, portfolio, tarifs, choix de 3 templates design.", href: "/studio/mediakit", couleur: "var(--or)" },
  { icon: ClipboardCheck, nom: "Contrat-Type WTF", description: "Consultez le modèle de contrat de management WTF. Transparent, sans clauses abusives, avec commission marginale et sortie 30 jours.", href: "/contrat-type", couleur: "#5A7D4A" },
  { icon: Sparkles, nom: "Studio IA (Plan Gratuit)", description: "Créez, éditez et publiez du contenu avec l'IA. 5 crédits offerts par mois, 3 plateformes, templates et inspiration feed.", href: "/studio", couleur: "var(--or)" },
  { icon: MessageCircle, nom: "Chat Copilot", description: "Assistant IA pour gérer vos conversations fans. Réponses personnalisées, Tone Guard, relances automatiques et détection d'intention.", href: "/chat-ai", couleur: "#C44536" },
];

export function OutilsClient() {
  return (
    <main>
      <HeroSection />
      <PourquoiSection />
      <OutilsGridSection />
      <PlusSection />
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
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={140} height={140} style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Gratuit et sans engagement
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Des outils gratuits<br />pour les créateurs
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Simulateur de commission, Bouclier Légal, Média Kit, Contrat-Type, tout ce dont vous avez besoin pour démarrer, sans payer.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#outils-liste" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir les outils</Link>
          <Link href="/saas" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Découvrir la suite complète <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function PourquoiSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Pourquoi des outils gratuits
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Parce que la transparence commence par l'accès
        </motion.h2>
        <motion.div className="space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <p>Nous croyons que chaque créateur devrait pouvoir comprendre ses revenus, analyser ses contrats et protéger son contenu, même sans être accompagné par WTF. Ces outils gratuits sont notre contribution à un marché plus transparent.</p>
          <p>Ils sont aussi une démonstration de notre approche : pas de piège, pas d'entonnoir de vente déguisé. Vous pouvez les utiliser indéfiniment, sans engagement, sans même nous parler. Si un jour vous voulez aller plus loin, nous sommes là.</p>
          <p>Tous nos outils gratuits respectent votre vie privée. Pas de collecte de données sans consentement. Pas de revente d'information. Pas de publicité.</p>
        </motion.div>
      </div>
    </section>
  );
}

function OutilsGridSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} id="outils-liste" className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Les outils
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Tout pour démarrer, gratuitement
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 800, margin: "0 auto" }}>
          {OUTILS_GRATUITS.map((outil, i) => {
            const Icon = outil.icon;
            return (
              <motion.div key={outil.nom} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.06}>
                <Link href={outil.href} className="flex items-start gap-4 p-6 transition-all block" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: outil.couleur }}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-bold" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{outil.nom}</h3>
                      <span className="text-[9px] font-semibold px-2 py-0.5 uppercase tracking-[0.08em]" style={{ background: "rgba(90,125,74,0.15)", color: "#5A7D4A", fontFamily: "var(--font-util), monospace" }}>Gratuit</span>
                    </div>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{outil.description}</p>
                  </div>
                  <ArrowRight size={14} className="shrink-0 mt-1" style={{ color: outil.couleur }} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PlusSection() {
  const { ref, inView } = useReveal(0.15);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.4, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={110} height={110} style={{ height: 110, width: "auto" }} />
        </motion.div>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Envie d'aller plus loin ?
        </motion.h2>
        <motion.p className="text-[15px] leading-relaxed mb-8" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12}>
          Ces outils gratuits sont la partie émergée de notre suite. Découvrez la suite complète, CRM, IA, protection juridique, reporting, intégrée et cohérente. Avec accompagnement humain si vous le souhaitez.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.2}>
          <Link href="/saas" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Voir la suite complète <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={130} height={130} style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Vous avez des questions ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Nos outils sont gratuits, notre équipe est disponible. Parlons de vos besoins, sans engagement.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/contact" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Nous contacter</Link>
          <Link href="/demo" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Demander une démo <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}
