-- ─── Atlas — Inbox Unifié ──────────────────────────────────
-- Migration 011: Enhanced drafts, fan context, conversation read status

-- ============================================================
-- 1. UPDATE atlas_drafts — add engagement scoring, editing, audit
-- ============================================================
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS approach TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS estimated_engagement INTEGER;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS edited_text TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS sent_via TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS ai_warning TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS generator_prompt TEXT;
ALTER TABLE atlas_drafts ADD COLUMN IF NOT EXISTS original_content TEXT;

-- Widen status check to include new draft workflow states
DO $$ BEGIN
  EXECUTE (
    SELECT 'ALTER TABLE atlas_drafts DROP CONSTRAINT ' || quote_ident(conname)
    FROM pg_constraint
    WHERE conrelid = 'atlas_drafts'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%status%'
    LIMIT 1
  );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
ALTER TABLE atlas_drafts ADD CONSTRAINT atlas_drafts_status_check
  CHECK (status IN ('pending','pending_validation','approved','edited','rejected','sent'));

-- ============================================================
-- 2. FAN READ STATUS — track unread conversations per creator
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_conversation_read (
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (fan_id, creator_id)
);

ALTER TABLE atlas_conversation_read ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns read status" ON atlas_conversation_read FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 3. COMPLIANCE AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns audit logs" ON atlas_audit_log FOR ALL USING (auth.uid() = creator_id);
