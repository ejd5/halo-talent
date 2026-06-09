import { type NextRequest, NextResponse } from "next/server";
import { handleStatusCallback } from "@/lib/atlas/channels/sms";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    await handleStatusCallback({
      MessageSid: (formData.get("MessageSid") as string) || "",
      MessageStatus: (formData.get("MessageStatus") as string) || "",
      To: (formData.get("To") as string) || "",
      ErrorCode: (formData.get("ErrorCode") as string) || undefined,
      Price: (formData.get("Price") as string) || undefined,
    });

    return new Response("", { status: 200 });
  } catch (err) {
    console.error("[SMS STATUS] Error:", err);
    return new Response("", { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}
