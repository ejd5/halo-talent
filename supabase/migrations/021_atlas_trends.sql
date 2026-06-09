-- 021_atlas_trends.sql
-- Trend Hub Pro — watchlist, cache, alerts

-- ─── Watchlist ────────────────────────────────────────────────────
CREATE TABLE trends_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  category TEXT,
  geo_filter TEXT DEFAULT 'FR',
  sources TEXT[] DEFAULT ARRAY['google', 'youtube', 'reddit'],
  alert_threshold INTEGER DEFAULT 50,
  last_value INTEGER,
  last_checked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Cache ────────────────────────────────────────────────────────
CREATE TABLE trends_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  query TEXT NOT NULL,
  geo TEXT DEFAULT 'FR',
  timeframe TEXT DEFAULT '7d',
  data JSONB NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '4 hours'
);

CREATE INDEX idx_trends_cache_lookup ON trends_cache(source, query, geo, timeframe);
CREATE INDEX idx_trends_cache_expiry ON trends_cache(expires_at);

-- ─── Alerts ──────────────────────────────────────────────────────
CREATE TABLE trends_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  watchlist_id UUID REFERENCES trends_watchlist(id),
  trend_data JSONB,
  alert_type TEXT CHECK (alert_type IN ('spike', 'crash', 'pre_viral', 'new_trend')),
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  notified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RLS ─────────────────────────────────────────────────────────
ALTER TABLE trends_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE trends_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator owns watchlist" ON trends_watchlist
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Creator owns alerts" ON trends_alerts
  FOR ALL USING (auth.uid() = creator_id);

-- Cache is read-only for authenticated users
CREATE POLICY "Authenticated can read cache" ON trends_cache
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Service role manages cache" ON trends_cache
  FOR ALL USING (auth.role() = 'service_role');
