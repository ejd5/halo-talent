-- ============================================================
-- Migration 004: Video Generation
-- ============================================================

CREATE TABLE IF NOT EXISTS video_generation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  external_job_id TEXT,
  model TEXT NOT NULL,
  mode TEXT DEFAULT 'text-to-video' CHECK (mode IN ('text-to-video', 'image-to-video', 'video-extension')),
  prompt TEXT,
  params JSONB DEFAULT '{}',
  output_url TEXT,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  progress REAL DEFAULT 0,
  error TEXT,
  credits_used INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 5,
  estimated_completion_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_jobs_creator ON video_generation_jobs(creator_id);
CREATE INDEX IF NOT EXISTS idx_video_jobs_status ON video_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_video_jobs_created ON video_generation_jobs(created_at DESC);

ALTER TABLE video_generation_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own video jobs" ON video_generation_jobs
  FOR SELECT USING (auth.uid() = creator_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin')
  ));

CREATE POLICY "Users insert own video jobs" ON video_generation_jobs
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Users update own video jobs" ON video_generation_jobs
  FOR UPDATE USING (auth.uid() = creator_id);
