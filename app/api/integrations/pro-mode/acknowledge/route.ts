import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const version = "v1.0";

  try {
    const admin = createAdminClient();
    const ipAddress =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "";

    await admin.from("pro_mode_acknowledgments").upsert(
      {
        creator_id: user.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        version,
      },
      { onConflict: "creator_id", ignoreDuplicates: false },
    );

    return NextResponse.json({ ok: true, version });
  } catch (e: any) {
    console.error("[PRO MODE] Acknowledge error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
