import { ShieldCheck, BookOpen, ArrowRight, Scale, Lock, Eye, FileSearch } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import { FreshnessBadge } from "@/components/legal/FreshnessBadge";

async function getLastScanDate() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("legal_updates_log")
      .select("created_at")
      .eq("action", "cgu_scraped")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data?.created_at || "2026-06-01";
  } catch {
    return "2026-06-01";
  }
}

const PROBLEMS = [
  {
    icon: Lock,
    title: "Verrouillage de compte",
    desc: "Certaines agences conservent vos identifiants et verrouillent l'accès à votre compte. Vous perdez tout contrôle de votre identité numérique et de vos revenus.",
  },
  {
    icon: Eye,
    title: "Accès à l'aveugle",
    desc: "Connexion partagée sans visibilité : qui accède à votre compte, quand, et pour faire quoi ? Les CGU des plateformes interdisent pourtant le partage de compte.",
  },
  {
    icon: ShieldCheck,
    title: "Shadowbans et fermetures",
    desc: "Les algorithmes et la modération des plateformes peuvent restreindre ou supprimer votre compte du jour au lendemain, sans préavis ni recours clair.",
  },
  {
    icon: Scale,
    title: "Pertes de revenus",
    desc: "Quand vous générez un chiffre d'affaires élevé, la moindre clause abusive ou rétention de fonds peut représenter des milliers d'euros de pertes.",
  },
];

const SOLUTIONS = [
  {
    icon: Lock,
    title: "Accès révocables",
    desc: "Vous gardez le contrôle total. Chaque accès est nominatif, révocable à tout instant, et audité. Pas de mot de passe partagé, pas d'accès permanent.",
  },
  {
    icon: Eye,
    title: "Identité protégée",
    desc: "Votre identité de créateur reste distincte de vos outils de管理. Les plateformes voient vous, pas votre équipe.",
  },
  {
    icon: FileSearch,
    title: "Commissions lisibles",
    desc: "Chaque transaction est tracée, chaque commission est affichée. Vous savez exactement ce que vous gagnez, ce que coûte chaque service, et qui touche quoi.",
  },
  {
    icon: BookOpen,
    title: "Veille juridique permanente",
    desc: "Atlas Legal propulsé par Sentinel analyse en continu les CGU de 8 plateformes, détecte les changements, et vous alerte. Votre contrat est comparé au marché en temps réel.",
  },
];

export default async function LexPage() {
  const lastScanDate = await getLastScanDate();

  return (
    <div className="py-8 max-w-5xl mx-auto px-2">
      {/* Hero */}
      <div className="text-center mb-14">
        <div
          className="w-16 h-16 flex items-center justify-center mx-auto mb-5"
          style={{ backgroundColor: "var(--color-accent-soft)" }}
        >
          <ShieldCheck size={30} style={{ color: "var(--color-accent)" }} />
        </div>
        <p
          className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] mb-4"
          style={{ color: "var(--color-accent)" }}
        >
          Bouclier Légal · Halo Talent
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
          Sécurité & Cadre légal
        </h1>
        <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Protéger les créateurs, ce n&apos;est pas optionnel. C&apos;est notre raison d&apos;être.
          Découvrez comment Halo sécurise votre activité et votre identité numérique.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <FreshnessBadge date={lastScanDate} />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mb-10">
        <LegalDisclaimer variant="agency" />
      </div>

      {/* Section problème */}
      <section className="mb-14">
        <h2 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          Le problème
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROBLEMS.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="p-5"
                style={{
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} style={{ color: "var(--color-alert)" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {p.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section réponse Halo */}
      <section className="mb-14">
        <h2 className="text-lg font-bold mb-6" style={{ color: "var(--text-primary)" }}>
          La réponse Halo Talent
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOLUTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="p-5"
                style={{
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--bg-card)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} style={{ color: "var(--color-accent)" }} />
                  <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {s.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tools section */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/protection"
            className="p-5 text-center transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: "rgba(199,91,57,0.04)",
              border: "1px solid rgba(199,91,57,0.2)",
            }}
          >
            <Scale size={20} style={{ color: "var(--color-accent)" }} className="mx-auto mb-2" />
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Analyseur de contrat
            </h3>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Détectez les clauses abusives en 2 minutes
            </p>
          </Link>

          <Link
            href="/lex/changements"
            className="p-5 text-center transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: "rgba(199,91,57,0.04)",
              border: "1px solid rgba(199,91,57,0.2)",
            }}
          >
            <BookOpen size={20} style={{ color: "var(--color-accent)" }} className="mx-auto mb-2" />
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Journal des changements
            </h3>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Suivez les évolutions des CGU des plateformes
            </p>
          </Link>

          <Link
            href="/lex/atlas"
            className="p-5 text-center transition-all hover:scale-[1.01]"
            style={{
              backgroundColor: "rgba(199,91,57,0.04)",
              border: "1px solid rgba(199,91,57,0.2)",
            }}
          >
            <FileSearch size={20} style={{ color: "var(--color-accent)" }} className="mx-auto mb-2" />
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Atlas Legal (dashboard)
            </h3>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Veille juridique et conformité (membres)
            </p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center mb-10">
        <Link
          href="/protection"
          className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          Analyser mon contrat
          <ArrowRight size={18} />
        </Link>
      </div>

      <LegalDisclaimer variant="full" />
    </div>
  );
}
