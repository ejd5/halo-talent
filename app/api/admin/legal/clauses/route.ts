import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("abusive_clauses")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return NextResponse.json({ clauses: data || [] });
  } catch (error) {
    console.error("Admin legal clauses GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const body = await request.json();
    const { id, label, description, category, legal_argument, severity, cgu_references, law_references, sort_order, is_active, icon } = body;

    if (!id || !label || !category || !legal_argument) {
      return NextResponse.json({ error: "id, label, category, and legal_argument are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("abusive_clauses")
      .insert({
        id, label, description: description || null, category, icon: icon || null,
        cgu_references: cgu_references || [], law_references: law_references || [],
        legal_argument, severity: severity || 3, sort_order: sort_order || 0,
        is_active: is_active !== false,
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id, success: true });
  } catch (error) {
    console.error("Admin legal clauses POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const body = await request.json();
    const { orig_id, ...fields } = body;

    if (!orig_id) {
      return NextResponse.json({ error: "orig_id is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("abusive_clauses")
      .update(fields)
      .eq("id", orig_id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin legal clauses PUT error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error } = await supabase.from("abusive_clauses").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin legal clauses DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
