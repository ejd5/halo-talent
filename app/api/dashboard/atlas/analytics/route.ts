import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: snapshots } = await supabase
      .from("atlas_snapshots")
      .select("*")
      .eq("creator_id", user.id)
      .order("snapshot_date", { ascending: false })
      .limit(30);

    return NextResponse.json({ snapshots: snapshots ?? [] });
  } catch (err) {
    console.error("[ATLAS ANALYTICS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
