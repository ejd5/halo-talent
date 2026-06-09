import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { data: statuses } = await supabase.rpc("atlas_compliance_status", {
      p_creator_id: user.id,
    });

    const channels = (statuses ?? []).map((s: any) => ({
      channel: s.chanel,
      status: s.status,
      label: s.label,
      details: s.details,
    }));

    const totalOk = channels.filter((c: any) => c.status === "ok").length;
    const totalWarning = channels.filter((c: any) => c.status === "warning").length;
    const score = Math.round((totalOk / Math.max(channels.length, 1)) * 100);

    return NextResponse.json({ score, channels });
  } catch (err) {
    console.error("[COMPLIANCE STATUS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
