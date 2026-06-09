import { createClient } from "@supabase/supabase-js";
import { globSync } from "glob";
import matter from "gray-matter";
import { readFileSync } from "fs";
import { resolve, relative, basename, dirname } from "path";

const KNOWLEDGE_ROOT = resolve(import.meta.dirname ?? __dirname, "..", "knowledge");

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Map frontmatter type → legal_knowledge.category
const TYPE_CATEGORY: Record<string, string> = {
  cgu_platform: "cgu",
  law: "loi",
  jurisprudence: "jurisprudence",
  guide: "pratique",
  industry_report: "pratique",
  contract_template: "pratique",
};

// Legal knowledge stats
let knowledgeProcessed = 0;
let knowledgeNew = 0;
let knowledgeUpdated = 0;
let knowledgeUnchanged = 0;
let knowledgeSkipped = 0;

// Clause stats
let clausesProcessed = 0;
let clausesNew = 0;
let clausesUpdated = 0;
let clausesUnchanged = 0;

// ------ helpers ------

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 120);
}

function parseSeverity(text: string): number {
  const m = text.match(/severity:\s*(\d+)\s*\/?\s*(\d*)/i);
  if (m) {
    const val = parseInt(m[1]);
    const max = m[2] ? parseInt(m[2]) : 5;
    return Math.round((val / max) * 5);
  }
  return 3;
}

// ------ legal_knowledge sync ------

async function syncLegalKnowledge(filePath: string) {
  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  if (!data.title || data.type === "index" || data.type === "clause_catalogue") {
    knowledgeSkipped++;
    return;
  }

  const category = TYPE_CATEGORY[data.type] || data.type;
  const platform = data.platform ?? null;
  const jurisdiction = data.jurisdiction ?? "international";
  const tags: string[] = data.tags ?? [];
  const sourceUrl = data.source_url ?? null;
  const sourceName = sourceUrl ? new URL(sourceUrl).hostname.replace("www.", "") : null;
  const severityScore = data.severity ?? 3;
  const summary = content.split("\n").slice(0, 3).join(" ").replace(/#{1,6}\s/g, "").trim().slice(0, 300) || null;
  const related = Array.isArray(data.related)
    ? data.related.flat(2).filter(Boolean).map((r: string) => r.replace(/^\[\[|\]\]$/g, ""))
    : [];

  // Determine match key
  const title = data.title;
  const matchKey = `${title}||${platform ?? ""}`;

  // Check existing
  const { data: existing } = await supabase
    .from("legal_knowledge")
    .select("id, title, content, updated_at")
    .eq("title", title)
    .eq("platform", platform)
    .maybeSingle();

  if (existing) {
    // Compare content to decide if update is needed
    const existingBody = existing.content?.trim() ?? "";
    const newBody = content.trim();
    if (existingBody === newBody) {
      knowledgeUnchanged++;
    } else {
      const { error } = await supabase
        .from("legal_knowledge")
        .update({
          content,
          summary,
          source_url: sourceUrl,
          source_name: sourceName,
          severity_score: severityScore,
          tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
      if (error) {
        console.error(`  [ERR] update ${title}:`, error.message);
      } else {
        knowledgeUpdated++;
      }
    }
  } else {
    const { error } = await supabase.from("legal_knowledge").insert({
      category,
      platform,
      jurisdiction,
      title,
      content,
      summary,
      source_url: sourceUrl,
      source_name: sourceName,
      severity_score: severityScore,
      tags,
      auto_generated: false,
    });
    if (error) {
      console.error(`  [ERR] insert ${title}:`, error.message);
    } else {
      knowledgeNew++;
    }
  }

  knowledgeProcessed++;
}

// ------ abusive_clauses sync (from clauses-abusives-catalogue.md) ------

async function syncAbusiveClauses(filePath: string) {
  const raw = readFileSync(filePath, "utf-8");
  const { content } = matter(raw);

  // Parse sections: ## N. Title (severity: X/5)
  const sectionRegex = /^##\s+(\d+)\.\s+(.+?)\s*\(severity:\s*(\d+)\s*\/?\s*(\d*)\)\s*$/gm;
  const sections: { num: number; title: string; severity: number; body: string; start: number; end: number }[] = [];

  let match: RegExpExecArray | null;
  while ((match = sectionRegex.exec(content)) !== null) {
    const num = parseInt(match[1]);
    const title = match[2].trim();
    const sev = parseInt(match[3]);
    const max = match[4] ? parseInt(match[4]) : 5;
    sections.push({
      num,
      title,
      severity: Math.round((sev / max) * 5),
      body: "",
      start: match.index,
      end: content.length,
    });
  }

  // Assign body text for each section (up to next section)
  for (let i = 0; i < sections.length; i++) {
    const endIdx = i + 1 < sections.length ? sections[i + 1].start : content.length;
    sections[i].body = content.slice(sections[i].start + content.slice(sections[i].start).indexOf("\n") + 1, endIdx).trim();
  }

  for (const section of sections) {
    const body = section.body;

    // Determine ID
    const id = `clause_${slugify(section.title)}`;

    // Determine category from content keywords
    const lower = body.toLowerCase();
    let category = "autres";
    if (lower.includes("email") || lower.includes("mot de passe") || lower.includes("compte")) category = "droits_image"; // account control
    else if (lower.includes("exclusivité") || lower.includes("exclusivité totale")) category = "exclusivité";
    else if (lower.includes("commission") || lower.includes("revenu") || lower.includes("pourcentage")) category = "rémunération";
    else if (lower.includes("propriété") || lower.includes("contenu") || lower.includes("comptes")) category = "propriété_intellectuelle";
    else if (lower.includes("renouvellement") || lower.includes("tacite")) category = "résiliation";
    else if (lower.includes("pénalité") || lower.includes("sortie") || lower.includes("rupture")) category = "résiliation";
    else if (lower.includes("non-concurrence") || lower.includes("concurrence")) category = "résiliation";
    else if (lower.includes("transparence") || lower.includes("financière")) category = "rémunération";
    else if (lower.includes("ghosting") || lower.includes("cesser")) category = "modification_unilatérale";
    else if (lower.includes("cession") || lower.includes("unilatérale")) category = "modification_unilatérale";

    // Extract references: lines starting with - or **Référence**
    const cguRefs: string[] = [];
    const lawRefs: string[] = [];
    const refSection = body.match(/(?:\*\*R[ée]f[ée]rences?\s*:\*\*|R[ée]f[ée]rences?\s*:)\s*([\s\S]*?)(?=\n##|\n\*\*|$)/i);
    if (refSection) {
      const refLines = refSection[1].split("\n").filter((l) => l.trim().startsWith("-"));
      for (const line of refLines) {
        const text = line.replace(/^-\s*/, "").trim();
        if (/(ToS|CGU|Terms|Policy|Guidelines|plateforme)/i.test(text)) {
          cguRefs.push(text);
        } else {
          lawRefs.push(text);
        }
      }
    }

    // Also search body for inline refs
    const inlineRefs = body.matchAll(/(?:R[ée]f[ée]rence\s*:?\s*|R[ée]f[ée]rences?\s*:?\s*)?(?:(Art\.?\s*[\d-]+[\s\w]*|L\.\s*[\d-]+[\s\w]*|Code\s+\w+(?:\s+\w+)*))/gi);
    for (const ir of inlineRefs) {
      const text = ir[0].trim();
      if (text && !lawRefs.includes(text)) {
        lawRefs.push(text);
      }
    }

    const label = section.title;
    // Build description: first sentence or the "La clause" line
    const clauseLine = body.match(/\*\*La clause\s*:\*\*\s*(.+?)(?:\n|$)/);
    const whyLine = body.match(/\*\*Pourquoi.*:\*\*/);
    let description = clauseLine ? clauseLine[1].trim() : "";
    if (description.length > 200) description = description.slice(0, 200) + "…";
    if (!description) description = label;

    // Build legal_argument: "Pourquoi" text + references + "Comment s'en libérer"
    const whyMatch = body.match(/\*\*Pourquoi c'est abusif\s*:\*\*([\s\S]*?)(?=\*\*R[ée]f[ée]rences?\s*:|\*\*Comment|\*\*S[oô]lution|\*\*D[ée]s[ée]quilibre|##|$)/i);
    const howMatch = body.match(/\*\*Comment s'en lib[ée]rer\s*:\*\*([\s\S]*?)(?=##|$)/i);
    const solutionMatch = body.match(/\*\*S[oô]lution\s*:\*\*(.+?)(?=\n##|\n\*\*|$)/i);
    const desequilibreMatch = body.match(/\*\*D[ée]s[ée]quilibre\s*:\*\*(.+?)(?=\n##|\n\*\*|$)/i);

    let legalArg = whyMatch ? whyMatch[1].trim() : "";
    if (solutionMatch) legalArg += `\n\nSolution: ${solutionMatch[1].trim()}`;
    if (desequilibreMatch) legalArg += `\n\nDéséquilibre: ${desequilibreMatch[1].trim()}`;
    if (howMatch) legalArg += `\n\nComment s'en libérer:\n${howMatch[1].trim()}`;
    if (!legalArg) legalArg = body;

    // Check existing
    const { data: existing } = await supabase
      .from("abusive_clauses")
      .select("id, label, legal_argument")
      .eq("id", id)
      .maybeSingle();

    if (existing) {
      if (existing.legal_argument?.trim() === legalArg.trim()) {
        clausesUnchanged++;
      } else {
        const { error } = await supabase
          .from("abusive_clauses")
          .update({
            label,
            description,
            category,
            severity: section.severity,
            legal_argument: legalArg,
            cgu_references: cguRefs,
            law_references: lawRefs,
            sort_order: section.num,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id);
        if (error) {
          console.error(`  [ERR] update clause ${id}:`, error.message);
        } else {
          clausesUpdated++;
        }
      }
    } else {
      const { error } = await supabase
        .from("abusive_clauses")
        .insert({
          id,
          label,
          description,
          category,
          icon: null,
          legal_argument: legalArg,
          severity: section.severity,
          cgu_references: cguRefs,
          law_references: lawRefs,
          sort_order: section.num,
          is_active: true,
        });
      if (error) {
        console.error(`  [ERR] insert clause ${id}:`, error.message);
      } else {
        clausesNew++;
      }
    }

    clausesProcessed++;
  }
}

// ------ main ------

async function main() {
  console.log("");
  console.log("── Knowledge → Supabase ──────────────────────────────");
  console.log("");

  // Sync legal_knowledge
  const files = globSync("**/*.md", { cwd: KNOWLEDGE_ROOT })
    .filter((f) => !f.endsWith("README.md"))
    .map((f) => resolve(KNOWLEDGE_ROOT, f));

  console.log(`Found ${files.length} files in /knowledge`);
  console.log("");

  for (const filePath of files) {
    const rel = relative(KNOWLEDGE_ROOT, filePath);
    const raw = readFileSync(filePath, "utf-8");

    // Quick check — skip empty or no-frontmatter files
    if (!raw.startsWith("---")) {
      knowledgeSkipped++;
      continue;
    }

    const { data } = matter(raw);

    if (data.type === "clause_catalogue") {
      console.log(`  📄 ${rel} → abusive_clauses`);
      await syncAbusiveClauses(filePath);
    } else if (data.type !== "index") {
      console.log(`  📄 ${rel} → legal_knowledge`);
      await syncLegalKnowledge(filePath);
    } else {
      knowledgeSkipped++;
    }
  }

  // Report
  console.log("");
  console.log("── Sync complete ──────────────────────────────────────");
  console.log("");
  console.log(`  legal_knowledge:`);
  console.log(`    processed:   ${knowledgeProcessed}`);
  console.log(`    new:         ${knowledgeNew}`);
  console.log(`    updated:     ${knowledgeUpdated}`);
  console.log(`    unchanged:   ${knowledgeUnchanged}`);
  console.log(`    skipped:     ${knowledgeSkipped}`);
  console.log("");
  console.log(`  abusive_clauses:`);
  console.log(`    processed:   ${clausesProcessed}`);
  console.log(`    new:         ${clausesNew}`);
  console.log(`    updated:     ${clausesUpdated}`);
  console.log(`    unchanged:   ${clausesUnchanged}`);
  console.log("");
  console.log(`  Total: ${knowledgeProcessed + clausesProcessed} entries`);
  console.log("──────────────────────────────────────────────────────");
  console.log("");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
