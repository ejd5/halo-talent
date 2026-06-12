// ─── Halo Lex — Ingestion CLI ──────────────────────────────────
// Lance le pipeline d'ingestion depuis la base de connaissances
// Usage: bun run scripts/ingest-legal-knowledge.ts
//        bun run scripts/ingest-legal-knowledge.ts --status

import { runIngestion, getSourceStatuses } from "../lib/halo-lex/ingestion/scheduler";

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--status")) {
    console.log("");
    console.log("── Statut des sources ──────────────────────────────");
    console.log("");

    const statuses = await getSourceStatuses();

    if (statuses.length === 0) {
      console.log("  Aucune source trouvée.");
      console.log("");
      process.exit(0);
    }

    for (const s of statuses) {
      const icon =
        s.status === "done" ? "✅" : s.status === "error" ? "❌" : "⏳";
      const lastIngested = s.lastIngestedAt
        ? new Date(s.lastIngestedAt).toLocaleDateString("fr-FR")
        : "jamais";
      console.log(
        `  ${icon} ${s.sourceName} (${s.sourceType})`
      );
      console.log(`     Documents: ${s.documentCount} | Chunks: ${s.chunkCount} | Dernière ingestion: ${lastIngested}`);
      console.log("");
    }

    const totals = {
      sources: statuses.length,
      documents: statuses.reduce((s, src) => s + src.documentCount, 0),
      chunks: statuses.reduce((s, src) => s + src.chunkCount, 0),
    };

    console.log(`  Total: ${totals.sources} sources, ${totals.documents} documents, ${totals.chunks} chunks`);
    console.log("");
    process.exit(0);
  }

  // Run ingestion
  console.log("");
  console.log("── Halo Lex — Ingestion de la base juridique ─────────");
  console.log("");

  const result = await runIngestion();

  console.log("");
  console.log("── Résumé ──────────────────────────────────────────");
  console.log("");
  console.log(`  Documents traités : ${result.stats.length}`);
  console.log(`  Chunks créés      : ${result.stats.reduce((s, r) => s + r.chunksCreated, 0)}`);
  console.log(`  Erreurs           : ${result.stats.reduce((s, r) => s + r.errors.length, 0)}`);
  console.log(`  Durée totale      : ${Math.round(result.durationMs / 1000)}s`);
  console.log("");

  const errors = result.stats.flatMap((r) => r.errors);
  if (errors.length > 0) {
    console.log("  Détail des erreurs :");
    for (const err of errors) {
      console.log(`    ❌ ${err}`);
    }
    console.log("");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
