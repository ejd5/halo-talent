-- ─── Compliance Drafter - Colonnes supplémentaires ───────────
-- Ajoute les colonnes nécessaires au système de drafts conforme 2026

ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS prompt JSONB DEFAULT '{}'::jsonb;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS full_response JSONB DEFAULT '{}'::jsonb;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS approach TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS compliance_check JSONB DEFAULT '{}'::jsonb;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS warnings JSONB DEFAULT '[]'::jsonb;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS ai_warnings JSONB DEFAULT '[]'::jsonb;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS generated_with_model TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS intent TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS platform TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS creator_ip TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS requires_disclosure BOOLEAN DEFAULT FALSE;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS moderation_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS moderation_reason TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS edit_history JSONB DEFAULT '[]'::jsonb;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS sent_channel TEXT;

-- Extension du CHECK status pour inclure 'draft' et 'failed'
ALTER TABLE atlas_drafts DROP CONSTRAINT IF EXISTS atlas_drafts_status_check;
ALTER TABLE atlas_drafts ADD CONSTRAINT atlas_drafts_status_check
  CHECK (status IN ('pending','approved','rejected','sent','draft','failed'));

-- ─── Table d'audit (rétention 7 ans) ──────────────────────
-- Conserve le payload complet pour preuve juridique

CREATE TABLE IF NOT EXISTS atlas_draft_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draft_id UUID REFERENCES atlas_drafts(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('generated','approved','rejected','edited','sent','failed')),
  platform TEXT,
  intent TEXT,
  prompt_sent TEXT,
  response_received TEXT,
  compliance_checks JSONB DEFAULT '{}'::jsonb,
  creator_ip TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
) WITH (autovacuum_enabled = false);

CREATE INDEX IF NOT EXISTS idx_draft_audit_creator ON atlas_draft_audit(creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_draft_audit_draft ON atlas_draft_audit(draft_id);
CREATE INDEX IF NOT EXISTS idx_draft_audit_action ON atlas_draft_audit(action);

ALTER TABLE atlas_draft_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "creator_select_draft_audit"
  ON atlas_draft_audit FOR SELECT
  USING (creator_id IN (SELECT id FROM profiles WHERE auth.uid() = id));

CREATE POLICY "insert_draft_audit"
  ON atlas_draft_audit FOR INSERT
  WITH CHECK (true);
