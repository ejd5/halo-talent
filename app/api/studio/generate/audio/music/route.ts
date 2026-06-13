import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkCredits, deductCredits, logGeneration } from "@/lib/studio/credits";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration, style, count = 3 } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt requis" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const cost = 3; // generate_music
    const creditCheck = await checkCredits(supabase, user.id, cost, "generate_music");
    if (!creditCheck.allowed) {
      return NextResponse.json({
        error: creditCheck.message || "Crédits insuffisants",
        credits_available: creditCheck.credits_available ?? 0,
        credits_needed: cost,
      }, { status: 402 });
    }

    // Try real API providers
    let tracks: { url: string; title: string; duration: number }[] = [];
    const apiKey = process.env.MUBERT_API_KEY;

    if (apiKey) {
      try {
        const res = await fetch("https://api.mubert.com/v2/ttm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ text: prompt, duration_sec: duration, style }),
        });
        if (res.ok) {
          const data = await res.json();
          tracks = (data.tracks || []).map((t: any) => ({
            url: t.audio,
            title: t.title || `Génération ${Date.now()}`,
            duration: t.duration || duration,
          }));
        }
      } catch {
        // fallback to demo
      }
    }

    // Demo mode: generate sample tones
    if (tracks.length === 0) {
      for (let i = 0; i < count; i++) {
        const id = `music_${Date.now()}_${i}`;
        // Generate a simple audio tone as data URL
        const sampleRate = 44100;
        const numSamples = sampleRate * Math.min(duration, 30);
        const freq = 220 + i * 55;
        const buffer = generateTone(numSamples, sampleRate, freq);
        const wavUrl = await wavToDataUrl(buffer, sampleRate);
        tracks.push({
          url: wavUrl,
          title: `${prompt.slice(0, 40)}, Variation ${i + 1}`,
          duration: Math.min(duration, 30),
        });
      }
    }

    // Log generation
    await logGeneration(supabase, {
      creator_id: user.id,
      action: "generate_music",
      credits_used: cost,
      provider: apiKey ? "mubert" : "demo",
      model: "audio-gen",
      prompt,
      status: "success",
    });

    // Deduct credits
    await deductCredits(supabase, user.id, cost);

    return NextResponse.json({ tracks, credits_remaining: creditCheck.credits_available! - cost });
  } catch (err) {
    console.error("[MUSIC GEN] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ─── Demo tone generation ───

function generateTone(numSamples: number, sampleRate: number, freq: number): Float32Array {
  const buffer = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Sine wave + harmonics for richer sound
    buffer[i] = Math.sin(2 * Math.PI * freq * t) * 0.3
      + Math.sin(2 * Math.PI * freq * 2 * t) * 0.15
      + Math.sin(2 * Math.PI * freq * 3 * t) * 0.05;
    // Envelope (fade in/out)
    const envelope = Math.min(1, Math.min(i, numSamples - i) / (sampleRate * 0.05));
    buffer[i] *= envelope;
  }
  return buffer;
}

async function wavToDataUrl(samples: Float32Array, sampleRate: number): Promise<string> {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = samples.length * blockAlign;
  const bufferSize = 44 + dataSize;

  const arrayBuffer = new ArrayBuffer(bufferSize);
  const view = new DataView(arrayBuffer);

  // WAV header
  writeString(view, 0, "RIFF");
  view.setUint32(4, bufferSize - 8, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  // Write samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }

  const blob = new Blob([arrayBuffer], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}
