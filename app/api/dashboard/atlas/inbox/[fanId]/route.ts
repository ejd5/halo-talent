import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ fanId: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { fanId } = await params;

    // Fetch messages
    const { data: messages } = await supabase
      .from("atlas_interactions")
      .select("*")
      .eq("fan_id", fanId)
      .eq("creator_id", user.id)
      .order("occurred_at", { ascending: true })
      .limit(100);

    // Fetch pending drafts for this fan
    const { data: pendingDrafts } = await supabase
      .from("atlas_drafts")
      .select("*")
      .eq("fan_id", fanId)
      .eq("creator_id", user.id)
      .in("status", ["pending", "pending_validation"])
      .order("generated_at", { ascending: false })
      .limit(10);

    // Mark as read
    await supabase
      .from("atlas_conversation_read")
      .upsert({
        fan_id: fanId,
        creator_id: user.id,
        last_read_at: new Date().toISOString(),
      }, { onConflict: "fan_id, creator_id" });

    return NextResponse.json({
      messages: messages ?? [],
      pending_drafts: pendingDrafts ?? [],
    });
  } catch (err) {
    console.error("[ATLAS INBOX FAN] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
