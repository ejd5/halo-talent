"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronLeft, ShieldCheck, Lock, FileText, AlertTriangle, Globe, CreditCard, Users, Database } from "lucide-react";
import { CoutureEmblem } from "@/components/home/CoutureEmblem";
import { StepAccueil } from "@/components/bouclier-legal/StepAccueil";
import { StepPlateformes } from "@/components/bouclier-legal/StepPlateformes";
import { StepClauses } from "@/components/bouclier-legal/StepClauses";
import { StepResultat } from "@/components/bouclier-legal/StepResultat";
import { calculateRisk } from "@/lib/bouclier-legal/scoring";
import { createClient } from "@/lib/supabase/client";
import type { WizardStep, AnalysisReport } from "@/lib/bouclier-legal/types";

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

const RISQUES = [
  { icon: Lock, titre: "Accès aux comptes", description: "Partage d'identifiants, accès non révocables, utilisation sans consentement. Un compte cédé est un compte que vous ne contrôlez plus." },
  { icon: FileText, titre: "Contenus et propriété", description: "Cession de droits non limitée, utilisation de vos contenus sans votre accord, impossibilité de supprimer vos créations." },
  { icon: Globe, titre: "Règles des plateformes", description: "CGU qui évoluent sans préavis, modération opaque, suspensions injustifiées. Les plateformes ne négocient pas." },
  { icon: CreditCard, titre: "Paiements et revenus", description: "Retards de paiement, commissions opaques, retenues injustifiées, absence de décompte détaillé." },
  { icon: Users, titre: "Réputation", description: "Usurpation d'identité, contenus détournés, bad buzz, absence de droit de réponse structuré." },
  { icon: Database, titre: "Données personnelles", description: "Collecte non consentie, revente de données, non-conformité RGPD, impossibilité de récupérer vos données." },
  { icon: AlertTriangle, titre: "Contrats déséquilibrés", description: "Clauses abusives, exclusivité excessive, pénalités disproportionnées, absence de clause de sortie claire." },
];

const METHODE = [
  { etape: "01", titre: "Prévenir", description: "Identifier les risques avant qu'ils ne se matérialisent. Connaître les CGU des plateformes, vérifier les clauses contractuelles, cartographier vos accès." },
  { etape: "02", titre: "Documenter", description: "Conserver les preuves : captures d'écran horodatées, historiques de conversation, relevés de revenus, versions successives des CGU." },
  { etape: "03", titre: "Sécuriser", description: "Activer l'authentification à deux facteurs, utiliser des mots de passe uniques, limiter les accès tiers, vérifier les connexions actives." },
  { etape: "04", titre: "Préparer", description: "Avoir un dossier juridique à jour : contrat, preuves, échanges, analyses. En cas de litige, vous gagnez des semaines." },
  { etape: "05", titre: "Transmettre", description: "Confier le dossier à un avocat spécialisé avec tous les éléments déjà organisés. L'avocat agit plus vite, vous payez moins cher." },
];

const PLATEFORMES = [
  { nom: "OnlyFans", slug: "/protection/onlyfans", description: "CGU, conformité, droits des créateurs" },
  { nom: "Fansly", slug: "/protection/fansly", description: "Conditions, bonnes pratiques, risques" },
  { nom: "MYM", slug: "/protection/mym", description: "Réglementation française, obligations" },
  { nom: "Instagram", slug: "/protection/instagram", description: "Modération, droits d'auteur, monétisation" },
  { nom: "TikTok", slug: "/protection/tiktok", description: "Politiques de contenu, restrictions" },
  { nom: "X (Twitter)", slug: "/protection/x", description: "Conditions, monétisation, droits" },
  { nom: "YouTube", slug: "/protection/youtube", description: "Copyright, monétisation, Content ID" },
];

const TABLEAU_RISQUES = [
  { risque: "Perte d'accès à un compte", action: "Activer la 2FA, ne jamais partager ses identifiants, utiliser des accès limités", gravite: "Élevée" },
  { risque: "Contenu supprimé par une plateforme", action: "Télécharger une copie locale de tous vos contenus, comprendre la raison, faire appel si justifié", gravite: "Moyenne" },
  { risque: "Contrat avec clause abusive", action: "Faire analyser par Lex, consulter un avocat, demander une modification écrite", gravite: "Élevée" },
  { risque: "Retard de paiement d'une agence", action: "Documenter les relances, vérifier les obligations contractuelles, mise en demeure", gravite: "Élevée" },
  { risque: "Usurpation d'identité", action: "Signaler à la plateforme, déposer une plainte, surveiller les comptes frauduleux", gravite: "Critique" },
  { risque: "Non-conformité RGPD d'un partenaire", action: "Demander le registre de traitement, exercer vos droits d'accès et de suppression", gravite: "Moyenne" },
  { risque: "Fuite de contenus privés", action: "Déposer un signalement DMCA, porter plainte, documenter les URLs de diffusion", gravite: "Critique" },
];

const FAQ = [
  { q: "Le Bouclier Légal remplace-t-il un avocat ?", r: "Non. Le Bouclier Légal est un outil de préparation et d'alerte. Il identifie les risques et vous aide à constituer un dossier, mais seul un avocat peut vous conseiller juridiquement et vous représenter." },
  { q: "WTF peut-il garantir que mon compte ne sera pas banni ?", r: "Non. Aucun outil ni service ne peut garantir l'absence de sanction par une plateforme. Les plateformes appliquent leurs propres règles, qui évoluent. Ce que nous faisons : vous aider à comprendre ces règles, à documenter votre activité, et à réagir en cas de problème." },
  { q: "Comment WTF documente-t-il les changements de CGU ?", r: "Notre veille juridique surveille les CGU des principales plateformes et détecte les modifications. Ces changements sont documentés, résumés et publiés dans le Journal des changements pour vous tenir informé." },
  { q: "Que faire si une agence refuse de me rendre mes comptes ?", r: "Documentez toutes vos demandes (écrites de préférence). Vérifiez votre contrat : les conditions d'accès doivent être claires. Utilisez les procédures de récupération des plateformes. Si nécessaire, consultez un avocat spécialisé." },
  { q: "Les guides de protection par plateforme sont-ils à jour ?", r: "Nous mettons à jour nos guides régulièrement en fonction des changements de CGU détectés. La date de dernière vérification est indiquée sur chaque page. Consultez également le Journal des changements pour les évolutions récentes." },
];

function FAQItem({ q, r }: { q: string; r: string }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <div style={{ border: "1px solid var(--ligne-faible)" }}>
      <button
        type="button"
        className="w-full flex items-center justify-between p-5 text-left"
        style={{ background: ouvert ? "rgba(216,169,91,0.04)" : "transparent", transition: "background 0.3s ease" }}
        onClick={() => setOuvert(!ouvert)}
      >
        <span className="text-[14px] font-medium pr-4" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{q}</span>
        <ChevronDown size={14} style={{ color: "var(--or)", transform: ouvert ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }} />
      </button>
      {ouvert && (
        <div className="px-5 pb-5">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{r}</p>
        </div>
      )}
    </div>
  );
}

const STEP_ORDER: WizardStep[] = ["welcome", "platforms", "clauses", "result"];

function getStepIndex(step: WizardStep): number {
  return STEP_ORDER.indexOf(step);
}

function BouclierLegalWizard() {
  const [step, setStep] = useState<WizardStep>("welcome");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const goTo = useCallback((s: WizardStep) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePlatformsNext = useCallback((p: string[]) => {
    setPlatforms(p);
    goTo("clauses");
  }, [goTo]);

  const handleClausesNext = useCallback(async (clauseIds: string[]) => {
    setAnalyzing(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isConnected = !!user;

    if (isConnected) {
      try {
        const platform = platforms[0] || "other";
        const res = await fetch("/api/legal/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform, clauses_checked: clauseIds }),
        });
        if (res.ok) {
          const apiData = await res.json();
          const localReport = calculateRisk(clauseIds, platforms);
          setReport({ ...localReport, aiDiagnosis: apiData.diagnosis });
          setAnalyzing(false);
          goTo("result");
          return;
        }
        console.warn("API analyze failed, using local fallback:", res.status);
      } catch (err) {
        console.warn("API analyze error, using local fallback:", err);
      }
    }

    const fallbackReport = calculateRisk(clauseIds, platforms);
    setTimeout(() => {
      setReport(fallbackReport);
      setAnalyzing(false);
      goTo("result");
    }, 400);
  }, [platforms, goTo]);

  const handleNewAnalysis = useCallback(() => {
    setPlatforms([]);
    setReport(null);
    goTo("welcome");
  }, [goTo]);

  const currentIdx = getStepIndex(step);
  const progressMax = 3;
  const progressPercent = step === "result" ? 100 : (currentIdx / progressMax) * 100;

  const { ref } = useReveal(0.05);

  return (
    <div ref={ref}>
      <div
        style={{
          "--bl-accent": "var(--or)",
          "--bl-accent-soft": "rgba(216,169,91,0.1)",
        } as React.CSSProperties}
      >
        {/* Top bar */}
        <div
          className="sticky top-[57px] z-30 backdrop-blur-sm"
          style={{ backgroundColor: "rgba(12,10,8,0.92)", borderBottom: "1px solid var(--ligne-faible)" }}
        >
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-20">
                {step !== "welcome" && step !== "result" && (
                  <button
                    onClick={() => {
                      if (step === "clauses") goTo("platforms");
                      else if (step === "platforms") goTo("welcome");
                    }}
                    className="flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}
                  >
                    <ChevronLeft size={16} />
                    Retour
                  </button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={22} style={{ color: "var(--or)" }} />
                <span className="text-base font-bold tracking-tight" style={{ color: "var(--or)", fontFamily: "var(--font-display-alt), serif" }}>
                  Bouclier Légal
                </span>
              </div>
              <div className="w-20 text-right">
                {step !== "welcome" && step !== "result" && (
                  <span className="text-xs font-medium" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>
                    {currentIdx}/{progressMax}
                  </span>
                )}
              </div>
            </div>
            {step !== "welcome" && (
              <div className="h-1 overflow-hidden" style={{ backgroundColor: "rgba(244,238,227,0.06)" }}>
                <div
                  className="h-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPercent}%`, backgroundColor: "var(--or)" }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[calc(100vh-8rem)]" style={{ backgroundColor: "var(--encre)" }}>
          <div className="max-w-5xl mx-auto px-6 py-8">
            {step === "welcome" && <StepAccueil onStart={() => goTo("platforms")} />}
            {step === "platforms" && <StepPlateformes onNext={handlePlatformsNext} />}
            {step === "clauses" && (
              <>
                {analyzing ? (
                  <div className="flex flex-col items-center justify-center py-32">
                    <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(216,169,91,0.1)" }}>
                      <div
                        className="w-6 h-6 animate-spin"
                        style={{ border: "2px solid rgba(216,169,91,0.2)", borderTopColor: "var(--or)" }}
                      />
                    </div>
                    <p className="text-sm font-medium" style={{ color: "var(--ivoire)", fontFamily: "var(--font-body), sans-serif" }}>
                      Analyse de votre contrat en cours...
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                      Quelques instants
                    </p>
                  </div>
                ) : (
                  <StepClauses onNext={handleClausesNext} />
                )}
              </>
            )}
            {step === "result" && report && (
              <StepResultat report={report} onNewAnalysis={handleNewAnalysis} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProtectionClient() {
  return (
    <main>
      <HeroSection />
      <PourquoiSection />
      <RisquesSection />
      <MethodeHaloSection />
      <PlateformesSection />
      <TableauRisquesSection />
      <BouclierLegalWizard />
      <FAQSection />
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
          <CoutureEmblem size={28} color="var(--or)" />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Protection créateur
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Protéger l'image, les accès, les preuves et les décisions
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Dans un monde où les règles changent sans préavis, la protection n'est pas un luxe. C'est la base de votre indépendance. Documentation, conformité, prévention.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#bouclier" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Lancer le Bouclier Légal</Link>
          <Link href="/protection/guide" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Guide pratique créateur</Link>
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
          L'essentiel
        </motion.p>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Pourquoi la protection compte
        </motion.h2>
        <motion.div className="space-y-4 text-[15px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          <p>Votre activité de créateur repose sur des plateformes, des contrats et des partenaires que vous ne contrôlez pas entièrement. Chaque jour, des créateurs perdent l'accès à leurs comptes, voient leurs contenus supprimés, ou découvrent des clauses abusives trop tard.</p>
          <p>La protection n'est pas une méfiance. C'est une discipline. Elle consiste à savoir ce qui peut arriver, à s'y préparer, et à avoir les bons réflexes quand cela arrive. Un créateur protégé est un créateur libre.</p>
          <p>Le Bouclier Légal WTF et nos guides par plateforme sont conçus pour vous donner cette discipline, sans jargon, sans peur, et sans remplacer un avocat quand il en faut un.</p>
        </motion.div>
      </div>
    </section>
  );
}

function RisquesSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Cartographie
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Les risques à connaître
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ maxWidth: 1000, margin: "0 auto" }}>
          {RISQUES.map((r, i) => (
            <motion.div key={r.titre} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.04}>
              <div className="p-5 h-full" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                <div className="w-10 h-10 flex items-center justify-center mb-4" style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}>
                  <r.icon size={18} />
                </div>
                <h3 className="text-[14px] font-bold mb-2" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{r.titre}</h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{r.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodeHaloSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Méthode
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          La méthode WTF
        </motion.h2>
        <div className="space-y-3">
          {METHODE.map((m, i) => (
            <motion.div key={m.etape} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.06}>
              <div className="flex items-start gap-5 p-5" style={{ borderLeft: "2px solid var(--or)", background: "rgba(12,10,8,0.02)" }}>
                <span className="text-[0.65rem] font-bold tracking-[0.1em] shrink-0 pt-0.5" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>{m.etape}</span>
                <div>
                  <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{m.titre}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{m.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlateformesSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Guides
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Guides de protection par plateforme
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          {PLATEFORMES.map((p, i) => (
            <motion.div key={p.nom} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.05 + i * 0.04}>
              <Link href={p.slug} className="block p-5 h-full transition-all hover:opacity-80" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                <h3 className="text-[14px] font-bold mb-1" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{p.nom}</h3>
                <p className="text-[11px] leading-relaxed mb-3" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{p.description}</p>
                <span className="text-[11px] font-medium inline-flex items-center gap-1" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
                  Consulter <ArrowRight size={10} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TableauRisquesSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Référence
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Risques et actions
        </motion.h2>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or)" }}>
                  <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace" }}>Risque</th>
                  <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace" }}>Action recommandée</th>
                  <th className="py-3 px-4 text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--encre)", opacity: 0.4, fontFamily: "var(--font-util), monospace" }}>Gravité</th>
                </tr>
              </thead>
              <tbody>
                {TABLEAU_RISQUES.map((row, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid var(--ligne-faible)", background: i % 2 === 0 ? "transparent" : "rgba(12,10,8,0.02)" }}
                  >
                    <td className="py-3 px-4 text-[13px] font-medium" style={{ color: "var(--encre)", fontFamily: "var(--font-body), sans-serif" }}>{row.risque}</td>
                    <td className="py-3 px-4 text-[12px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.6, fontFamily: "var(--font-body), sans-serif" }}>{row.action}</td>
                    <td className="py-3 px-4 text-[11px] font-semibold" style={{ color: row.gravite === "Critique" ? "#C44536" : row.gravite === "Élevée" ? "#D8A95B" : "#7A9A65", fontFamily: "var(--font-util), monospace" }}>{row.gravite}</td>
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

function FAQSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Questions fréquentes
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Protection
        </motion.h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.05}>
              <FAQItem q={item.q} r={item.r} />
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
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={26} color="var(--or)" />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Prêt à protéger votre activité ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Lancez le Bouclier Légal pour analyser votre contrat, ou consultez nos guides par plateforme pour connaître vos droits.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="#bouclier" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Lancer le Bouclier Légal</Link>
          <Link href="/protection/guide" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Guide pratique créateur</Link>
        </motion.div>
      </div>
    </section>
  );
}
