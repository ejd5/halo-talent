"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Shield, TrendingUp, Lock, Sparkles, Scale, Heart, Globe } from "lucide-react";
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

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={28} color="var(--or)" />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Nos convictions fondatrices
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          Notre Manifeste
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Le créateur n'est pas un produit. Son image est un actif. Son contrôle doit rester central.
        </motion.p>
      </div>
    </section>
  );
}

function SectionBlock({ label, title, children, bg = "encre", ornament = false }: { label: string; title: string; children: React.ReactNode; bg?: "encre" | "creme"; ornament?: boolean }) {
  const { ref, inView } = useReveal(0.1);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: bg === "creme" ? "var(--creme)" : "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        {ornament && (
          <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: bg === "creme" ? 0.4 : 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
            <CoutureEmblem size={20} color={bg === "creme" ? "var(--encre)" : "var(--or)"} />
          </motion.div>
        )}
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

function ValeursGrid() {
  const valeurs = [
    { icon: Eye, titre: "Transparence", text: "La confiance ne se décrète pas. Elle se documente, se prouve, se maintient. Nos commissions sont publiques, nos méthodes sont expliquées, nos résultats sont traçables." },
    { icon: Shield, titre: "Souveraineté", text: "Le créateur reste propriétaire de tout : ses comptes, son contenu, ses données, son image. Nous sommes un partenaire, pas un propriétaire." },
    { icon: TrendingUp, titre: "Élévation", text: "Notre mission : aider chaque talent à transformer son audience en entreprise durable. Pas de promesse de viralité, une construction méthodique." },
    { icon: Lock, titre: "Discrétion", text: "Ce qui se passe chez WTF reste chez WTF. La vie privée de nos talents n'est pas négociable. Nous protégeons les données, l'identité et la réputation." },
    { icon: Sparkles, titre: "Technologie maîtrisée", text: "L'IA est un outil, pas un pilote automatique. Elle propose, l'humain valide, le créateur contrôle. Aucune décision n'est déléguée à un algorithme sans supervision." },
    { icon: Scale, titre: "Justice économique", text: "Nous gagnons quand vous gagnez. Pas de frais fixes qui pèsent sur les petits revenus. Plus vous grandissez, plus le pourcentage de commission baisse." },
    { icon: Heart, titre: "Respect du créateur", text: "Pas de pression à produire du contenu dégradant. Pas de stratégie qui sacrifie l'image pour un gain court terme. Votre dignité est notre cadre." },
    { icon: Globe, titre: "Vision internationale", text: "Paris, New York, Milan, Tokyo. Nous pensons global, nous agissons local. Chaque marché a ses règles, nous les connaissons et nous les respectons." },
  ];
  const { ref, inView } = useReveal(0.05);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco">
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4 text-center" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Nos piliers
        </motion.p>
        <motion.h2 className="display-medium mb-12 text-center" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que nous défendons
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {valeurs.map((v, i) => (
            <motion.div key={v.titre} className="p-7 flex gap-5" style={{ border: "1px solid rgba(12,10,8,0.08)", background: "white" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.12 + i * 0.06}>
              <v.icon size={22} style={{ color: "var(--or)", flexShrink: 0, marginTop: 3 }} />
              <div>
                <h3 className="text-[1rem] font-bold mb-2" style={{ color: "var(--encre)", fontFamily: "var(--font-display-alt), serif" }}>{v.titre}</h3>
                <p className="text-[14px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{v.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConclusionCTA() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section text-center" style={{ backgroundColor: "var(--encre)", paddingTop: 100, paddingBottom: 100 }}>
      <div className="wrap-eco" style={{ maxWidth: 640, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <CoutureEmblem size={26} color="var(--or)" />
        </motion.div>
        <motion.blockquote className="display-medium mb-6" style={{ color: "var(--ivoire)", fontStyle: "normal" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Une maison plus juste.
        </motion.blockquote>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Nous ne voulons pas construire une machine qui consomme des créateurs. Nous voulons construire une maison qui les aide à durer.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/qui-sommes-nous" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Découvrir qui nous sommes</Link>
          <Link href="/demo" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Demander une démo <ArrowRight size={14} /></Link>
        </motion.div>
      </div>
    </section>
  );
}

export function ManifesteClient() {
  return (
    <main>
      <HeroSection />

      <SectionBlock label="Le constat" title="Le marché a changé" bg="creme" ornament>
        <p>L'économie des créateurs a explosé. Des plateformes comme OnlyFans, Instagram, TikTok, YouTube ou MYM ont transformé des millions de personnes en entrepreneurs de leur image. C'est une révolution silencieuse, porteuse d'opportunités immenses, mais aussi de risques profonds.</p>
        <p>Des centaines d'agences ont émergé pour capter cette nouvelle richesse. Certaines sont sérieuses. Beaucoup ne le sont pas. Elles promettent la richesse rapide, achètent la confiance avec des cadeaux, imposent des contrats incompréhensibles, et disparaissent quand les résultats ne suivent pas.</p>
        <p>Le résultat : des créateurs qui changent d'agence tous les six mois, qui perdent leurs données à chaque rupture, qui signent des exclusivités sans comprendre les clauses. Le marché a grandi plus vite que ses règles, et ce sont les créateurs qui en paient le prix.</p>
      </SectionBlock>

      <PhraseForte>Une image peut créer de la valeur. Elle doit aussi être protégée.</PhraseForte>

      <SectionBlock label="Le vrai problème" title="Ce n'est pas la monétisation. C'est l'opacité.">
        <p>Gagner de l'argent avec son image n'a rien de problématique. Le problème, c'est quand les conditions de cette monétisation sont opaques, déséquilibrées ou imposées sans consentement éclairé.</p>
        <p>Combien de créateurs savent exactement combien leur agence prélève ? Combien peuvent consulter un décompte clair mois par mois ? Combien ont accès à leurs propres données après avoir quitté leur agence ?</p>
        <p>L'opacité n'est pas un accident, c'est un modèle économique. Une agence qui garde le flou sur ses marges peut les augmenter sans se justifier. Une agence qui confisque les outils rend le départ trop coûteux. La transparence n'est pas un supplément, c'est une condition.</p>
      </SectionBlock>

      <PhraseForte bg="creme">La performance ne doit pas effacer la dignité.</PhraseForte>

      <SectionBlock label="Le pilier" title="Pourquoi le créateur doit rester le centre" bg="creme">
        <p>Dans le modèle traditionnel, l'agence est au centre. Elle détient les contrats, les outils, les données, les relations. Le créateur est un satellite, essentiel mais périphérique. Ce modèle est confortable pour l'agence. Il est dangereux pour le créateur.</p>
        <p>Chez Where Talent Forms, le créateur est le centre du système. Tout s'organise autour de lui : les outils sont à son service, les données lui appartiennent, les décisions lui reviennent. L'agence est un partenaire qui gravite autour, pas un propriétaire qui contrôle.</p>
        <p>Ce renversement change tout. Il change la nature du contrat. Il change la relation de pouvoir. Il change la durée de la collaboration. Quand le créateur est au centre, il peut partir sans tout perdre. Quand l'agence est au centre, le créateur est prisonnier.</p>
      </SectionBlock>

      <SectionBlock label="Nos lignes rouges" title="Ce que nous refusons">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {[
            "La promesse de richesse comme argument commercial",
            "La manipulation pour fidéliser un talent",
            "Les cadeaux pour acheter la confiance",
            "La pression à produire du contenu dégradant",
            "L'opacité sur les marges et les méthodes",
            "Les stratégies court terme qui épuisent",
            "La confiscation des outils et des données",
            "Les contrats que le créateur ne comprend pas",
          ].map((r, i) => (
            <motion.div key={i} className="flex items-start gap-3 p-4" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.04 }} viewport={{ once: true }}>
              <EyeOff size={14} style={{ color: "var(--or)", flexShrink: 0, marginTop: 2 }} />
              <span className="text-[14px]" style={{ color: "var(--ivoire)", opacity: 0.75, fontFamily: "var(--font-body), sans-serif" }}>{r}</span>
            </motion.div>
          ))}
        </div>
      </SectionBlock>

      <PhraseForte>La transparence n'est pas un supplément. C'est une condition.</PhraseForte>

      <ValeursGrid />

      <SectionBlock label="Technologie" title="La place de l'IA" bg="creme">
        <p>L'intelligence artificielle transforme le métier de créateur. Elle peut générer du contenu, analyser des audiences, préparer des réponses, détecter des risques. Mais elle ne doit jamais décider à la place du créateur.</p>
        <p>Notre principe est simple : l'IA propose, l'humain valide, le créateur contrôle. Aucun message n'est envoyé automatiquement. Aucune décision n'est déléguée à un algorithme. L'IA est un assistant, pas un remplacement.</p>
        <p>C'est ce que nous appelons la souveraineté technologique : utiliser la puissance de l'IA sans perdre le contrôle humain. C'est plus exigeant que l'automatisation totale, mais c'est la seule approche qui respecte le créateur et protège son image.</p>
      </SectionBlock>

      <SectionBlock label="Juridique" title="La place du juridique">
        <p>Le droit est partout dans la vie d'un créateur : contrats avec les agences, conditions d'utilisation des plateformes, droits d'image, propriété intellectuelle, fiscalité internationale. Ignorer ces sujets, c'est prendre un risque existentiel.</p>
        <p>Where Talent Forms ne remplace pas un avocat, et nous ne prétendons jamais le contraire. Mais nous donnons aux créateurs les outils pour comprendre leurs obligations, structurer leurs documents et identifier les risques avant qu'ils ne deviennent des problèmes.</p>
        <p>WTF Lex analyse les contrats, suit les changements de CGU, prépare des dossiers pour les avocats. Le Bouclier Légal documente les droits par plateforme. C'est du juridique préparatoire : éclairer, structurer, préparer, jamais juger à la place d'un professionnel du droit.</p>
      </SectionBlock>

      <SectionBlock label="Notre rôle" title="La place de l'agence" bg="creme">
        <p>Dans notre vision, l'agence n'est ni un patron, ni un propriétaire, ni un intermédiaire opaque. C'est un partenaire stratégique qui apporte des outils, des compétences et un accompagnement, sans jamais confisquer le pouvoir de décision.</p>
        <p>Nous ne voulons pas gérer des créateurs comme des comptes. Nous voulons construire avec eux des marques humaines, désirables et protégées. La différence est fondamentale. Un compte se gère. Une marque se construit.</p>
        <p>Cela implique une relation plus exigeante : plus de transparence, plus de dialogue, plus de documentation. Mais c'est la seule relation qui peut durer. Les relations fondées sur l'opacité finissent toujours par se briser.</p>
      </SectionBlock>

      <PhraseForte bg="creme">Nous ne voulons pas construire une machine qui consomme des créateurs.</PhraseForte>

      <SectionBlock label="Contenu" title="Notre vision du contenu premium">
        <p>Le contenu est la matière première du créateur. Sa qualité détermine sa valeur. Sa cohérence construit sa marque. Sa protection assure sa pérennité. Nous croyons que le contenu premium, bien produit, bien protégé, bien monétisé, est la seule stratégie durable.</p>
        <p>Cela signifie refuser la course au volume. Refuser de produire plus pour produire plus. Refuser de sacrifier l'image pour un pic d'audience. Le contenu premium, c'est le contenu qui résiste au temps, qui renforce la marque, qui attire les bons partenaires.</p>
        <p>Notre Studio IA, notre CRM et notre équipe de direction artistique sont entièrement orientés vers cet objectif : vous aider à produire mieux, pas nécessairement plus. La qualité est la seule stratégie qui ne s'épuise pas.</p>
      </SectionBlock>

      <ConclusionCTA />
    </main>
  );
}
