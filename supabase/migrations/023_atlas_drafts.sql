-- ─── Sovereign Chat — Drafts IA avec audit compliance ───
-- Migration 023: Drafts validés manuellement, conformes aux règles 2026

CREATE TABLE atlas_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('onlyfans', 'instagram', 'tiktok', 'mym', 'fansly', 'email', 'sms')),
  intent TEXT,
  draft_text TEXT NOT NULL,
  edited_text TEXT,
  approach TEXT,
  rationale TEXT,
  warnings JSONB,
  compliance_check JSONB,
  estimated_engagement INTEGER,
  status TEXT DEFAULT 'pending_validation' CHECK (status IN ('pending_validation', 'edited', 'sent', 'rejected')),
  sent_at TIMESTAMPTZ,
  sent_via TEXT,
  generated_with_model TEXT,
  generation_prompt JSONB,
  smart_message_campaign_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance settings (per creator)
CREATE TABLE sovereign_chat_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  auto_disclaimer_email BOOLEAN DEFAULT true,
  watermark_ai_assisted BOOLEAN DEFAULT true,
  detailed_audit_logging BOOLEAN DEFAULT true,
  reject_on_ai_warning BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_drafts_status ON atlas_drafts(creator_id, status);
CREATE INDEX idx_drafts_fan ON atlas_drafts(fan_id);
CREATE INDEX idx_drafts_campaign ON atlas_drafts(smart_message_campaign_id);
CREATE INDEX idx_drafts_created ON atlas_drafts(creator_id, created_at DESC);

-- RLS
ALTER TABLE atlas_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sovereign_chat_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator owns drafts" ON atlas_drafts FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Creator owns settings" ON sovereign_chat_settings FOR ALL USING (auth.uid() = creator_id);
