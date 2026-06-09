-- ─── Atlas — Fan Profile 360° ───
-- Migration 009: Purchases, private notes, documents, timeline

-- ============================================================
-- 1. ATLAS PURCHASES (transactions history)
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL DEFAULT 'onlyfans',
  type TEXT NOT NULL CHECK (type IN ('ppv','tip','subscription','custom','bundle')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('completed','refunded','pending','cancelled')),
  metadata JSONB DEFAULT '{}'::jsonb,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_atlas_purchases_fan ON atlas_purchases(fan_id, purchased_at DESC);
CREATE INDEX IF NOT EXISTS idx_atlas_purchases_creator ON atlas_purchases(creator_id);
ALTER TABLE atlas_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns purchases" ON atlas_purchases FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 2. ATLAS NOTES (private creator notes)
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rich_text JSONB DEFAULT '{}'::jsonb,
  images TEXT[] DEFAULT '{}',
  pin_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_atlas_notes_fan ON atlas_notes(fan_id, pin_order DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_atlas_notes_creator ON atlas_notes(creator_id);
ALTER TABLE atlas_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns notes" ON atlas_notes FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 3. ATLAS DOCUMENTS (contracts, ID verification, etc.)
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('contract','id_verification','release_form','other')),
  name TEXT NOT NULL,
  file_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','archived','expired')),
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_atlas_documents_fan ON atlas_documents(fan_id, uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_atlas_documents_creator ON atlas_documents(creator_id);
ALTER TABLE atlas_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns documents" ON atlas_documents FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 4. ATLAS MERGE LOG (identity merge audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_merge_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  primary_fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  merged_fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  merged_fields JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_merge_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns merge logs" ON atlas_merge_log FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- 5. DELETE LOG (RGPD compliance)
-- ============================================================
CREATE TABLE IF NOT EXISTS atlas_deletion_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  original_fan_id UUID,
  fan_email TEXT,
  fan_display_name TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE atlas_deletion_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns deletion logs" ON atlas_deletion_log FOR ALL USING (auth.uid() = creator_id);
