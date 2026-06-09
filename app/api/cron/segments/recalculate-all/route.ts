import { NextResponse } from "next/server";
import { SmartSegmentEngine } from "@/lib/sovereign-chat/segments/engine";

export async function GET() {
  try {
    const engine = new SmartSegmentEngine();
    const results = await engine.recalculateAll();
    return NextResponse.json({
      ok: true,
      recalculated: results.length,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 },
    );
  }
}
