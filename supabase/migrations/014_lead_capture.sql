-- ─── Lead Capture — Opt-in, Link-in-Bio, Forms ───
-- Migration 014: Pages de capture, liens, consent logs

-- ============================================================
-- 1. Add handle to profiles (for public URLs)
-- ============================================================
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS handle TEXT UNIQUE;
CREATE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle);

-- ============================================================
-- 2. LEAD CAPTURE PAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS lead_capture_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  page_type TEXT NOT NULL CHECK (page_type IN ('link_in_bio', 'capture_page', 'popup_form')),
  title TEXT NOT NULL DEFAULT 'Ma page',
  slug TEXT NOT NULL,  -- URL path segment, unique per creator
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused')),

  -- Design
  background_type TEXT DEFAULT 'color' CHECK (background_type IN ('color', 'image', 'video')),
  background_value TEXT DEFAULT '#1A1614',
  font_family TEXT DEFAULT 'system-ui',
  accent_color TEXT DEFAULT '#C75B39',
  text_color TEXT DEFAULT '#F5F0EB',
  avatar_url TEXT,
  bio TEXT,
  display_name TEXT,

  -- Capture form config (for capture_page/popup_form)
  headline TEXT,
  subtitle TEXT,
  cta_text TEXT DEFAULT 'Je m\'abonne',
  confirmation_message TEXT DEFAULT 'Vérifiez votre boîte mail pour confirmer',
  collect_first_name BOOLEAN DEFAULT TRUE,
  consent_text TEXT DEFAULT 'J\'accepte de recevoir des communications',

  -- Stats
  views INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,

  -- Meta
  seo_title TEXT,
  seo_description TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(creator_id, slug)
);

ALTER TABLE lead_capture_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns capture pages"
  ON lead_capture_pages FOR ALL
  USING (auth.uid() = creator_id);

-- Public read: only active pages
CREATE POLICY "Public can view active capture pages"
  ON lead_capture_pages FOR SELECT
  USING (status IN ('active'));

-- ============================================================
-- 3. LEAD CAPTURE LINKS (for link_in_bio pages)
-- ============================================================
CREATE TABLE IF NOT EXISTS lead_capture_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES lead_capture_pages(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('social', 'content', 'custom', 'capture_form', 'store')),
  label TEXT NOT NULL,
  url TEXT,
  icon TEXT,  -- icon name for display
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  open_in_new_tab BOOLEAN DEFAULT TRUE,
  utm_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lead_capture_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns links"
  ON lead_capture_links FOR ALL
  USING (auth.uid() = creator_id);

CREATE POLICY "Public can view active links"
  ON lead_capture_links FOR SELECT
  USING (TRUE);

-- ============================================================
-- 4. CONSENT LOGS (RGPD - audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('email_marketing', 'sms_marketing', 'data_processing', 'push_notification')),
  granted BOOLEAN NOT NULL,
  source TEXT NOT NULL,  -- 'double_opt_in', 'form_submit', 'manual', 'api'
  ip_address TEXT,
  user_agent TEXT,
  consent_version TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns consent logs"
  ON consent_logs FOR ALL
  USING (auth.uid() = creator_id);

-- ============================================================
-- 5. LEAD CAPTURE SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS lead_capture_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES lead_capture_pages(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  fan_id UUID REFERENCES atlas_fans(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  source TEXT,
  ip_address TEXT,
  user_agent TEXT,
  confirmed_at TIMESTAMPTZ,  -- NULL until double opt-in
  confirmation_token TEXT UNIQUE,
  token_expires_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'expired', 'abandoned')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE lead_capture_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Creator owns submissions"
  ON lead_capture_submissions FOR ALL
  USING (auth.uid() = creator_id);

CREATE POLICY "Public can insert submissions"
  ON lead_capture_submissions FOR INSERT
  WITH CHECK (TRUE);
