import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id: conversationId } = await params;

  try {
    // 1. Load conversation with fan data
    const { data: conv, error: convErr } = await supabase
      .from("chat_ai_conversations")
      .select("*, chat_ai_fans(*)")
      .eq("id", conversationId)
      .single();

    if (convErr || !conv) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    }

    if (conv.creator_id !== user.id) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
    }

    // 2. Load messages for this conversation
    const { data: messages, error: msgErr } = await supabase
      .from("chat_ai_messages")
      .select("id, conversation_id, seq, direction, text, created_at, metadata")
      .eq("conversation_id", conversationId)
      .order("seq", { ascending: true });

    if (msgErr) {
      console.error("[Chat AI] Messages load error:", msgErr);
    }

    // 3. Load drafts for this conversation
    const { data: drafts, error: draftErr } = await supabase
      .from("chat_ai_drafts")
      .select("id, conversation_id, text, objective, tone, status, risk_level, explanation, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false });

    if (draftErr) {
      console.error("[Chat AI] Drafts load error:", draftErr);
    }

    return NextResponse.json({
      conversation: {
        id: conv.id,
        platform: conv.platform,
        status: conv.status,
        priority_score: conv.priority_score,
        fan: conv.chat_ai_fans || null,
      },
      messages: messages || [],
      drafts: drafts || [],
    });
  } catch (error) {
    console.error("[Chat AI] Conversation detail GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
