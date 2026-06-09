-- Benchmarking: best practices extracted automatically
CREATE TABLE IF NOT EXISTS best_practices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  insight TEXT NOT NULL,
  evidence JSONB DEFAULT '{}',
  applicable_to_dept TEXT,
  shared_with_creators BOOLEAN DEFAULT FALSE,
  discovered_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE best_practices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage best_practices" ON best_practices
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );

-- Admin insights for weekly AI analysis
CREATE TABLE IF NOT EXISTS admin_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  period_start TIMESTAMPTZ,
  period_end TIMESTAMPTZ,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage admin_insights" ON admin_insights
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager'))
  );
