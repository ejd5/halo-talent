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

    const { data: funnel, error } = await supabase
      .from("atlas_funnels")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();

    if (error || !funnel) {
      return NextResponse.json({ error: "Funnel introuvable" }, { status: 404 });
    }

    return NextResponse.json({ funnel });
  } catch (err) {
    console.error("[FUNNELS] Error:", err);
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
    const updates: Record<string, unknown> = {};

    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.steps !== undefined) updates.steps = body.steps;
    if (body.status !== undefined) updates.status = body.status;

    const { data: funnel, error } = await supabase
      .from("atlas_funnels")
      .update(updates)
      .eq("id", id)
      .eq("creator_id", user.id)
      .select("*")
      .single();

    if (error) {
      console.error("[FUNNELS] Update error:", error);
      return NextResponse.json({ error: "Erreur de sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({ funnel });
  } catch (err) {
    console.error("[FUNNELS] Error:", err);
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

    if (!status || !["draft", "active", "paused", "completed"].includes(status)) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
    }

    const { data: funnel, error } = await supabase
      .from("atlas_funnels")
      .update({ status })
      .eq("id", id)
      .eq("creator_id", user.id)
      .select("id, name, status")
      .single();

    if (error) {
      console.error("[FUNNELS] Status update error:", error);
      return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }

    return NextResponse.json({ funnel });
  } catch (err) {
    console.error("[FUNNELS] Error:", err);
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
      .from("atlas_funnels")
      .delete()
      .eq("id", id)
      .eq("creator_id", user.id);

    if (error) {
      console.error("[FUNNELS] Delete error:", error);
      return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[FUNNELS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
