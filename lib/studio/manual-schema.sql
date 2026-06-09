-- Migration : manual_publications table
-- Pour OnlyFans, MYM, Fansly — pas d'API publique, publication manuelle

CREATE TABLE IF NOT EXISTS manual_publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('onlyfans', 'mym', 'fansly')),
  content JSONB NOT NULL DEFAULT '{}',
  scheduled_for TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'copied', 'published', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE manual_publications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'manual_publications' AND policyname = 'Creator owns manual publications'
  ) THEN
    CREATE POLICY "Creator owns manual publications" ON manual_publications
      FOR ALL USING (auth.uid() = creator_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_manual_pub_creator_status ON manual_publications(creator_id, status);
