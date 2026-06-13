import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/dashboard/atlas/rules/process-queue
// Called by CRON or manually to process queued rules
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check, either CRON secret or authenticated user
    const authHeader = request.headers.get("authorization");
    const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isCron) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("atlas_process_rule_queue", {
      p_limit: 10,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const result = data?.[0] ?? { processed: 0, errors: 0 };
    return NextResponse.json(result);
  } catch (err) {
    console.error("[ATLAS RULES QUEUE PROCESS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
