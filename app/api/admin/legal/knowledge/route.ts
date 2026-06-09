import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const platform = searchParams.get("platform");
    const jurisdiction = searchParams.get("jurisdiction");

    let query = supabase
      .from("legal_knowledge")
      .select("*")
      .order("created_at", { ascending: false });

    if (category) query = query.eq("category", category);
    if (platform) query = query.eq("platform", platform);
    if (jurisdiction) query = query.eq("jurisdiction", jurisdiction);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ entries: data || [] });
  } catch (error) {
    console.error("Admin legal knowledge GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const body = await request.json();
    const { category, platform, jurisdiction, title, content, summary, source_url, source_name, severity_score, tags, auto_generated } = body;

    if (!category || !title || !content) {
      return NextResponse.json({ error: "category, title, and content are required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("legal_knowledge")
      .insert({
        category, platform: platform || null, jurisdiction: jurisdiction || "international",
        title, content, summary: summary || null, source_url: source_url || null,
        source_name: source_name || null, severity_score: severity_score || 3,
        tags: tags || [], auto_generated: auto_generated || false,
      })
      .select("id")
      .single();

    if (error) throw error;
    return NextResponse.json({ id: data.id, success: true });
  } catch (error) {
    console.error("Admin legal knowledge POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createAdminClient();
    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("legal_knowledge")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin legal knowledge PUT error:", error);
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

    const { error } = await supabase.from("legal_knowledge").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin legal knowledge DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
