import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ═══════════════════════════════════════════════
// BYOK, Bring Your Own Key
// GET  → récupérer les clés (masquées)
// POST → sauvegarder les clés
// ═══════════════════════════════════════════════

const PROVIDERS = [
  { key: "anthropic_key", label: "Anthropic (Claude)", testUrl: "https://api.anthropic.com/v1/messages" },
  { key: "replicate_key", label: "Replicate", testUrl: "https://api.replicate.com/v1/models" },
  { key: "openai_key", label: "OpenAI", testUrl: "https://api.openai.com/v1/models" },
  { key: "runway_key", label: "Runway", testUrl: null },
  { key: "elevenlabs_key", label: "ElevenLabs", testUrl: "https://api.elevenlabs.io/v1/voices" },
  { key: "huggingface_key", label: "HuggingFace", testUrl: "https://api-inference.huggingface.co/models" },
];

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { data: apiKeys } = await supabase
      .from("user_api_keys")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!apiKeys) {
      return NextResponse.json({
        providers: PROVIDERS.map((p) => ({
          id: p.key,
          label: p.label,
          has_key: false,
          enabled: false,
          key_preview: null,
        })),
        byok_enabled_for: [],
      });
    }

    return NextResponse.json({
      providers: PROVIDERS.map((p) => ({
        id: p.key,
        label: p.label,
        has_key: !!apiKeys[p.key],
        enabled: (apiKeys.byok_enabled_for ?? []).includes(p.key.replace("_key", "")),
        key_preview: apiKeys[p.key]
          ? `${apiKeys[p.key].slice(0, 8)}...${apiKeys[p.key].slice(-4)}`
          : null,
      })),
      byok_enabled_for: apiKeys.byok_enabled_for ?? [],
    });
  } catch (err) {
    console.error("[BYOK GET] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();

    // Validate that only known provider keys are submitted
    const validKeys = PROVIDERS.map((p) => p.key);
    const updateData: Record<string, string | null> = {};
    let hasChanges = false;

    for (const key of validKeys) {
      if (key in body) {
        updateData[key] = body[key] || null;
        hasChanges = true;
      }
    }

    // Handle byok_enabled_for toggle
    if (body.byok_enabled_for !== undefined) {
      updateData.byok_enabled_for = body.byok_enabled_for;
      hasChanges = true;
    }

    if (!hasChanges) {
      return NextResponse.json({ error: "Aucune donnée à mettre à jour" }, { status: 400 });
    }

    updateData.updated_at = new Date().toISOString();

    const { error } = await supabase.from("user_api_keys").upsert(
      { user_id: user.id, ...updateData },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("[BYOK UPSERT] Error:", error);
      return NextResponse.json({ error: "Erreur de sauvegarde" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[BYOK POST] Error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ─── Test key endpoint ───

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider_key, key_value } = body;

    if (!provider_key || !key_value) {
      return NextResponse.json({ error: "provider_key et key_value requis" }, { status: 400 });
    }

    const provider = PROVIDERS.find((p) => p.key === provider_key);
    if (!provider) {
      return NextResponse.json({ error: "Provider inconnu" }, { status: 400 });
    }

    if (!provider.testUrl) {
      return NextResponse.json({ success: true, message: "Test non disponible" });
    }

    const res = await fetch(provider.testUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${key_value}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    }

    const errData = await res.text();
    return NextResponse.json({
      success: false,
      error: `Erreur ${res.status}: ${errData.slice(0, 200)}`,
    });
  } catch (err) {
    console.error("[BYOK TEST] Error:", err);
    return NextResponse.json({ error: "Erreur de test" }, { status: 500 });
  }
}
