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

    const { data: page, error } = await supabase
      .from("lead_capture_pages")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (error || !page) {
      return NextResponse.json({ error: "Page introuvable" }, { status: 404 });
    }

    // Fetch links if link_in_bio
    let links: any[] = [];
    if (page.page_type === "link_in_bio") {
      const { data: l } = await supabase
        .from("lead_capture_links")
        .select("*")
        .eq("page_id", id)
        .order("sort_order", { ascending: true });
      links = l ?? [];
    }

    return NextResponse.json({ page, links });
  } catch (err) {
    console.error("[LEAD-CAPTURE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const allowedFields = [
      "title", "slug", "status", "background_type", "background_value",
      "font_family", "accent_color", "text_color", "avatar_url", "bio",
      "display_name", "headline", "subtitle", "cta_text",
      "confirmation_message", "collect_first_name", "consent_text",
      "seo_title", "seo_description", "utm_campaign",
    ];

    const updates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) updates[field] = body[field];
    }
    updates.updated_at = new Date().toISOString();

    const { data: page, error } = await supabase
      .from("lead_capture_pages")
      .update(updates)
      .eq("id", id)
      .eq("creator_id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("[LEAD-CAPTURE] Update error:", error);
      return NextResponse.json({ error: "Erreur de sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({ page });
  } catch (err) {
    console.error("[LEAD-CAPTURE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { status } = body;

    if (!status || !["draft", "active", "paused"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const { data: page, error } = await supabase
      .from("lead_capture_pages")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("creator_id", user.id)
      .select("id, title, status")
      .single();

    if (error) {
      return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }

    return NextResponse.json({ page });
  } catch (err) {
    console.error("[LEAD-CAPTURE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { error } = await supabase
      .from("lead_capture_pages")
      .delete()
      .eq("id", id)
      .eq("creator_id", user.id);

    if (error) {
      return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[LEAD-CAPTURE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
