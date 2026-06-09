import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "error" | "miss"> = {
    ok: "ok",
  };

  // Check Supabase env
  checks.supabase_url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ? "ok" : "miss";

  // Check DB connectivity (optional — add if you have a client)
  // try { await supabase.from("health").select("1").limit(1); checks.database = "ok"; }
  // catch { checks.database = "error"; }

  const allOk = Object.values(checks).every((v) => v === "ok");
  const statusCode = allOk ? 200 : 503;

  return NextResponse.json(
    {
      status: allOk ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    },
    { status: statusCode },
  );
}
