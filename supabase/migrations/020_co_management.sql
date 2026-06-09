-- ─── Co-management Officiel ────────────────────────────────────
-- Migration 020: Legal multi-account management via platform APIs
-- Alternative compliant to anti-detect browsers

CREATE TABLE platform_co_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'youtube', 'onlyfans', 'mym', 'fansly')),
  manager_email TEXT,
  manager_name TEXT,
  access_level TEXT CHECK (access_level IN ('admin', 'content_creator', 'moderator', 'analyst', 'view_only')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'revoked')),
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB
);

CREATE TABLE co_management_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  co_management_id UUID REFERENCES platform_co_management(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  performed_by TEXT,
  device_info JSONB,
  performed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE platform_co_management ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns co-mgmt" ON platform_co_management FOR ALL USING (auth.uid() = creator_id);

ALTER TABLE co_management_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns audit" ON co_management_audit FOR ALL USING (auth.uid() = creator_id);

CREATE INDEX idx_co_mgmt_creator ON platform_co_management(creator_id);
CREATE INDEX idx_co_mgmt_audit_creator ON co_management_audit(creator_id);
CREATE INDEX idx_co_mgmt_audit_mgmt ON co_management_audit(co_management_id);
