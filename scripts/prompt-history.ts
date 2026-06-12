// ─── Prompt History Store ────────────────────────────────────────
// Stocke les hash de prompts pour détecter les doublons entre sessions.
// Usage: npx tsx scripts/prompt-history.ts check <prompt>
//        npx tsx scripts/prompt-history.ts record <prompt> [status]
//        npx tsx scripts/prompt-history.ts search <keyword>
//        npx tsx scripts/prompt-history.ts stats

import fs from "fs";
import path from "path";
import crypto from "crypto";

const STORAGE_DIR = path.resolve(import.meta.dirname, "..", ".claude", "prompt-history");
const STORAGE_FILE = path.join(STORAGE_DIR, "prompts.json");

interface PromptEntry {
  hash: string;
  prefix: string;        // First 120 chars of the prompt
  timestamp: string;     // ISO date
  session: string;       // Session identifier (date-based)
  status: string;        // "processed", "skipped", "partial"
}

function loadEntries(): PromptEntry[] {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      return JSON.parse(fs.readFileSync(STORAGE_FILE, "utf-8"));
    }
  } catch {}
  return [];
}

function saveEntries(entries: PromptEntry[]): void {
  if (!fs.existsSync(STORAGE_DIR)) {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  }
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(entries, null, 2));
}

function hashPrompt(prompt: string): string {
  return crypto.createHash("sha256").update(prompt, "utf-8").digest("hex");
}

function todaySession(): string {
  return new Date().toISOString().slice(0, 10);
}

// ─── Commands ────────────────────────────────────────────────────

function cmdCheck(prompt: string): void {
  const hash = hashPrompt(prompt);
  const entries = loadEntries();
  const matches = entries.filter((e) => e.hash === hash).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (matches.length === 0) {
    console.log("✅ Nouveau prompt — aucun doublon trouvé.");
    process.exit(0);
  }

  const first = matches[0];
  const count = matches.length;
  const ago = timeAgo(new Date(first.timestamp));
  const sameSession = first.session === todaySession();

  console.log(`⚠️  Doublon détecté ! (${count} occurrence(s) au total)`);
  console.log(`   Dernière fois : ${ago}${sameSession ? " (dans cette session)" : ""}`);
  console.log(`   Extrait : "${first.prefix}..."`);
  process.exit(1);
}

function cmdRecord(prompt: string, status = "processed"): void {
  const hash = hashPrompt(prompt);
  const entries = loadEntries();

  entries.push({
    hash,
    prefix: prompt.replace(/\s+/g, " ").slice(0, 120),
    timestamp: new Date().toISOString(),
    session: todaySession(),
    status,
  });

  saveEntries(entries);
  console.log(`💾 Prompt enregistré (${entries.length} entrées au total).`);
}

function cmdSearch(keyword: string): void {
  const entries = loadEntries();
  const lower = keyword.toLowerCase();
  const matches = entries.filter(
    (e) => e.prefix.toLowerCase().includes(lower) || e.hash.includes(lower)
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (matches.length === 0) {
    console.log("Aucune correspondance trouvée.");
    return;
  }

  console.log(`\n${matches.length} correspondance(s) :\n`);
  for (const m of matches.slice(0, 10)) {
    console.log(`  [${m.timestamp.slice(0, 16)}] ${m.status}`);
    console.log(`  → ${m.prefix.slice(0, 80)}...`);
    console.log();
  }
  if (matches.length > 10) {
    console.log(`  ... et ${matches.length - 10} autre(s).`);
  }
}

function cmdStats(): void {
  const entries = loadEntries();
  if (entries.length === 0) {
    console.log("Aucun prompt enregistré.");
    return;
  }

  const sessions = new Set(entries.map((e) => e.session));
  const today = todaySession();
  const todayCount = entries.filter((e) => e.session === today).length;

  // Find duplicates
  const hashCounts = new Map<string, number>();
  for (const e of entries) {
    hashCounts.set(e.hash, (hashCounts.get(e.hash) || 0) + 1);
  }
  const duplicates = [...hashCounts.entries()].filter(([, c]) => c > 1);

  console.log(`\n📊 Statistiques des prompts :`);
  console.log(`   Total enregistrés : ${entries.length}`);
  console.log(`   Sessions : ${sessions.size}`);
  console.log(`   Aujourd'hui : ${todayCount}`);
  console.log(`   Doublons : ${duplicates.length} prompts uniques réutilisés`);
  if (duplicates.length > 0) {
    console.log();
    for (const [hash, count] of duplicates.slice(0, 5)) {
      const example = entries.find((e) => e.hash === hash);
      console.log(`   ×${count} — ${example?.prefix.slice(0, 60)}...`);
    }
  }
}

// ─── CLI ─────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "check":
    cmdCheck(args.slice(1).join(" "));
    break;
  case "record":
    cmdRecord(args.slice(1).join(" "), "processed");
    break;
  case "search":
    cmdSearch(args[1] || "");
    break;
  case "stats":
    cmdStats();
    break;
  default:
    console.log(`Usage:
  npx tsx scripts/prompt-history.ts check <prompt>    — Vérifie si un prompt a déjà été vu
  npx tsx scripts/prompt-history.ts record <prompt>   — Enregistre un nouveau prompt
  npx tsx scripts/prompt-history.ts search <keyword>  — Cherche dans l'historique
  npx tsx scripts/prompt-history.ts stats             — Statistiques`);
    process.exit(1);
}

// ─── Helpers ────────────────────────────────────────────────────

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "à l'instant";
  if (mins < 60) return `il y a ${mins} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.round(hours / 24);
  return `il y a ${days}j`;
}
