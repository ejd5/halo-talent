-- Migration: Halo Lex — Knowledge Base vectorielle + RAG
-- Tables pour le stockage, chunking, embedding et recherche
-- sémantique de la base juridique de Halo Lex.
--
-- Dépend de : pgvector (déjà activé via migration 031)

-- ============================================================
-- TABLE 1: legal_sources (sources amont)
-- ============================================================
CREATE TABLE IF NOT EXISTS legal_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type TEXT NOT NULL,        -- 'cgu_platform', 'law', 'jurisprudence', 'case_law', 'internal'
  source_name TEXT NOT NULL,
  url TEXT,
  jurisdiction TEXT DEFAULT 'international',
  language TEXT DEFAULT 'fr',
  current_version_hash TEXT,
  last_checked_at TIMESTAMPTZ,
  last_updated_at TIMESTAMPTZ,
  update_frequency TEXT DEFAULT 'weekly', -- 'daily', 'weekly', 'monthly'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE 2: legal_documents (versions spécifiques des sources)
-- ============================================================
CREATE TABLE IF NOT EXISTS legal_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES legal_sources(id) ON DELETE CASCADE,
  document_title TEXT NOT NULL,
  document_reference TEXT,          -- ex: "Art. 1171", "CGU v2026.04"
  effective_date DATE,
  version_hash TEXT NOT NULL,       -- SHA-256 du full_text
  full_text TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  ingested_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- TABLE 3: legal_chunks (chunks vectorisés)
-- ============================================================
CREATE TABLE IF NOT EXISTS legal_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES legal_documents(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_summary TEXT,
  embedding VECTOR(1024),
  tags TEXT[] DEFAULT '{}',
  complexity_level INT DEFAULT 3 CHECK (complexity_level BETWEEN 1 AND 5),
  use_cases TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS : service_role uniquement (comme legal_source_snapshots)
-- ============================================================
ALTER TABLE legal_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON legal_sources
  FOR ALL USING (false) WITH CHECK (false);

ALTER TABLE legal_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON legal_documents
  FOR ALL USING (false) WITH CHECK (false);

ALTER TABLE legal_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role only" ON legal_chunks
  FOR ALL USING (false) WITH CHECK (false);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_legal_chunks_embedding
  ON legal_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE INDEX IF NOT EXISTS idx_legal_chunks_tags
  ON legal_chunks USING GIN (tags);

CREATE INDEX IF NOT EXISTS idx_legal_chunks_document
  ON legal_chunks (document_id);

CREATE INDEX IF NOT EXISTS idx_legal_documents_source
  ON legal_documents (source_id);

-- ============================================================
-- RECHERCHE VECTORIELLE — RPC function
-- ============================================================
CREATE OR REPLACE FUNCTION match_legal_chunks(
  p_embedding VECTOR(1024),
  p_match_threshold FLOAT DEFAULT 0.7,
  p_match_count INT DEFAULT 10,
  p_tags TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  chunk_text TEXT,
  chunk_summary TEXT,
  document_title TEXT,
  source_name TEXT,
  source_url TEXT,
  tags TEXT[],
  complexity_level INT,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.chunk_text,
    c.chunk_summary,
    d.document_title,
    s.source_name,
    s.url AS source_url,
    c.tags,
    c.complexity_level,
    1 - (c.embedding <=> p_embedding) AS similarity
  FROM legal_chunks c
  JOIN legal_documents d ON d.id = c.document_id
  JOIN legal_sources s ON s.id = d.source_id
  WHERE 1 - (c.embedding <=> p_embedding) > p_match_threshold
    AND (p_tags IS NULL OR c.tags && p_tags)
  ORDER BY similarity DESC
  LIMIT p_match_count;
END;
$$;

-- Seed initial : les sources juridiques de base
INSERT INTO legal_sources (source_type, source_name, url, jurisdiction, language, update_frequency) VALUES
  ('cgu_platform', 'OnlyFans Terms of Service', 'https://onlyfans.com/terms', 'international', 'en', 'weekly'),
  ('cgu_platform', 'Fansly Terms of Service', 'https://fansly.com/tos', 'international', 'en', 'weekly'),
  ('cgu_platform', 'MYM Conditions Générales', 'https://www.mym.fans/terms', 'france', 'fr', 'weekly'),
  ('law', 'Code civil français', NULL, 'france', 'fr', 'monthly'),
  ('law', 'Code de la propriété intellectuelle', NULL, 'france', 'fr', 'monthly'),
  ('law', 'RGPD — Règlement 2016/679', NULL, 'europe', 'fr', 'monthly'),
  ('law', 'Digital Services Act — Règlement 2022/2065', NULL, 'europe', 'en', 'monthly'),
  ('jurisprudence', 'Cour de cassation', NULL, 'france', 'fr', 'daily'),
  ('jurisprudence', 'CJUE', NULL, 'europe', 'fr', 'daily')
ON CONFLICT DO NOTHING;

NOTIFY pgrst, 'reload schema';
