import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seulement en développement" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const adminClient = createAdminClient();

  // Check if profile exists
  const { data: existing } = await adminClient
    .from("profiles")
    .select("id, role, credits_ia")
    .eq("id", user.id)
    .single();

  if (existing) {
    // Ensure admin has proper credits
    const updates: any = {};
    if ((existing as any).role === "admin" && (existing as any).credits_ia !== 999999) {
      updates.credits_ia = 999999;
    }
    if (Object.keys(updates).length > 0) {
      await adminClient.from("profiles").update(updates).eq("id", user.id);
    }
    return NextResponse.json({
      message: "Profil déjà existant",
      profile: existing,
    });
  }

  // Create profile
  const { error: insertError } = await adminClient.from("profiles").insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator",
    role: "creator",
    status: "active",
    credits_ia: 5,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Profil créé avec succès !",
    email: user.email,
  });
}
