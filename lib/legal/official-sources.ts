/**
 * Veille législative officielle.
 * Interroge les flux RSS/API des sources officielles françaises et européennes
 * et insère les nouveautés pertinentes dans legal_knowledge.
 *
 * Sources : Legifrance (PISTE), EUR-Lex, CNIL actualités, Judilibre
 * Fréquence : 1x/semaine (intégré dans le cron, jour configurable)
 */

import { createAdminClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { assertNoVerbatim } from "./no-verbatim";

// ── Sources officielles ─────────────────────────────────────────

interface OfficialSource {
  id: string;
  label: string;
  jurisdiction: string;
  type: "rss" | "api";
  url: string;
  maxItems: number;
  delayMs: number;
}

const OFFICIAL_SOURCES: OfficialSource[] = [
  {
    id: "legifrance",
    label: "Légifrance (PISTE)",
    jurisdiction: "fr",
    type: "rss",
    url: "https://www.legifrance.gouv.fr/rss/actualites-legislatives.xml",
    maxItems: 10,
    delayMs: 2000,
  },
  {
    id: "eurlex",
    label: "EUR-Lex",
    jurisdiction: "eu",
    type: "rss",
    url: "https://eur-lex.europa.eu/eli/daily/rss.xml",
    maxItems: 10,
    delayMs: 2000,
  },
  {
    id: "cnil",
    label: "CNIL, Actualités",
    jurisdiction: "fr",
    type: "rss",
    url: "https://www.cnil.fr/rss/actualites.xml",
    maxItems: 10,
    delayMs: 1500,
  },
  {
    id: "judilibre",
    label: "Judilibre (Cour de cassation)",
    jurisdiction: "fr",
    type: "api",
    url: "https://www.courdecassation.fr/recherche-judilibre?search_api_fulltext=&sort=field_date_publication",
    maxItems: 5,
    delayMs: 2000,
  },
];

// ── Keywords de filtrage ────────────────────────────────────────

const RELEVANT_KEYWORDS = [
  "créateur", "créatrice", "contenu", "plateforme", "contrat", "agence",
  "commission", "clause abusive", "déséquilibre", "propriété intellectuelle",
  "droit d'auteur", "data", "rgpd", "donnée personnelle", "influenceur",
  "influenceuse", "digital", "numérique", "sous-traitance", "traitement",
  "consentement", "modération", "cgus", "terms of service", "utilisateur",
  "travailleur indépendant", "impersonation", "ai", "ia", "intelligence artificielle",
  "deepfake", "shadowban", "account", "copyright", "monétisation",
  "creator", "influencer", "platform", "agency",
];

function isRelevant(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  return RELEVANT_KEYWORDS.some((kw) => text.includes(kw));
}

// ── RSS parser minimal ──────────────────────────────────────────

function parseRSSItems(xml: string): Array<{ title: string; description: string; link: string; date: string }> {
  const items: Array<{ title: string; description: string; link: string; date: string }> = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const get = (tag: string) => {
      const m = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(match![1]);
      return m ? m[1].trim() : "";
    };
    items.push({
      title: get("title"),
      description: get("description").replace(/<[^>]+>/g, "").slice(0, 500),
      link: get("link"),
      date: get("pubDate") || get("dc:date") || new Date().toISOString(),
    });
  }
  return items;
}

// ── Fetch helper avec timeout ───────────────────────────────────

async function fetchWithTimeout(url: string, ms: number): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "HaloTalent-LegalBot/1.0 (legislative-watch)" },
    signal: AbortSignal.timeout(ms),
  });
  return res.text();
}

// ── Vérification doublon ────────────────────────────────────────

async function alreadyExists(
  supabase: ReturnType<typeof createAdminClient>,
  title: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("legal_knowledge")
    .select("id")
    .eq("auto_generated", true)
    .ilike("title", title.slice(0, 100))
    .limit(1)
    .maybeSingle();
  return !!data;
}

// ── Scan d'une source officielle ─────────────────────────────────

async function scanSource(
  supabase: ReturnType<typeof createAdminClient>,
  anthropic: Anthropic,
  source: OfficialSource,
): Promise<{ scanned: number; inserted: number }> {
  let raw: string;
  try {
    raw = await fetchWithTimeout(source.url, 15000);
  } catch {
    return { scanned: 0, inserted: 0 };
  }

  let items: Array<{ title: string; description: string; link: string; date: string }>;
  try {
    items = parseRSSItems(raw);
  } catch {
    return { scanned: 0, inserted: 0 };
  }

  const relevant = items.filter((item) => isRelevant(item.title, item.description));
  let inserted = 0;

  for (const item of relevant.slice(0, source.maxItems)) {
    // Skip if already imported
    if (await alreadyExists(supabase, item.title)) continue;

    // Generate knowledge entry via Claude
    try {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: `Tu es un analyste juridique spécialisé dans le droit des créateurs de contenu.

Une nouvelle publication officielle a été détectée :

Source : ${source.label}
Titre : ${item.title}
Description : ${item.description}
Lien : ${item.link}

Rédige une fiche de veille juridique structurée (3-5 phrases max) :
1. Résumé de la publication en une phrase
2. Impact potentiel pour les créateurs de contenu et agences OFM
3. Actions recommandées (si applicable)

Format : paragraphe concis, sans titre. Ne cite PAS textuellement la source, reformule avec tes propres mots.`,
          },
        ],
      });

      const content = response.content[0].type === "text" ? response.content[0].text : "";
      if (!content) continue;

      // Anti-verbatim guardrail
      assertNoVerbatim(content, item.description, `${source.label}: ${item.title}`);

      // Determine category and tags
      const lower = `${item.title} ${item.description}`.toLowerCase();
      let category = "best_practice";
      if (lower.includes("donnée") || lower.includes("rgpd") || lower.includes("data")) category = "law";
      else if (lower.includes("cgu") || lower.includes("terms") || lower.includes("plateforme")) category = "cgu_platform";
      else if (lower.includes("clause") || lower.includes("contrat")) category = "clause_type";

      const tags: string[] = [];
      if (lower.includes("ia") || lower.includes("intelligence artificielle") || lower.includes("deepfake")) tags.push("ai");
      if (lower.includes("rgpd") || lower.includes("donnée")) tags.push("rgpd");
      if (lower.includes("influenceur") || lower.includes("créateur") || lower.includes("creator")) tags.push("creator_rights");
      if (lower.includes("plateforme") || lower.includes("platform")) tags.push("platform_regulation");

      const pubDate = new Date(item.date).toISOString();

      await supabase.from("legal_knowledge").insert({
        title: item.title.slice(0, 255),
        category,
        jurisdiction: source.jurisdiction === "eu" ? "eu" : source.jurisdiction === "fr" ? "fr" : "international",
        content,
        summary: item.description.slice(0, 300),
        source_url: item.link,
        source_name: source.label,
        tags: tags.length > 0 ? tags : null,
        is_active: true,
        auto_generated: true,
        last_verified_at: pubDate,
      });

      inserted++;
    } catch (err) {
      // Log but continue, non-critical
      console.warn(`[official-sources] Skipped "${item.title}": ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { scanned: items.length, inserted };
}

// ── Fonction principale ─────────────────────────────────────────

export async function runLegislativeWatch(): Promise<{
  sourcesScanned: number;
  itemsFound: number;
  itemsInserted: number;
}> {
  const supabase = await createAdminClient();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  let totalScanned = 0;
  let totalFound = 0;
  let totalInserted = 0;

  for (const source of OFFICIAL_SOURCES) {
    const result = await scanSource(supabase, anthropic, source);
    totalScanned++;
    totalFound += result.scanned;
    totalInserted += result.inserted;

    if (source.delayMs > 0) {
      await new Promise((r) => setTimeout(r, source.delayMs));
    }
  }

  // Log the run
  await supabase.from("legal_updates_log").insert({
    action: "cgu_scraped",
    source: "legislative_watch",
    details: {
      type: "legislative",
      sources_scanned: totalScanned,
      items_found: totalFound,
      items_inserted: totalInserted,
      scan_date: new Date().toISOString(),
    },
    items_affected: totalInserted,
    reviewed_by_admin: false,
  });

  return {
    sourcesScanned: totalScanned,
    itemsFound: totalFound,
    itemsInserted: totalInserted,
  };
}
