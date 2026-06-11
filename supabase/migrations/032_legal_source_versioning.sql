-- Migration: Legal CGU Versioning — snapshots traçables + change events
-- Capture les versions successives des CGU scrappées pour permettre
-- un diff entre versions et un historique traçable des évolutions.
-- Conçu pour être alimenté par legal-scan cron (sans le modifier ici).

-- ============================================================
-- TABLE 1: legal_source_snapshots (archives de CGU)
-- ============================================================
CREATE TABLE legal_source_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Identification de la source
  platform TEXT NOT NULL,        -- 'onlyfans', 'fansly', 'mym', etc.
  doc_type TEXT NOT NULL,        -- 'terms_of_service', 'acceptable_use', 'privacy_policy', 'creator_guidelines'
  source_url TEXT NOT NULL,       -- URL exacte au moment du snapshot
  doc_version TEXT,              -- Version indiquée par la plateforme (ex: "v2026.04")

  -- Contenu
  raw_content TEXT NOT NULL,     -- Le texte brut scrappé (HTML stripped)
  content_hash TEXT NOT NULL,    -- hash SHA-256 du raw_content pour détection de changements

  -- Métadonnées de capture
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  fetch_method TEXT DEFAULT 'scraper', -- 'scraper', 'api', 'manual'
  fetch_success BOOLEAN DEFAULT true,
  fetch_error TEXT,              -- Message d'erreur si échec
  response_size_bytes INT,       -- Taille de la réponse
  is_active BOOLEAN DEFAULT true,

  -- Contrainte d'unicité sur le hash pour éviter les doublons
  CONSTRAINT unique_content_hash UNIQUE (content_hash)
);

-- ============================================================
-- TABLE 2: legal_change_events (deltas détectés)
-- ============================================================
CREATE TABLE legal_change_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Référence aux snapshots (avant / après)
  previous_snapshot_id UUID REFERENCES legal_source_snapshots(id) ON DELETE SET NULL,
  new_snapshot_id UUID REFERENCES legal_source_snapshots(id) ON DELETE SET NULL,

  -- Contexte du changement
  platform TEXT NOT NULL,
  doc_type TEXT NOT NULL,
  source_url TEXT,

  -- Analyse du changement
  summary TEXT NOT NULL,                 -- Résumé IA du changement (1-3 phrases)
  impact_level TEXT DEFAULT 'minor',     -- 'critical', 'major', 'minor', 'none'
  affected_articles TEXT[],              -- Liste des articles/sections modifiés
  human_reviewed BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,

  -- Publication
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_legal_snapshots_lookup
  ON legal_source_snapshots(platform, doc_type, fetched_at DESC);

CREATE INDEX idx_legal_snapshots_hash
  ON legal_source_snapshots(content_hash);

CREATE INDEX idx_legal_change_events_platform
  ON legal_change_events(platform, doc_type, created_at DESC);

CREATE INDEX idx_legal_change_events_published
  ON legal_change_events(published, human_reviewed)
  WHERE published = true AND human_reviewed = true;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- legal_source_snapshots : accessible uniquement par service_role
-- (service_role bypass RLS, donc USING(false) bloque anon/authenticated)
ALTER TABLE legal_source_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Block anon all" ON legal_source_snapshots
  FOR ALL USING (false)
  WITH CHECK (false);

-- legal_change_events : écriture service_role seulement,
-- lecture publique uniquement sur les événements publiés + vérifiés
ALTER TABLE legal_change_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role write" ON legal_change_events
  FOR ALL USING (false)
  WITH CHECK (false);

CREATE POLICY "Public read reviewed" ON legal_change_events
  FOR SELECT USING (published = true AND human_reviewed = true);

-- ============================================================
-- NOTIFY pour recharger le schéma
-- ============================================================
NOTIFY pgrst, 'reload schema';
