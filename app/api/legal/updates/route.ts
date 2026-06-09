import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: updates, error } = await supabase
      .from("legal_updates_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;

    return NextResponse.json({ updates: updates || [] });
  } catch (error) {
    console.error("Legal updates GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { clause_label, clause_description, platform } = body;

    if (!clause_label) {
      return NextResponse.json({ error: "clause_label is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("legal_updates_log")
      .insert({
        action: "clause_added",
        source: `user:${user.id}`,
        details: {
          clause_label,
          clause_description: clause_description || null,
          platform: platform || null,
          suggested_by: user.id,
        },
        items_affected: 0,
        reviewed_by_admin: false,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, success: true });
  } catch (error) {
    console.error("Legal updates POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
