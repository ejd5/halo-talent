import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkCredits, deductCredits, logGeneration } from "@/lib/studio/credits";
import { isDemoMode, getDemoModeMessage } from "@/lib/studio/api-config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, count = 4 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (isDemoMode()) {
      return NextResponse.json({ error: getDemoModeMessage() }, { status: 503 });
    }

    const cost = count;
    const creditCheck = await checkCredits(supabase, user.id, cost, "variation");
    if (!creditCheck.allowed) {
      return NextResponse.json({
        error: creditCheck.message || "Crédits insuffisants",
        credits_available: creditCheck.credits_available ?? 0,
        credits_needed: creditCheck.credits_needed ?? cost,
        cta: creditCheck.cta,
      }, { status: 402 });
    }

    const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({ input: { prompt, num_outputs: Math.min(count, 4), output_format: "webp", output_quality: 90 } }),
    });

    const data = await res.json();
    if (!res.ok) {
      await logGeneration(supabase, { creator_id: user.id, action: "variation", credits_used: cost, provider: "replicate", model: "flux-schnell", status: "failed", error: data.detail || "Variations failed" });
      throw new Error(data.detail || "Variations failed");
    }

    const images = data.output as string[];

    const savedUrls = await Promise.all(
      images.map(async (url) => {
        const imgRes = await fetch(url);
        const buffer = await imgRes.arrayBuffer();
        const fileName = `generated/${user.id}/var-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
        await supabase.storage.from("media").upload(fileName, buffer, { contentType: "image/webp" });
        const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(fileName);
        return publicUrl.publicUrl;
      })
    );

    const remaining = await deductCredits(supabase, user.id, cost);
    await logGeneration(supabase, { creator_id: user.id, action: "variation", credits_used: cost, provider: "replicate", model: "flux-schnell", image_url: savedUrls[0], status: "success" });

    return NextResponse.json({ images: savedUrls, credits_used: cost, credits_remaining: remaining });
  } catch (err) {
    console.error("[VARIATIONS] Error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Erreur serveur" }, { status: 500 });
  }
}
