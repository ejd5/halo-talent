import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkCredits, deductCredits, logGeneration } from "@/lib/studio/credits";
import { isDemoMode, getDemoModeMessage } from "@/lib/studio/api-config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url } = body;

    if (!image_url) {
      return NextResponse.json({ error: "image_url requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (isDemoMode()) {
      return NextResponse.json({ error: getDemoModeMessage() }, { status: 503 });
    }

    const cost = 1;
    const creditCheck = await checkCredits(supabase, user.id, cost, "remove_bg");
    if (!creditCheck.allowed) {
      return NextResponse.json({
        error: creditCheck.message || "Crédits insuffisants",
        credits_available: creditCheck.credits_available ?? 0,
        credits_needed: creditCheck.credits_needed ?? cost,
        cta: creditCheck.cta,
      }, { status: 402 });
    }

    const res = await fetch("https://api.replicate.com/v1/models/lucataco/remove-bg/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({ input: { image: image_url } }),
    });

    const data = await res.json();
    if (!res.ok) {
      await logGeneration(supabase, { creator_id: user.id, action: "remove_bg", credits_used: cost, provider: "replicate", model: "remove-bg", status: "failed", error: data.detail || "Remove BG failed" });
      throw new Error(data.detail || "Remove BG failed");
    }

    const resultUrl = data.output as string;
    const imgRes = await fetch(resultUrl);
    const buffer = await imgRes.arrayBuffer();
    const fileName = `generated/${user.id}/nobg-${Date.now()}.png`;
    await supabase.storage.from("media").upload(fileName, buffer, { contentType: "image/png" });
    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(fileName);

    const remaining = await deductCredits(supabase, user.id, cost);
    await logGeneration(supabase, { creator_id: user.id, action: "remove_bg", credits_used: cost, provider: "replicate", model: "remove-bg", image_url: publicUrl.publicUrl, status: "success" });

    return NextResponse.json({ image_url: publicUrl.publicUrl, credits_used: cost, credits_remaining: remaining });
  } catch (err) {
    console.error("[REMOVE BG] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
  }
}
