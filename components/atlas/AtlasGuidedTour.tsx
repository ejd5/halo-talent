"use client";

import { useEffect, useState } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function AtlasGuidedTour({ autoStart = false }: { autoStart?: boolean }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!autoStart || started) return;
    setStarted(true);

    const timeout = setTimeout(() => {
      const drive = driver({
        animate: true,
        allowClose: true,
        showProgress: true,
        smoothScroll: true,
        stagePadding: 12,
        stageRadius: 6,
        popoverOffset: 8,
        overlayColor: "#000",
        showButtons: ["next", "previous", "close"],
        steps: [
          {
            element: "body",
            popover: {
              title: "Bienvenue dans Atlas",
              description:
                "Faisons un tour rapide de l'interface Atlas pour que vous repériez tout du premier coup d'œil.",
              side: "over",
              showButtons: ["next", "close"],
            },
          },
          {
            element: "body",
            popover: {
              title: "CRM Fans",
              description:
                "Tous vos fans en un endroit. Segmentez, scorez et suivez chaque interaction. Les Whales & VIP sont mis en avant.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Inbox unifié",
              description:
                "Tous vos messages (email, SMS, DM) arrivent ici. Répondez sans changer d'onglet. Les brouillons IA vous proposent des réponses.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Campagnes multi-canaux",
              description:
                "Créez des campagnes email, SMS et push notifications en quelques clics. Atlas suit les taux d'ouverture et de conversion.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Funnels automatisés",
              description:
                "Des tunnels de conversion prêts à l'emploi. Welcome sequence, lead capture, ventes, tout est automatisé.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Règles & Automatisations",
              description:
                "Créez des règles &quot;Si-Alors&quot; comme dans Zapier. Nouveau fan → Email de bienvenue. Tag ajouté → Changement de tier. Inactivité → Relance SMS.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Analytics & ROI",
              description:
                "Mesurez le ROI de chaque action Atlas : campagnes, funnels, règles. Visualisez l'attribution, les cohortes, et les tendances.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Centre de conformité",
              description:
                "Atlas vérifie en permanence que tout est légal : RGPD, anti-spam, consents, audit trail. Protection anti-ban.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Raccourcis clavier",
              description:
                "Cmd+A pour ouvrir l'Atlas Launcher. Cmd+M pour l'Inbox. Cmd+F pour chercher un fan. Cmd+N pour nouvelle campagne.",
              side: "over",
              showButtons: ["close"],
            },
          },
        ],
      });

      drive.drive();
    }, 800);

    return () => clearTimeout(timeout);
  }, [autoStart, started]);

  return null;
}

export function AtlasTourButton() {
  const handleStartTour = () => {
    const drive = driver({
      animate: true,
      allowClose: true,
      showProgress: true,
      smoothScroll: true,
      stagePadding: 12,
      stageRadius: 6,
      popoverOffset: 8,
      overlayColor: "#000",
      steps: [
        {
          element: "body",
          popover: {
            title: "Tour guidé Atlas",
            description: "Découvrez les fonctionnalités principales d'Atlas en un clin d'œil.",
            side: "over",
            showButtons: ["next", "close"],
          },
        },
        {
          element: "body",
          popover: {
            title: "CRM Fans",
            description: "Gérez tous vos fans, segmentez, scorez, et identifiez vos Whales & VIP.",
            side: "over",
          },
        },
        {
            element: "body",
            popover: {
              title: "Inbox unifié",
              description: "Messages centralisés depuis toutes vos plateformes. Répondez partout depuis Atlas.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Campagnes & Funnels",
              description: "Créez des campagnes email/SMS/Push et des funnels automatisés en quelques minutes.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Règles d'automatisation",
              description: "Automatisez vos actions CRM avec des règles conditionnelles puissantes.",
              side: "over",
            },
          },
          {
            element: "body",
            popover: {
              title: "Analytics & ROI",
              description: "Suivez vos performances, le ROI de chaque action, et l'engagement de vos fans.",
              side: "over",
              showButtons: ["close"],
            },
          },
        ],
      });

      drive.drive();
    };

  return (
    <button
      onClick={handleStartTour}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 font-medium transition-all hover:opacity-80"
      style={{ backgroundColor: "rgba(199,91,57,0.1)", color: "var(--accent)", border: "1px solid rgba(199,91,57,0.2)" }}
    >
      Tour guidé
    </button>
  );
}
