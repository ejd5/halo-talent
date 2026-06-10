"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
  disclaimer?: boolean;
}

const FAQS: FaqItem[] = [
  {
    q: "C'est quoi la différence avec une agence classique ?",
    a: "Une agence classique prend 30 à 70% de vos revenus, contrôle souvent vos comptes, et vous enferme dans des contrats longs. Halo vous donne les mêmes services — création, CRM, juridique, analytics — dans une plateforme unifiée, avec une commission publique et dégressive (30% → 10%), une clause de sortie à 30 jours, et vous gardez 100% du contrôle de vos données et de vos comptes.",
  },
  {
    q: "Comment fonctionne la commission dégressive ?",
    a: "Notre commission est marginale, comme l'impôt sur le revenu : vous payez 30% sur la tranche 0-5k€, 25% sur 5k-20k€, 20% sur 20k-50k€, 15% sur 50k-150k€, et 10% au-delà. Concrètement, si vous gagnez 25k€/mois, votre taux effectif est d'environ 25%, pas 20%. Utilisez notre calculateur pour voir votre taux exact.",
  },
  {
    q: "Le Bouclier Légal, c'est gratuit pour de vrai ?",
    a: "Oui, le Bouclier Légal est totalement gratuit pour tous les créateurs, sans limite d'utilisation. Vous pouvez analyser autant de contrats que vous voulez, détecter les clauses abusives, et accéder à notre base juridique. Pas de piège, pas de version premium cachée.",
  },
  {
    q: "Mes données m'appartiennent vraiment ?",
    a: "Absolument. Vos données vous appartiennent. Vous pouvez exporter l'intégralité de vos données (CSV, JSON, PDF) à tout moment, et nous ne les revendons à personne. Consultez notre page Confidentialité pour les détails techniques.",
  },
  {
    q: "Comment fonctionne la clause de sortie 30 jours ?",
    a: "Vous pouvez résilier à tout moment, sans pénalité et sans justification. Il suffit de nous prévenir 30 jours à l'avance, et nous vous accompagnons pour la transition. Pas de frais cachés, pas de période d'engagement minimum.",
  },
  {
    q: "L'IA poste-t-elle automatiquement à ma place ?",
    a: "Non. Halo fonctionne en mode « IA assistée » : l'IA vous suggère du contenu, des réponses et des optimisations, mais vous validez chaque action avant publication. Vous gardez le contrôle total de ce qui est publié et du moment de la publication.",
  },
  {
    q: "Quelles plateformes sont supportées ?",
    a: "Nous supportons OnlyFans, MYM, Fansly, Fanvue, AdmireMe, et plus de 15 plateformes. Notre CRM unifie toutes vos conversations et vos analytics en un seul endroit, quelle que soit la plateforme.",
  },
  {
    q: "C'est sécurisé ? Qui a accès à mes comptes ?",
    a: "La sécurité est notre priorité. Nous utilisons un chiffrement de bout en bout, et seuls vous et les personnes que vous autorisez explicitement avez accès à vos comptes. Nous ne nous connectons jamais à vos plateformes sans votre consentement. Consultez notre page Sécurité pour plus de détails.",
  },
  {
    q: "Vous êtes avocats ?",
    a: "Halo Talent n'est pas un cabinet d'avocats et ne fournit pas de conseil juridique. Le Bouclier Légal est un outil d'aide à la décision basé sur l'IA. Pour des conseils juridiques personnalisés, nous vous recommandons de consulter un avocat spécialisé.",
    disclaimer: true,
  },
  {
    q: "Comment commencer ?",
    a: "Créez votre compte gratuitement en 2 minutes. Aucune carte bancaire requise. Vous aurez accès immédiatement au Studio IA, au Bouclier Légal, et à toutes les fonctionnalités gratuites. Quand vous serez prêt, vous pourrez choisir un plan SaaS ou activer la commission management. Pas d'engagement, pas de risque.",
  },
];

export function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section ref={ref} className="py-24 md:py-36" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="mx-auto max-w-3xl px-6 md:px-12">
        <div
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <h2
            className="font-display font-bold text-[1.75rem] sm:text-[2.25rem] md:text-[2.75rem] leading-[1.15] tracking-[-0.02em]"
            style={{ color: "var(--text-primary)" }}
          >
            Questions fréquentes
          </h2>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(16px)",
                transitionDelay: `${i * 60}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left transition-all duration-200 hover:opacity-80"
                style={{
                  backgroundColor: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                }}
              >
                <span className="text-sm md:text-base font-medium leading-snug flex-1">
                  {faq.q}
                </span>
                <ChevronDown
                  size={14}
                  className="shrink-0 transition-transform duration-300"
                  style={{
                    color: "var(--text-tertiary)",
                    transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openIndex === i ? "300px" : "0px",
                  opacity: openIndex === i ? 1 : 0,
                }}
              >
                <div
                  className="p-4 md:p-5 text-sm leading-relaxed"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderLeft: "1px solid var(--border-default)",
                    borderRight: "1px solid var(--border-default)",
                    borderBottom: "1px solid var(--border-default)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {faq.a}
                  {faq.disclaimer && (
                    <p
                      className="mt-3 text-[0.6rem] font-medium"
                      style={{ color: "var(--warning)" }}
                    >
                      Halo Talent ne fournit pas de conseil juridique. Le Bouclier Légal est un outil d&apos;aide à la décision.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
