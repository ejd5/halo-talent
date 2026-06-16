import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: comment, error } = await supabase
      .from("atlas_comments")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (error || !comment) {
      return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 });
    }

    return NextResponse.json({ comment });
  } catch (err) {
    console.error("[COMMENTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { action, content } = body; // action: "reply" | "like" | "hide" | "unhide" | "delete" | "approve"

    if (!action) {
      return NextResponse.json({ error: "Action requise" }, { status: 400 });
    }

    const validActions = ["reply", "like", "hide", "unhide", "delete", "approve"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    // Get the comment
    const { data: comment } = await supabase
      .from("atlas_comments")
      .select("id, platform, external_comment_id, status")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (!comment) {
      return NextResponse.json({ error: "Commentaire introuvable" }, { status: 404 });
    }

    const updates: Record<string, any> = { updated_at: new Date().toISOString() };
    const logContent = content || null;

    switch (action) {
      case "reply":
        if (!content) return NextResponse.json({ error: "Contenu requis pour reply" }, { status: 400 });
        updates.status = "replied";
        updates.auto_reply_content = content;
        updates.replied_at = new Date().toISOString();
        break;
      case "like":
        break;
      case "hide":
        updates.status = "hidden";
        break;
      case "unhide":
        updates.status = "approved";
        break;
      case "delete":
        updates.status = "deleted";
        break;
      case "approve":
        updates.status = "approved";
        break;
    }

    await supabase
      .from("atlas_comments")
      .update(updates)
      .eq("id", id)
      .eq("creator_id", user.id);

    // Log the action
    await supabase.from("comment_actions").insert({
      comment_id: id,
      creator_id: user.id,
      action_type: action,
      content: logContent,
      success: true,
    }).maybeSingle();

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[COMMENTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
