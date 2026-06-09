import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: pages } = await supabase
      .from("lead_capture_pages")
      .select("id, page_type, title, slug, status, views, conversions, created_at, updated_at")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ pages: pages ?? [] });
  } catch (err) {
    console.error("[LEAD-CAPTURE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { page_type, title, slug, template } = body;

    if (!page_type || !title) {
      return NextResponse.json({ error: "Type et titre requis" }, { status: 400 });
    }

    const insertData: Record<string, any> = {
      creator_id: user.id,
      page_type,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      status: "draft",
    };

    // If template provided, spread its config
    if (template) {
      Object.assign(insertData, template);
    }

    const { data: page, error } = await supabase
      .from("lead_capture_pages")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
      }
      console.error("[LEAD-CAPTURE] Insert error:", error);
      return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
    }

    return NextResponse.json({ page }, { status: 201 });
  } catch (err) {
    console.error("[LEAD-CAPTURE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
