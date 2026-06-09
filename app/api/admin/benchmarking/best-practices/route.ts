import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { data: practices } = await supabase
    .from("best_practices")
    .select("*")
    .order("discovered_at", { ascending: false });

  return NextResponse.json({ practices: practices || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { category, insight, evidence, applicable_to_dept } = body;

  if (!category || !insight) {
    return NextResponse.json({ error: "category et insight requis" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("best_practices")
    .insert({ category, insight, evidence: evidence || {}, applicable_to_dept: applicable_to_dept || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur création" }, { status: 500 });
  return NextResponse.json({ practice: data });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await request.json();
  const { id, shared_with_creators, category, insight, evidence, applicable_to_dept } = body;

  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const updates: Record<string, any> = {};
  if (shared_with_creators !== undefined) updates.shared_with_creators = shared_with_creators;
  if (category !== undefined) updates.category = category;
  if (insight !== undefined) updates.insight = insight;
  if (evidence !== undefined) updates.evidence = evidence;
  if (applicable_to_dept !== undefined) updates.applicable_to_dept = applicable_to_dept;

  const { data, error } = await supabase
    .from("best_practices")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  return NextResponse.json({ practice: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  await supabase.from("best_practices").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}
