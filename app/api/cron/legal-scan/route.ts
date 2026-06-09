import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

export const dynamic = "force-dynamic";

// ── Config ──────────────────────────────────────────────────────

const CGU_PLATFORMS = [
  { slug: "onlyfans", url: "https://onlyfans.com/terms", label: "OnlyFans", fileSlug: "terms-of-service-2026" },
  { slug: "fansly", url: "https://fansly.com/tos", label: "Fansly", fileSlug: "terms-of-service" },
];

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

// ── Auth guard ──────────────────────────────────────────────────

function isAuthorized(request: NextRequest) {
  return request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
}

// ── Helpers ─────────────────────────────────────────────────────

function extractText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wordSet(text: string): string[] {
  return [...new Set(text.toLowerCase().split(/\s+/).filter((w) => w.length > 3))];
}

function similar(a: string, b: string): boolean {
  const aWords = wordSet(a);
  const bWords = wordSet(b);
  const bSet = new Set(bWords);
  let common = 0;
  for (const w of aWords) if (bSet.has(w)) common++;
  const union = new Set(aWords.concat(bWords));
  return union.size > 0 && common / union.size > 0.35;
}

// ── Tasks ───────────────────────────────────────────────────────

async function runPatternDetection(supabase: ReturnType<typeof createAdminClient>, anthropic: Anthropic) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const { data: analyses } = await supabase
    .from("contract_analyses")
    .select("other_clause_text, platform, created_at")
    .not("other_clause_text", "is", null)
    .gte("created_at", sevenDaysAgo);

  if (!analyses || analyses.length === 0) return { scanned: 0, newClauses: 0 };

  // Group by normalised text
  const groups = new Map<string, { raw: string; count: number; platforms: Set<string> }>();
  for (const a of analyses) {
    const t = (a.other_clause_text || "").trim();
    if (t.length < 10) continue;
    const key = t.toLowerCase().slice(0, 80);
    const existing = groups.get(key);
    if (existing) {
      existing.count++;
      if (a.platform) existing.platforms.add(a.platform);
    } else {
      groups.set(key, { raw: t, count: 1, platforms: new Set(a.platform ? [a.platform] : []) });
    }
  }

  const frequent = Array.from(groups.values()).filter((g) => g.count > 3);
  if (frequent.length === 0) return { scanned: analyses.length, newClauses: 0 };

  // Load existing abusive clauses
  const { data: existingClauses } = await supabase
    .from("abusive_clauses")
    .select("id, label, description");

  const existingLabels = (existingClauses || []).map((c) => c.label.toLowerCase());

  // Filter patterns that don't match existing clauses
  const novel = frequent.filter((p) => {
    return !existingLabels.some((l) => {
      const words = p.raw.toLowerCase().split(/\s+/);
      const matchCount = words.filter((w) => l.includes(w)).length;
      return matchCount / words.length > 0.35;
    });
  });

  if (novel.length === 0) return { scanned: analyses.length, newClauses: 0 };

  // Generate legal argument for each novel pattern
  let inserted = 0;
  for (const pattern of novel) {
    const platforms = [...pattern.platforms].join(", ");

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Tu es un juriste spécialisé dans le droit des créateurs de contenu et des contrats d'agence.

Un utilisateur de l'outil Bouclier Légal a signalé cette clause comme abusive :
"${pattern.raw}"

Cette clause a été signalée ${pattern.count} fois sur ${platforms || "plusieurs plateformes"}.

Génère un argumentaire juridique structuré (3-5 phrases) expliquant :
1. Pourquoi cette clause est problématique pour le créateur
2. Les risques juridiques concrets
3. Une référence juridique ou une piste de contestation

Format : paragraphe concis, sans titre ni introduction.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    // Insert pattern notification into legal_updates_log
    await supabase.from("legal_updates_log").insert({
      action: "pattern_detected",
      source: "legal_scanner",
      details: {
        text: pattern.raw,
        count: pattern.count,
        platforms: [...pattern.platforms],
        analysis: text,
        note: "Clause candidate détectée via analyse automatique des signalements utilisateurs",
      },
      items_affected: pattern.count,
      reviewed_by_admin: false,
    });

    inserted++;
  }

  return { scanned: analyses.length, newClauses: inserted };
}

async function runCGUScan(supabase: ReturnType<typeof createAdminClient>, anthropic: Anthropic) {
  let checked = 0;
  let updated = 0;

  for (const platform of CGU_PLATFORMS) {
    const { data: existing } = await supabase
      .from("legal_knowledge")
      .select("id, title, content, updated_at")
      .eq("platform", platform.slug)
      .eq("category", "cgu")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Skip if less than 7 days since last update
    if (existing?.updated_at) {
      const daysSince = (Date.now() - new Date(existing.updated_at).getTime()) / 86400000;
      if (daysSince < 7) {
        checked++;
        continue;
      }
    }

    // Fetch fresh CGU
    let html: string;
    try {
      const res = await fetch(platform.url, {
        headers: { "User-Agent": "HaloTalent-LegalBot/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      html = await res.text();
    } catch {
      continue;
    }

    const freshText = extractText(html);
    const freshWords = freshText.split(/\s+/).length;
    if (freshWords < 50) continue;

    checked++;

    if (!existing) {
      // First-time seed
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [
          {
            role: "user",
            content: `Tu es un analyste juridique spécialisé dans les plateformes créateurs.

Voici les CGU de ${platform.label} (${platform.url}) :

${freshText.slice(0, 10000)}

Produis une fiche knowledge au format markdown structuré avec les sections suivantes (quand applicables) :
- Propriété du compte
- Propriété du contenu
- Politique de paiement
- Interdiction de l'usurpation d'identité
- Contenu IA
- Implications pour les agences

Chaque section : 3-6 points, incluant des sous-sections "Implications pour les agences" quand pertinent.
Ajoute > citations des CGU originales quand possible.

Ne mets PAS de frontmatter YAML dans ta réponse, seulement le contenu markdown.`,
          },
        ],
      });

      const text = response.content[0].type === "text" ? response.content[0].text : "";

      // Determine tags from content
      const lower = text.toLowerCase();
      const tags: string[] = [];
      if (lower.includes("compte") || lower.includes("account")) tags.push("account_ownership");
      if (lower.includes("contenu") || lower.includes("content")) tags.push("content_rights");
      if (lower.includes("ia") || lower.includes("ai")) tags.push("ai_disclosure");
      if (lower.includes("paiement") || lower.includes("payment")) tags.push("payment");
      if (lower.includes("usurpation") || lower.includes("impersonation")) tags.push("impersonation");

      await supabase.from("legal_knowledge").insert({
        title: `${platform.label} Terms of Service`,
        category: "cgu",
        platform: platform.slug,
        jurisdiction: "international",
        content: text,
        tags,
        source_url: platform.url,
        source_name: platform.label,
        auto_generated: true,
      });

      await supabase.from("legal_updates_log").insert({
        action: "cgu_scraped",
        source: "legal_scanner",
        details: { platform: platform.slug, note: `Premier import des CGU ${platform.label}` },
        items_affected: 1,
        reviewed_by_admin: false,
      });

      updated++;
      continue;
    }

    // Compare — crude similarity check
    const existingWords = (existing.content || "").split(/\s+/).length;
    const ratio = Math.abs(freshWords - existingWords) / Math.max(existingWords, 1);

    if (ratio < 0.05) continue;

    // Changes detected — ask Claude
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Tu es un analyste juridique spécialisé dans les plateformes créateurs.

Les CGU de ${platform.label} ont changé (${(ratio * 100).toFixed(1)}% de différence détectée).

NOUVELLE VERSION (extrait) :
${freshText.slice(0, 8000)}

ANCIENNE VERSION :
${(existing.content || "").slice(0, 4000)}

Produis une fiche knowledge markdown à jour avec les sections :
- Propriété du compte
- Propriété du contenu
- Politique de paiement
- Interdiction de l'usurpation d'identité
- Contenu IA
- Implications pour les agences

Ajoute un bloc [CHANGEMENTS DÉTECTÉS] en haut listant les modifications importantes identifiées.
Ne mets PAS de frontmatter YAML.`,
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    await supabase
      .from("legal_knowledge")
      .update({ content: text, auto_generated: true, updated_at: new Date().toISOString() })
      .eq("id", existing.id);

    await supabase.from("legal_updates_log").insert({
      action: "cgu_scraped",
      source: "legal_scanner",
      details: { platform: platform.slug, change_ratio: ratio, note: "CGU mises à jour automatiquement" },
      items_affected: 1,
      reviewed_by_admin: false,
    });

    updated++;
  }

  return { checked, updated };
}

// ── Admin notification ──────────────────────────────────────────

async function sendDigest(supabase: ReturnType<typeof createAdminClient>, results: {
  patterns: { scanned: number; newClauses: number };
  cgu: { checked: number; updated: number };
}) {
  if (!ADMIN_USER_ID) return;

  const lines = [
    `🤖 *Scanner Juridique — ${new Date().toLocaleDateString("fr-FR")}*`,
    ``,
    `*Patterns détectés :*`,
    `  Analyses scannées : ${results.patterns.scanned}`,
    `  Nouvelles clauses : ${results.patterns.newClauses}`,
    ``,
    `*CGU vérifiées :*`,
    `  Plateformes : ${results.cgu.checked}`,
    `  Mises à jour : ${results.cgu.updated}`,
  ];

  await supabase.from("notifications").insert({
    user_id: ADMIN_USER_ID,
    type: "legal_scan",
    title: "Scan juridique terminé",
    message: lines.join("\n"),
    read: false,
  });
}

// ── Route ───────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createAdminClient();
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const results = {
    patterns: { scanned: 0, newClauses: 0 },
    cgu: { checked: 0, updated: 0 },
    errors: [] as string[],
  };

  // Task 1 — Pattern detection
  try {
    results.patterns = await runPatternDetection(supabase, anthropic);
  } catch (err) {
    results.errors.push(`Pattern detection: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Task 2 — CGU scan
  try {
    results.cgu = await runCGUScan(supabase, anthropic);
  } catch (err) {
    results.errors.push(`CGU scan: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Task 3 — Notification
  try {
    await sendDigest(supabase, results);
  } catch {
    // Non-critical
  }

  return NextResponse.json({ ok: true, ...results });
}

/*
 ── Option B : n8n workflow (auto-hébergé) ─────────────────────

 Si tu préfères n8n plutôt que Vercel Cron, voici la logique :

 1. TRIGGER : Schedule "Daily at 6:00"
 2. HTTP Request (GET) → Supabase REST /rest/v1/contract_analyses
    Query: other_clause_text=not.is.null&created_at=gte.${7daysAgo}
    Headers: apikey, Authorization: Bearer ${SERVICE_ROLE}
 3. Code Node (JavaScript) :
    const groups = {};
    for (const a of $input.all()) {
      const t = (a.other_clause_text || "").trim();
      if (t.length < 10) continue;
      const key = t.toLowerCase().slice(0, 80);
      groups[key] = groups[key] || { text: t, count: 0 };
      groups[key].count++;
    }
    const frequent = Object.values(groups).filter(g => g.count > 3);
    return frequent;
 4. HTTP Request (POST) → Anthropic API /v1/messages
    Body: { model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [...] }
 5. HTTP Request (POST) → Supabase REST /rest/v1/legal_updates_log
    Body: { action: "pattern_detected", source: "legal_scanner", details: {...} }
 6. HTTP Request (POST) → Telegram Bot API sendMessage
    Chat: admin_chat_id, Text: résumé du scan

 Dépendances n8n : aucune (HTTP nodes natifs + 1 Code node)
*/
