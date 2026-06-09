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

    const { data: links } = await supabase
      .from("lead_capture_links")
      .select("*")
      .eq("page_id", id)
      .eq("creator_id", user.id)
      .order("sort_order", { ascending: true });

    return NextResponse.json({ links: links ?? [] });
  } catch (err) {
    console.error("[LEAD-CAPTURE LINKS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { link_type, label, url, icon } = body;

    if (!link_type || !label) {
      return NextResponse.json({ error: "Type et label requis" }, { status: 400 });
    }

    // Get the next sort order
    const { data: existing } = await supabase
      .from("lead_capture_links")
      .select("sort_order")
      .eq("page_id", id)
      .eq("creator_id", user.id)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

    const { data: link, error } = await supabase
      .from("lead_capture_links")
      .insert({
        page_id: id,
        creator_id: user.id,
        link_type,
        label,
        url: url || "",
        icon: icon || null,
        sort_order: nextOrder,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[LEAD-CAPTURE LINKS] Insert error:", error);
      return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
    }

    return NextResponse.json({ link }, { status: 201 });
  } catch (err) {
    console.error("[LEAD-CAPTURE LINKS] Error:", err);
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
    const { link_id, label, url, link_type, icon, sort_order, is_active, open_in_new_tab, utm_enabled } = body;

    if (!link_id) {
      return NextResponse.json({ error: "link_id requis" }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (label !== undefined) updates.label = label;
    if (url !== undefined) updates.url = url;
    if (link_type !== undefined) updates.link_type = link_type;
    if (icon !== undefined) updates.icon = icon;
    if (sort_order !== undefined) updates.sort_order = sort_order;
    if (is_active !== undefined) updates.is_active = is_active;
    if (open_in_new_tab !== undefined) updates.open_in_new_tab = open_in_new_tab;
    if (utm_enabled !== undefined) updates.utm_enabled = utm_enabled;

    const { data: link, error } = await supabase
      .from("lead_capture_links")
      .update(updates)
      .eq("id", link_id)
      .eq("creator_id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("[LEAD-CAPTURE LINKS] Update error:", error);
      return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }

    return NextResponse.json({ link });
  } catch (err) {
    console.error("[LEAD-CAPTURE LINKS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = new URL(request.url);
    const linkId = url.searchParams.get("link_id");

    if (!linkId) {
      return NextResponse.json({ error: "link_id requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { error } = await supabase
      .from("lead_capture_links")
      .delete()
      .eq("id", linkId)
      .eq("page_id", id)
      .eq("creator_id", user.id);

    if (error) {
      return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[LEAD-CAPTURE LINKS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
