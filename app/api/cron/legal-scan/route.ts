import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";
import { CGU_SOURCES, type CguSource } from "@/lib/legal/sources";
import { htmlToMarkdown } from "@/lib/legal/html-to-md";
import { runLegislativeWatch } from "@/lib/legal/official-sources";

export const dynamic = "force-dynamic";

// ── Config ──────────────────────────────────────────────────────

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

// ── Auth guard ──────────────────────────────────────────────────

function isAuthorized(request: NextRequest) {
  return request.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;
}

// ── Helpers ─────────────────────────────────────────────────────

function sha256(text: string): string {
  return crypto.createHash("sha256").update(text, "utf-8").digest("hex");
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Pattern detection (unchanged) ───────────────────────────────

async function runPatternDetection(supabase: ReturnType<typeof createAdminClient>, anthropic: Anthropic) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();

  const { data: analyses } = await supabase
    .from("contract_analyses")
    .select("other_clause_text, platform, created_at")
    .not("other_clause_text", "is", null)
    .gte("created_at", sevenDaysAgo);

  if (!analyses || analyses.length === 0) return { scanned: 0, newClauses: 0 };

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

  const { data: existingClauses } = await supabase
    .from("abusive_clauses")
    .select("id, label, description");

  const existingLabels = (existingClauses || []).map((c) => c.label.toLowerCase());

  const novel = frequent.filter((p) => {
    return !existingLabels.some((l) => {
      const words = p.raw.toLowerCase().split(/\s+/);
      const matchCount = words.filter((w) => l.includes(w)).length;
      return matchCount / words.length > 0.35;
    });
  });

  if (novel.length === 0) return { scanned: analyses.length, newClauses: 0 };

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

// ── Snapshot helpers ────────────────────────────────────────────

async function getLastSnapshot(
  supabase: ReturnType<typeof createAdminClient>,
  source: CguSource,
) {
  const { data } = await supabase
    .from("legal_source_snapshots")
    .select("id, content_hash, fetched_at")
    .eq("platform", source.slug)
    .eq("doc_type", source.docType)
    .eq("is_active", true)
    .order("fetched_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data;
}

async function insertSnapshot(
  supabase: ReturnType<typeof createAdminClient>,
  source: CguSource,
  markdown: string,
  hash: string,
  fetchSuccess: boolean,
  fetchError?: string,
) {
  const sizeBytes = new TextEncoder().encode(markdown).length;

  const { data, error } = await supabase
    .from("legal_source_snapshots")
    .insert({
      platform: source.slug,
      doc_type: source.docType,
      source_url: source.url,
      raw_content: markdown,
      content_hash: hash,
      fetched_at: new Date().toISOString(),
      fetch_method: "scraper",
      fetch_success: fetchSuccess,
      fetch_error: fetchError || null,
      response_size_bytes: sizeBytes,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

async function archiveToStorage(
  supabase: ReturnType<typeof createAdminClient>,
  source: CguSource,
  markdown: string,
  hash: string,
) {
  const datePath = new Date().toISOString().slice(0, 10);
  const fileName = `${source.slug}/${source.docType}/${datePath}_${hash.slice(0, 12)}.md`;

  const { error } = await supabase.storage
    .from("legal-snapshots")
    .upload(fileName, markdown, {
      contentType: "text/markdown",
      upsert: false,
    });

  if (error && !error.message?.includes("already exists")) {
    console.warn(`[cron] Storage archive failed for ${source.slug}: ${error.message}`);
  }
}

async function createChangeEvent(
  supabase: ReturnType<typeof createAdminClient>,
  source: CguSource,
  previousSnapshotId: string | null,
  newSnapshotId: string,
  anthropic: Anthropic,
  freshMarkdown: string,
  previousMarkdown?: string,
) {
  // Generate AI summary of changes
  let summary = `CGU de ${source.label} mises à jour.`;
  let impact: string = "minor";
  let articles: string[] = [];

  try {
    const prompt = `Tu es un analyste juridique. Les CGU de ${source.label} ont changé.

NOUVELLE VERSION (extrait, ${freshMarkdown.length} caractères) :
${freshMarkdown.slice(0, 6000)}

${previousMarkdown ? `ANCIENNE VERSION (extrait, ${previousMarkdown.length} caractères) :
${previousMarkdown.slice(0, 3000)}` : "Pas de version précédente disponible (premier snapshot)."}

Analyse les changements et réponds UNIQUEMENT au format JSON :
{
  "summary": "Résumé des changements en 1-2 phrases en français",
  "impact": "critical|major|minor|none",
  "articles": ["Article modifié 1", "Article modifié 2"]
}`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 800,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const parsed = JSON.parse(text);
    if (parsed.summary) summary = parsed.summary;
    if (parsed.impact) impact = parsed.impact;
    if (Array.isArray(parsed.articles)) articles = parsed.articles;
  } catch {
    // Use defaults on AI failure
  }

  const { error } = await supabase.from("legal_change_events").insert({
    previous_snapshot_id: previousSnapshotId,
    new_snapshot_id: newSnapshotId,
    platform: source.slug,
    doc_type: source.docType,
    source_url: source.url,
    summary,
    impact_level: impact,
    affected_articles: articles.length > 0 ? articles : null,
    human_reviewed: false,
    published: false,
  });

  if (error) console.error(`[cron] Failed to create change event for ${source.slug}:`, error.message);
}

async function updateLegalKnowledge(
  supabase: ReturnType<typeof createAdminClient>,
  source: CguSource,
  anthropic: Anthropic,
  freshMarkdown: string,
  previousMarkdown?: string,
) {
  const { data: existing } = await supabase
    .from("legal_knowledge")
    .select("id, title, content")
    .eq("platform", source.slug)
    .eq("category", "cgu")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const maxChars = 10000;
  const truncated = freshMarkdown.slice(0, maxChars);

  let response;
  try {
    const compareContext = previousMarkdown
      ? `\nANCIENNE VERSION (à mettre à jour) :\n${previousMarkdown.slice(0, 4000)}`
      : "";

    response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Tu es un analyste juridique spécialisé dans les plateformes créateurs.

Voici les CGU de ${source.label} (${source.url}) :

${truncated}${compareContext}

Produis une fiche knowledge au format markdown structuré avec les sections suivantes (quand applicables) :
- Propriété du compte
- Propriété du contenu
- Politique de paiement
- Interdiction de l'usurpation d'identité
- Contenu IA
- Implications pour les agences

Chaque section : 3-6 points, incluant des sous-sections "Implications pour les agences" quand pertinent.
${previousMarkdown ? "Ajoute un bloc [CHANGEMENTS DÉTECTÉS] en haut listant les modifications importantes." : ""}
Ne mets PAS de frontmatter YAML dans ta réponse, seulement le contenu markdown.
Ne cite JAMAIS les CGU textuellement — reformule avec tes mots.`,
        },
      ],
    });
  } catch {
    return; // Skip knowledge update on AI failure
  }

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  if (!text) return;

  // Determine tags from content
  const lower = text.toLowerCase();
  const tags: string[] = [];
  if (lower.includes("compte") || lower.includes("account")) tags.push("account_ownership");
  if (lower.includes("contenu") || lower.includes("content")) tags.push("content_rights");
  if (lower.includes("ia") || lower.includes("ai")) tags.push("ai_disclosure");
  if (lower.includes("paiement") || lower.includes("payment")) tags.push("payment");
  if (lower.includes("usurpation") || lower.includes("impersonation")) tags.push("impersonation");

  if (existing) {
    await supabase
      .from("legal_knowledge")
      .update({ content: text, tags, auto_generated: true, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabase.from("legal_knowledge").insert({
      title: `${source.label} Terms of Service`,
      category: "cgu",
      platform: source.slug,
      jurisdiction: source.jurisdiction,
      content: text,
      tags,
      source_url: source.url,
      source_name: source.label,
      auto_generated: true,
    });
  }
}

// ── CGU scan (generalised, versioned) ──────────────────────────

async function runCGUScan(supabase: ReturnType<typeof createAdminClient>, anthropic: Anthropic) {
  let checked = 0;
  let updated = 0;

  for (const source of CGU_SOURCES) {
    // 1. Get last snapshot to compare
    const lastSnapshot = await getLastSnapshot(supabase, source);

    // 2. Fetch fresh CGU page
    let freshMarkdown = "";
    let fetchError: string | undefined;

    try {
      const res = await fetch(source.url, {
        headers: { "User-Agent": "HaloTalent-LegalBot/1.0 (cron)" },
        signal: AbortSignal.timeout(20000),
      });

      if (!res.ok) {
        fetchError = `HTTP ${res.status}`;
        // Still insert a failed snapshot for the record
        const failedHash = sha256(`failed:${res.status}:${Date.now()}`);
        await insertSnapshot(supabase, source, "", failedHash, false, fetchError);
        await sleep(source.delayMs);
        continue;
      }

      const html = await res.text();
      freshMarkdown = htmlToMarkdown(html);

      if (freshMarkdown.split(/\s+/).length < 50) {
        fetchError = "Response too short";
        const failedHash = sha256(`failed:short:${Date.now()}`);
        await insertSnapshot(supabase, source, "", failedHash, false, fetchError);
        await sleep(source.delayMs);
        continue;
      }
    } catch (err) {
      fetchError = err instanceof Error ? err.message : String(err);
      const failedHash = sha256(`failed:${Date.now()}`);
      await insertSnapshot(supabase, source, "", failedHash, false, fetchError);
      await sleep(source.delayMs);
      continue;
    }

    checked++;

    // 3. Compare hash with last snapshot
    const newHash = sha256(freshMarkdown);

    if (lastSnapshot && lastSnapshot.content_hash === newHash) {
      // No change — skip
      await sleep(source.delayMs);
      continue;
    }

    // 4. CHANGE DETECTED — insert snapshot, archive, create event
    const previousMarkdown: string | undefined =
      lastSnapshot?.content_hash
        ? undefined // We'd need to fetch the raw_content, skip for efficiency
        : undefined;

    // We fetch the previous raw_content only if there's a change to report
    let previousContent: string | undefined;
    if (lastSnapshot) {
      const { data: prev } = await supabase
        .from("legal_source_snapshots")
        .select("raw_content")
        .eq("id", lastSnapshot.id)
        .single();
      previousContent = prev?.raw_content;
    }

    const newSnapshotId = await insertSnapshot(supabase, source, freshMarkdown, newHash, true);

    // Archive to Storage (best-effort)
    await archiveToStorage(supabase, source, freshMarkdown, newHash);

    // Create change event with AI summary
    await createChangeEvent(
      supabase,
      source,
      lastSnapshot?.id || null,
      newSnapshotId,
      anthropic,
      freshMarkdown,
      previousContent,
    );

    // 5. Update legal_knowledge (existing behaviour, now with 8 platforms)
    await updateLegalKnowledge(supabase, source, anthropic, freshMarkdown, previousContent);

    // Log the update
    await supabase.from("legal_updates_log").insert({
      action: "cgu_scraped",
      source: "legal_scanner",
      details: {
        platform: source.slug,
        hash_changed: !lastSnapshot,
        previous_hash: lastSnapshot?.content_hash || null,
        new_hash: newHash,
        note: lastSnapshot
          ? "CGU modifiées — snapshot + change event créés"
          : "Premier snapshot CGU",
      },
      items_affected: 1,
      reviewed_by_admin: false,
    });

    updated++;

    // Respectful delay between sources
    await sleep(source.delayMs);
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
    legislative: { sourcesScanned: 0, itemsFound: 0, itemsInserted: 0 },
    errors: [] as string[],
  };

  // Task 1 — Pattern detection (unchanged)
  try {
    results.patterns = await runPatternDetection(supabase, anthropic);
  } catch (err) {
    results.errors.push(`Pattern detection: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Task 2 — CGU scan (generalised, 8 platforms + versioning)
  try {
    results.cgu = await runCGUScan(supabase, anthropic);
  } catch (err) {
    results.errors.push(`CGU scan: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Task 3 — Legislative watch (weekly: only on Mondays)
  try {
    const today = new Date().getDay();
    if (today === 1) {
      results.legislative = await runLegislativeWatch();
    }
  } catch (err) {
    results.errors.push(`Legislative watch: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Task 4 — Write execution summary for FreshnessBadge
  try {
    await supabase.from("legal_updates_log").insert({
      action: "cgu_scraped",
      source: "legal_scanner",
      details: {
        summary: true,
        platforms_checked: results.cgu.checked,
        platforms_updated: results.cgu.updated,
        patterns_scanned: results.patterns.scanned,
        patterns_new: results.patterns.newClauses,
        errors: results.errors.length > 0 ? results.errors : null,
        scan_date: new Date().toISOString(),
      },
      items_affected: results.cgu.checked + results.patterns.scanned,
      reviewed_by_admin: false,
    });
  } catch {
    // Non-critical
  }

  // Task 4 — Notification
  try {
    await sendDigest(supabase, results);
  } catch {
    // Non-critical
  }

  return NextResponse.json({ ok: true, ...results });
}
