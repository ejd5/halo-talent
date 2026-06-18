"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown, Search, AlertTriangle, FileText, Scale, FileCheck } from "lucide-react";

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

function PhraseForte({ texte }: { texte: string }) {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 80, paddingBottom: 80 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 120, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[1.25rem] leading-relaxed" style={{ color: "var(--ivoire)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          {texte}
        </motion.p>
      </div>
    </section>
  );
}

const CE_QUE_LEX_AIDE = [
  { icon: Search, titre: "Comprendre une situation", description: "Vous recevez un contrat ou une mise en demeure. Lex identifie les clauses clés, explique leur portée en langage clair, et signale les points de vigilance." },
  { icon: FileText, titre: "Préparer un contrat", description: "Vous devez proposer un contrat à un partenaire. Lex vous aide à structurer les clauses essentielles et à identifier ce qui doit figurer dans le document." },
  { icon: AlertTriangle, titre: "Vérifier des points de vigilance", description: "Lex détecte les clauses potentiellement abusives : exclusivité excessive, cession de droits trop large, pénalités disproportionnées, durée d'engagement anormale." },
  { icon: FileCheck, titre: "Organiser des preuves", description: "Lex vous aide à rassembler et structurer les éléments factuels : captures d'écran, échanges, contrats, dans un dossier chronologique cohérent." },
  { icon: Scale, titre: "Préparer une transmission à un avocat", description: "Lex structure votre dossier pour qu'il soit compréhensible par un professionnel du droit. Vous gagnez du temps et réduisez les frais de consultation." },
];

const CE_QUE_LEX_NE_FAIT_PAS = [
  { texte: "Ne remplace pas un avocat. Lex est un outil d'aide à la compréhension, pas un conseiller juridique. Pour toute décision engageante, consultez un professionnel du droit." },
  { texte: "Ne donne pas de garantie juridique. Les analyses de Lex sont informatives. Elles ne garantissent pas l'issue d'un litige ou la validité d'un contrat devant un tribunal." },
  { texte: "Ne prend pas de décision juridique finale. Lex vous éclaire, vous informe, vous alerte. La décision de signer, de refuser ou de contester vous appartient." },
  { texte: "Ne se substitue pas à une veille juridique professionnelle. Les lois et les CGU des plateformes évoluent. Lex fait de son mieux pour rester à jour, mais un décalage est possible." },
];

const CAS_USAGE = [
  { cas: "Droits d'image", question: "Une marque veut utiliser mon image pour une campagne publicitaire. Quels sont mes droits ?", aide: "Lex identifie les clauses de cession de droits dans le contrat proposé, explique leur portée (territoire, durée, supports), et suggère des limitations à négocier." },
  { cas: "Collaboration", question: "Je dois co-créer du contenu avec un autre créateur. Comment protéger ma part ?", aide: "Lex vous aide à structurer un accord de collaboration : répartition des revenus, propriété du contenu, conditions de sortie, et utilisation post-collaboration." },
  { cas: "Contrat type", question: "Une agence me propose un contrat standard. Que dois-je vérifier ?", aide: "Lex scanne le contrat et surligne les clauses à risque : commission, exclusivité, durée, droits d'image, pénalités de sortie, renouvellement automatique." },
  { cas: "Litige", question: "Un partenaire ne me paie pas. Quels sont mes recours ?", aide: "Lex vous aide à structurer les faits, rassembler les preuves (contrat, échanges, factures), et préparer une mise en demeure. Il vous oriente ensuite vers un avocat si nécessaire." },
  { cas: "Changement de règle plateforme", question: "Ma plateforme a changé ses conditions. Qu'est-ce que ça change pour moi ?", aide: "Lex analyse les nouvelles CGU, identifie les changements qui vous impactent, et explique leurs conséquences pratiques sur votre activité." },
  { cas: "Signalement", question: "Quelqu'un utilise mon contenu sans autorisation. Que faire ?", aide: "Lex vous aide à documenter l'atteinte (captures horodatées, URLs), qualifier l'infraction, et générer une lettre de mise en demeure ou un signalement DMCA." },
];

const TABLEAU_QUESTIONS = [
  { question: "Ce contrat est-il équilibré ?", aideLex: "Analyse des clauses, score de risque par catégorie, explication en langage clair.", consulterAvocat: "Si le score de risque est élevé ou si des clauses pénales complexes sont présentes." },
  { question: "Puis-je rompre ce contrat ?", aideLex: "Identification des clauses de sortie, calcul des délais et pénalités.", consulterAvocat: "Si les pénalités sont importantes ou si la clause de sortie est ambiguë." },
  { question: "Mes droits d'image sont-ils protégés ?", aideLex: "Vérification de l'étendue de la cession : territoire, durée, supports.", consulterAvocat: "Si la cession est perpétuelle, mondiale, ou sans limitation de supports." },
  { question: "Comment répondre à une mise en demeure ?", aideLex: "Aide à la compréhension du document et suggestion de structure de réponse.", consulterAvocat: "Toujours. Une mise en demeure est un acte juridique sérieux qui nécessite un avocat." },
  { question: "Cette clause de commission est-elle abusive ?", aideLex: "Comparaison avec les pratiques du marché, explication du mécanisme.", consulterAvocat: "Si la commission dépasse 50% ou si le mode de calcul est particulièrement complexe." },
];

const FAQ = [
  { q: "WTF Lex remplace-t-il un avocat ?", r: "Non. WTF Lex est un outil d'aide à la compréhension des documents juridiques. Il ne remplace pas un avocat et ne constitue pas un exercice illégal du droit. Pour toute décision juridique, consultez un professionnel du droit." },
  { q: "Lex est-il gratuit ?", r: "L'analyse de base des clauses est gratuite. Les fonctionnalités avancées (génération de lettres, diagnostic complet, dossier pour avocat) sont incluses dans les plans Premium, Elite et Icon." },
  { q: "Mes documents sont-ils confidentiels ?", r: "Oui. Tous les documents que vous soumettez à Lex sont chiffrés et traités de manière confidentielle. Nous ne les utilisons pas pour entraîner nos modèles et ne les partageons avec personne." },
  { q: "Lex connaît-il les lois de mon pays ?", r: "Lex est principalement entraîné sur le droit français et européen. Pour les questions relevant d'autres juridictions, Lex peut fournir des informations générales mais nous vous recommandons de consulter un avocat local." },
  { q: "Puis-je utiliser Lex pour un litige en cours ?", r: "Lex peut vous aider à structurer votre dossier et rassembler les preuves. Mais pour un litige en cours, vous devez impérativement être accompagné par un avocat. Lex ne vous représentera pas et ne produira pas d'actes de procédure." },
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
        <span className="text-[14px] font-medium pr-4" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{q}</span>
        <ChevronDown size={14} style={{ color: "var(--or)", transform: ouvert ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", flexShrink: 0 }} />
      </button>
      {ouvert && (
        <div className="px-5 pb-5">
          <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{r}</p>
        </div>
      )}
    </div>
  );
}

export function LexClient() {
  return (
    <main>
      <HeroSection />
      <CeQueLexAideSection />
      <PhraseForte texte="«&nbsp;Lex ne remplace pas un avocat. Il vous aide à mieux comprendre pour mieux décider.&nbsp;»" />
      <CeQueLexNeFaitPasSection />
      <CasUsageSection />
      <TableauQuestionsSection />
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
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          WTF Lex
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Préparer mieux.<br />Comprendre plus vite.<br />Transmettre plus clairement.
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 600 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Une IA juridique préparatoire pour structurer vos questions, analyser vos documents et préparer vos dossiers, sans remplacer un avocat.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="/lex-ai" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Essayer WTF Lex <ArrowRight size={14} /></Link>
          <Link href="#aide" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Ce que Lex peut faire pour vous</Link>
        </motion.div>
      </div>
    </section>
  );
}

function CeQueLexAideSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} id="aide" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Capacités
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que Lex vous aide à faire
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 880, margin: "0 auto" }}>
          {CE_QUE_LEX_AIDE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.titre} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.05}>
                <div className="flex items-start gap-4 p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{item.titre}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
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

function CeQueLexNeFaitPasSection() {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.div className="flex items-center gap-3 mb-6" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          <AlertTriangle size={20} style={{ color: "#C44536" }} />
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.16em]" style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }}>Important</p>
        </motion.div>
        <motion.h2 className="display-medium mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que Lex ne fait pas
        </motion.h2>
        <motion.div className="space-y-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.18}>
          {CE_QUE_LEX_NE_FAIT_PAS.map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-[15px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
              <span style={{ color: "#C44536", fontWeight: 700, flexShrink: 0 }}>, </span>
              <span>{item.texte}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CasUsageSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Cas d'usage
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Des situations concrètes où Lex vous assiste
        </motion.h2>
        <div className="space-y-4" style={{ maxWidth: 800, margin: "0 auto" }}>
          {CAS_USAGE.map((cas, i) => (
            <motion.div key={cas.cas} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1 + i * 0.06}>
              <div className="p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{cas.cas}</h3>
                    <p className="text-[13px] italic mb-2" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>«&nbsp;{cas.question}&nbsp;»</p>
                  </div>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.7, fontFamily: "var(--font-body), sans-serif" }}><span style={{ color: "var(--or)", fontWeight: 600 }}>Comment Lex aide :</span> {cas.aide}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TableauQuestionsSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Guide pratique
        </motion.p>
        <motion.h2 className="display-medium mb-10 text-center" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Question courante / Aide Lex / Quand consulter un avocat
        </motion.h2>
        <div className="overflow-x-auto" style={{ maxWidth: 900, margin: "0 auto" }}>
          <table className="w-full text-[13px]" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--or)" }}>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>Question</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace", fontSize: "0.6rem" }}>Aide Lex</th>
                <th className="text-left py-3 px-4 font-bold" style={{ color: "#C44536", fontFamily: "var(--font-util), monospace", fontSize: "0.6rem" }}>Quand consulter un avocat</th>
              </tr>
            </thead>
            <tbody>
              {TABLEAU_QUESTIONS.map((ligne, i) => (
                <motion.tr key={ligne.question} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08 + i * 0.04} style={{ borderBottom: "1px solid var(--ligne-faible)" }}>
                  <td className="py-3 px-4 font-medium" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{ligne.question}</td>
                  <td className="py-3 px-4" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{ligne.aideLex}</td>
                  <td className="py-3 px-4" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif", fontStyle: "italic" }}>{ligne.consulterAvocat}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
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
          Tout savoir sur WTF Lex
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
          <img src="/wtf-logo-rond.png" alt="WTF Talent" style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Prêt à mieux comprendre vos contrats ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          WTF Lex est gratuit pour une première analyse. Importez votre contrat et découvrez ce que Lex peut faire pour vous.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/lex-ai" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Analyser un contrat <ArrowRight size={14} /></Link>
          <Link href="/protection" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Découvrir la protection</Link>
        </motion.div>
      </div>
    </section>
  );
}
