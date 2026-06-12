import { type NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

const SAMPLE_DATA: Record<number, Record<string, unknown>> = {
  1: {
    essence: ["Authentique", "Créative", "Déterminée"],
    why: "Je crée pour inspirer les autres à poursuivre leurs rêves, même quand tout semble impossible.",
    references: "Léna Situations, Emma Chamberlain, Casey Neistat",
    primary_quality: "Authenticité",
  },
  2: {
    tone: { formality: 30, humor: 70, mystery: 20, warmth: 85, boldness: 65, luxury: 25, spirituality: 15, expressiveness: 80 },
    emoji_usage: "Beaucoup",
    signature_emojis: ["🔥", "✨", "💫", "❤️", "🙏"],
    phrases: ["Franchement les amis, aujourd'hui on va parler d'un sujet qui me tient VRAIMENT à cœur", "J'ai testé ça pendant 30 jours et voilà ce qui s'est passé...", "Vous n'imaginez même pas ce qui m'est arrivé hier"],
    sign_off: "Je vous embrasse fort, à demain 🔥",
  },
  3: {
    audience_desc: "Mon fan idéal a entre 22 et 35 ans, vit en zone urbaine, travaille dans le marketing, la tech ou l'entrepreneuriat.",
    avg_age: 27,
    top_topics: ["Développement personnel", "Coulisses de la création", "Voyages"],
  },
  4: {
    mood_cards: ["minimal", "chaud", "nature", "lumineux", "soft"],
    colors: ["var(--or, #D8A95B)", "#F5F0EB", "#2D1B69"],
    photo_style: "natural",
    visual_inspirations: "Magazines Kinfolk, direction photo Christopher Nolan, minimalisme japonais",
  },
  5: {
    formats: { photos: 9, reels: 7, lives: 3, "long-videos": 6, stories: 8, podcasts: 4, writing: 5, streaming: 0 },
    weekly_output: 8,
    favorite_topics: "Mindset, Productivité, Voyages, Santé mentale, Tech",
  },
  6: {
    hard_limits: ["Contenu explicite", "Violence", "Propos haineux ou discriminatoires", "Contenu politique", "Armes"],
    limits_details: "Je refuse tout partenariat avec des marques d'alcool ou de paris sportifs.",
    transparency: 7,
    collaborations: "Sélectif",
  },
  7: {
    goals: [
      { objective: "Atteindre 500K followers", metric: "500 000 followers", deadline: "Décembre 2026" },
      { objective: "Lancer ma marque", metric: "Première collection", deadline: "Mars 2027" },
      { objective: "Podcast hebdomadaire", metric: "10K écoutes/épisode", deadline: "Septembre 2026" },
    ],
    ultimate_dream: "Avoir ma propre maison de production.",
    blockers: "Manque de temps, syndrome de l'imposteur.",
    ambition_balance: 6,
  },
  8: {
    schedule: {
      Lun: [8, 9, 10, 11, 14, 15, 16],
      Mar: [8, 9, 10, 11, 14, 15, 16],
      Mer: [8, 9, 10, 11, 14, 15],
      Jeu: [8, 9, 10, 11, 14, 15, 16],
      Ven: [8, 9, 10, 11, 14, 15],
      Sam: [10, 11, 12],
      Dim: [],
    },
    hours_per_week: 35,
    break_days: ["Dim"],
  },
};

export async function POST(request: NextRequest) {
  const diagnostics: string[] = [];

  try {
    // Auth
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    diagnostics.push(`Auth: user=${user?.id ?? "null"}, error=${authError?.message ?? "none"}`);

    if (!user) {
      return NextResponse.json({ success: false, error: "Non autorisé", diagnostics }, { status: 401 });
    }

    const adminDb = createAdminClient();
    diagnostics.push("Admin client created");

    // ── Auto-migration: create tables/columns if missing ──
    diagnostics.push("Running auto-migration...");

    // Use Supabase's raw SQL via the REST API
    const MIGRATION_SQL = `
-- Add columns to profiles
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS studio_access BOOLEAN DEFAULT FALSE;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'creator';
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Create creator_dna
CREATE TABLE IF NOT EXISTS creator_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID UNIQUE NOT NULL,
  section_1 JSONB, section_2 JSONB, section_3 JSONB, section_4 JSONB,
  section_5 JSONB, section_6 JSONB, section_7 JSONB, section_8 JSONB,
  voice_profile JSONB, style_profile JSONB, audience_profile JSONB,
  is_complete BOOLEAN DEFAULT FALSE, completion_pct INTEGER DEFAULT 0,
  last_updated_section INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create creator_dna_versions
CREATE TABLE IF NOT EXISTS creator_dna_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, version_number)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_creator_dna_creator ON creator_dna (creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_dna_versions_creator ON creator_dna_versions (creator_id, version_number DESC);

-- RLS
ALTER TABLE IF EXISTS creator_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS creator_dna_versions ENABLE ROW LEVEL SECURITY;
`.trim();

    try {
      const migrationRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          },
        }
      );
      diagnostics.push(`Migration rpc/exec_sql: status=${migrationRes.status}`);
    } catch (e) {
      diagnostics.push(`Migration via rpc failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Try running SQL via the sql endpoint directly
    try {
      const sqlRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/sql`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({ query: MIGRATION_SQL }),
        }
      );
      const sqlText = await sqlRes.text();
      diagnostics.push(`Migration /sql: status=${sqlRes.status}, body=${sqlText.substring(0, 200)}`);
    } catch (e) {
      diagnostics.push(`Migration via /sql failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Try creating tables via native PostgREST
    try {
      // Tables may already be created above; test
      const { data: tableCheck, error: tableError } = await adminDb
        .from("creator_dna")
        .select("id")
        .limit(1);
      diagnostics.push(`Table check after migration: data=${!!tableCheck}, error=${tableError?.message ?? "none"}, code=${tableError?.code ?? "none"}`);
    } catch (e) {
      diagnostics.push(`Table check error: ${e instanceof Error ? e.message : String(e)}`);
    }

    // Ensure profile exists
    const { data: profile } = await adminDb
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();
    if (!profile) {
      diagnostics.push("No profile found — creating one");
      const { error: profileError } = await adminDb.from("profiles").insert({
        id: user.id,
        role: "creator",
        studio_access: false,
      });
      if (profileError) {
        diagnostics.push(`Profile creation FAILED: ${profileError.message} (code: ${profileError.code})`);
      } else {
        diagnostics.push("Profile created OK");
      }
    } else {
      diagnostics.push("Profile found OK");
    }

    // Upsert all 8 sections
    const insertData: Record<string, unknown> = {
      creator_id: user.id,
      last_updated_section: 8,
      completion_pct: 100,
      is_complete: true,
    };

    for (let s = 1; s <= 8; s++) {
      insertData[`section_${s}`] = SAMPLE_DATA[s];
    }

    // Try upsert: first check if row exists
    const { data: existing } = await adminDb
      .from("creator_dna")
      .select("id")
      .eq("creator_id", user.id)
      .single();

    if (existing) {
      const { error: updateError } = await adminDb
        .from("creator_dna")
        .update(insertData)
        .eq("creator_id", user.id)
        .select();
      if (updateError) {
        diagnostics.push(`Update FAILED: ${updateError.message} (code: ${updateError.code})`);
        return NextResponse.json({ success: false, error: `Update error: ${updateError.message}`, diagnostics }, { status: 500 });
      }
      diagnostics.push("Update: OK");
    } else {
      const { error: insertError } = await adminDb
        .from("creator_dna")
        .insert(insertData)
        .select();
      if (insertError) {
        diagnostics.push(`Insert FAILED: ${insertError.message} (code: ${insertError.code}, details: ${JSON.stringify(insertError)})`);
        return NextResponse.json({ success: false, error: `Insert error: ${insertError.message}`, diagnostics }, { status: 500 });
      }
      diagnostics.push("Insert: OK");
    }

    // Verify
    const { data: verify } = await adminDb
      .from("creator_dna")
      .select("id, completion_pct, is_complete, section_1, section_2, section_3, section_4, section_5, section_6, section_7, section_8")
      .eq("creator_id", user.id)
      .single();

    const verifyRecord = verify as Record<string, unknown> | null;
    const sectionsFound = verifyRecord
      ? [1, 2, 3, 4, 5, 6, 7, 8].filter((s) => verifyRecord[`section_${s}`] != null).length
      : 0;

    diagnostics.push(`Verify: exists=${!!verify}, sections=${sectionsFound}/8, completion=${verify?.completion_pct ?? 0}%`);

    return NextResponse.json({
      success: true,
      message: `${sectionsFound}/8 sections seeded`,
      diagnostics,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    diagnostics.push(`Exception: ${message}`);
    return NextResponse.json({ success: false, error: message, diagnostics }, { status: 500 });
  }
}
