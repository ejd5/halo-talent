import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SmartSegmentEngine } from "@/lib/sovereign-chat/segments/engine";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { segment_id } = body;
  if (!segment_id) return NextResponse.json({ error: "segment_id requis" }, { status: 400 });

  // Verify ownership
  const { data: segment } = await supabase
    .from("atlas_segments")
    .select("id, creator_id")
    .eq("id", segment_id)
    .eq("creator_id", user.id)
    .single();
  if (!segment) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  const engine = new SmartSegmentEngine();
  const result = await engine.recalculate(segment_id);

  return NextResponse.json(result);
}
