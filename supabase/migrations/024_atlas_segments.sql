-- ─── Smart Segments — Groupes de fans dynamiques ───
-- Migration 024: Segmentation automatique avec règles, recalcul temps réel, funnels

CREATE TABLE atlas_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('smart', 'static')) DEFAULT 'smart',
  rules JSONB DEFAULT '[]'::jsonb,
  member_count INTEGER DEFAULT 0,
  on_entry_funnel_id UUID,
  on_exit_funnel_id UUID,
  last_calculated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE atlas_segment_memberships (
  segment_id UUID REFERENCES atlas_segments(id) ON DELETE CASCADE,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (segment_id, fan_id)
);

-- Indexes
CREATE INDEX idx_segments_creator ON atlas_segments(creator_id);
CREATE INDEX idx_segment_memberships_fan ON atlas_segment_memberships(fan_id);

-- RLS
ALTER TABLE atlas_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE atlas_segment_memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creator owns segments" ON atlas_segments FOR ALL USING (auth.uid() = creator_id);
CREATE POLICY "Creator owns memberships" ON atlas_segment_memberships
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM atlas_segments
      WHERE id = atlas_segment_memberships.segment_id
      AND creator_id = auth.uid()
    )
  );

-- Trigger de recalcul temps réel
CREATE OR REPLACE FUNCTION trigger_segment_recalc()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('fan_updated', json_build_object('fan_id', NEW.id)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_fan_update
AFTER UPDATE ON atlas_fans
FOR EACH ROW
EXECUTE FUNCTION trigger_segment_recalc();
