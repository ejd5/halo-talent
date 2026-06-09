import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: template, error } = await supabase
      .from("templates")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !template) {
      return NextResponse.json({ error: "Template introuvable" }, { status: 404 });
    }

    // Check if user liked it
    let likedByMe = false;
    if (user) {
      const { data: like } = await supabase
        .from("template_likes")
        .select("id")
        .eq("template_id", id)
        .eq("user_id", user.id)
        .maybeSingle();
      likedByMe = !!like;
    }

    return NextResponse.json({ template: { ...template, liked_by_me: likedByMe } });
  } catch (err) {
    console.error("[TEMPLATE GET] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from("templates")
      .select("created_by")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Template introuvable" }, { status: 404 });
    }

    const isAdmin = (await supabase.from("profiles").select("role").eq("id", user.id).single()).data?.role === "admin";
    if (existing.created_by !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const body = await request.json();
    const allowed = ["name", "description", "category", "type", "target_platforms", "target_aspect_ratios", "template_data", "is_public", "tags", "style", "mood", "preview_url"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) updates[key] = body[key];
    }

    const { data, error } = await supabase
      .from("templates")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }

    return NextResponse.json({ template: data });
  } catch (err) {
    console.error("[TEMPLATE PUT] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data: existing } = await supabase
      .from("templates")
      .select("created_by")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Template introuvable" }, { status: 404 });
    }

    const isAdmin = (await supabase.from("profiles").select("role").eq("id", user.id).single()).data?.role === "admin";
    if (existing.created_by !== user.id && !isAdmin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await supabase.from("templates").delete().eq("id", id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[TEMPLATE DELETE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
