import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import { FreshnessBadge } from "@/components/legal/FreshnessBadge";
import { ChangementsClient } from "./ChangementsClient";

export const metadata: Metadata = {
  title: "Journal des changements, Where Talent Forms",
  description:
    "Veille juridique des évolutions de CGU, politiques de contenu et conditions de paiement des plateformes. Détectées, analysées et résumées pour les créateurs.",
  openGraph: {
    title: "Journal des changements, Veille juridique | Where Talent Forms",
    description:
      "Les règles des plateformes évoluent en permanence. Nous les surveillons pour vous, avec prudence et transparence. Changements détectés, analysés et résumés.",
  },
};

interface ChangeEvent {
  id: string;
  platform: string;
  doc_type: string;
  source_url: string | null;
  summary: string;
  impact_level: string;
  affected_articles: string[] | null;
  created_at: string;
  published_at: string | null;
}

const PLATFORM_LABELS: Record<string, string> = {
  onlyfans: "OnlyFans",
  fansly: "Fansly",
  mym: "MYM",
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X (Twitter)",
  twitch: "Twitch",
};

const IMPACT_COLORS: Record<string, { bg: string; text: string }> = {
  critical: { bg: "rgba(196,69,54,0.12)", text: "#C44536" },
  major: { bg: "rgba(216,169,91,0.12)", text: "var(--or)" },
  minor: { bg: "rgba(122,154,101,0.12)", text: "#7A9A65" },
  none: { bg: "rgba(255,255,255,0.04)", text: "var(--pierre)" },
};

async function getEvents(): Promise<ChangeEvent[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("legal_change_events")
      .select("id, platform, doc_type, source_url, summary, impact_level, affected_articles, created_at, published_at")
      .eq("published", true)
      .eq("human_reviewed", true)
      .order("created_at", { ascending: false })
      .limit(50);
    return (data || []) as ChangeEvent[];
  } catch {
    return [];
  }
}

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

export default async function ChangementsPage() {
  const [events, lastScanDate] = await Promise.all([getEvents(), getLastScanDate()]);

  return (
    <div>
      <ChangementsClient />

      {/* Events List Section */}
      <section className="couture-section" style={{ backgroundColor: "var(--encre)", paddingTop: 40, paddingBottom: 90 }}>
        <div className="wrap-eco" style={{ maxWidth: 800, margin: "0 auto" }}>
          <div className="text-center mb-10">
            <h2 className="display-medium mb-4" style={{ color: "var(--ivoire)" }}>Changements détectés</h2>
            <p className="text-[14px] mb-4" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
              Évolutions des conditions générales des plateformes, détectées et analysées par notre veille juridique.
            </p>
            <div className="flex items-center justify-center gap-3">
              <FreshnessBadge date={lastScanDate} />
            </div>
          </div>

          <div className="mb-8">
            <LegalDisclaimer variant="short" />
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[1rem]" style={{ color: "var(--pierre)", fontFamily: "var(--font-accent), serif", fontStyle: "italic" }}>
                Aucun changement publié pour le moment. Revenez bientôt.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => {
                const impact = IMPACT_COLORS[event.impact_level] || IMPACT_COLORS.none;
                return (
                  <div
                    key={event.id}
                    className="p-5"
                    style={{
                      border: "1px solid var(--ligne-faible)",
                      background: "rgba(244,238,227,0.02)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace" }}>
                          {PLATFORM_LABELS[event.platform] || event.platform}
                        </span>
                        <span className="text-[10px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                          {event.doc_type.replace(/_/g, " ")}
                        </span>
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 uppercase tracking-[0.06em]"
                        style={{ backgroundColor: impact.bg, color: impact.text, fontFamily: "var(--font-util), monospace" }}
                      >
                        {event.impact_level}
                      </span>
                    </div>

                    <p className="text-[14px] leading-relaxed mb-3" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                      {event.summary}
                    </p>

                    {event.affected_articles && event.affected_articles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {event.affected_articles.map((article, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5"
                            style={{
                              background: "rgba(216,169,91,0.1)",
                              color: "var(--or)",
                              fontFamily: "var(--font-util), monospace",
                            }}
                          >
                            {article}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--pierre)", fontFamily: "var(--font-body), sans-serif" }}>
                      <span>
                        {new Date(event.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      {event.source_url && (
                        <a
                          href={event.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 transition-opacity hover:opacity-70"
                          style={{ color: "var(--or)", fontFamily: "var(--font-util), monospace", fontSize: "0.6rem" }}
                        >
                          Source officielle &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/lex" className="btn-eco" style={{ backgroundColor: "var(--or)", color: "var(--encre)", borderColor: "var(--or)" }}>
              En savoir plus sur WTF Lex
            </Link>
          </div>

          <div className="mt-8">
            <LegalDisclaimer variant="short" />
          </div>
        </div>
      </section>
    </div>
  );
}
