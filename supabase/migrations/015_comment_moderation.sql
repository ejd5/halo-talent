-- ─── Comment Moderation — Public Comments Manager ───
-- Migration 015: Unified inbox, auto-reply rules, response templates, moderation actions

-- ============================================================
-- 1. ATLAS COMMENTS (unified inbox)
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Platform identification
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'twitter', 'facebook')),
  external_comment_id TEXT,
  post_id TEXT,
  post_url TEXT,
  parent_comment_id TEXT,  -- for replies to replies

  -- Author
  author_external_id TEXT,
  author_username TEXT,
  author_display_name TEXT,
  author_avatar TEXT,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,

  -- Content
  content TEXT NOT NULL,
  detected_language TEXT DEFAULT 'fr',

  -- AI analysis
  sentiment TEXT CHECK (sentiment IN ('very_positive', 'positive', 'neutral', 'negative', 'very_negative')),
  intent TEXT CHECK (intent IN ('compliment', 'question', 'complaint', 'spam', 'promotion', 'general', 'harassment')),
  is_spam BOOLEAN DEFAULT FALSE,
  contains_link BOOLEAN DEFAULT FALSE,
  ai_analysis JSONB DEFAULT '{}'::jsonb,

  -- Engagement metrics
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'approved', 'replied', 'hidden', 'deleted', 'flagged')),
  moderation_action TEXT CHECK (moderation_action IN ('none', 'auto_approved', 'auto_hidden', 'auto_replied', 'flagged_review')),

  -- Auto-reply tracking
  auto_reply_id UUID,
  auto_reply_content TEXT,
  replied_at TIMESTAMPTZ,

  -- Timestamps
  occurred_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(creator_id, platform, external_comment_id)
);

CREATE INDEX IF NOT EXISTS idx_atlas_comments_creator ON atlas_comments(creator_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_atlas_comments_status ON atlas_comments(creator_id, status);
CREATE INDEX IF NOT EXISTS idx_atlas_comments_platform ON atlas_comments(creator_id, platform);
CREATE INDEX IF NOT EXISTS idx_atlas_comments_intent ON atlas_comments(creator_id, intent);

ALTER TABLE atlas_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns comments"
  ON atlas_comments FOR ALL
  USING (auth.uid() = creator_id);

-- ============================================================
-- 2. COMMENT AUTO-REPLY RULES
-- ============================================================
CREATE TABLE IF NOT EXISTS comment_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 0,  -- lower = higher priority

  -- Trigger conditions (JSONB for flexibility)
  conditions JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- {
  --   "operator": "and" | "or",
  --   "conditions": [
  --     { "field": "sentiment", "operator": "in", "value": ["very_positive", "positive"] },
  --     { "field": "intent", "operator": "eq", "value": "compliment" },
  --     { "field": "contains_link", "operator": "eq", "value": true },
  --     { "field": "content_match", "operator": "contains", "value": "?" },
  --     { "field": "fan_tier", "operator": "in", "value": ["whale", "vip"] },
  --   ]
  -- }

  -- Actions
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- [
  --   { "type": "like", "enabled": true },
  --   {
  --     "type": "auto_reply",
  --     "template_id": "...",
  --     "probability": 80,
  --     "variations": true
  --   },
  --   { "type": "hide", "enabled": true },
  --   { "type": "notify", "enabled": true }
  -- ]

  execution_count INTEGER DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comment_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns comment rules"
  ON comment_rules FOR ALL
  USING (auth.uid() = creator_id);

-- ============================================================
-- 3. RESPONSE TEMPLATES (with variations)
-- ============================================================
CREATE TABLE IF NOT EXISTS comment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  responses TEXT[] NOT NULL DEFAULT '{}',  -- array of response variations
  language TEXT DEFAULT 'fr',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comment_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns comment templates"
  ON comment_templates FOR ALL
  USING (auth.uid() = creator_id);

-- ============================================================
-- 4. COMMENT ACTIONS LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS comment_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES atlas_comments(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('reply', 'like', 'hide', 'unhide', 'delete', 'approve', 'flag', 'auto_reply', 'auto_hide')),
  content TEXT,
  success BOOLEAN DEFAULT TRUE,
  platform_response JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE comment_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns comment actions"
  ON comment_actions FOR ALL
  USING (auth.uid() = creator_id);

-- ============================================================
-- 5. PLATFORM SYNC LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS platform_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  action TEXT NOT NULL DEFAULT 'sync_comments',
  items_found INTEGER DEFAULT 0,
  items_processed INTEGER DEFAULT 0,
  status TEXT DEFAULT 'success' CHECK (status IN ('success', 'partial', 'error')),
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE platform_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns sync logs"
  ON platform_sync_log FOR ALL
  USING (auth.uid() = creator_id);
