import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: rules } = await supabase
      .from("comment_rules")
      .select("*")
      .eq("creator_id", user.id)
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    return NextResponse.json({ rules: rules ?? [] });
  } catch (err) {
    console.error("[COMMENT RULES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { name, description, conditions, actions, is_active, priority } = body;

    if (!name || !conditions || !actions) {
      return NextResponse.json({ error: "Nom, conditions et actions requis" }, { status: 400 });
    }

    const { data: rule, error } = await supabase
      .from("comment_rules")
      .insert({
        creator_id: user.id,
        name,
        description: description || null,
        conditions,
        actions,
        is_active: is_active ?? true,
        priority: priority ?? 0,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[COMMENT RULES] Insert error:", error);
      return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
    }

    return NextResponse.json({ rule }, { status: 201 });
  } catch (err) {
    console.error("[COMMENT RULES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { rule_id, ...updates } = body;

    if (!rule_id) {
      return NextResponse.json({ error: "rule_id requis" }, { status: 400 });
    }

    const allowedFields = ["name", "description", "conditions", "actions", "is_active", "priority"];
    const cleanUpdates: Record<string, any> = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) cleanUpdates[field] = updates[field];
    }

    const { data: rule, error } = await supabase
      .from("comment_rules")
      .update({ ...cleanUpdates, updated_at: new Date().toISOString() })
      .eq("id", rule_id)
      .eq("creator_id", user.id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
    }

    return NextResponse.json({ rule });
  } catch (err) {
    console.error("[COMMENT RULES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ruleId = searchParams.get("rule_id");

    if (!ruleId) {
      return NextResponse.json({ error: "rule_id requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { error } = await supabase
      .from("comment_rules")
      .delete()
      .eq("id", ruleId)
      .eq("creator_id", user.id);

    if (error) return NextResponse.json({ error: "Erreur de suppression" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[COMMENT RULES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
