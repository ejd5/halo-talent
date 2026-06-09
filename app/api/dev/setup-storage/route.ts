import { NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Dev only" }, { status: 403 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const admin = createAdminClient();
  const results: Record<string, any> = {};

  // 1. Create media bucket
  const { data: bucket, error: bucketError } = await admin
    .storage
    .createBucket("media", { public: true, fileSizeLimit: 10485760 });

  results.bucket = bucket || "exists";
  results.bucket_error = bucketError?.message || null;

  // 2. Set bucket public
  await admin.storage.updateBucket("media", { public: true }).catch(() => {});

  // 3. Check media_library table exists
  try {
    const { data: tables } = await supabase.from("media_library").select("id").limit(1);
    results.media_library = tables !== null ? "exists" : "empty";
  } catch {
    results.media_library = "table does not exist";
  }

  // 4. Create media_library via raw SQL using service key
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (serviceKey && supabaseUrl) {
    const sqlRes = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
    });
    results.rpc_check = sqlRes.status;
  }

  // 5. Try direct SQL via Supabase SQL endpoint
  // The /sql endpoint is available in self-hosted Supabase
  // For managed Supabase, try the management API
  const sqlQuery = `
    CREATE TABLE IF NOT EXISTS media_library (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      url TEXT NOT NULL,
      type TEXT DEFAULT 'image',
      source TEXT DEFAULT 'ai_generated',
      ai_prompt TEXT,
      ai_model TEXT,
      ai_style TEXT,
      tags TEXT[] DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_library' AND policyname = 'Users see own media') THEN
        CREATE POLICY "Users see own media" ON media_library FOR SELECT USING (auth.uid() = creator_id);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_library' AND policyname = 'Users insert own media') THEN
        CREATE POLICY "Users insert own media" ON media_library FOR INSERT WITH CHECK (auth.uid() = creator_id);
      END IF;
    END $$;
  `;

  // Try via auth/v1/query (Supabase internal)
  if (supabaseUrl && serviceKey) {
    const queryRes = await fetch(`${supabaseUrl}/auth/v1/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": serviceKey,
        "Authorization": `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ query: sqlQuery }),
    });
    results.sql_query_status = queryRes.status;
    if (queryRes.ok) {
      results.sql_query_result = "ok";
    } else {
      const errText = await queryRes.text();
      results.sql_query_error = errText.slice(0, 200);
    }
  }

  // Verify
  try {
    const { data: test } = await supabase.from("media_library").select("id").limit(1);
    results.verified = test !== null ? "table exists" : "empty";
  } catch {
    results.verified = "still missing";
  }

  return NextResponse.json(results);
}
