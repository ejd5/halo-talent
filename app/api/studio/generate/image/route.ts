import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCreatorDNA } from "@/lib/dna/helpers";
import { checkCredits, deductCredits, logGeneration } from "@/lib/studio/credits";
import { getPrimaryImageProvider, isDemoMode, getDemoModeMessage } from "@/lib/studio/api-config";

const STYLE_PROMPTS: Record<string, string> = {
  photorealism: "photorealistic, hyper-detailed, 8K, natural lighting, sharp focus, realistic textures",
  cinematic: "cinematic lighting, film grain, anamorphic lens, dramatic shadows, motion picture quality, volumetric lighting",
  editorial: "editorial photography, high contrast, fashion magazine quality, clean composition, studio lighting",
  artistic: "expressive, artistic, creative composition, bold colors, painterly, textured",
  anime: "anime style, manga aesthetics, cel-shaded, vibrant colors, Japanese animation quality, detailed linework",
  "3d_render": "3D render, octane render, blender, cycles, ray tracing, subsurface scattering, geometric, clean lines",
  watercolor: "watercolor painting, soft washes, paper texture, flowing pigments, artistic loose style",
  minimalist: "minimalist, clean design, negative space, simple composition, elegant, muted palette",
  vintage: "vintage aesthetic, retro, film photography, warm tones, grain texture, faded colors, analog feel",
  dark: "dark moody, low key, deep shadows, dramatic lighting, noir atmosphere, mysterious, chiaroscuro",
};

async function enhancePromptWithDNA(prompt: string, style: string, dna: any): Promise<string> {
  if (!dna?.style_profile) return prompt;
  const styleProfile = dna.style_profile;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (!anthropicKey) return prompt;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 600,
        messages: [
          {
            role: "user",
            content: `Améliore ce prompt de génération d'image pour qu'il colle au style visuel unique du créateur.

PROMPT ORIGINAL : ${prompt}
STYLE DEMANDÉ : ${style}

STYLE PROFILE DU CRÉATEUR :
${JSON.stringify(styleProfile, null, 2)}

INSTRUCTIONS :
- Garde l'essence du prompt original
- Ajoute des descripteurs visuels alignés avec son style visuel
- Inclus ses couleurs signature si pertinent
- Inclus le mood, lighting, composition qui correspondent à son univers visuel
- Format final : prompt en anglais (les modèles d'image marchent mieux en anglais)
- Max 200 mots

Retourne UNIQUEMENT le prompt final, sans guillemets ni explication.`,
          },
        ],
      }),
    });

    if (!response.ok) return prompt;
    const data = await response.json();
    return data.content?.[0]?.text?.trim() || prompt;
  } catch {
    return prompt;
  }
}

async function generateReplicate(prompt: string, count: number, aspectRatio: string) {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) throw new Error("REPLICATE_API_TOKEN not configured");

  const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      input: { prompt, aspect_ratio: aspectRatio, num_outputs: Math.min(count, 4), output_format: "webp", output_quality: 90 },
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Replicate error");
  if (data.output) return data.output as string[];

  const predictionUrl = data.urls?.get;
  if (!predictionUrl) throw new Error("No prediction URL");

  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(predictionUrl, { headers: { Authorization: `Bearer ${apiToken}` } });
    const poll = await pollRes.json();
    if (poll.status === "succeeded") return poll.output as string[];
    if (poll.status === "failed") throw new Error(poll.error || "Generation failed");
  }
  throw new Error("Generation timeout");
}

async function generateHuggingFace(prompt: string, count: number) {
  const apiToken = process.env.HUGGINGFACE_API_KEY;
  if (!apiToken) throw new Error("HUGGINGFACE_API_KEY not configured");

  const urls: string[] = [];
  for (let i = 0; i < count; i++) {
    const res = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: prompt }),
    });
    if (!res.ok) throw new Error(`HuggingFace error: ${res.status}`);
    const buffer = await res.arrayBuffer();
    const fileName = `temp/hf-${Date.now()}-${i}.png`;

    const supabase = createClient();
    const { data: uploadData, error: uploadError } = await supabase
      .then((s) => s.storage.from("media").upload(fileName, buffer, { contentType: "image/png" }));
    if (uploadError) throw new Error(uploadError.message);
    const { data: publicUrl } = await supabase.then((s) => s.storage.from("media").getPublicUrl(fileName));
    urls.push(publicUrl.publicUrl);
  }
  return urls;
}

async function storeImages(supabase: Awaited<ReturnType<typeof createClient>>, userId: string, imageUrls: string[], prompt: string, style: string, model: string) {
  const savedUrls: string[] = [];
  for (const url of imageUrls) {
    try {
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      const fileName = `generated/${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
      const { error: uploadErr } = await supabase.storage.from("media").upload(fileName, buffer, { contentType: "image/webp", upsert: true });
      if (uploadErr) throw uploadErr;
      const { data: publicUrl } = supabase.storage.from("media").getPublicUrl(fileName);
      savedUrls.push(publicUrl.publicUrl);
    } catch {
      savedUrls.push(url);
    }
  }
  const { error: mediaError } = await supabase.from("media_library").insert(
    savedUrls.map((url) => ({
      creator_id: userId, url, type: "image", source: "ai_generated", ai_prompt: prompt, ai_model: model, ai_style: style, tags: [style, "ai-generated"],
    }))
  );
  if (mediaError) console.error("[IMAGE GEN] Media insert error:", mediaError);
  return savedUrls;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, aspect_ratio = "1:1", count = 1, use_dna = true, provider = "replicate" } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Check demo mode
    if (isDemoMode()) {
      return NextResponse.json({ error: getDemoModeMessage() }, { status: 503 });
    }

    // Calculate cost (per generation, not per image)
    const costPerGen = aspect_ratio === "16:9" || aspect_ratio === "9:16" ? 2 : 1;
    const totalCost = costPerGen;
    const creditAction = costPerGen > 1 ? "generate_image_wide" : "generate_image";

    // Check credits
    const creditCheck = await checkCredits(supabase, user.id, totalCost, creditAction);
    if (!creditCheck.allowed) {
      return NextResponse.json({
        error: creditCheck.message || "Crédits insuffisants",
        credits_available: creditCheck.credits_available ?? 0,
        credits_needed: creditCheck.credits_needed ?? totalCost,
        cta: creditCheck.cta,
      }, { status: creditCheck.reason === "daily_limit" ? 429 : 402 });
    }

    // Enhance prompt with DNA
    let finalPrompt = prompt;
    if (use_dna) {
      const dna = await getCreatorDNA(user.id).catch(() => null);
      finalPrompt = await enhancePromptWithDNA(prompt, style || "photorealism", dna);
    }

    const stylePrefix = STYLE_PROMPTS[style || "photorealism"];
    if (stylePrefix && !use_dna) {
      finalPrompt = `${finalPrompt}, ${stylePrefix}`;
    }

    // Determine provider
    const usedProvider = provider === "replicate" && process.env.REPLICATE_API_TOKEN
      ? "replicate"
      : provider === "huggingface" && process.env.HUGGINGFACE_API_KEY
      ? "huggingface"
      : provider === "openai" && process.env.OPENAI_API_KEY
      ? "openai"
      : getPrimaryImageProvider() || "replicate";

    // Generate
    let imageUrls: string[];
    let modelName = `flux-schnell-${usedProvider}`;

    try {
      switch (usedProvider) {
        case "replicate":
          imageUrls = await generateReplicate(finalPrompt, count, aspect_ratio);
          break;
        case "huggingface":
          imageUrls = await generateHuggingFace(finalPrompt, count);
          break;
        case "openai": {
          const res = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({ model: "dall-e-3", prompt: finalPrompt, n: 1, size: "1024x1024" }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error?.message || "OpenAI error");
          imageUrls = data.data.map((img: any) => img.url);
          modelName = "dall-e-3";
          break;
        }
        default:
          throw new Error("No provider available");
      }
    } catch (genErr) {
      // Log failure - don't deduct credits
      await logGeneration(supabase, {
        creator_id: user.id,
        action: creditAction,
        credits_used: totalCost,
        provider: usedProvider,
        model: modelName,
        prompt: finalPrompt,
        status: "failed",
        error: genErr instanceof Error ? genErr.message : "Generation failed",
      });
      throw genErr; // re-throw for outer catch
    }

    // Store images
    const savedUrls = await storeImages(supabase, user.id, imageUrls, finalPrompt, style || "photorealism", modelName);

    // Deduct credits (only on success)
    const remaining = await deductCredits(supabase, user.id, totalCost);

    // Log success
    await logGeneration(supabase, {
      creator_id: user.id,
      action: creditAction,
      credits_used: totalCost,
      provider: usedProvider,
      model: modelName,
      prompt: finalPrompt,
      image_url: savedUrls[0],
      status: "success",
    });

    // Save to ai_generations (legacy)
    const { error: aiError } = await supabase.from("ai_generations").insert({
      creator_id: user.id, type: "image", input: { prompt, style, aspect_ratio, count, use_dna }, output: { urls: savedUrls }, credits_used: totalCost, created_at: new Date().toISOString(),
    });
    if (aiError) console.error("[IMAGE GEN] ai_generations error:", aiError);

    return NextResponse.json({
      images: savedUrls,
      credits_used: totalCost,
      credits_remaining: remaining,
      model: usedProvider,
      final_prompt: finalPrompt,
    });
  } catch (err) {
    console.error("[GENERATE IMAGE] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
