-- ─── Smart Messages — Campagnes de drafts personnalisés ───
-- Migration 025: Génération en masse, validation humaine, envoi

CREATE TABLE atlas_smart_messages_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT,
  segment_id UUID REFERENCES atlas_segments(id),
  platform TEXT,
  tone TEXT,
  goal TEXT,
  brief TEXT,
  variables JSONB,
  total_drafts INTEGER DEFAULT 0,
  validated_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  rejected_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'generating' CHECK (status IN ('generating', 'ready_for_validation', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_campaigns_creator ON atlas_smart_messages_campaigns(creator_id, status);

ALTER TABLE atlas_smart_messages_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns campaigns" ON atlas_smart_messages_campaigns FOR ALL USING (auth.uid() = creator_id);
