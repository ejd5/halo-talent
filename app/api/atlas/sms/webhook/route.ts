import { type NextRequest, NextResponse } from "next/server";
import { handleInboundSMS } from "@/lib/atlas/channels/sms";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const from = (formData.get("From") as string) || "";
    const body = (formData.get("Body") as string) || "";

    const result = await handleInboundSMS(from, body);

    if (result.responseXml) {
      return new Response(result.responseXml, {
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });
    }

    // No response needed for regular replies (Twilio handles with default)
    return new Response("", { status: 200 });
  } catch (err) {
    console.error("[SMS WEBHOOK] Error:", err);
    return new Response("", { status: 200 }); // Always 200 for Twilio
  }
}

// Twilio sends POST requests
export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}
