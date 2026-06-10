-- ============================================================
-- Migration DNA System — À exécuter dans le SQL Editor Supabase
-- Aller sur https://supabase.com/dashboard/project/lsabyfolyqlrvbseggit
-- Onglet "SQL Editor" → "New Query" → Copier-coller tout ce fichier → "Run"
-- ============================================================

-- 1. Ajouter les colonnes Studio au profil (si pas déjà fait)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS studio_access BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- 2. S'assurer que le profil admin/manager a les bonnes colonnes
-- (si la table profiles a été créée par Supabase Auth, certaines colonnes peuvent manquer)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='role') THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'creator';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='full_name') THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='email') THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- 3. Table principale : ADN du créateur
CREATE TABLE IF NOT EXISTS creator_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  section_1 JSONB,
  section_2 JSONB,
  section_3 JSONB,
  section_4 JSONB,
  section_5 JSONB,
  section_6 JSONB,
  section_7 JSONB,
  section_8 JSONB,

  voice_profile JSONB,
  style_profile JSONB,
  audience_profile JSONB,

  is_complete BOOLEAN DEFAULT FALSE,
  completion_pct INTEGER DEFAULT 0,
  last_updated_section INTEGER,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table d'historique des versions
CREATE TABLE IF NOT EXISTS creator_dna_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, version_number)
);

-- 5. Index
CREATE INDEX IF NOT EXISTS idx_creator_dna_creator ON creator_dna (creator_id);
CREATE INDEX IF NOT EXISTS idx_creator_dna_versions_creator ON creator_dna_versions (creator_id, version_number DESC);

-- 6. Auto-update updated_at
CREATE OR REPLACE FUNCTION update_creator_dna_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_creator_dna_updated ON creator_dna;
CREATE TRIGGER trigger_creator_dna_updated
  BEFORE UPDATE ON creator_dna
  FOR EACH ROW EXECUTE FUNCTION update_creator_dna_timestamp();

-- 7. Row Level Security
ALTER TABLE creator_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_dna_versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Creator owns DNA" ON creator_dna;
CREATE POLICY "Creator owns DNA" ON creator_dna
  FOR ALL
  USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Manager reads DNA" ON creator_dna;
CREATE POLICY "Manager reads DNA" ON creator_dna
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('manager', 'admin')
    )
  );

DROP POLICY IF EXISTS "Creator owns DNA versions" ON creator_dna_versions;
CREATE POLICY "Creator owns DNA versions" ON creator_dna_versions
  FOR ALL
  USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Manager reads DNA versions" ON creator_dna_versions;
CREATE POLICY "Manager reads DNA versions" ON creator_dna_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('manager', 'admin')
    )
  );

-- 8. Créer le profil pour ton utilisateur (si pas déjà fait)
INSERT INTO profiles (id, full_name, email, role, studio_access)
VALUES ('0bc147e9-b1ab-4b16-8570-54ca7008ea04', 'Créateur', NULL, 'creator', FALSE)
ON CONFLICT (id) DO NOTHING;

-- Résultat
SELECT '✅ Migration DNA terminée !' AS result;
