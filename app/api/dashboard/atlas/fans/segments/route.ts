import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: segments } = await supabase
      .from("atlas_segments")
      .select("id, name, description, filters, estimated_count")
      .eq("creator_id", user.id)
      .order("name");

    return NextResponse.json({ segments: segments ?? [] });
  } catch (err) {
    console.error("[SEGMENTS LIST] Error:", err);
    return NextResponse.json({ segments: [] });
  }
}
