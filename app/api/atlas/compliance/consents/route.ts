import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const type = req.nextUrl.searchParams.get("type");
    const search = req.nextUrl.searchParams.get("search");

    let query = supabase
      .from("atlas_consent_registry")
      .select("*, fan:fan_id(id, display_name, email, phone, fan_tier)")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false })
      .limit(200);

    if (type) query = query.eq("consent_type", type);
    if (search) query = query.or(`fan.display_name.ilike.%${search}%,fan.email.ilike.%${search}%`);

    const { data: consents } = await query;

    return NextResponse.json({ consents: consents ?? [] });
  } catch (err) {
    console.error("[COMPLIANCE CONSENTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
