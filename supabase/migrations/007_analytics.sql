-- ─── Analytics & Insights System ───
-- Migration 007: content_metrics, insights, ab_tests, feedback loop

-- ============================================================
-- 1. CONTENT METRICS
-- Multi-platform performance tracking per publication
-- ============================================================
CREATE TABLE IF NOT EXISTS content_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  publication_id TEXT NOT NULL,                     -- platform's native post ID
  platform TEXT NOT NULL CHECK (platform IN ('instagram','tiktok','youtube','twitter','threads','linkedin','bluesky','onlyfans','mym','fansly')),
  content_type TEXT NOT NULL,                       -- 'post','story','reel','carousel','short','long_video','tweet','thread','video','photo'
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,

  -- Core metrics
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  clicks_link INTEGER DEFAULT 0,
  clicks_profile INTEGER DEFAULT 0,

  -- Platform-specific
  followers_gained INTEGER DEFAULT 0,
  followers_lost INTEGER DEFAULT 0,
  engagement_rate NUMERIC(8,4) DEFAULT 0,           -- calculated: (likes+comments+shares)/impressions * 100
  watch_time_seconds INTEGER DEFAULT 0,              -- video platforms
  avg_watch_percent NUMERIC(5,2) DEFAULT 0,          -- avg % watched
  completion_rate NUMERIC(5,2) DEFAULT 0,            -- % viewed to end

  -- Revenue (for OFM/MYM/Fansly)
  revenue_eur NUMERIC(10,2) DEFAULT 0,
  tips_eur NUMERIC(10,2) DEFAULT 0,
  new_subs INTEGER DEFAULT 0,
  messages_count INTEGER DEFAULT 0,
  ppv_sales INTEGER DEFAULT 0,

  -- Metadata
  raw_data JSONB DEFAULT '{}',                       -- full platform response for reprocessing
  synced_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_publication_daily UNIQUE (publication_id, metric_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_metrics_creator_date ON content_metrics(creator_id, metric_date DESC);
CREATE INDEX IF NOT EXISTS idx_content_metrics_platform ON content_metrics(creator_id, platform);
CREATE INDEX IF NOT EXISTS idx_content_metrics_engagement ON content_metrics(creator_id, engagement_rate DESC);
CREATE INDEX IF NOT EXISTS idx_content_metrics_type ON content_metrics(content_type);

-- Enable RLS
ALTER TABLE content_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own metrics"
  ON content_metrics FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users insert own metrics"
  ON content_metrics FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users update own metrics"
  ON content_metrics FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Admins can view all metrics"
  ON content_metrics FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 2. ANALYTICS INSIGHTS
-- AI-generated patterns and recommendations
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('pattern','recommendation','warning','opportunity','trend','milestone')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  metric_name TEXT,                                    -- e.g. 'engagement_rate', 'likes'
  metric_value NUMERIC(12,4),
  comparison_value NUMERIC(12,4),                      -- previous period for comparison
  change_percent NUMERIC(8,2),
  is_positive BOOLEAN DEFAULT TRUE,
  tags TEXT[] DEFAULT '{}',
  source_data JSONB DEFAULT '{}',                      -- what triggered this insight
  is_read BOOLEAN DEFAULT FALSE,
  is_actioned BOOLEAN DEFAULT FALSE,                   -- user acted on this
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ                               -- auto-cleanup
);

CREATE INDEX IF NOT EXISTS idx_analytics_insights_creator ON analytics_insights(creator_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_insights_category ON analytics_insights(creator_id, category);

ALTER TABLE analytics_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own insights"
  ON analytics_insights FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users insert own insights"
  ON analytics_insights FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users update own insights"
  ON analytics_insights FOR UPDATE
  USING (creator_id = auth.uid());

-- ============================================================
-- 3. A/B TESTS
-- Track split-test experiments
-- ============================================================
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,

  -- Variants
  variant_a_data JSONB NOT NULL DEFAULT '{}',           -- caption/media/config
  variant_b_data JSONB NOT NULL DEFAULT '{}',

  variant_a_publication_id TEXT,                        -- platform post ID after publishing
  variant_b_publication_id TEXT,

  platform TEXT NOT NULL,
  content_type TEXT NOT NULL,

  -- Results (auto-calculated)
  variant_a_impressions INTEGER DEFAULT 0,
  variant_b_impressions INTEGER DEFAULT 0,
  variant_a_engagement INTEGER DEFAULT 0,
  variant_b_engagement INTEGER DEFAULT 0,
  variant_a_conversion NUMERIC(8,4) DEFAULT 0,         -- engagement rate
  variant_b_conversion NUMERIC(8,4) DEFAULT 0,

  winner TEXT CHECK (winner IN ('a','b','draw','pending')),
  confidence NUMERIC(5,2) DEFAULT 0,                   -- statistical confidence %
  insight_learned TEXT,

  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','running','completed','cancelled')),
  published_at TIMESTAMPTZ,
  concluded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ab_tests_creator ON ab_tests(creator_id, created_at DESC);

ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own ab_tests"
  ON ab_tests FOR ALL
  USING (creator_id = auth.uid());

-- ============================================================
-- 4. CONTENT FEEDBACK LOOP
-- Top/bottom 20% analysis results
-- ============================================================
CREATE TABLE IF NOT EXISTS content_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,

  -- Top performers
  top_performers JSONB DEFAULT '[]',                     -- [{id, title, metrics, patterns}]
  top_patterns JSONB DEFAULT '{}',                       -- extracted winning patterns
  top_common_tags TEXT[] DEFAULT '{}',
  top_common_moods TEXT[] DEFAULT '{}',
  top_common_styles TEXT[] DEFAULT '{}',
  top_avg_engagement NUMERIC(8,4) DEFAULT 0,

  -- Bottom performers
  bottom_performers JSONB DEFAULT '[]',
  bottom_patterns JSONB DEFAULT '{}',                    -- patterns to avoid
  bottom_common_tags TEXT[] DEFAULT '{}',
  bottom_common_moods TEXT[] DEFAULT '{}',
  bottom_common_styles TEXT[] DEFAULT '{}',
  bottom_avg_engagement NUMERIC(8,4) DEFAULT 0,

  -- DNA update
  dna_updates JSONB DEFAULT '{}',                        -- suggested profile updates
  dna_applied BOOLEAN DEFAULT FALSE,
  dna_applied_at TIMESTAMPTZ,

  insights_generated TEXT[],                              -- key takeaways
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_content_feedback_creator ON content_feedback(creator_id, analysis_date DESC);

ALTER TABLE content_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own feedback"
  ON content_feedback FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users insert own feedback"
  ON content_feedback FOR INSERT
  WITH CHECK (creator_id = auth.uid());

-- ============================================================
-- 5. CREATOR DNA HISTORY
-- Track changes to creator profile from feedback
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dna_version INTEGER DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_feedback_date DATE;

-- ============================================================
-- 6. ANALYTICS COACH LOG
-- Raw coaching sessions
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('weekly_review','pattern_analysis','recommendation','custom')),
  input_summary TEXT,
  output_summary TEXT,
  insights_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE coach_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own coach sessions"
  ON coach_sessions FOR SELECT
  USING (creator_id = auth.uid());

-- ============================================================
-- 7. HELPER FUNCTIONS
-- ============================================================

-- Calculate engagement rate for a metric row
CREATE OR REPLACE FUNCTION calc_engagement_rate(p_impressions INTEGER, p_likes INTEGER, p_comments INTEGER, p_shares INTEGER)
RETURNS NUMERIC(8,4) LANGUAGE SQL IMMUTABLE AS $
  SELECT CASE WHEN p_impressions > 0
    THEN ROUND((p_likes + p_comments + p_shares)::NUMERIC / p_impressions * 100, 4)
    ELSE 0 END;
$;

-- Get top/bottom 20% performers for a creator in a date range
CREATE OR REPLACE FUNCTION get_performance_quartiles(
  p_creator_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  publication_id TEXT,
  platform TEXT,
  content_type TEXT,
  metric_date DATE,
  engagement_rate NUMERIC(8,4),
  percentile_rank NUMERIC(5,2),
  tier TEXT
) LANGUAGE SQL STABLE AS $
  WITH ranked AS (
    SELECT
      cm.publication_id,
      cm.platform,
      cm.content_type,
      cm.metric_date,
      calc_engagement_rate(cm.impressions, cm.likes, cm.comments, cm.shares) AS engagement_rate,
      PERCENT_RANK() OVER (
        ORDER BY calc_engagement_rate(cm.impressions, cm.likes, cm.comments, cm.shares) DESC
      ) AS p_rank
    FROM content_metrics cm
    WHERE cm.creator_id = p_creator_id
      AND cm.metric_date BETWEEN p_start_date AND p_end_date
  )
  SELECT
    r.publication_id,
    r.platform,
    r.content_type,
    r.metric_date,
    r.engagement_rate,
    ROUND(r.p_rank * 100, 2) AS percentile_rank,
    CASE
      WHEN r.p_rank >= 0.8 THEN 'top_20'
      WHEN r.p_rank <= 0.2 THEN 'bottom_20'
      ELSE 'middle'
    END AS tier
  FROM ranked r;
$;
