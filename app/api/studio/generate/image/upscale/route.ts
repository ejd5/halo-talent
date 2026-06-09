import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkCredits, deductCredits, logGeneration } from "@/lib/studio/credits";
import { isDemoMode, getDemoModeMessage } from "@/lib/studio/api-config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image_url, scale = 2 } = body;

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

    const cost = scale === 4 ? 4 : 2;
    const creditCheck = await checkCredits(supabase, user.id, cost, "upscale_4x");
    if (!creditCheck.allowed) {
      return NextResponse.json({
        error: creditCheck.message || "Crédits insuffisants",
        credits_available: creditCheck.credits_available ?? 0,
        credits_needed: creditCheck.credits_needed ?? cost,
        cta: creditCheck.cta,
      }, { status: 402 });
    }

    const res = await fetch("https://api.replicate.com/v1/models/nightmareai/real-esrgan/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({ input: { image: image_url, scale } }),
    });

    const data = await res.json();
    if (!res.ok) {
      await logGeneration(supabase, { creator_id: user.id, action: scale === 4 ? "upscale_4x" : "upscale_2x", credits_used: cost, provider: "replicate", model: "real-esrgan", status: "failed", error: data.detail || "Upscale failed" });
      throw new Error(data.detail || "Upscale failed");
    }

    const upscaledUrl = data.output as string;

    const imgRes = await fetch(upscaledUrl);
    const buffer = await imgRes.arrayBuffer();
    const fileName = `generated/${user.id}/upscale-${Date.now()}.webp`;
    await supabase.storage.from("media").upload(fileName, buffer, { contentType: "image/webp" });
    const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(fileName);

    const remaining = await deductCredits(supabase, user.id, cost);
    await logGeneration(supabase, { creator_id: user.id, action: scale === 4 ? "upscale_4x" : "upscale_2x", credits_used: cost, provider: "replicate", model: "real-esrgan", image_url: publicUrl.publicUrl, status: "success" });

    return NextResponse.json({ image_url: publicUrl.publicUrl, credits_used: cost, credits_remaining: remaining });
  } catch (err) {
    console.error("[UPSCALE] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
  }
}
