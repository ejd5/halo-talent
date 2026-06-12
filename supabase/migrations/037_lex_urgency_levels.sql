-- Migration: Add Urgent priority level + LX-YYYY-XXXX reference format
-- Tasks 78-79: 3 urgency tiers (Standard/Urgent/Express) + human-readable references

-- ============================================================
-- 1. Add 'urgent' to letter_priority enum
-- ============================================================
ALTER TYPE letter_priority ADD VALUE IF NOT EXISTS 'urgent';

-- ============================================================
-- 2. Add reference column to letter_requests
-- ============================================================
ALTER TABLE letter_requests
  ADD COLUMN IF NOT EXISTS reference VARCHAR(20);

-- Unique index on reference
CREATE UNIQUE INDEX IF NOT EXISTS idx_lr_reference ON letter_requests (reference)
  WHERE reference IS NOT NULL;

-- ============================================================
-- 3. Admin notifications table (Task 81)
-- ============================================================
CREATE TABLE IF NOT EXISTS lex_admin_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  notification_type VARCHAR(50) NOT NULL,
  -- 'daily_recap', 'deadline_4h', 'late_alert', 'new_request'

  request_id UUID REFERENCES letter_requests(id) ON DELETE SET NULL,
  recipient_admin_id UUID REFERENCES auth.users(id),

  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  is_sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,

  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_lan_admin ON lex_admin_notifications (recipient_admin_id, is_read);
CREATE INDEX IF NOT EXISTS idx_lan_type ON lex_admin_notifications (notification_type);

ALTER TABLE lex_admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin only" ON lex_admin_notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

NOTIFY pgrst, 'reload schema';
