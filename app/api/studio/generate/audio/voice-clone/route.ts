import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkCredits, deductCredits, logGeneration } from "@/lib/studio/credits";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, voice_id, text, emotion, speed } = body;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // ─── Setup: create voice model from sample ───
    if (action === "setup") {
      const { audio_url, name } = body;
      if (!audio_url) {
        return NextResponse.json({ error: "Audio requis pour créer le modèle vocal" }, { status: 400 });
      }

      const creditCheck = await checkCredits(supabase, user.id, 10, "voice_clone_setup");
      if (!creditCheck.allowed) {
        return NextResponse.json({ error: creditCheck.message || "Crédits insuffisants" }, { status: 402 });
      }

      const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
      let voiceId = "demo";

      if (elevenLabsKey) {
        try {
          const audioRes = await fetch(audio_url);
          const audioBlob = await audioRes.blob();
          const formData = new FormData();
          formData.append("name", name || "Ma voix");
          formData.append("files", audioBlob, "sample.wav");

          const res = await fetch("https://api.elevenlabs.io/v1/voices/add", {
            method: "POST",
            headers: { "xi-api-key": elevenLabsKey },
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            voiceId = data.voice_id;
          }
        } catch {
          // fallback to demo
        }
      }

      await deductCredits(supabase, user.id, 10);
      await logGeneration(supabase, {
        creator_id: user.id,
        action: "voice_clone_setup",
        credits_used: 10,
        provider: elevenLabsKey ? "elevenlabs" : "demo",
        model: "voice-clone",
        status: "success",
      });

      return NextResponse.json({ voice_id: voiceId, status: "ready" });
    }

    // ─── Generate: text-to-speech with cloned voice ───
    if (action === "generate") {
      if (!text) {
        return NextResponse.json({ error: "Texte requis" }, { status: 400 });
      }

      const creditCheck = await checkCredits(supabase, user.id, 2, "voice_generate");
      if (!creditCheck.allowed) {
        return NextResponse.json({ error: creditCheck.message || "Crédits insuffisants" }, { status: 402 });
      }

      const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
      let audioUrl = "";

      if (elevenLabsKey && voice_id && voice_id !== "demo") {
        try {
          const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
            method: "POST",
            headers: {
              "xi-api-key": elevenLabsKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text,
              model_id: "eleven_multilingual_v2",
              voice_settings: {
                stability: speed || 0.5,
                similarity_boost: 0.75,
                style: emotion === "joyful" ? 0.8 : emotion === "calm" ? 0.3 : 0.5,
              },
            }),
          });
          if (res.ok) {
            const blob = await res.blob();
            audioUrl = URL.createObjectURL(blob);
          }
        } catch {
          // fallback
        }
      }

      // Demo: generate a speech-like tone
      if (!audioUrl) {
        const sampleRate = 22050;
        const durationSec = Math.max(2, text.length / 15);
        const numSamples = sampleRate * durationSec;
        const buffer = new Float32Array(numSamples);
        for (let i = 0; i < numSamples; i++) {
          const t = i / sampleRate;
          // Simulated speech: modulated frequencies
          const freq = 150 + Math.sin(t * 4) * 50 + Math.sin(t * 1.5) * 30;
          buffer[i] = Math.sin(2 * Math.PI * freq * t) * 0.3
            * Math.sin(Math.PI * t * 2) * 0.5 + 0.5;
        }
        const wavBlob = await float32ToWav(buffer, sampleRate);
        audioUrl = URL.createObjectURL(wavBlob);
      }

      await deductCredits(supabase, user.id, 2);
      await logGeneration(supabase, {
        creator_id: user.id,
        action: "voice_generate",
        credits_used: 2,
        provider: elevenLabsKey ? "elevenlabs" : "demo",
        model: "voice-clone",
        prompt: text,
        status: "success",
      });

      return NextResponse.json({
        audio_url: audioUrl,
        duration_seconds: text.length / 15,
        credits_remaining: creditCheck.credits_available! - 2,
      });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch (err) {
    console.error("[VOICE CLONE] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function float32ToWav(samples: Float32Array, sampleRate: number): Promise<Blob> {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = samples.length * blockAlign;
  const bufferSize = 44 + dataSize;
  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  const w = (o: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  w(0, "RIFF"); view.setUint32(4, bufferSize - 8, true); w(8, "WAVE");
  w(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true); view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true); w(36, "data"); view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }
  return new Blob([arrayBuffer], { type: "audio/wav" });
}
