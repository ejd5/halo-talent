import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SmartSegmentEngine } from "@/lib/sovereign-chat/segments/engine";
import { SEGMENT_TEMPLATES } from "@/lib/sovereign-chat/segments/templates";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const templates = searchParams.get("templates");
  const id = searchParams.get("id");

  // Return template library
  if (templates === "true") {
    return NextResponse.json({ templates: SEGMENT_TEMPLATES });
  }

  // Return single segment
  if (id) {
    const { data: segment } = await supabase
      .from("atlas_segments")
      .select("*")
      .eq("id", id)
      .eq("creator_id", user.id)
      .single();
    if (!segment) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json({ segment });
  }

  // Return all segments for user
  const { data: segments } = await supabase
    .from("atlas_segments")
    .select("*")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  // Get member counts from memberships for accuracy
  const { data: counts } = await supabase
    .from("atlas_segment_memberships")
    .select("segment_id, fan_id")
    .in("segment_id", (segments || []).map((s) => s.id));

  const countMap = new Map<string, number>();
  for (const row of counts || []) {
    countMap.set(row.segment_id, (countMap.get(row.segment_id) || 0) + 1);
  }

  const enriched = (segments || []).map((s) => ({
    ...s,
    member_count: countMap.get(s.id) || 0,
  }));

  return NextResponse.json({ segments: enriched });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { name, description, type, rules, on_entry_funnel_id, on_exit_funnel_id, from_template } = body;

  if (!name) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }

  // If cloning from template
  let finalRules = rules || [];
  if (from_template) {
    const template = SEGMENT_TEMPLATES.find((t) => t.id === from_template);
    if (template) {
      finalRules = template.rules;
    }
  }

  const { data, error } = await supabase
    .from("atlas_segments")
    .insert({
      creator_id: user.id,
      name,
      description: description || null,
      type: type || "smart",
      rules: finalRules,
      on_entry_funnel_id: on_entry_funnel_id || null,
      on_exit_funnel_id: on_exit_funnel_id || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
  }

  // Initial calculation if smart
  if (data.type === "smart") {
    const engine = new SmartSegmentEngine();
    await engine.recalculate(data.id);
  }

  return NextResponse.json({ segment: data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { id, name, description, type, rules, on_entry_funnel_id, on_exit_funnel_id } = body;

  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  const updates: Record<string, any> = {};
  if (name !== undefined) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (type !== undefined) updates.type = type;
  if (rules !== undefined) updates.rules = rules;
  if (on_entry_funnel_id !== undefined) updates.on_entry_funnel_id = on_entry_funnel_id;
  if (on_exit_funnel_id !== undefined) updates.on_exit_funnel_id = on_exit_funnel_id;

  const { data, error } = await supabase
    .from("atlas_segments")
    .update(updates)
    .eq("id", id)
    .eq("creator_id", user.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Erreur de mise à jour" }, { status: 500 });
  }

  // Recalculate if rules changed
  if (rules !== undefined && data.type === "smart") {
    const engine = new SmartSegmentEngine();
    await engine.recalculate(data.id);
  }

  return NextResponse.json({ segment: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID requis" }, { status: 400 });

  await supabase.from("atlas_segments").delete().eq("id", id).eq("creator_id", user.id);
  return NextResponse.json({ ok: true });
}
