"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Shield,
  UserCheck,
  Download,
  Key,
  FileText,
  Eye,
  Trash2,
  Globe,
  X,
  Check,
  Lock,
} from "lucide-react";

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

const SECURITE_COMPTES = [
  { titre: "Propriété des comptes", description: "Vous êtes propriétaire de vos comptes. WTF ne prend jamais possession de vos identifiants, de vos contenus, ni de vos relations fans. Les connexions plateformes (OAuth ou manuelles) restent sous votre contrôle. Vous pouvez les révoquer à tout moment.", icon: UserCheck },
  { titre: "Authentification à deux facteurs", description: "2FA obligatoire pour les rôles Admin et Manager. Nous supportons les clés de sécurité (WebAuthn), les applications TOTP, et les codes de secours. Votre compte est protégé même si votre mot de passe est compromis.", icon: Lock },
  { titre: "Sessions et appareils", description: "Visualisez et révoquez toutes les sessions actives. Notification par email en cas de connexion depuis un nouvel appareil ou une nouvelle localisation. Sessions inactives automatiquement expirées après 7 jours.", icon: Shield },
];

const GESTION_PERMISSIONS = [
  { role: "Admin", droits: "Accès complet : compte, facturation, équipe, API, suppression de données." },
  { role: "Manager", droits: "Gestion des chatters, contenus, analytics, invitations. Pas d'accès facturation." },
  { role: "Chatter", droits: "Répondre aux conversations. Voir les profils fans. Pas d'accès aux paramètres." },
  { role: "Content", droits: "Créer et éditer du contenu. Pas d'accès aux conversations fans." },
  { role: "Viewer", droits: "Consultation seule : analytics, contenus. Pas de modification." },
];

const DONNEES_CONFIDENTIALITE = [
  { titre: "Données exportables", description: "Exportez toutes vos données à tout moment. Formats CSV, JSON, PDF. Inclut : historique des conversations, données fans, contenus, analytics, transactions. Aucune donnée n'est retenue après votre départ.", icon: Download },
  { titre: "Suppression des données", description: "Effacement complet sur demande. Vous pouvez demander la suppression de votre ADN créatif, de vos données fans, et de l'ensemble de votre compte. Suppression confirmée par email sous 30 jours maximum.", icon: Trash2 },
  { titre: "RGPD & ePrivacy", description: "Conçu en Europe, pour l'Europe. Hébergement chez un fournisseur européen. Consentement explicite pour chaque traitement. Droit d'accès, de rectification, d'effacement et de portabilité. DPA (Data Processing Agreement) public.", icon: Globe },
];

const AUDIT_LOGS = [
  { titre: "Traçabilité complète", description: "Chaque message envoyé, chaque modification de prix, chaque export, chaque connexion est horodaté et attribué à un utilisateur spécifique. Rien n'est anonyme, rien n'est invisible.", icon: FileText },
  { titre: "Validation humaine IA", description: "L'IA propose, vous décidez. Aucun message n'est envoyé automatiquement sans validation humaine. Chaque brouillon IA est présenté avec son score de confiance et le contexte utilisé. Vous pouvez auditer chaque message.", icon: Eye },
  { titre: "BYOK (Bring Your Own Key)", description: "Utilisez vos propres clés API. Avec les plans Elite et Icon, vous pouvez connecter vos propres clés Anthropic, OpenAI, Replicate, ElevenLabs. Vos appels API passent par vos comptes, pas par les nôtres.", icon: Key },
];

const BONNES_PRATIQUES = [
  "Activez la 2FA sur votre compte WTF et sur toutes les plateformes que vous connectez.",
  "Utilisez un mot de passe unique et fort pour WTF, idéalement généré par un gestionnaire de mots de passe.",
  "Vérifiez régulièrement la liste des sessions actives et révoquez celles que vous ne reconnaissez pas.",
  "Ne partagez jamais vos identifiants WTF avec des tiers. Utilisez le système d'invitation pour ajouter des membres à votre équipe.",
  "Exportez vos données régulièrement (nous recommandons une fois par mois).",
  "Activez les notifications de connexion pour être alerté en cas d'accès suspect.",
  "Vérifiez les permissions de chaque membre de votre équipe et retirez les accès inutilisés.",
  "Lisez les résultats d'audit IA avant d'approuver un message, le score de confiance est votre indicateur.",
];

const CE_QUE_HALO_NE_FAIT_PAS = [
  { titre: "Nous ne vendons pas vos données", description: "Vos données, vos fans, vos conversations, vos contenus ne sont jamais vendus, partagés, ou monétisés par WTF. Vous êtes notre client, pas notre produit." },
  { titre: "Nous ne lisons pas vos conversations privées", description: "L'équipe WTF n'a pas accès à vos conversations avec vos fans. Les logs d'audit enregistrent les métadonnées (horodatage, expéditeur), pas le contenu." },
  { titre: "Nous ne prenons pas de décision automatique à votre place", description: "L'IA propose, vous validez. Aucun message, aucun prix, aucun contenu n'est publié ou envoyé sans votre approbation explicite." },
  { titre: "Nous ne promettons pas une sécurité absolue", description: "Aucun système n'est inviolable. Nous mettons en œuvre les meilleures pratiques, mais la sécurité est une responsabilité partagée. Nous vous aidons à faire votre part." },
  { titre: "Nous ne conservons pas vos données indéfiniment", description: "Les logs d'audit sont conservés 12 mois. Les données de compte sont supprimées 30 jours après votre demande. Rien n'est gardé «&nbsp;au cas où&nbsp;»." },
];

const FAQ = [
  { q: "Où sont hébergées mes données ?", r: "Vos données sont hébergées chez un fournisseur cloud européen, sur des serveurs situés dans l'Union Européenne. Nous ne transférons pas vos données hors de l'EEE sans garanties appropriées." },
  { q: "Que se passe-t-il si je perds l'accès à ma 2FA ?", r: "Nous générons des codes de secours que nous vous recommandons de sauvegarder. Si vous les perdez, contactez notre équipe. Nous vérifions votre identité via l'email du compte et un processus de récupération avant de désactiver la 2FA." },
  { q: "Qui peut voir mes données ?", r: "Vous et les membres de votre équipe que vous invitez, dans la limite des permissions que vous leur attribuez. L'équipe technique WTF a un accès limité aux métadonnées pour le support et la maintenance, jamais au contenu de vos conversations." },
  { q: "Puis-je utiliser mes propres clés API ?", r: "Oui, avec les plans Elite et Icon. Vous pouvez connecter vos propres clés Anthropic, OpenAI, Replicate, ElevenLabs. Dans ce cas, vos appels API ne transitent pas par nos comptes et vos données ne sont pas visibles par WTF." },
  { q: "Comment puis-je vérifier l'activité de mon compte ?", r: "Les logs d'audit sont accessibles depuis votre dashboard, dans la section Sécurité. Vous pouvez filtrer par période, par utilisateur, et par type d'action. Les logs incluent l'horodatage, l'utilisateur, et l'action effectuée." },
  { q: "Comment supprimer définitivement mon compte ?", r: "Depuis les paramètres de votre compte, section Confidentialité, vous pouvez demander la suppression. Nous confirmons votre identité, puis nous supprimons l'intégralité de vos données sous 30 jours. Vous recevez un email de confirmation une fois la suppression complète." },
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

export function SecurityClient() {
  return (
    <main>
      <HeroSection />
      <SecuriteComptesSection />
      <GestionPermissionsSection />
      <DonneesConfidentialiteSection />
      <AuditLogsSection />
      <BonnesPratiquesSection />
      <CeQueHaloNeFaitPasSection />
      <FAQSection />
      <CTASection />
    </main>
  );
}

function HeroSection() {
  const { ref, inView } = useReveal(0.2);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 160, paddingBottom: 100 }}>
      <div className="wrap-eco text-center" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={140} height={140} style={{ height: 140, width: "auto" }} />
        </motion.div>
        <motion.p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] mb-6" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Centre de Confiance
        </motion.p>
        <motion.h1 className="display-large mx-auto mb-8" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.1}>
          La confiance commence par les accès.
        </motion.h1>
        <motion.p className="text-[1.15rem] leading-relaxed mx-auto mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic", maxWidth: 520 }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.25}>
          Sécurité, confidentialité, contrôle. Tout ce que vous devez savoir sur la protection de vos données, de vos comptes, et de votre activité chez Where Talent Forms.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.4}>
          <Link href="#securite-comptes" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>Explorer</Link>
          <Link href="/contact" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>Contacter l'équipe</Link>
        </motion.div>
      </div>
    </section>
  );
}

function SecuriteComptesSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} id="securite-comptes" className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Accès
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Sécurité des comptes
        </motion.h2>
        <div className="space-y-4">
          {SECURITE_COMPTES.map((item, i) => {
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

function GestionPermissionsSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Permissions
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Gestion des permissions
        </motion.h2>
        <motion.div variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" style={{ minWidth: 600 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--or)" }}>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Rôle</th>
                  <th className="py-3 px-4 text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: "var(--pierre)", fontFamily: "var(--font-util), monospace" }}>Droits</th>
                </tr>
              </thead>
              <tbody>
                {GESTION_PERMISSIONS.map((item, i) => (
                  <tr key={item.role} style={{ borderBottom: "1px solid var(--ligne-faible)", background: i % 2 === 0 ? "transparent" : "rgba(244,238,227,0.02)" }}>
                    <td className="py-4 px-4 text-[13px] font-semibold" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{item.role}</td>
                    <td className="py-4 px-4 text-[12px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{item.droits}</td>
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

function DonneesConfidentialiteSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Données
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Données et confidentialité
        </motion.h2>
        <div className="space-y-4">
          {DONNEES_CONFIDENTIALITE.map((item, i) => {
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

function AuditLogsSection() {
  const { ref, inView } = useReveal(0.06);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 820, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Traçabilité
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Audit logs et contrôle
        </motion.h2>
        <div className="space-y-4">
          {AUDIT_LOGS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.05}>
                <div className="flex items-start gap-5 p-6" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(244,238,227,0.02)" }}>
                  <div className="w-11 h-11 flex items-center justify-center shrink-0" style={{ background: "rgba(216,169,91,0.1)", color: "var(--or)" }}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold mb-2" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{item.titre}</h3>
                    <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
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

function BonnesPratiquesSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--creme)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 700, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-4" style={{ color: "#5A7D4A", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Recommandations
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--encre)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Bonnes pratiques
        </motion.h2>
        <div className="space-y-3">
          {BONNES_PRATIQUES.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.04}>
              <div className="flex items-start gap-3 p-4" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(12,10,8,0.02)" }}>
                <Check size={16} style={{ color: "#5A7D4A", flexShrink: 0, marginTop: 1 }} />
                <span className="text-[13px] leading-relaxed" style={{ color: "var(--encre)", opacity: 0.65, fontFamily: "var(--font-body), sans-serif" }}>{item}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CeQueHaloNeFaitPasSection() {
  const { ref, inView } = useReveal(0.08);
  return (
    <section ref={ref} className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 90, paddingBottom: 90 }}>
      <div className="wrap-eco" style={{ maxWidth: 760, margin: "0 auto" }}>
        <motion.p className="text-[0.6rem] font-bold uppercase tracking-[0.16em] mb-5" style={{ color: "#C44536", fontFamily: "var(--font-util), monospace" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Nos limites
        </motion.p>
        <motion.h2 className="display-medium mb-10" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.08}>
          Ce que WTF ne fait pas
        </motion.h2>
        <div className="space-y-3">
          {CE_QUE_HALO_NE_FAIT_PAS.map((item, i) => (
            <motion.div key={i} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.06 + i * 0.05}>
              <div className="flex items-start gap-4 p-5" style={{ border: "1px solid var(--ligne-faible)", background: "rgba(196,69,54,0.02)" }}>
                <div className="w-8 h-8 flex items-center justify-center shrink-0" style={{ background: "rgba(196,69,54,0.1)", color: "#C44536" }}>
                  <X size={14} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold mb-1" style={{ color: "var(--ivoire)", fontFamily: "var(--font-display-alt), serif" }}>{item.titre}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
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
          Sécurité
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
      <div className="wrap-eco" style={{ maxWidth: 600, margin: "0 auto" }}>
        <motion.div className="couture-ornament mb-8" initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 0.6, scale: 1 } : {}} transition={{ duration: 0.8 }}>
          <Image src="/wtf-logo-rond.png" alt="WTF Talent" width={130} height={130} style={{ height: 130, width: "auto" }} />
        </motion.div>
        <motion.p className="display-medium mb-6" style={{ color: "var(--ivoire)" }} variants={riseItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0}>
          Des questions sur la sécurité ?
        </motion.p>
        <motion.p className="text-[1rem] leading-relaxed mb-10" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.15}>
          Contactez notre équipe pour toute question relative à la protection de vos données.
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-4" variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.3}>
          <Link href="/contact" className="btn-eco inline-flex items-center gap-2" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>
            Contacter l'équipe <ArrowRight size={14} />
          </Link>
          <Link href="/lex" className="btn-eco" style={{ borderColor: "var(--ligne)", color: "var(--ivoire)" }}>
            Hub juridique WTF
          </Link>
        </motion.div>
        <motion.p className="mt-8 text-[0.65rem]" style={{ color: "var(--pierre)", opacity: 0.4, fontFamily: "var(--font-body), sans-serif" }} variants={fadeItem} initial="hidden" animate={inView ? "visible" : "hidden"} custom={0.6}>
          Cette page reflète l'état actuel de notre infrastructure de sécurité. Dernière mise à jour : Juin 2026.
        </motion.p>
      </div>
    </section>
  );
}
