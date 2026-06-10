"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Users,
  Shield,
  LayoutDashboard,
  Check,
} from "lucide-react";

/* ─── Feature block data ─── */
interface FeatureBlock {
  id: string;
  title: string;
  desc: string;
  bullets: string[];
  accent: string;
  badge?: string;
  imageSide: "left" | "right";
  // For the mockup illustration
  mockupBg: string;
  mockupIcon: React.ElementType;
}

const BLOCKS: FeatureBlock[] = [
  {
    id: "studio",
    title: "Studio IA : Créez sans limites",
    desc: "Générez du contenu premium en quelques clics — textes, images, vidéos, audio et avatars parlants — avec une IA entraînée à votre ADN créatif.",
    bullets: [
      "Génération texte / image / vidéo / audio",
      "Avatars parlants réalistes",
      "ADN Créatif : l'IA apprend votre style",
      "Templates prêts à l'emploi",
    ],
    accent: "#7c3aed",
    imageSide: "left",
    mockupBg: "linear-gradient(135deg, #7c3aed20, #a78bfa10)",
    mockupIcon: Sparkles,
  },
  {
    id: "crm",
    title: "Atlas CRM : Connaissez chaque fan",
    desc: "Une inbox unifiée, des segments intelligents et un copilot IA pour ne jamais laisser passer une opportunité.",
    bullets: [
      "Inbox unifiée multi-plateforme",
      "Smart Segments : fans à fort potentiel",
      "Chat Copilot IA : réponses automatiques",
      "Revenue Radar : opportunités détectées",
      "Fans à risque : alertes personnalisées",
    ],
    accent: "#2563eb",
    imageSide: "right",
    mockupBg: "linear-gradient(135deg, #2563eb20, #60a5fa10)",
    mockupIcon: Users,
  },
  {
    id: "legal",
    title: "Bouclier Légal : Protégez votre carrière",
    desc: "Analysez vos contrats en un clic, détectez les clauses abusives et accédez à une base juridique pensée pour les créateurs.",
    bullets: [
      "Analyse de contrat gratuite par IA",
      "Détection des clauses abusives",
      "Lettres types personnalisables",
      "Base juridique dédiée aux créateurs",
    ],
    accent: "#059669",
    badge: "Gratuit pour tous",
    imageSide: "left",
    mockupBg: "linear-gradient(135deg, #05966920, #34d39910)",
    mockupIcon: Shield,
  },
  {
    id: "command-center",
    title: "Command Center : Pilotez votre empire",
    desc: "Un tableau de bord unifié pour suivre vos revenus, vos créateurs et votre marché en temps réel.",
    bullets: [
      "Analytics unifiés multi-plateforme",
      "Commissions transparentes et dégressives",
      "Mode multi-créateurs",
      "Benchmark marché : comparez-vous",
    ],
    accent: "#f59e0b",
    imageSide: "right",
    mockupBg: "linear-gradient(135deg, #f59e0b20, #fbbf2410)",
    mockupIcon: LayoutDashboard,
  },
];

/* ─── Mock visual (CSS-only) ─── */
function BlockMockup({ block }: { block: FeatureBlock }) {
  const Icon = block.mockupIcon;
  return (
    <div
      className="w-full rounded-xl overflow-hidden p-6 md:p-8"
      style={{ background: block.mockupBg, border: "1px solid var(--border-default)" }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--danger)" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--warning)" }} />
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "var(--success)" }} />
      </div>
      <div
        className="w-14 h-14 flex items-center justify-center rounded-xl mb-4"
        style={{ backgroundColor: `${block.accent}25` }}
      >
        <Icon size={24} style={{ color: block.accent }} />
      </div>
      <div className="space-y-2">
        <div className="h-3 rounded-full w-3/4" style={{ backgroundColor: `${block.accent}20` }} />
        <div className="h-3 rounded-full w-1/2" style={{ backgroundColor: `${block.accent}15` }} />
        <div className="h-3 rounded-full w-5/6" style={{ backgroundColor: `${block.accent}10` }} />
        <div className="h-3 rounded-full w-2/3" style={{ backgroundColor: `${block.accent}10` }} />
      </div>
    </div>
  );
}

/* ─── Single block ─── */
function FeatureBlock({ block, index, visible }: { block: FeatureBlock; index: number; visible: boolean }) {
  const isLeft = block.imageSide === "left";

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center transition-all duration-700"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transitionDelay: `${index * 100}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {/* Image side */}
      <div className={isLeft ? "order-1" : "order-2"}>
        <BlockMockup block={block} />
      </div>

      {/* Text side */}
      <div className={isLeft ? "order-2" : "order-1"}>
        {block.badge && (
          <span
            className="inline-block text-[0.55rem] font-semibold uppercase tracking-[0.08em] px-2 py-1 rounded-sm mb-4"
            style={{
              backgroundColor: `${block.accent}20`,
              color: block.accent,
            }}
          >
            {block.badge}
          </span>
        )}

        <h3
          className="font-display font-bold text-[1.5rem] sm:text-[1.75rem] md:text-[2rem] leading-[1.2] tracking-[-0.02em] mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          {block.title}
        </h3>

        <p
          className="text-sm md:text-base leading-relaxed mb-6"
          style={{ color: "var(--text-secondary)" }}
        >
          {block.desc}
        </p>

        <ul className="space-y-2.5">
          {block.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm">
              <Check size={14} className="shrink-0 mt-0.5" style={{ color: block.accent }} strokeWidth={2.5} />
              <span style={{ color: "var(--text-primary)" }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <section ref={ref} className="py-24 md:py-36" style={{ backgroundColor: "var(--bg-surface)" }}>
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        <div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24 transition-all duration-700"
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
            Tout ce dont vous avez besoin, en un seul endroit
          </h2>
          <p
            className="text-base md:text-lg mt-4 max-w-xl mx-auto leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            Création, CRM, juridique et pilotage — Halo remplace 7 outils par une plateforme unifiée.
          </p>
        </div>

        <div className="space-y-20 md:space-y-32">
          {BLOCKS.map((block, i) => (
            <FeatureBlock key={block.id} block={block} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
