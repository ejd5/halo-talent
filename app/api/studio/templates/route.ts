import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type");
    const category = url.searchParams.get("category");
    const style = url.searchParams.get("style");
    const mood = url.searchParams.get("mood");
    const platform = url.searchParams.get("platform");
    const department = url.searchParams.get("department");
    const official = url.searchParams.get("official");
    const mine = url.searchParams.get("mine");
    const market = url.searchParams.get("market");
    const search = url.searchParams.get("search")?.toLowerCase();
    const limit = parseInt(url.searchParams.get("limit") ?? "50");
    const offset = parseInt(url.searchParams.get("offset") ?? "0");

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase.from("templates").select("*");

    // Official templates
    if (official === "true") {
      query = query.eq("is_official", true);
    }
    // My templates
    else if (mine === "true" && user) {
      query = query.eq("created_by", user.id);
    }
    // Community marketplace
    else if (market === "true") {
      query = query
        .eq("is_public", true)
        .eq("is_official", false);
      if (user) query = query.neq("created_by", user.id);
    }
    // Default: official only
    else {
      query = query.eq("is_official", true);
    }

    if (type) query = query.eq("type", type);
    if (category) query = query.eq("category", category);
    if (style) query = query.eq("style", style);
    if (mood) query = query.eq("mood", mood);
    if (department) query = query.eq("department", department);
    if (platform) query = query.contains("target_platforms", [platform]);
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
    }

    const { data, error, count } = await query
      .order("uses_count", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[TEMPLATES] Error:", error);
      return NextResponse.json({ error: "Erreur de récupération" }, { status: 500 });
    }

    // Check if user has liked each template
    let likedIds: string[] = [];
    if (user && data) {
      const { data: likes } = await supabase
        .from("template_likes")
        .select("template_id")
        .in("template_id", data.map((t: any) => t.id))
        .eq("user_id", user.id);
      likedIds = (likes ?? []).map((l: any) => l.template_id);
    }

    const templates = (data ?? []).map((t: any) => ({
      ...t,
      liked_by_me: likedIds.includes(t.id),
    }));

    return NextResponse.json({ templates, count });
  } catch (err) {
    console.error("[TEMPLATES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, type, target_platforms, target_aspect_ratios, template_data, is_public, tags, style, mood } = body;

    if (!name || !type) {
      return NextResponse.json({ error: "name et type requis" }, { status: 400 });
    }

    const validTypes = ["photo", "video", "carousel", "story", "caption"];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: "Type invalide" }, { status: 400 });
    }

    const { data, error } = await supabase.from("templates").insert({
      name,
      description: description ?? null,
      category: category ?? null,
      type,
      target_platforms: target_platforms ?? [],
      target_aspect_ratios: target_aspect_ratios ?? [],
      template_data: template_data ?? {},
      created_by: user.id,
      is_public: is_public ?? false,
      tags: tags ?? [],
      style: style ?? null,
      mood: mood ?? null,
    }).select().single();

    if (error) {
      console.error("[TEMPLATES CREATE] Error:", error);
      return NextResponse.json({ error: "Erreur de création" }, { status: 500 });
    }

    return NextResponse.json({ template: data }, { status: 201 });
  } catch (err) {
    console.error("[TEMPLATES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
