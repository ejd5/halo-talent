import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Default templates
const DEFAULT_TEMPLATES = [
  {
    name: "Digital Creator — 21 posts/semaine",
    description: "Rythme intensif : 3 posts/jour sur 3 plateformes principales",
    profile_type: "digital_creator",
    weekly_schedule: {
      monday: [{ platform: "TikTok", type: "reel", count: 2 }, { platform: "Instagram", type: "story", count: 3 }, { platform: "YouTube", type: "shorts", count: 1 }],
      tuesday: [{ platform: "TikTok", type: "post", count: 2 }, { platform: "Instagram", type: "reel", count: 1 }, { platform: "OnlyFans", type: "ppv", count: 1 }],
      wednesday: [{ platform: "TikTok", type: "reel", count: 2 }, { platform: "Instagram", type: "post", count: 2 }],
      thursday: [{ platform: "TikTok", type: "reel", count: 2 }, { platform: "Instagram", type: "story", count: 3 }, { platform: "YouTube", type: "video", count: 1 }],
      friday: [{ platform: "TikTok", type: "post", count: 2 }, { platform: "Instagram", type: "reel", count: 1 }, { platform: "OnlyFans", type: "ppv", count: 1 }],
      saturday: [{ platform: "Instagram", type: "story", count: 2 }],
      sunday: [{ platform: "TikTok", type: "reel", count: 1 }],
    },
    is_default: true,
  },
  {
    name: "Artist — 2 posts/semaine + 1 live",
    description: "Rythme modéré avec focus qualité et live engagement",
    profile_type: "artist",
    weekly_schedule: {
      monday: [{ platform: "Instagram", type: "post", count: 1 }],
      tuesday: [],
      wednesday: [{ platform: "TikTok", type: "reel", count: 1 }],
      thursday: [],
      friday: [{ platform: "Instagram", type: "live", count: 1 }],
      saturday: [],
      sunday: [],
    },
    is_default: true,
  },
  {
    name: "Lifestyle — 14 posts/semaine",
    description: "Mix stories quotidiennes + 2 reels/semaine + 1 vidéo longue",
    profile_type: "lifestyle",
    weekly_schedule: {
      monday: [{ platform: "Instagram", type: "story", count: 3 }, { platform: "TikTok", type: "reel", count: 1 }],
      tuesday: [{ platform: "Instagram", type: "story", count: 2 }, { platform: "OnlyFans", type: "post", count: 1 }],
      wednesday: [{ platform: "Instagram", type: "reel", count: 1 }, { platform: "TikTok", type: "post", count: 1 }],
      thursday: [{ platform: "Instagram", type: "story", count: 3 }],
      friday: [{ platform: "Instagram", type: "post", count: 1 }, { platform: "YouTube", type: "video", count: 1 }],
      saturday: [{ platform: "Instagram", type: "story", count: 2 }],
      sunday: [],
    },
    is_default: true,
  },
];

export async function GET() {
  const supabase = await createClient();
  const { data: templates } = await supabase
    .from("content_calendar_templates")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });

  return NextResponse.json({ templates: templates || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { name, description, profile_type, weekly_schedule } = body;

  if (!name || !weekly_schedule) {
    return NextResponse.json({ error: "name et weekly_schedule requis" }, { status: 400 });
  }

  const { data: template, error } = await supabase
    .from("content_calendar_templates")
    .insert({ name, description, profile_type, weekly_schedule })
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur création" }, { status: 500 });
  return NextResponse.json({ template });
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const { data: template, error } = await supabase
    .from("content_calendar_templates")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
  return NextResponse.json({ template });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  await supabase.from("content_calendar_templates").delete().eq("id", id);
  return NextResponse.json({ ok: true });
}

// Seed defaults on first load
export async function seedDefaults() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("content_calendar_templates")
    .select("id", { count: "exact", head: true });

  if (count === 0) {
    for (const tpl of DEFAULT_TEMPLATES) {
      await supabase.from("content_calendar_templates").insert(tpl);
    }
  }
}
