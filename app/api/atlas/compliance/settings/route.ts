import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data } = await supabase
      .from("atlas_compliance_settings")
      .select("*")
      .eq("creator_id", user.id)
      .maybeSingle();

    return NextResponse.json(data ?? {});
  } catch (err) {
    console.error("[COMPLIANCE SETTINGS GET] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();

    const { data, error } = await supabase
      .from("atlas_compliance_settings")
      .upsert({ creator_id: user.id, ...body, updated_at: new Date().toISOString() })
      .select()
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("[COMPLIANCE SETTINGS PUT] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
