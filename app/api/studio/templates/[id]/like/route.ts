import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check if already liked
    const { data: existing } = await supabase
      .from("template_likes")
      .select("id")
      .eq("template_id", id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Unlike
      await supabase.from("template_likes").delete().eq("id", existing.id);
      const { data: t } = await supabase.from("templates").select("likes_count").eq("id", id).single();
      if (t) {
        await supabase.from("templates").update({ likes_count: Math.max(0, (t as any).likes_count - 1) }).eq("id", id);
      }
      return NextResponse.json({ liked: false });
    } else {
      // Like
      await supabase.from("template_likes").insert({ template_id: id, user_id: user.id });
      const { data: t } = await supabase.from("templates").select("likes_count").eq("id", id).single();
      if (t) {
        await supabase.from("templates").update({ likes_count: (t as any).likes_count + 1 }).eq("id", id);
      }
      return NextResponse.json({ liked: true });
    }
  } catch (err) {
    console.error("[TEMPLATE LIKE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
