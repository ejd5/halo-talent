import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAction } from "@/lib/compliance/audit";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = user.id;
  const { id: draftId } = await params;

  try {
    // 1. Load draft to verify ownership and status
    const { data: draft, error: draftErr } = await supabase
      .from("chat_ai_drafts")
      .select("id, status, text, conversation_id")
      .eq("id", draftId)
      .single();

    if (draftErr || !draft) {
      return NextResponse.json({ error: "Brouillon introuvable" }, { status: 404 });
    }

    // 2. Verify user owns the conversation this draft belongs to
    const { data: conv, error: convErr } = await supabase
      .from("chat_ai_conversations")
      .select("id, user_id")
      .eq("id", draft.conversation_id)
      .single();

    if (convErr || !conv) {
      return NextResponse.json({ error: "Conversation introuvable" }, { status: 404 });
    }

    if (conv.user_id !== userId) {
      return NextResponse.json({ error: "Accès non autorisé à ce brouillon" }, { status: 403 });
    }

    if (draft.status === "blocked") {
      return NextResponse.json({
        error: "Ce brouillon est bloqué. Impossible de le copier.",
      }, { status: 403 });
    }

    // 3. Update status to copied
    const { error: updateErr } = await supabase
      .from("chat_ai_drafts")
      .update({ status: "copied" })
      .eq("id", draftId);

    if (updateErr) {
      console.error("[Chat AI] Draft copy update error:", updateErr);
    }

    // 4. Audit log
    await logAction({
      userId,
      actorId: userId,
      actorType: "creator",
      action: "ai_draft_copied",
      targetType: "draft",
      targetId: draftId,
      metadata: {
        conversationId: draft.conversation_id,
        textLength: (draft.text as string)?.length || 0,
      },
    });

    return NextResponse.json({
      success: true,
      draftId,
      text: draft.text,
      message: "Texte prêt à être collé dans la plateforme. Aucun envoi automatique n'a été effectué.",
    });
  } catch (error) {
    console.error("[Chat AI] Draft copy POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
