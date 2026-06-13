import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/dashboard/trends/watchlist
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data, error } = await supabase
      .from("trends_watchlist")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ watchlist: data ?? [] });
  } catch (err) {
    console.error("[TRENDS WATCHLIST] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/dashboard/trends/watchlist
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();
    const { keyword, category, geo_filter, sources, alert_threshold } = body;

    if (!keyword) {
      return NextResponse.json({ error: "keyword requis" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("trends_watchlist")
      .select("id")
      .eq("creator_id", user.id)
      .eq("keyword", keyword)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "Ce mot-clé est déjà surveillé" }, { status: 409 });
    }

    // Check limit (10 for premium, 25 for elite, using 10 as default)
    const { count } = await supabase
      .from("trends_watchlist")
      .select("*", { count: "exact", head: true })
      .eq("creator_id", user.id);

    if ((count ?? 0) >= 25) {
      return NextResponse.json({ error: "Limite de mots-clés atteinte (max 25)" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("trends_watchlist")
      .insert({
        creator_id: user.id,
        keyword,
        category: category ?? null,
        geo_filter: geo_filter ?? "FR",
        sources: sources ?? ["google", "youtube"],
        alert_threshold: alert_threshold ?? 50,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ entry: data }, { status: 201 });
  } catch (err) {
    console.error("[TRENDS WATCHLIST CREATE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/dashboard/trends/watchlist
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

    const { error } = await supabase
      .from("trends_watchlist")
      .delete()
      .eq("id", id)
      .eq("creator_id", user.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[TRENDS WATCHLIST DELETE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
