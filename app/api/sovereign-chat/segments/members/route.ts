import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SmartSegmentEngine } from "@/lib/sovereign-chat/segments/engine";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const segmentId = searchParams.get("segment_id");
  if (!segmentId) return NextResponse.json({ error: "segment_id requis" }, { status: 400 });

  // Verify ownership
  const { data: segment } = await supabase
    .from("atlas_segments")
    .select("id, creator_id")
    .eq("id", segmentId)
    .eq("creator_id", user.id)
    .single();
  if (!segment) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

  // Get members with fan details
  const { data: memberships } = await supabase
    .from("atlas_segment_memberships")
    .select("fan_id, added_at")
    .eq("segment_id", segmentId);

  const fanIds = (memberships || []).map((m) => m.fan_id);

  if (fanIds.length === 0) {
    return NextResponse.json({ members: [], total: 0 });
  }

  const { data: fans } = await supabase
    .from("atlas_fans")
    .select("*")
    .in("id", fanIds);

  return NextResponse.json({ members: fans || [], total: fans?.length || 0 });
}
