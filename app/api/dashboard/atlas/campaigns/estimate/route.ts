import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { estimateSegmentCount } from "@/lib/atlas/channels/email";
import type { SegmentFilter } from "@/lib/atlas/crm/segments";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { segmentId, filters: customFilters } = await request.json();

    let filters: SegmentFilter[] = [];

    // Load segment filters if specified
    if (segmentId) {
      const { data: segment } = await supabase
        .from("atlas_segments")
        .select("filters")
        .eq("id", segmentId)
        .eq("creator_id", user.id)
        .single();

      if (segment?.filters) {
        filters = Array.isArray(segment.filters)
          ? (segment.filters as SegmentFilter[])
          : [];
      }
    }

    const count = await estimateSegmentCount(user.id, filters, customFilters || {});
    return NextResponse.json({ estimated_count: count });
  } catch (err) {
    console.error("[ESTIMATE] Error:", err);
    return NextResponse.json({ estimated_count: 0 });
  }
}
