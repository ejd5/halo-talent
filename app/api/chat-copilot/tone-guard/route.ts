import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkTone } from "@/lib/chat-copilot/tone-guard-service";
import type { ToneCheckResult } from "@/lib/chat-copilot/types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { message } = await request.json();

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "message requis" }, { status: 400 });
  }

  try {
    // Load creator DNA for banned words
    let dnaContext: string | null = null;
    try {
      const { data: dna } = await supabase
        .from("creator_dna")
        .select("voice_profile, section_6")
        .eq("creator_id", user.id)
        .single();
      dnaContext = dna?.voice_profile
        ? JSON.stringify(dna.voice_profile)
        : null;
    } catch {
      // Graceful fallback — continue without DNA context
    }

    const result: ToneCheckResult = checkTone(message.trim(), dnaContext);
    return NextResponse.json(result);
  } catch {
    // On error, allow the message through
    return NextResponse.json({ passed: true, warnings: [] });
  }
}
