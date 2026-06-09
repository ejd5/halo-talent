-- ─── Pro Mode — Acknowledgment ─────────────────────────────────
-- Migration 019: Pro Mode third-party tool acknowledgment system
-- Ensures Zero Ban Guarantee by requiring explicit disclaimer acceptance

CREATE TABLE pro_mode_acknowledgments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  acknowledged_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  version TEXT DEFAULT 'v1.0'
);

ALTER TABLE pro_mode_acknowledgments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator owns ack" ON pro_mode_acknowledgments
  FOR ALL USING (auth.uid() = creator_id);

CREATE INDEX idx_pro_mode_ack_creator ON pro_mode_acknowledgments(creator_id);
