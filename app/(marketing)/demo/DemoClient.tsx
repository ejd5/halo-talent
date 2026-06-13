"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  Eye,
  Target,
  Shield,
  Check,
  Play,
  User,
} from "lucide-react";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";

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

const CE_QUE_LA_DEMO_COUVRE = [
  { titre: "Vos objectifs", description: "Nous identifions avec vous ce que vous voulez accomplir et le département le plus pertinent pour votre profil.", icon: Target },
  { titre: "Les outils adaptés", description: "Studio IA, Atlas CRM, WTF Lex, Chat AI : nous vous montrons ceux qui répondent à vos besoins spécifiques.", icon: Eye },
  { titre: "Votre niveau d'autonomie", description: "Nous évaluons où vous en êtes et comment WTF peut vous rendre plus autonome, pas dépendant.", icon: User },
  { titre: "Les risques identifiés", description: "Nous pointons les vulnérabilités de votre situation actuelle : contrats, plateformes, image, réputation.", icon: Shield },
  { titre: "Les options concrètes", description: "Vous repartez avec des recommandations claires, que vous choisissiez de travailler avec nous ou non.", icon: Check },
];

const POUR_QUI = [
  "Créateurs qui veulent comprendre comment structurer leur activité",
  "Professionnels de l'image qui hésitent entre plusieurs directions",
  "Artistes qui cherchent des alternatives aux circuits traditionnels",
  "Athlètes et coaches qui veulent diversifier leurs revenus",
  "Influenceurs qui souhaitent reprendre le contrôle de leur trajectoire",
];

const DEROULE = [
  {
    phase: "Avant",
    items: [
      "Vous remplissez un court questionnaire pour nous aider à préparer la démo.",
      "Nous analysons votre profil et préparons une démonstration personnalisée.",
      "Vous recevez un lien de rendez-vous pour la session.",
    ],
  },
  {
    phase: "Pendant",
    items: [
      "30 à 45 minutes en visioconférence avec un membre de l'équipe WTF.",
      "Nous explorons vos objectifs, vos blocages, et les outils qui peuvent vous aider.",
      "Démonstration concrète des modules pertinents pour votre situation.",
    ],
  },
  {
    phase: "Après",
    items: [
      "Vous recevez un résumé écrit des points abordés et des recommandations.",
      "Pas de relance commerciale agressive. Si la proposition vous convient, vous revenez vers nous.",
      "Si vous décidez de ne pas donner suite, vous repartez avec une analyse utile de votre situation.",
    ],
  },
];

const RASSURANCE = [
  "La démo est gratuite et sans engagement.",
  "Aucune décision n'est attendue pendant ou juste après la démo.",
  "Nous ne faisons pas de démarchage commercial agressif.",
  "Vos informations sont traitées confidentiellement.",
  "Si nous estimons ne pas pouvoir vous aider, nous vous le disons honnêtement.",
];

const FAQ = [
  { q: "Combien de temps dure la démo ?", r: "30 à 45 minutes. C'est suffisant pour explorer votre situation et vous montrer les modules les plus pertinents, sans vous submerger d'informations." },
  { q: "La démo est-elle personnalisée ?", r: "Oui. Nous préparons chaque démo en fonction de votre profil, de vos plateformes, et de vos objectifs. Ce n'est pas une présentation générique." },
  { q: "Dois-je préparer quelque chose ?", r: "Rien de spécifique. Ayez en tête vos objectifs et vos difficultés actuelles. Nous vous enverrons un court questionnaire avant la session pour guider la discussion." },
  { q: "Y a-t-il une obligation d'achat ?", r: "Aucune. La démo est une découverte mutuelle. Vous n'avez aucun engagement, et nous ne vous demandons pas de prendre une décision pendant la session." },
  { q: "Puis-je faire la démo avec mon équipe ?", r: "Oui, vous pouvez inviter jusqu'à 2 collaborateurs. Indiquez-le dans le formulaire de demande." },
  { q: "Que se passe-t-il après la démo ?", r: "Vous recevez un résumé écrit. Vous prenez le temps de réfléchir. Si vous souhaitez aller plus loin, nous vous proposons un accompagnement sur mesure. Sinon, vous repartez avec une analyse utile." },
];

function FAQItem({ q, r, fond = "creme" }: { q: string; r: string; fond?: "creme" | "encre" }) {
  const [ouvert, setOuvert] = useState(false);
  const isEncre = fond === "encre";
  return (
    <div style={{ border: `1px solid var(--ligne-faible)` }}>
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left"
        style={{
          background: ouvert ? (isEncre ? "rgba(216,169,91,0.06)" : "rgba(216,169,91,0.04)") : "transparent",
          transition: "background 0.3s ease",
        }}
        onClick={() => setOuvert(!ouvert)}
      >
        <span className="text-[14px] font-medium pr-4" style={{ color: isEncre ? "var(--ivoire)" : "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{q}</span>
        <ChevronDown size={14} style={{ color: "var(--or)", transform: ouvert ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }} />
      </button>
      {ouvert && (
        <div className="px-5 pb-5">
          <p className="text-[13px] leading-relaxed" style={{ color: isEncre ? "var(--pierre)" : "var(--encre)", opacity: isEncre ? 1 : 0.65, fontFamily: "var(--font-body), sans-serif" }}>{r}</p>
        </div>
      )}
    </div>
  );
}

export function DemoClient() {
  return (
    <main>
      <HeroSection />
      <CeQueLaDemoCouvreSection />
      <PourQuiSection />
      <DerouleSection />
      <RassuranceSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 680, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={28} color="var(--or)" />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Démonstration
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Voir comment WTF peut structurer votre activité.
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 480 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          30 minutes pour explorer vos objectifs, découvrir les outils adaptés à votre profil, et repartir avec des recommandations concrètes. Gratuit et sans engagement.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="/demo/start" className="btn-eco inline-flex items-center gap-2" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>
            Demander une démo <Play size={14} />
          </Link>
          <Link href="#deroule" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Comment ça se passe</Link>
        </motion.div>
      </div>
    </section>
  );
}

function CeQueLaDemoCouvreSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Contenu
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que la démo couvre
        </motion.h2>
        <div className="space-y-4">
          {CE_QUE_LA_DEMO_COUVRE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.05}>
                <div className="flex items-start gap-5 p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                  <div className="w-11 h-11 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{item.titre}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PourQuiSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Pour qui
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Pour qui est faite la démo
        </motion.h2>
        <div className="space-y-2">
          {POUR_QUI.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.05}>
              <div className="flex items-center gap-3 p-4" style={{ border: "1px solid var(--ligne-faible)" }}>
                <span className="w-8 h-8 flex items-center justify-center shrink-0" style={{ color: "var(--or)", fontSize: "1.1rem" }}>&#9670;</span>
                <span className="text-[14px]" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DerouleSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} id="deroule" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Déroulé
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Avant / Pendant / Après la démo
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEROULE.map((phase, pi) => (
            <motion.div key={pi} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + pi * 0.08}>
              <div className="p-6 h-full" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 flex items-center justify-center" style={{ background: pi === 1 ? "var(--or)" : "rgba(216,169,91,0.15)", color: pi === 1 ? "var(--encre)" : "var(--or)", fontFamily: "var(--font-display-alt), serif", fontSize: "0.8rem", fontWeight: 700 }}>
                    {String(pi + 1).padStart(2, "0")}
                  </div>
                  <h3 className="text-[16px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{phase.phase}</h3>
                </div>
                <ul className="space-y-3">
                  {phase.items.map((item, ii) => (
                    <li key={ii} className="flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>
                      <Check size={13} style={{ color: "#5A7D4A", flexShrink: 0, marginTop: 1 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RassuranceSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 40, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0} className="p-6" style={{ border: "1px solid var(--ligne)", background: "rgba(216,169,91,0.03)" }}>
          <div className="flex items-center gap-3 mb-5">
            <Shield size={18} style={{ color: "var(--or)" }} />
            <h3 className="text-[15px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>Nos engagements pour la démo</h3>
          </div>
          <div className="space-y-3">
            {RASSURANCE.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check size={14} style={{ color: "#5A7D4A", flexShrink: 0, marginTop: 1 }} />
                <span className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FAQSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 40, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Démo
        </motion.h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.05}>
              <FAQItem q={item.q} r={item.r} fond="creme" />
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
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 560, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={26} color="var(--or)" />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Prêt à voir ce que WTF peut faire pour vous ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          30 minutes. Gratuit. Sans engagement.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/demo/start" className="btn-eco inline-flex items-center gap-2" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>
            Demander une démo <Play size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
