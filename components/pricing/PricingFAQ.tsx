"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Puis-je changer de plan à tout moment ?",
    a: "Oui. Vous pouvez monter ou descendre de plan quand vous voulez. Le changement est immédiat et les crédits sont recalculés au prorata.",
  },
  {
    q: "Que se passe-t-il si je dépasse mes crédits IA ?",
    a: "Vous pouvez acheter des packs de crédits supplémentaires (100 crédits pour 9 €, 500 pour 39 €). Les crédits ne sont jamais perdus : ils se cumulent d'un mois sur l'autre si vous ne les utilisez pas.",
  },
  {
    q: "Puis-je utiliser mes propres clés API ?",
    a: "Oui, avec le plan Elite. BYOK (Bring Your Own Key) vous permet d'utiliser vos propres clés Anthropic, OpenAI, Replicate, ElevenLabs. Vous êtes facturé directement par ces fournisseurs, et Halo ne prend aucune commission sur vos usages BYOK.",
  },
  {
    q: "Comment fonctionne la commission de management ?",
    a: "Notre commission est marginale par tranche de revenus. Vous ne payez un pourcentage que sur la partie de vos revenus dans chaque tranche. Plus vous gagnez, plus le taux moyen diminue. Exemple : sur 10 000 € de revenus, la commission totale est de 2 750 € (soit 27,5% effectif).",
  },
  {
    q: "Y a-t-il un engagement minimum ?",
    a: "Aucun engagement. Vous pouvez résilier à tout moment avec un préavis de 30 jours. Vous conservez l'intégralité de vos contenus, données et accès à vos plateformes.",
  },
  {
    q: "Les prix sont-ils TTC ?",
    a: "Oui, tous les prix sont TTC (TVA incluse au taux en vigueur). Une facture détaillée est générée automatiquement chaque mois.",
  },
  {
    q: "Puis-je cumuler Studio IA et Atlas CRM ?",
    a: "Absolument. Les deux produits sont complémentaires. Vous pouvez par exemple être en plan Premium Studio + Pro Atlas. Chaque abonnement est indépendant.",
  },
  {
    q: "Qu'est-ce que le Revenue Radar ?",
    a: "Le Revenue Radar est une fonctionnalité exclusive d'Atlas CRM qui identifie automatiquement les fans à fort potentiel de revenus, ceux qui sont sur le point de partir (churn), et les opportunités de vente croisée (upsell).",
  },
];

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-2xl mx-auto space-y-1">
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="rounded-xl overflow-hidden transition-all"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex items-center justify-between w-full px-4 py-3.5 text-left"
            >
              <span
                className="text-sm font-medium pr-4"
                style={{ color: "var(--text-primary)" }}
              >
                {faq.q}
              </span>
              <ChevronDown
                size={14}
                className="shrink-0 transition-transform duration-200"
                style={{
                  color: "var(--text-tertiary)",
                  transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-3.5">
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
