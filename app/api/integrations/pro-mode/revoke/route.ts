import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    await supabase
      .from("pro_mode_acknowledgments")
      .delete()
      .eq("creator_id", user.id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[PRO MODE] Revoke error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
