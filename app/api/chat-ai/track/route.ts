import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { trackEvent, ChatAITrackingEvents } from "@/lib/tracking/chat-ai-events";

const ALLOWED_EVENT_NAMES = Object.values(ChatAITrackingEvents) as [string, ...string[]];

const trackSchema = z.object({
  name: z.enum(ALLOWED_EVENT_NAMES),
  payload: z
    .object({
      href: z.string().max(256).optional(),
      source: z.string().max(64).optional(),
      section: z.string().max(64).optional(),
      locale: z.string().max(10).optional(),
      clientTimestamp: z.string().datetime().optional(),
    })
    .optional(),
});

const MAX_BODY_SIZE = 1024; // 1KB

export async function POST(request: NextRequest) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_SIZE) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const body = await request.json();

    const result = trackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }

    const { name, payload } = result.data;
    await trackEvent(name, payload ?? {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
