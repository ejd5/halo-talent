import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("legal_updates_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    return NextResponse.json({ updates: data || [] });
  } catch (error) {
    console.error("Admin legal updates GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const body = await request.json();
    const { action, id } = body;

    // Approve an update
    if (action === "approve" && id) {
      const { error } = await supabase
        .from("legal_updates_log")
        .update({ reviewed_by_admin: true })
        .eq("id", id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Manual scan trigger (records a scan event)
    if (action === "scan") {
      const { data, error } = await supabase
        .from("legal_updates_log")
        .insert({
          action: "cgu_scraped",
          source: "admin_manual_scan",
          details: { triggered_by: "admin", note: "Scan manuel déclenché depuis l'admin" },
          items_affected: 0,
          reviewed_by_admin: false,
        })
        .select("id")
        .single();

      if (error) throw error;
      return NextResponse.json({ id: data.id, success: true });
    }

    // Delete an entry
    if (action === "delete" && id) {
      const { error } = await supabase
        .from("legal_updates_log")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Admin legal updates POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
