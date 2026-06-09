import { TrendAlertEngine } from "@/lib/trends/alerts";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (
    request.headers.get("authorization") !==
    `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const engine = new TrendAlertEngine();
  await engine.run();
  return NextResponse.json({ ok: true, timestamp: new Date() });
}
