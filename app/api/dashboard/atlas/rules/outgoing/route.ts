import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: webhooks } = await supabase
      .from("atlas_outgoing_webhooks")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ webhooks: webhooks ?? [] });
  } catch (err) {
    console.error("[ATLAS OUTGOING WEBHOOKS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { name, url, events } = body;
    if (!name || !url || !events) {
      return NextResponse.json({ error: "name, url, events requis" }, { status: 400 });
    }

    const { data: wh, error } = await supabase
      .from("atlas_outgoing_webhooks")
      .insert({ creator_id: user.id, name, url, events })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ webhook: wh }, { status: 201 });
  } catch (err) {
    console.error("[ATLAS OUTGOING WEBHOOKS CREATE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { webhookId } = await request.json();
    const { error } = await supabase
      .from("atlas_outgoing_webhooks")
      .delete()
      .eq("id", webhookId)
      .eq("creator_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ATLAS OUTGOING WEBHOOKS DELETE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
