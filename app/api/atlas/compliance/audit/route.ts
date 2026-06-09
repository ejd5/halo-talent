import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const eventType = req.nextUrl.searchParams.get("event_type");
    const entityType = req.nextUrl.searchParams.get("entity_type");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") ?? "100");

    let query = supabase
      .from("atlas_compliance_audit")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(Math.min(limit, 500));

    if (eventType) query = query.eq("event_type", eventType);
    if (entityType) query = query.eq("entity_type", entityType);

    const { data: logs } = await query;

    return NextResponse.json({ logs: logs ?? [] });
  } catch (err) {
    console.error("[COMPLIANCE AUDIT] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
