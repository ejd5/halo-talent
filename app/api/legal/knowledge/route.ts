import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const platform = searchParams.get("platform");
    const jurisdiction = searchParams.get("jurisdiction");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let query = supabase
      .from("legal_knowledge")
      .select("*")
      .eq("is_active", true)
      .order("severity_score", { ascending: false });

    if (platform) {
      query = query.or(`platform.eq.${platform},platform.is.null`);
    }
    if (jurisdiction) {
      query = query.eq("jurisdiction", jurisdiction);
    }
    if (category) {
      query = query.eq("category", category);
    }
    if (search) {
      query = query.or(
        `title.ilike.%${search}%,summary.ilike.%${search}%,content.ilike.%${search}%`
      );
    }

    const { data: entries, error } = await query.limit(50);

    if (error) throw error;

    return NextResponse.json({ entries: entries || [] });
  } catch (error) {
    console.error("Legal knowledge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
