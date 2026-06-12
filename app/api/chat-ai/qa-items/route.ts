import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const reason = searchParams.get("reason");
    const severity = searchParams.get("severity");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    let query = supabase
      .from("chat_ai_qa_items")
      .select(`
        id, reason, severity, status, notes, created_at, updated_at,
        message_id, draft_id,
        chat_ai_messages!chat_ai_qa_items_message_id_fkey(id, text, direction, created_at),
        chat_ai_drafts!chat_ai_qa_items_draft_id_fkey(id, text, objective, tone, status, risk_level)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status) query = query.eq("status", status);
    if (reason) query = query.eq("reason", reason);
    if (severity) query = query.eq("severity", parseInt(severity));

    const { data, error } = await query;
    if (error) throw error;

    const items = (data || []).map((item: Record<string, unknown>) => ({
      id: item.id,
      reason: item.reason,
      severity: item.severity,
      status: item.status,
      notes: item.notes,
      messageId: item.message_id,
      draftId: item.draft_id,
      message: item.chat_ai_messages || null,
      draft: item.chat_ai_drafts || null,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error("[Chat AI] QA items GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
