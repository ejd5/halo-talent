-- Migration : platform_connections table
-- Chiffrement AES-256-GCM des tokens côté application (lib/crypto.ts)

CREATE TABLE IF NOT EXISTS platform_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_user_id TEXT,
  platform_username TEXT,
  platform_followers INT DEFAULT 0,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  scopes TEXT[],
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'error')),
  last_sync_at TIMESTAMPTZ,
  connected_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, platform)
);

ALTER TABLE platform_connections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'platform_connections' AND policyname = 'Creator owns connections'
  ) THEN
    CREATE POLICY "Creator owns connections" ON platform_connections
      FOR ALL USING (auth.uid() = creator_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_platform_connections_creator ON platform_connections(creator_id);
CREATE INDEX IF NOT EXISTS idx_platform_connections_expires ON platform_connections(expires_at) WHERE status = 'active';
