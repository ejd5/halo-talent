import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FanBrainService } from "@/lib/chat-copilot/fan-brain";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ fanId: string }> },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { fanId } = await params;
  const body = await request.json();
  const { messages } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: "messages requis (tableau non vide)" },
      { status: 400 },
    );
  }

  // Validate message structure
  for (const msg of messages) {
    if (!msg.role || !msg.content) {
      return NextResponse.json(
        { error: "Chaque message doit avoir role et content" },
        { status: 400 },
      );
    }
    if (!["fan", "creator"].includes(msg.role)) {
      return NextResponse.json(
        { error: "role doit être 'fan' ou 'creator'" },
        { status: 400 },
      );
    }
  }

  try {
    const service = new FanBrainService(fanId, user.id);
    const result = await service.analyzeConversation({ messages });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
