import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");
    const intent = searchParams.get("intent");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("atlas_comments")
      .select("*", { count: "exact" })
      .eq("creator_id", user.id);

    if (status && status !== "all") query = query.eq("status", status);
    if (platform && platform !== "all") query = query.eq("platform", platform);
    if (intent && intent !== "all") query = query.eq("intent", intent);

    const { data: comments, count, error } = await query
      .order("occurred_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    // Get counts for filters
    const { data: counts } = await supabase
      .from("atlas_comments")
      .select("status, platform, intent")
      .eq("creator_id", user.id);

    const statusCounts: Record<string, number> = { all: 0 };
    const platformCounts: Record<string, number> = { all: 0 };
    const intentCounts: Record<string, number> = { all: 0 };

    (counts || []).forEach((c) => {
      statusCounts.all = (statusCounts.all || 0) + 1;
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
      platformCounts.all = (platformCounts.all || 0) + 1;
      platformCounts[c.platform] = (platformCounts[c.platform] || 0) + 1;
      intentCounts.all = (intentCounts.all || 0) + 1;
      if (c.intent) intentCounts[c.intent] = (intentCounts[c.intent] || 0) + 1;
    });

    return NextResponse.json({ comments: comments ?? [], count: count || 0, statusCounts, platformCounts, intentCounts });
  } catch (err) {
    console.error("[COMMENTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { comment_id, status } = body;

    if (!comment_id || !status) {
      return NextResponse.json({ error: "comment_id et status requis" }, { status: 400 });
    }

    if (!["approved", "replied", "hidden", "deleted", "flagged"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const { data: comment, error } = await supabase
      .from("atlas_comments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", comment_id)
      .eq("creator_id", user.id)
      .select("id, status, content, platform, external_comment_id")
      .single();

    if (error) {
      return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }

    // Log action
    await supabase.from("comment_actions").insert({
      comment_id,
      creator_id: user.id,
      action_type: status === "hidden" ? "hide" : status === "deleted" ? "delete" : "approve",
      success: true,
    }).maybeSingle();

    return NextResponse.json({ comment });
  } catch (err) {
    console.error("[COMMENTS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
