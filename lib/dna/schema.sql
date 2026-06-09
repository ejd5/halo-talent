-- ============================================================
-- Migration 00002: Creator DNA System
-- Stockage ADN, profils IA, embeddings vectoriels, versioning
-- ============================================================

-- 1. Active l'extension pgvector (cosine similarity search)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Ajoute les colonnes Studio au profil
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS studio_access BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;

-- 3. Table principale : ADN du créateur
CREATE TABLE IF NOT EXISTS creator_dna (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Stockage brut des réponses (8 sections du questionnaire)
  section_1 JSONB,  -- Identité
  section_2 JSONB,  -- Voice
  section_3 JSONB,  -- Audience
  section_4 JSONB,  -- Esthétique
  section_5 JSONB,  -- Contenu
  section_6 JSONB,  -- Tabous
  section_7 JSONB,  -- Objectifs
  section_8 JSONB,  -- Rythme

  -- Profils dérivés (générés par IA via finalizer)
  voice_profile JSONB,
  style_profile JSONB,
  audience_profile JSONB,

  -- Embeddings pour recherche sémantique (cosine similarity)
  voice_embedding VECTOR(1536),
  style_embedding VECTOR(1536),

  -- Statut
  is_complete BOOLEAN DEFAULT FALSE,
  completion_pct INTEGER DEFAULT 0,
  last_updated_section INTEGER,

  -- Métadonnées
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table d'historique : chaque finalisation crée une version
CREATE TABLE IF NOT EXISTS creator_dna_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  snapshot JSONB NOT NULL,  -- Copie complète du creator_dna au moment de la version
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, version_number)
);

-- ============================================================
-- INDEX
-- ============================================================

-- Accès rapide par creator_id (déjà unique, mais explicite)
CREATE INDEX IF NOT EXISTS idx_creator_dna_creator ON creator_dna (creator_id);

-- Recherche vectorielle : similarité cosinus sur voice_embedding
CREATE INDEX IF NOT EXISTS idx_creator_dna_voice_embedding
  ON creator_dna USING ivfflat (voice_embedding vector_cosine_ops)
  WITH (lists = 100);

-- Recherche vectorielle : similarité cosinus sur style_embedding
CREATE INDEX IF NOT EXISTS idx_creator_dna_style_embedding
  ON creator_dna USING ivfflat (style_embedding vector_cosine_ops)
  WITH (lists = 100);

-- Historique : trouver les versions d'un créateur
CREATE INDEX IF NOT EXISTS idx_creator_dna_versions_creator
  ON creator_dna_versions (creator_id, version_number DESC);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================

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

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE creator_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_dna_versions ENABLE ROW LEVEL SECURITY;

-- Creator : owns his DNA
CREATE POLICY "Creator owns DNA" ON creator_dna
  FOR ALL
  USING (auth.uid() = creator_id);

-- Manager/Admin : read-only DNA
CREATE POLICY "Manager reads DNA" ON creator_dna
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('manager', 'admin')
    )
  );

-- Creator : owns his versions
CREATE POLICY "Creator owns DNA versions" ON creator_dna_versions
  FOR ALL
  USING (auth.uid() = creator_id);

-- Manager/Admin : read-only versions
CREATE POLICY "Manager reads DNA versions" ON creator_dna_versions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
        AND role IN ('manager', 'admin')
    )
  );
