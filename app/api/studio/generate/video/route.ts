import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCreatorDNA } from "@/lib/dna/helpers";
import { checkCredits, deductCredits, logGeneration } from "@/lib/studio/credits";
import { startVideoGeneration } from "@/lib/studio/video/providers";
import { VIDEO_MODELS } from "@/lib/studio/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model, duration, aspect_ratio, mode = "text-to-video", style, reference_image, use_dna = true } = body;

    if (!prompt || !model) {
      return NextResponse.json({ error: "Prompt et modèle requis" }, { status: 400 });
    }

    const modelDef = VIDEO_MODELS.find((m) => m.id === model);
    if (!modelDef) {
      return NextResponse.json({ error: "Modèle non trouvé" }, { status: 400 });
    }

    if (duration < modelDef.minDuration || duration > modelDef.maxDuration) {
      return NextResponse.json(
        { error: `Durée invalide pour ${modelDef.name}. Min: ${modelDef.minDuration}s, Max: ${modelDef.maxDuration}s` },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Calculate cost
    const costAction = `video_${model}`;
    const totalCost = modelDef.costPerSec * duration;

    // Check credits
    const creditCheck = await checkCredits(supabase, user.id, totalCost, costAction);
    if (!creditCheck.allowed) {
      return NextResponse.json({
        error: creditCheck.message || "Crédits insuffisants",
        credits_available: creditCheck.credits_available ?? 0,
        credits_needed: creditCheck.credits_needed ?? totalCost,
        cta: creditCheck.cta,
      }, { status: 402 });
    }

    // Enhance prompt with DNA
    let finalPrompt = prompt;
    if (use_dna) {
      const dna = await getCreatorDNA(user.id).catch(() => null);
      if (dna) {
        finalPrompt = `${prompt}${style ? `, style: ${style}` : ""}`;
      }
    } else if (style) {
      finalPrompt = `${prompt}, style: ${style}`;
    }

    // Start generation
    const job = await startVideoGeneration({
      model,
      prompt: finalPrompt,
      duration,
      aspect_ratio: aspect_ratio || "16:9",
      mode: mode || "text-to-video",
      reference_image: reference_image || null,
    });

    const estimatedCompletionAt = new Date(Date.now() + job.eta_ms);

    // Save job record
    const { data: jobRecord, error: insertError } = await supabase
      .from("video_generation_jobs")
      .insert({
        creator_id: user.id,
        external_job_id: job.id,
        model,
        mode: mode || "text-to-video",
        prompt: finalPrompt,
        params: { duration, aspect_ratio, style, reference_image },
        status: "processing",
        progress: 0,
        credits_used: totalCost,
        duration_seconds: duration,
        estimated_completion_at: estimatedCompletionAt.toISOString(),
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError || !jobRecord) {
      throw new Error(insertError?.message || "Failed to create job record");
    }

    // Log generation start
    await logGeneration(supabase, {
      creator_id: user.id,
      action: costAction,
      credits_used: totalCost,
      provider: modelDef.provider,
      model: modelDef.id,
      prompt: finalPrompt,
      status: "pending",
    });

    return NextResponse.json({
      job_id: jobRecord.id,
      eta_seconds: Math.round(job.eta_ms / 1000),
      model: modelDef.id,
      provider: modelDef.provider,
      estimated_completion_at: estimatedCompletionAt.toISOString(),
    });
  } catch (err) {
    console.error("[VIDEO GEN] Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Erreur serveur" },
      { status: 500 }
    );
  }
}
