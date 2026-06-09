-- Content Calendar System
-- Migration 029

CREATE TABLE content_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  content_type TEXT CHECK (content_type IN ('post', 'reel', 'story', 'live', 'video', 'ppv')),
  draft_id UUID,
  scheduled_for TIMESTAMPTZ NOT NULL,
  published_at TIMESTAMPTZ,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'published', 'failed', 'cancelled')),
  title TEXT,
  preview_url TEXT,
  hashtags TEXT[],
  campaign_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_calendar_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  theme TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  required_hashtags TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'completed', 'cancelled')),
  created_by UUID REFERENCES team_members(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE content_calendar_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  profile_type TEXT,
  weekly_schedule JSONB NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_cce_creator_date ON content_calendar_events(creator_id, scheduled_for);
CREATE INDEX idx_cce_status ON content_calendar_events(status, scheduled_for);
CREATE INDEX idx_cce_campaign ON content_calendar_events(campaign_id);
CREATE INDEX idx_ccc_status ON content_calendar_campaigns(status);

-- Enable RLS
ALTER TABLE content_calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_calendar_templates ENABLE ROW LEVEL SECURITY;

-- RLS: events
CREATE POLICY "cce_admin_all" ON content_calendar_events
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'owner')));

CREATE POLICY "cce_manager_read" ON content_calendar_events
  FOR SELECT USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('manager', 'admin', 'owner')));

CREATE POLICY "cce_creator_own" ON content_calendar_events
  FOR ALL USING (auth.uid() = creator_id);

-- RLS: campaigns
CREATE POLICY "ccc_admin_all" ON content_calendar_campaigns
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'owner')));

CREATE POLICY "ccc_read" ON content_calendar_campaigns
  FOR SELECT USING (TRUE);

-- RLS: templates
CREATE POLICY "cct_admin_all" ON content_calendar_templates
  FOR ALL USING (auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'owner')));

CREATE POLICY "cct_read" ON content_calendar_templates
  FOR SELECT USING (TRUE);
