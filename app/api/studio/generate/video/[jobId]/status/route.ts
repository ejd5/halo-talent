import { type NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { checkVideoJobStatus } from "@/lib/studio/video/providers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data: job } = await supabase
      .from("video_generation_jobs")
      .select("*")
      .eq("id", jobId)
      .eq("creator_id", user.id)
      .single();

    if (!job) {
      return NextResponse.json({ error: "Job non trouvé" }, { status: 404 });
    }

    const j = job as any;

    // Already completed or failed — return cached result
    if (j.status === "completed") {
      return NextResponse.json({
        status: "completed",
        video_url: j.output_url,
        thumbnail_url: j.thumbnail_url,
        duration_seconds: j.duration_seconds,
        prompt: j.prompt,
        model: j.model,
        credits_used: j.credits_used,
      });
    }

    if (j.status === "failed") {
      return NextResponse.json({
        status: "failed",
        error: j.error,
      });
    }

    // Check external provider status
    const startedAt = new Date(j.started_at).getTime();
    const estimatedCompletionAt = j.estimated_completion_at
      ? new Date(j.estimated_completion_at).getTime()
      : startedAt + 60000;
    const etaMs = estimatedCompletionAt - startedAt;

    const externalStatus = await checkVideoJobStatus(j.model, j.external_job_id, startedAt, etaMs);

    if (externalStatus.status === "succeeded" && externalStatus.video_url) {
      const adminClient = createAdminClient();
      let savedUrl = externalStatus.video_url;

      // Download and save to Supabase storage
      try {
        const videoRes = await fetch(externalStatus.video_url);
        if (videoRes.ok) {
          const videoBuffer = await videoRes.arrayBuffer();
          const fileName = `videos/${j.creator_id}/${Date.now()}.mp4`;

          const { error: uploadErr } = await adminClient.storage
            .from("media")
            .upload(fileName, Buffer.from(videoBuffer), { contentType: "video/mp4", upsert: true });

          if (!uploadErr) {
            const { data: publicUrl } = adminClient.storage.from("media").getPublicUrl(fileName);
            savedUrl = publicUrl.publicUrl;
          }
        }
      } catch {
        // Fallback to original URL
      }

      // Update job record
      await supabase
        .from("video_generation_jobs")
        .update({
          status: "completed",
          output_url: savedUrl,
          progress: 1,
          completed_at: new Date().toISOString(),
        })
        .eq("id", jobId);

      // Add to media library
      const { error: _mlErr } = await supabase.from("media_library").insert({
        creator_id: j.creator_id,
        url: savedUrl,
        type: "video",
        source: "ai_generated",
        ai_prompt: j.prompt,
        ai_model: j.model,
      });
      void _mlErr; // table may not exist

      // Update credit usage status
      await supabase.from("credit_usage").update({ status: "success", image_url: savedUrl })
        .eq("creator_id", j.creator_id)
        .eq("action", `video_${j.model}`)
        .eq("status", "pending");

      // Deduct credits on success
      const { deductCredits: deduct } = await import("@/lib/studio/credits");
      await deduct(supabase, j.creator_id, j.credits_used);

      return NextResponse.json({
        status: "completed",
        video_url: savedUrl,
        duration_seconds: j.duration_seconds,
        prompt: j.prompt,
        model: j.model,
        credits_used: j.credits_used,
      });
    }

    if (externalStatus.status === "failed") {
      await supabase
        .from("video_generation_jobs")
        .update({ status: "failed", error: externalStatus.error || "Generation failed" })
        .eq("id", jobId);

      await supabase.from("credit_usage").update({ status: "failed", error: externalStatus.error })
        .eq("creator_id", j.creator_id)
        .eq("action", `video_${j.model}`)
        .eq("status", "pending");

      return NextResponse.json({ status: "failed", error: externalStatus.error });
    }

    // Update progress
    const progress = externalStatus.progress ?? Math.min(0.9, (Date.now() - startedAt) / etaMs);
    await supabase
      .from("video_generation_jobs")
      .update({ progress })
      .eq("id", jobId);

    return NextResponse.json({
      status: "processing",
      progress,
      eta_remaining: Math.max(0, Math.round((estimatedCompletionAt - Date.now()) / 1000)),
    });
  } catch (err) {
    console.error("[VIDEO STATUS] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
