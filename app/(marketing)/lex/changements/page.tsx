import { BookOpen, ArrowRight, ExternalLink, ShieldAlert, Info } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LegalDisclaimer } from "@/components/legal/LegalDisclaimer";
import { FreshnessBadge } from "@/components/legal/FreshnessBadge";

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
  major: { bg: "rgba(245,158,11,0.12)", text: "#F59E0B" },
  minor: { bg: "rgba(122,154,101,0.12)", text: "#7A9A65" },
  none: { bg: "rgba(122,154,101,0.06)", text: "var(--text-tertiary)" },
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
    <div className="py-8 max-w-4xl mx-auto px-2">
      {/* Header */}
      <div className="text-center mb-10">
        <div
          className="w-14 h-14 flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "var(--color-accent-soft)" }}
        >
          <BookOpen size={26} style={{ color: "var(--color-accent)" }} />
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Journal des changements
        </h1>
        <p className="text-base mb-4" style={{ color: "var(--text-secondary)" }}>
          Évolutions des conditions générales des plateformes, détectées et analysées par
          notre veille juridique automatisée.
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
          <Info size={24} style={{ color: "var(--text-tertiary)" }} className="mx-auto mb-3" />
          <p style={{ color: "var(--text-tertiary)" }}>
            Aucun changement publié pour le moment. Revenez bientôt.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const impact = IMPACT_COLORS[event.impact_level] || IMPACT_COLORS.minor;
            return (
              <div
                key={event.id}
                className="p-5"
                style={{
                  border: "1px solid var(--border-default)",
                  backgroundColor: "var(--bg-card)",
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: "var(--color-accent)" }}>
                      {PLATFORM_LABELS[event.platform] || event.platform}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      {event.doc_type.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5"
                    style={{ backgroundColor: impact.bg, color: impact.text }}
                  >
                    {event.impact_level}
                  </span>
                </div>

                <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                  {event.summary}
                </p>

                {event.affected_articles && event.affected_articles.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {event.affected_articles.map((article, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5"
                        style={{
                          backgroundColor: "var(--color-accent-soft)",
                          color: "var(--color-accent)",
                        }}
                      >
                        {article}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--text-tertiary)" }}>
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
                      className="inline-flex items-center gap-1 transition-colors hover:opacity-70"
                      style={{ color: "var(--color-accent)" }}
                    >
                      Source officielle
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CTA */}
      <div className="text-center mt-10 mb-8">
        <Link
          href="/protection"
          className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold transition-all hover:scale-[1.02]"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
        >
          Analyser mon contrat
          <ArrowRight size={18} />
        </Link>
      </div>

      <LegalDisclaimer variant="short" />
    </div>
  );
}
