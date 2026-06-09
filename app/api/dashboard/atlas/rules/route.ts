import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: rules } = await supabase
      .from("atlas_rules")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ rules: rules ?? [] });
  } catch (err) {
    console.error("[ATLAS RULES] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await request.json();

    // Map from new types to DB columns
    const dbRecord = {
      creator_id: user.id,
      name: body.name,
      description: body.description,
      trigger_event: body.trigger_event ?? body.trigger?.type ?? "custom",
      trigger_config: body.trigger_config ?? body.trigger ?? {},
      conditions: body.conditions ?? [],
      conditions_logic: body.conditions_logic ?? "all",
      actions: body.actions ?? [],
      is_active: body.is_active ?? false,
      test_mode: body.test_mode ?? false,
      rate_limit_per_hour: body.rate_limit_per_hour ?? 0,
      logging_level: body.logging_level ?? "normal",
      schedule_at: body.schedule_at ?? null,
    };

    const { data: rule, error } = await supabase
      .from("atlas_rules")
      .insert(dbRecord)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ rule });
  } catch (err) {
    console.error("[ATLAS RULES CREATE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { ruleId, ...updates } = await request.json();

    const dbUpdates: Record<string, any> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.trigger_event !== undefined) dbUpdates.trigger_event = updates.trigger_event;
    if (updates.trigger_config !== undefined) dbUpdates.trigger_config = updates.trigger_config;
    if (updates.conditions !== undefined) dbUpdates.conditions = updates.conditions;
    if (updates.conditions_logic !== undefined) dbUpdates.conditions_logic = updates.conditions_logic;
    if (updates.actions !== undefined) dbUpdates.actions = updates.actions;
    if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active;
    if (updates.test_mode !== undefined) dbUpdates.test_mode = updates.test_mode;
    if (updates.rate_limit_per_hour !== undefined) dbUpdates.rate_limit_per_hour = updates.rate_limit_per_hour;
    if (updates.logging_level !== undefined) dbUpdates.logging_level = updates.logging_level;
    if (updates.schedule_at !== undefined) dbUpdates.schedule_at = updates.schedule_at;

    const { data: rule, error } = await supabase
      .from("atlas_rules")
      .update(dbUpdates)
      .eq("id", ruleId)
      .eq("creator_id", user.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ rule });
  } catch (err) {
    console.error("[ATLAS RULES PATCH] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
