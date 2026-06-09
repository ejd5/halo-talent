-- ─── Atlas — SMS Campaigns ─────────────────────────────────
-- Migration 013: SMS type + Twilio tracking

-- Widen type check to include sms
DO $$ BEGIN
  EXECUTE (
    SELECT 'ALTER TABLE atlas_campaigns DROP CONSTRAINT ' || quote_ident(conname)
    FROM pg_constraint
    WHERE conrelid = 'atlas_campaigns'::regclass
      AND contype = 'c'
      AND pg_get_constraintdef(oid) LIKE '%type%'
    LIMIT 1
  );
EXCEPTION WHEN OTHERS THEN NULL;
END $$;
ALTER TABLE atlas_campaigns ADD CONSTRAINT atlas_campaigns_type_check
  CHECK (type IN ('newsletter','new_content','promo_ppv','welcome','reengagement','birthday','custom','sms'));

-- Add SMS-specific columns
ALTER TABLE atlas_campaigns ADD COLUMN IF NOT EXISTS message_text TEXT;
ALTER TABLE atlas_campaigns ADD COLUMN IF NOT EXISTS sms_cost_estimate NUMERIC(10,4) DEFAULT 0;
ALTER TABLE atlas_campaigns ADD COLUMN IF NOT EXISTS sms_cost_actual NUMERIC(10,4) DEFAULT 0;
ALTER TABLE atlas_campaigns ADD COLUMN IF NOT EXISTS time_restrictions JSONB DEFAULT '{"enabled": true, "quiet_hours_start": "21:00", "quiet_hours_end": "08:00"}'::jsonb;

-- Add Twilio/cost fields to campaign_sends
ALTER TABLE atlas_campaign_sends ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'email';
ALTER TABLE atlas_campaign_sends ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE atlas_campaign_sends ADD COLUMN IF NOT EXISTS cost NUMERIC(10,6) DEFAULT 0;
ALTER TABLE atlas_campaign_sends ADD COLUMN IF NOT EXISTS from_number TEXT;
ALTER TABLE atlas_campaign_sends ADD COLUMN IF NOT EXISTS to_number TEXT;
ALTER TABLE atlas_campaign_sends ADD COLUMN IF NOT EXISTS segments INTEGER DEFAULT 1;

-- Add twilio_webhook_logs for tracking inbound SMS and status
CREATE TABLE IF NOT EXISTS atlas_sms_webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message_sid TEXT,
  direction TEXT NOT NULL CHECK (direction IN ('inbound','status_callback')),
  from_number TEXT,
  to_number TEXT,
  body TEXT,
  keyword TEXT,
  status TEXT,
  error_code TEXT,
  raw_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_sms_webhook_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator can read sms webhook logs" ON atlas_sms_webhook_logs FOR SELECT USING (
  auth.uid() = creator_id OR creator_id IS NULL
);

-- Index for looking up by phone
CREATE INDEX IF NOT EXISTS idx_sms_webhook_from ON atlas_sms_webhook_logs(from_number);
CREATE INDEX IF NOT EXISTS idx_sms_webhook_sid ON atlas_sms_webhook_logs(message_sid);
