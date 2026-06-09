import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: templates } = await supabase
      .from("comment_templates")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ templates: templates ?? [] });
  } catch (err) {
    console.error("[COMMENT TEMPLATES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { name, responses, language } = body;

    if (!name || !responses || !Array.isArray(responses) || responses.length === 0) {
      return NextResponse.json({ error: "Nom et au moins une réponse requis" }, { status: 400 });
    }

    const { data: template, error } = await supabase
      .from("comment_templates")
      .insert({
        creator_id: user.id,
        name,
        responses,
        language: language || "fr",
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
    }

    return NextResponse.json({ template }, { status: 201 });
  } catch (err) {
    console.error("[COMMENT TEMPLATES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { template_id, name, responses, language, is_active } = body;

    if (!template_id) {
      return NextResponse.json({ error: "template_id requis" }, { status: 400 });
    }

    const updates: Record<string, any> = {};
    if (name !== undefined) updates.name = name;
    if (responses !== undefined) updates.responses = responses;
    if (language !== undefined) updates.language = language;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data: template, error } = await supabase
      .from("comment_templates")
      .update(updates)
      .eq("id", template_id)
      .eq("creator_id", user.id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    return NextResponse.json({ template });
  } catch (err) {
    console.error("[COMMENT TEMPLATES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const templateId = request.nextUrl.searchParams.get("template_id");
    if (!templateId) return NextResponse.json({ error: "template_id requis" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { error } = await supabase
      .from("comment_templates")
      .delete()
      .eq("id", templateId)
      .eq("creator_id", user.id);

    if (error) return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[COMMENT TEMPLATES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
