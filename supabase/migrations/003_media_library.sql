-- 1. MEDIA LIBRARY
CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  type TEXT DEFAULT 'image' CHECK (type IN ('image', 'video', 'audio', 'document')),
  source TEXT DEFAULT 'upload' CHECK (source IN ('upload', 'ai_generated', 'imported', 'received')),
  ai_prompt TEXT,
  ai_model TEXT,
  ai_style TEXT,
  tags TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_library_creator ON media_library(creator_id);
CREATE INDEX IF NOT EXISTS idx_media_library_source ON media_library(source);
CREATE INDEX IF NOT EXISTS idx_media_library_created ON media_library(created_at DESC);

-- RLS
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own media" ON media_library
  FOR SELECT USING (auth.uid() = creator_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('manager', 'admin')
  ));

CREATE POLICY "Users insert own media" ON media_library
  FOR INSERT WITH CHECK (auth.uid() = creator_id);
