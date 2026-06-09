import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;

    const { data: rule } = await supabase
      .from("atlas_rules")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .maybeSingle();

    if (!rule) return NextResponse.json({ error: "Règle introuvable" }, { status: 404 });

    // Get recent executions
    const { data: executions } = await supabase
      .from("atlas_rule_executions")
      .select("*")
      .eq("rule_id", id)
      .order("executed_at", { ascending: false })
      .limit(20);

    return NextResponse.json({ rule, executions: executions ?? [] });
  } catch (err) {
    console.error("[ATLAS RULE GET] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await params;

    const { error } = await supabase
      .from("atlas_rules")
      .delete()
      .eq("id", id)
      .eq("creator_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ATLAS RULE DELETE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
