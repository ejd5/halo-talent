-- ============================================================
-- Migration 00001: Initial schema
-- House of Creative Management — Supabase Database
-- ============================================================

-- 1. PROFILS UTILISATEURS (extension de auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'creator' CHECK (role IN ('creator', 'manager', 'admin')),
  department TEXT,
  status TEXT DEFAULT 'applicant' CHECK (status IN ('applicant', 'active', 'paused', 'archived')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COMPTES EXTERNES (plateformes connectées)
CREATE TABLE creator_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('onlyfans', 'mym', 'reveal', 'fansly', 'instagram', 'tiktok', 'youtube', 'twitter', 'twitch')),
  username TEXT,
  url TEXT,
  followers INTEGER DEFAULT 0,
  monthly_revenue DECIMAL(12,2) DEFAULT 0,
  is_managed BOOLEAN DEFAULT FALSE,
  api_connected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. REVENUS MENSUELS
CREATE TABLE monthly_revenues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  month DATE NOT NULL,
  gross_revenue DECIMAL(12,2) NOT NULL,
  agency_commission DECIMAL(12,2) NOT NULL,
  net_to_creator DECIMAL(12,2) NOT NULL,
  commission_rate DECIMAL(4,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(creator_id, platform, month)
);

-- 4. CANDIDATURES
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  display_name TEXT,
  department TEXT NOT NULL,
  current_monthly_revenue TEXT,
  platforms TEXT[],
  social_links JSONB,
  goals TEXT,
  why_us TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'rejected', 'on_hold')),
  reviewed_by UUID REFERENCES profiles(id),
  reviewed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONTRATS
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  contract_type TEXT NOT NULL,
  commission_tier TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  exit_notice_days INTEGER DEFAULT 30,
  pdf_url TEXT,
  signed BOOLEAN DEFAULT FALSE,
  signed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'signed', 'active', 'terminated')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MESSAGES INTERNES
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL,
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  attachments JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATIONS
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CONVERSATIONS IA (assistant Claude)
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_revenues ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POLICIES
-- ============================================================

-- Profils : le créateur voit son profil, les managers/admins voient tout
CREATE POLICY "Creators see own profile" ON profiles
  FOR SELECT USING (auth.uid() = id OR role IN ('manager', 'admin'));

CREATE POLICY "Managers can update profiles" ON profiles
  FOR UPDATE USING (auth.uid() = id OR role IN ('manager', 'admin'));

-- Comptes externes : le créateur gère ses comptes
CREATE POLICY "Creators see own accounts" ON creator_accounts
  FOR ALL USING (auth.uid() = creator_id);

CREATE POLICY "Managers view creator accounts" ON creator_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Revenus : le créateur voit ses revenus
CREATE POLICY "Creators see own revenues" ON monthly_revenues
  FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Managers view creator revenues" ON monthly_revenues
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('manager', 'admin')
    )
  );

-- Candidatures : tout le monde peut postuler, seul l'admin voit les soumissions
CREATE POLICY "Public can apply" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin view applications" ON applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin manage applications" ON applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Messages : les participants voient leurs messages
CREATE POLICY "Participants see thread messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND (
        id = sender_id
        OR role IN ('manager', 'admin')
      )
    )
  );

CREATE POLICY "Participants send messages" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Notifications : l'utilisateur voit ses notifications
CREATE POLICY "Users see own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

-- Conversations IA : le créateur voit ses conversations
CREATE POLICY "Creators own AI conversations" ON ai_conversations
  FOR ALL USING (auth.uid() = creator_id);

-- ============================================================
-- TRIGGER : créer un profil automatiquement à l'inscription
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
