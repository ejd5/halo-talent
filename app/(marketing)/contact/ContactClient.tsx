"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ChevronDown,
  Shield,
  Check,
  Clock,
  User,
  Briefcase,
  Newspaper,
  HelpCircle,
  Scale,
  Play,
} from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

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

const SUJETS = [
  { id: "candidature", label: "Candidature", description: "Questions sur le processus de candidature ou votre candidature en cours.", icon: User },
  { id: "partenariat", label: "Partenariat", description: "Propositions de collaboration, marques, médias.", icon: Briefcase },
  { id: "presse", label: "Presse", description: "Demandes d'interview, dossiers de presse, relations médias.", icon: Newspaper },
  { id: "support", label: "Support", description: "Aide technique, questions sur nos outils, problèmes de compte.", icon: HelpCircle },
  { id: "juridique", label: "Juridique préparatoire", description: "Questions sur WTF Lex, protection juridique, contrats.", icon: Scale },
  { id: "demo", label: "Démo Atlas", description: "Demande de démonstration personnalisée de la plateforme.", icon: Play },
];

const CE_QUIL_FAUT_PREPARER = [
  "Votre nom ou pseudo professionnel et votre email de contact.",
  "Une description claire de votre situation ou de votre question.",
  "Votre profil (créateur, agence, partenaire, presse) pour nous aider à vous orienter.",
  "Si vous avez déjà un compte WTF, votre email associé.",
  "Pour les demandes de partenariat : une brève présentation de votre structure.",
];

const DELAIS = [
  { sujet: "Candidature", delai: "3 à 5 jours ouvrés" },
  { sujet: "Support technique", delai: "24 à 48h ouvrées" },
  { sujet: "Partenariat / Presse", delai: "3 à 5 jours ouvrés" },
  { sujet: "Juridique préparatoire", delai: "48 à 72h ouvrées" },
  { sujet: "Demande de démo", delai: "24 à 48h ouvrées" },
  { sujet: "Autre", delai: "48h ouvrées" },
];

const RASSURANCE = [
  "Votre message est traité de manière confidentielle.",
  "Nous ne partageons jamais vos informations avec des tiers.",
  "Nous ne conservons vos données de contact que pour répondre à votre message.",
  "Vous ne serez pas inscrit à une newsletter sans votre consentement explicite.",
];

const FAQ = [
  { q: "Quel est le délai de réponse ?", r: "Nous répondons sous 24 à 48h ouvrées pour le support technique, et sous 3 à 5 jours ouvrés pour les candidatures et partenariats. Les demandes de démo sont traitées sous 24 à 48h." },
  { q: "Puis-je vous appeler par téléphone ?", r: "Nous privilégions l'écrit pour garantir la traçabilité de nos échanges et la qualité de nos réponses. Si votre situation nécessite un appel, nous vous le proposerons dans notre réponse." },
  { q: "À qui s'adresse le formulaire de contact ?", r: "À toute personne ayant une question sur Where Talent Forms : créateurs, partenaires, journalistes, ou simples curieux. Pour candidater, utilisez de préférence le formulaire de candidature." },
  { q: "Mes informations sont-elles sécurisées ?", r: "Oui. Le formulaire utilise une connexion chiffrée. Vos données sont stockées sur des serveurs européens et ne sont jamais partagées. Elles sont supprimées 12 mois après le dernier échange." },
  { q: "Puis-je vous écrire pour une question juridique ?", r: "Oui, pour des questions d'ordre général sur la protection des créateurs ou le cadre légal des plateformes. Nous ne fournissons pas de conseil juridique personnalisé par ce canal. Pour une analyse approfondie, découvrez WTF Lex." },
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

export function ContactClient() {
  return (
    <main>
      <HeroSection />
      <ChoisirSujetSection />
      <CeQuilFautPreparerSection />
      <FormulaireSection />
      <DelaisSection />
      <RassuranceSection />
      <FAQSection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 90 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={140} height={140} style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Contact
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Parlez-nous de votre projet.
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-4" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 460 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Une question, une proposition, une demande. Écrivez-nous. Nous répondons à chaque message.
        </motion.p>
      </div>
    </section>
  );
}

function ChoisirSujetSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Orientation
        </motion.p>
        <motion.h2 className="display-medium mb-6" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Choisir le bon sujet
        </motion.h2>
        <motion.p className="text-[1rem] leading-relaxed mb-8" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Pour que votre message arrive au bon interlocuteur, choisissez le sujet qui correspond le mieux à votre demande.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {SUJETS.map((sujet, i) => {
            const Icon = sujet.icon;
            return (
              <motion.div key={sujet.id} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.04}>
                <div className="p-5 h-full" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                      <Icon size={16} />
                    </div>
                    <h3 className="text-[14px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{sujet.label}</h3>
                  </div>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}>{sujet.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CeQuilFautPreparerSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Préparation
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce qu'il faut préparer
        </motion.h2>
        <div className="space-y-2">
          {CE_QUIL_FAUT_PREPARER.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.05}>
              <div className="flex items-start gap-3 p-4" style={{ border: "1px solid var(--ligne-faible)" }}>
                <span className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold" style={{ background: "rgba(216,169,91,0.15)", color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FormulaireSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Votre message
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Formulaire de contact
        </motion.h2>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          <ContactForm />
        </motion.div>
        <motion.div className="mt-8 p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(216,169,91,0.03)" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          <p className="text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.55, fontFamily: "var(--font-body), sans-serif" }}>
            Ce formulaire est destiné aux questions générales. Pour postuler à la maison, utilisez le{" "}
            <Link href="/apply" style={{ color: "var(--or)", textDecoration: "underline" }}>formulaire de candidature</Link>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function DelaisSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Délais
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Délais de réponse
        </motion.h2>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: 400 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or)" }}>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Sujet</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Délai</th>
                </tr>
              </thead>
              <tbody>
                {DELAIS.map((item, i) => (
                  <tr key={item.sujet} style={{ borderBottom: "1px solid var(--ligne-faible)", background: i % 2 === 0 ? "transparent" : "rgba(244,238,227,0.02)" }}>
                    <td className="py-4 px-4 text-[13px] font-medium" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{item.sujet}</td>
                    <td className="py-4 px-4 text-[12px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                      <span className="flex items-center gap-2">
                        <Clock size={12} style={{ color: "var(--or)" }} />
                        {item.delai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function RassuranceSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0} className="p-6" style={{ border: "1px solid var(--ligne)", background: "rgba(216,169,91,0.03)" }}>
          <div className="flex items-center gap-3 mb-5">
            <Shield size={18} style={{ color: "var(--or)" }} />
            <h3 className="text-[15px] font-bold" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>Confidentialité et protection de vos données</h3>
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
          Contact
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
