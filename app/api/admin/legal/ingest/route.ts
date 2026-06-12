import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { runIngestion, getSourceStatuses } from "@/lib/halo-lex/ingestion/scheduler";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/legal/ingest
 * Retourne le statut de l'ingestion pour chaque source.
 */
export async function GET() {
  try {
    const supabase = await createAdminClient();

    // Vérifier que l'utilisateur est admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const statuses = await getSourceStatuses();

    const totals = {
      totalSources: statuses.length,
      totalDocuments: statuses.reduce((s, src) => s + src.documentCount, 0),
      totalChunks: statuses.reduce((s, src) => s + src.chunkCount, 0),
      doneCount: statuses.filter((s) => s.status === "done").length,
      pendingCount: statuses.filter((s) => s.status === "pending").length,
    };

    return NextResponse.json({ sources: statuses, totals });
  } catch (error) {
    console.error("Admin ingestion GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/admin/legal/ingest
 * Déclenche le pipeline d'ingestion.
 */
export async function POST() {
  try {
    const supabase = await createAdminClient();

    // Vérifier que l'utilisateur est admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const result = await runIngestion();

    return NextResponse.json({
      success: true,
      sourcesProcessed: result.stats.length,
      chunksCreated: result.stats.reduce((s, r) => s + r.chunksCreated, 0),
      durationMs: result.durationMs,
      errors: result.stats.flatMap((r) => r.errors),
    });
  } catch (error) {
    console.error("Admin ingestion POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
