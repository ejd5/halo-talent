import { FileText, AlertTriangle, Search, Scale, FileCheck, ArrowRight, ShieldCheck, Eye, Clock, Lock, HelpCircle } from "lucide-react";
import Link from "next/link";

const PROBLEMS = [
  {
    icon: Lock,
    title: "Exclusivité abusive",
    desc: "Certains contrats d'agence vous empêchent de travailler avec d'autres partenaires, même pour des projets sans rapport avec l'agence.",
  },
  {
    icon: Eye,
    title: "Commission floue",
    desc: "Des clauses de rémunération imprécises ou déséquilibrées qui rendent difficile le suivi de vos revenus réels.",
  },
  {
    icon: Clock,
    title: "Durée trop longue",
    desc: "Des engagements de 2, 3 ou 5 ans sans clause de sortie claire, qui vous enferment même si la relation ne fonctionne plus.",
  },
  {
    icon: AlertTriangle,
    title: "Droits d'image trop larges",
    desc: "Des cessions de droits perpétuelles ou excessives sur votre image, votre nom, et votre contenu, sans limitation territoriale.",
  },
  {
    icon: FileText,
    title: "Sortie compliquée",
    desc: "Des pénalités de rupture abusives ou des clauses de non-concurrence post-contractuelles qui vous empêchent de rebondir.",
  },
];

const MODULES = [
  { icon: Search, title: "Clause Scanner", desc: "Identifie automatiquement les clauses importantes dans vos contrats." },
  { icon: AlertTriangle, title: "Risk Score", desc: "Attribue un score de risque à chaque clause et au contrat dans son ensemble." },
  { icon: Lock, title: "Exit Clause Finder", desc: "Repère les clauses de sortie, de résiliation et de non-concurrence." },
  { icon: FileCheck, title: "Commission Checker", desc: "Analyse la structure de rémunération et détecte les zones floues." },
  { icon: Eye, title: "Rights Usage Review", desc: "Vérifie l'étendue des droits cédés (image, contenu, nom, territoire)." },
  { icon: HelpCircle, title: "Questions Generator", desc: "Génère les bonnes questions à poser avant de signer." },
];

export default function LexPage() {
  return (
    <div style={{ background: "#1A1614" }}>
      {/* Hero */}
      <section className="relative py-28 md:py-36 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, #C75B39 0%, transparent 70%)" }}
        />

        <div className="relative z-10 mx-auto w-full max-w-4xl px-6 md:px-12 text-center">
          <p
            className="text-[0.65rem] font-sans font-semibold uppercase tracking-[0.12em] mb-6"
            style={{ color: "var(--color-accent)" }}
          >
            Halo Lex
          </p>
          <h1
            className="font-display text-[2.5rem] md:text-[4.5rem] font-bold uppercase tracking-[-0.02em] leading-[1.05]"
            style={{ color: "var(--color-dark-text)" }}
          >
            Comprenez vos contrats avant de les signer
          </h1>
          <p
            className="text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Halo Lex analyse les clauses, détecte les risques majeurs et vous aide à
            poser les bonnes questions avant de vous engager.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <Link
              href="/lex-ai"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "var(--color-accent)", color: "#F5F0EB" }}
            >
              Analyser un contrat
              <ArrowRight size={14} />
            </Link>
            <a
              href="#risques"
              className="inline-flex items-center justify-center px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300"
              style={{ border: "2px solid rgba(245, 240, 235, 0.15)", color: "var(--color-dark-text)" }}
            >
              Voir les risques fréquents
            </a>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section id="risques" className="py-20 md:py-28" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <h2
            className="font-display text-[1.8rem] md:text-[2.5rem] font-bold uppercase tracking-[-0.02em] text-center mb-4"
            style={{ color: "var(--color-dark-text)" }}
          >
            Les clauses qui méritent votre attention
          </h2>
          <p
            className="text-sm text-center mb-12 max-w-lg mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.4)" }}
          >
            Ces problèmes reviennent dans des centaines de contrats d&apos;agence analysés.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROBLEMS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="p-6"
                  style={{
                    border: "1px solid rgba(245, 240, 235, 0.06)",
                    background: "rgba(42, 36, 32, 0.5)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon size={18} style={{ color: "var(--color-alert)" }} />
                    <h3 className="text-sm font-semibold" style={{ color: "var(--color-dark-text)" }}>
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(245, 240, 235, 0.55)" }}>
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28">
        <div className="mx-auto w-full max-w-5xl px-6 md:px-12">
          <h2
            className="font-display text-[1.8rem] md:text-[2.5rem] font-bold uppercase tracking-[-0.02em] text-center mb-12"
            style={{ color: "var(--color-dark-text)" }}
          >
            Comment ça marche
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { step: "1", title: "Importez", desc: "Importez ou collez votre contrat dans Halo Lex." },
              { step: "2", title: "Analysez", desc: "Halo Lex identifie les clauses importantes et les zones à risque." },
              { step: "3", title: "Score", desc: "Recevez un score de risque global et par catégorie." },
              { step: "4", title: "Questions", desc: "Obtenez les questions à poser avant de vous engager." },
              { step: "5", title: "Décidez", desc: "Prenez votre décision avec plus de clarté." },
            ].map((item) => (
              <div key={item.step} className="text-center p-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold"
                  style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)" }}
                >
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-dark-text)" }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(245, 240, 235, 0.45)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 md:py-28" style={{ background: "var(--color-dark-surface)" }}>
        <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
          <h2
            className="font-display text-[1.8rem] md:text-[2.5rem] font-bold uppercase tracking-[-0.02em] text-center mb-4"
            style={{ color: "var(--color-dark-text)" }}
          >
            Modules Halo Lex
          </h2>
          <p
            className="text-sm text-center mb-12 max-w-lg mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.4)" }}
          >
            Chaque module est conçu pour un aspect spécifique de l&apos;analyse contractuelle.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map((m, i) => {
              const Icon = m.icon;
              return (
                <div
                  key={i}
                  className="p-6"
                  style={{
                    border: "1px solid rgba(245, 240, 235, 0.06)",
                    background: "rgba(42, 36, 32, 0.5)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon size={18} style={{ color: "var(--color-accent)" }} />
                    <h3 className="text-sm font-semibold" style={{ color: "var(--color-dark-text)" }}>
                      {m.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(245, 240, 235, 0.55)" }}>
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-16" style={{ background: "#2A2420" }}>
        <div className="mx-auto w-full max-w-3xl px-6 md:px-12 text-center">
          <div
            className="w-12 h-12 flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(199, 91, 57, 0.1)", color: "var(--color-accent)" }}
          >
            <Scale size={22} />
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(245, 240, 235, 0.55)" }}>
            Halo Lex fournit une aide à la compréhension des contrats et ne remplace pas un avocat.
            Pour des conseils juridiques personnalisés, nous vous recommandons de consulter un
            professionnel du droit.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-4xl px-6 md:px-12 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-[0.65rem] font-sans font-semibold uppercase tracking-[0.1em]"
            style={{
              color: "var(--color-success)",
              background: "rgba(122, 154, 101, 0.1)",
              border: "1px solid rgba(122, 154, 101, 0.2)",
            }}
          >
            <ShieldCheck size={12} />
            Gratuit pour tous les créateurs
          </div>
          <h2
            className="font-display text-[1.8rem] md:text-[3rem] font-bold uppercase tracking-[-0.02em] leading-[1.1]"
            style={{ color: "var(--color-dark-text)" }}
          >
            Prêt à analyser votre contrat ?
          </h2>
          <p
            className="text-base md:text-lg mt-4 max-w-lg mx-auto"
            style={{ color: "rgba(245, 240, 235, 0.55)" }}
          >
            Importez votre contrat et obtenez une analyse détaillée en quelques minutes.
            Sans engagement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
            <Link
              href="/lex-ai"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "var(--color-accent)", color: "#F5F0EB" }}
            >
              Analyser mon contrat
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/lex-ai"
              className="inline-flex items-center justify-center px-10 py-4 text-[0.8rem] font-display font-semibold uppercase tracking-[0.08em] transition-all duration-300"
              style={{ border: "2px solid rgba(245, 240, 235, 0.15)", color: "var(--color-dark-text)" }}
            >
              Découvrir Halo Lex
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
