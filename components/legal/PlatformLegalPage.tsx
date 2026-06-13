import { ArrowRight, ShieldCheck, BookOpen } from "lucide-react";
import Link from "next/link";
import { LegalDisclaimer } from "./LegalDisclaimer";
import { SourceTag, type SourceItem } from "./SourceTag";
import { FreshnessBadge } from "./FreshnessBadge";

export interface PlatformSection {
  title: string;
  items: string[];
}

export interface PlatformData {
  id: string;
  name: string;
  icon: string;
  description: string;
  freshnessDate: string;
  rights: PlatformSection[];
  cguPoints: {
    title: string;
    points: string[];
    sources: SourceItem[];
  }[];
  linkUrl: string;
}

export function PlatformLegalPage({ data }: { data: PlatformData }) {
  return (
    <div className="py-8 max-w-4xl mx-auto px-2">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--color-accent-soft)" }}
        >
          <ShieldCheck size={26} style={{ color: "var(--color-accent)" }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Protection {data.name}
        </h1>
        <p className="text-base" style={{ color: "var(--text-secondary)" }}>
          {data.description}
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <FreshnessBadge date={data.freshnessDate} />
        </div>
      </div>

      {/* Legal disclaimer */}
      <div className="mb-8">
        <LegalDisclaimer variant="short" />
      </div>

      {/* Droits clés */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
          Vos droits sur {data.name}
        </h2>
        <div className="space-y-5">
          {data.rights.map((section, i) => (
            <div
              key={i}
              className="p-5"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-surface)",
              }}
            >
              <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--color-accent)" }}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="shrink-0 mt-0.5 w-1.5 h-1.5" style={{ backgroundColor: "var(--color-accent)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Points d'attention CGU */}
      <section className="mb-10">
        <h2 className="text-lg font-bold mb-5" style={{ color: "var(--text-primary)" }}>
          Points d'attention dans les CGU
        </h2>
        <div className="space-y-4">
          {data.cguPoints.map((point, i) => (
            <div
              key={i}
              className="p-5"
              style={{
                border: "1px solid var(--border-default)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                {point.title}
              </h3>
              <ul className="space-y-1.5 mb-3">
                {point.points.map((p, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: "var(--color-alert)" }} />
                    {p}
                  </li>
                ))}
              </ul>
              {point.sources.length > 0 && (
                <div className="pt-2" style={{ borderTop: "1px solid var(--border-default)" }}>
                  <SourceTag sources={point.sources} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div
        className="p-6 text-center space-y-4 mb-8"
        style={{
          backgroundColor: "rgba(199,91,57,0.04)",
          border: "1px solid rgba(199,91,57,0.2)",
        }}
      >
        <BookOpen size={24} style={{ color: "var(--color-accent)" }} className="mx-auto" />
        <div>
          <h3 className="text-base font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Analysez votre contrat d'agesse
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Vérifiez si votre contrat contient des clauses abusives en 2 minutes
          </p>
        </div>
        <Link
          href="/protection"
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          Analyser mon contrat
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Source link */}
      <div className="text-center">
        <a
          href={data.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "var(--text-tertiary)" }}
        >
          Lire les CGU officielles de {data.name}
          <ArrowRight size={12} />
        </a>
      </div>

      {/* Footer disclaimer */}
      <div className="mt-8">
        <LegalDisclaimer variant="agency" />
      </div>
    </div>
  );
}
