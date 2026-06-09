// legal-scanner.js — Veille juridique quotidienne
// Tasks: 1) Scrape CGU pages  2) Detect clause patterns from user analyses  3) Monitor Reddit/forums
// Run via: node scripts/legal-scanner.js

const fs = require("fs");
const path = require("path");

const KNOWLEDGE_ROOT = path.resolve(__dirname, "..", "knowledge");
const UPDATES_DIR = path.join(KNOWLEDGE_ROOT, "_updates");

// ── Config ──────────────────────────────────────────────────────

const PLATFORMS = [
  {
    key: "onlyfans",
    url: "https://onlyfans.com/terms",
    file: "platforms/onlyfans/terms-of-service-2026.md",
    label: "OnlyFans",
  },
  {
    key: "fansly",
    url: "https://fansly.com/tos",
    file: "platforms/fansly/terms-of-service.md",
    label: "Fansly",
  },
  {
    key: "mym",
    url: "https://www.mym.fans/terms",
    file: "platforms/mym/terms-of-service.md",
    label: "MyM",
  },
];

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;

// ── State tracking ──────────────────────────────────────────────

const state = {
  cgu: { checked: 0, changed: 0, skipped: 0 },
  patterns: { scanned: 0, detected: 0, written: 0 },
  reddit: { scanned: 0, reports: 0 },
  errors: [],
};

// ── Utilities ───────────────────────────────────────────────────

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf-8");
}

function frontmatter(fields) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(fields)) {
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.map((s) => `"${s}"`).join(", ")}]`);
    } else if (typeof v === "string" && (v.includes(":") || v.includes("#") || v.includes("["))) {
      lines.push(`${k}: "${v}"`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push("---");
  return lines.join("\n");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function log(msg) {
  console.log(`  ${msg}`);
}

// ── Anthropic API helper ────────────────────────────────────────

async function callClaude(prompt, system = "You are a legal analyst specialized in creator economy contracts and platform terms of service.") {
  if (!ANTHROPIC_API_KEY) {
    state.errors.push("ANTHROPIC_API_KEY not set, skipping Claude call");
    return null;
  }
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        system,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await response.json();
    if (data.error) {
      state.errors.push(`Claude API error: ${data.error.message}`);
      return null;
    }
    return data.content?.[0]?.text || null;
  } catch (err) {
    state.errors.push(`Claude fetch error: ${err.message}`);
    return null;
  }
}

// ── Task 1: CGU Scraper ─────────────────────────────────────────

async function scrapeCGU(platform) {
  state.cgu.checked++;

  const existingFile = path.join(KNOWLEDGE_ROOT, platform.file);
  const existingContent = readFile(existingFile);

  log(`Fetching ${platform.url}...`);

  let html;
  try {
    const res = await fetch(platform.url, {
      headers: { "User-Agent": "HaloTalent-LegalBot/1.0 (research; bot@haloascend.com)" },
      signal: AbortSignal.timeout(15000),
    });
    html = await res.text();
  } catch (err) {
    state.errors.push(`Failed to fetch ${platform.key}: ${err.message}`);
    state.cgu.skipped++;
    return;
  }

  // Extract readable text from HTML
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const wordCount = text.split(/\s+/).length;

  if (!existingContent) {
    // First seed — write placeholder (full scrape via Claude in human-review mode)
    writeFile(
      existingFile,
      `${frontmatter({
        title: `${platform.label} Terms of Service`,
        type: "cgu_platform",
        platform: platform.key,
        jurisdiction: "international",
        last_updated: today(),
        source_url: platform.url,
        tags: [],
      })}\n\n<!-- Auto-detected ${today()}: ${wordCount} words fetched. Manual review needed for full extraction. -->\n\n${text.slice(0, 5000)}...\n`
    );
    log(`  ! New file created (${wordCount} words fetched, needs review)`);
    state.cgu.changed++;
    return;
  }

  // Compare length — crude "change > 5%" heuristic
  const existingWords = existingContent.split(/\s+/).length;
  const ratio = Math.abs(wordCount - existingWords) / Math.max(existingWords, 1);

  if (ratio < 0.05) {
    log(`  ~ No significant change (~${(ratio * 100).toFixed(1)}%)`);
    state.cgu.skipped++;
    return;
  }

  log(`  Δ Change detected (~${(ratio * 100).toFixed(1)}% difference) — asking Claude to analyze...`);

  const analysis = await callClaude(
    `I fetched the CGU page of ${platform.label} (${platform.url}). The previous version is in the knowledge base.\n\nHere is the NEW page content (truncated to 8000 chars):\n\n${text.slice(0, 8000)}\n\n---\n\nAnd here is the OLD file content:\n\n${existingContent.slice(0, 4000)}\n\nAnalyze the differences and produce an updated markdown knowledge file following this exact format:\n\n---\ntitle: "${platform.label} Terms of Service"\ntype: cgu_platform\nplatform: ${platform.key}\njurisdiction: international\nlast_updated: ${today()}\nsource_url: ${platform.url}\ntags: [relevant_tags]\nrelated:\n- [[related-article]]\n---\n\nThen write the content as structured markdown sections covering the key policy areas. Focus on: account ownership, content rights, AI/disclosure policies, payment terms, impersonation rules. Keep each section 3-6 bullet points with "Implications pour les agences" sub-sections where relevant. Output ONLY the markdown file content, nothing else.`
  );

  if (analysis) {
    writeFile(existingFile, analysis);
    log(`  ✓ Updated with Claude analysis`);
    state.cgu.changed++;
  } else {
    // Fallback: stamp the raw text as a placeholder
    const updated = existingContent.replace(
      /last_updated:.*/,
      `last_updated: ${today()}`
    );
    writeFile(existingFile, updated);
    log(`  ! No analysis from Claude, updated timestamp only`);
    state.cgu.changed++;
  }

  // Write to update log
  const logEntry = [
    `## ${today()} — ${platform.label} CGU`,
    ``,
    `**Source:** ${platform.url}`,
    `**Words fetched:** ${wordCount}`,
    `**Change ratio:** ${(ratio * 100).toFixed(1)}%`,
    analysis ? `**Analysis:** Updated via Claude` : `**Analysis:** Timestamp bump only`,
    ``,
    analysis
      ? `Extrait des changements détectés (analyse automatique) :\n> Les CGU de ${platform.label} ont été modifiées. Le fichier knowledge a été mis à jour.`
      : "Changement détecté mais analyse IA non disponible.",
    ``,
    `---`,
  ].join("\n");

  const logFile = path.join(UPDATES_DIR, `${today()}.md`);
  const existingLog = readFile(logFile) || "";
  writeFile(logFile, logEntry + "\n" + existingLog);
}

// ── Task 2: Pattern detection ───────────────────────────────────

async function detectPatterns() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    log("  ~ Supabase not configured, skipping pattern detection");
    return;
  }

  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  log("Fetching recent analyses...");

  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const { data: analyses, error } = await supabase
    .from("contract_analyses")
    .select("other_clause_text, platform, created_at")
    .not("other_clause_text", "is", null)
    .gte("created_at", sevenDaysAgo);

  if (error) {
    state.errors.push(`Supabase query error: ${error.message}`);
    return;
  }

  if (!analyses || analyses.length === 0) {
    log("  ~ No recent analyses with other_clause_text");
    return;
  }

  state.patterns.scanned = analyses.length;

  // Group by normalised text
  const groups = {};
  for (const a of analyses) {
    const t = (a.other_clause_text || "").trim();
    if (t.length < 10) continue;
    const key = t.toLowerCase().slice(0, 100);
    if (!groups[key]) groups[key] = { text: t, count: 0, platforms: new Set(), examples: [] };
    groups[key].count++;
    groups[key].platforms.add(a.platform);
    if (groups[key].examples.length < 3) groups[key].examples.push(t);
  }

  // Filter: appears > 3 times
  const frequent = Object.values(groups).filter((g) => g.count > 3);
  if (frequent.length === 0) {
    log("  ~ No frequent patterns detected");
    return;
  }

  state.patterns.detected = frequent.length;
  log(`  ! ${frequent.length} frequent pattern(s) detected`);

  // Load existing clauses to avoid duplicates
  const { data: existingClauses } = await supabase
    .from("abusive_clauses")
    .select("id, label, description");

  const existingLabels = (existingClauses || []).map((c) => c.label.toLowerCase());

  // Check each pattern — does it match any existing clause?
  let newClauses = [];
  for (const pattern of frequent) {
    const matchesExisting = existingLabels.some((label) => {
      const words = pattern.text.toLowerCase().split(/\s+/);
      const matchCount = words.filter((w) => label.includes(w)).length;
      return matchCount / words.length > 0.4;
    });

    if (matchesExisting) continue;

    newClauses.push(pattern);
  }

  if (newClauses.length === 0) {
    log("  ~ All patterns match existing clauses");
    return;
  }

  state.patterns.written = newClauses.length;
  log(`  ✦ ${newClauses.length} new clause candidate(s) — generating clause cards...`);

  // Build a markdown entry
  const autoClausesFile = path.join(KNOWLEDGE_ROOT, "contracts", "clauses-detectees-auto.md");
  let autoContent = readFile(autoClausesFile) || "";
  if (!autoContent) {
    autoContent = `${frontmatter({
      title: "Clauses détectées automatiquement — Analyses utilisateurs",
      type: "clause_catalogue",
      tags: ["auto_detected", "user_reports"],
    })}\n\n# Clauses détectées automatiquement\n\nCes clauses ont été identifiées par analyse des signalements utilisateurs dans l'outil Bouclier Légal.\n\n`;
  }

  for (const cc of newClauses) {
    autoContent += `## ${cc.text} (severity: auto)\n\n`;
    autoContent += `**Détecté ${cc.count} fois** sur ${[...cc.platforms].join(", ")}\n\n`;
    autoContent += `*Clause candidate — en attente de validation*\n\n`;
    autoContent += `**Exemples :**\n`;
    for (const ex of cc.examples) {
      autoContent += `- "${ex}"\n`;
    }
    autoContent += `\n---\n\n`;

    // Also add a notification to legal_updates_log
    await supabase.from("legal_updates_log").insert({
      action: "clause_added",
      source: "legal_scanner_auto",
      details: {
        text: cc.text,
        count: cc.count,
        platforms: [...cc.platforms],
        note: "Clause candidate détectée automatiquement via analyse des signalements utilisateurs",
      },
      items_affected: cc.count,
      reviewed_by_admin: false,
    });
  }

  writeFile(autoClausesFile, autoContent);
  log(`  ✓ Appended to contracts/clauses-detectees-auto.md`);
}

// ── Task 3: Reddit monitoring ────────────────────────────────────

async function scanReddit() {
  const hasRedditAuth = REDDIT_CLIENT_ID && REDDIT_CLIENT_SECRET;

  const subreddits = ["onlyfansadvice", "CreatorsAdvice"];
  const keywords = ["contract", "agency", "scam", "commission", "exclusivity"];

  const reports = [];
  const visited = new Set();

  for (const subreddit of subreddits) {
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=25`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "HaloTalent-LegalBot/1.0 (research)" },
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      const posts = data?.data?.children || [];

      for (const post of posts) {
        const p = post.data;
        const title = (p.title || "").toLowerCase();
        const selftext = (p.selftext || "").toLowerCase();
        const combined = title + " " + selftext;

        const matched = keywords.filter((k) => combined.includes(k));
        if (matched.length === 0) continue;
        if (visited.has(p.id)) continue;
        visited.add(p.id);

        reports.push({
          subreddit,
          title: p.title,
          url: `https://reddit.com${p.permalink}`,
          score: p.score,
          keywords: matched,
          created: new Date(p.created_utc * 1000).toISOString().slice(0, 10),
        });
      }
    } catch (err) {
      state.errors.push(`Reddit fetch ${subreddit}: ${err.message}`);
    }
  }

  if (reports.length === 0) {
    log("  ~ No relevant Reddit posts found today");
    return;
  }

  state.reddit.scanned = reports.length;
  log(`  ! ${reports.length} relevant Reddit post(s) found`);

  // Write community report
  const reportFile = path.join(KNOWLEDGE_ROOT, "industry", "community-reports.md");
  let reportContent = readFile(reportFile) || "";

  if (!reportContent) {
    reportContent = `${frontmatter({
      title: "Community Reports — Veille Reddit & Forums",
      type: "industry_report",
      tags: ["community", "reddit", "trending_issues"],
    })}\n\n# Community Reports\n\nSignalements récurrents collectés depuis Reddit et forums créateurs.\n\n`;
  }

  reportContent += `\n## ${today()}\n\n`;
  for (const r of reports) {
    reportContent += `- [${r.title}](${r.url}) — r/${r.subreddit} (${r.score} votes, ${r.created})\n`;
    reportContent += `  *Mots-clés : ${r.keywords.join(", ")}*\n\n`;
  }

  writeFile(reportFile, reportContent);
  state.reddit.reports = reports.length;
  log(`  ✓ Appended to industry/community-reports.md`);
}

// ── Main ────────────────────────────────────────────────────────

async function main() {
  console.log("");
  console.log("── Legal Scanner ────────────────────────────────────");
  console.log("");

  ensureDir(UPDATES_DIR);

  // Task 1
  console.log("Task 1 — CGU Scraper");
  console.log("");
  for (const platform of PLATFORMS) {
    await scrapeCGU(platform);
  }
  console.log("");

  // Task 2
  console.log("Task 2 — Pattern detection");
  console.log("");
  await detectPatterns();
  console.log("");

  // Task 3
  console.log("Task 3 — Reddit/forum monitoring");
  console.log("");
  await scanReddit();
  console.log("");

  // Summary
  console.log("── Summary ──────────────────────────────────────────");
  console.log("");
  console.log(`  CGU checked:     ${state.cgu.checked}`);
  console.log(`  CGU changed:     ${state.cgu.changed}`);
  console.log(`  CGU skipped:     ${state.cgu.skipped}`);
  console.log(`  Patterns scanned: ${state.patterns.scanned}`);
  console.log(`  Patterns detected: ${state.patterns.detected}`);
  console.log(`  Patterns written:  ${state.patterns.written}`);
  console.log(`  Reddit posts:    ${state.reddit.scanned}`);
  console.log(`  Reports written: ${state.reddit.reports}`);
  if (state.errors.length > 0) {
    console.log(`  Errors:          ${state.errors.length}`);
    for (const e of state.errors) console.log(`    ✗ ${e}`);
  }
  console.log("");
  console.log("────────────────────────────────────────────────────");
  console.log("");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
