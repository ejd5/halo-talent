-- Migration: Halo Lex — Questionnaires & diagnostic history
-- Stocke les questionnaires guidés et leurs diagnostics associés.
--
-- Dépend de : auth.users, generated_letters (030)

-- ============================================================
-- TABLE: lex_questionnaires
-- ============================================================
CREATE TABLE IF NOT EXISTS lex_questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  -- Propriétaire
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Étape 1 — Plateformes
  platforms TEXT[] DEFAULT '{}',

  -- Étape 2 — Type de problème
  problem_type TEXT,

  -- Étape 3 — Détails
  problem_timing TEXT,
  problem_description TEXT,
  platform_message TEXT,

  -- Étape 4 — Documents
  documents TEXT[] DEFAULT '{}',

  -- Étape 5 — Objectifs
  objectives TEXT[] DEFAULT '{}',
  urgency TEXT DEFAULT 'Modéré',

  -- Résultat du diagnostic
  diagnosis TEXT,
  status TEXT DEFAULT 'draft',   -- 'draft', 'completed', 'letter_generated', 'escalated'

  -- Lien vers une lettre générée
  letter_id UUID REFERENCES generated_letters(id) ON DELETE SET NULL,

  -- Métadonnées
  metadata JSONB DEFAULT '{}'
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_lex_questionnaires_user ON lex_questionnaires (user_id);
CREATE INDEX idx_lex_questionnaires_created ON lex_questionnaires (created_at DESC);
CREATE INDEX idx_lex_questionnaires_status ON lex_questionnaires (status);

-- ============================================================
-- RLS : utilisateur voit ses questionnaires, admin voit tout
-- ============================================================
ALTER TABLE lex_questionnaires ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own questionnaires" ON lex_questionnaires
  FOR ALL USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Insert questionnaires" ON lex_questionnaires
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR user_id IS NULL
  );

NOTIFY pgrst, 'reload schema';
