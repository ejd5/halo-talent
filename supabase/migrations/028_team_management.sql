-- Team Management System
-- Migration 028

-- 1. TEAM MEMBERS
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL CHECK (role IN ('owner', 'senior_manager', 'manager', 'drafter_assistant', 'analyst', 'compliance_officer')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'archived')),
  avatar_url TEXT,
  hired_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CREATOR MANAGER ASSIGNMENTS
CREATE TABLE creator_manager_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT TRUE,
  is_backup BOOLEAN DEFAULT FALSE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  assigned_by UUID REFERENCES team_members(id),
  notes TEXT,
  UNIQUE(creator_id, manager_id)
);

-- 3. TEAM MEMBER PERMISSIONS
CREATE TABLE team_member_permissions (
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  permission TEXT NOT NULL,
  granted_by UUID REFERENCES team_members(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (member_id, permission)
);

-- 4. AVAILABILITY
CREATE TABLE team_member_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  date_from DATE NOT NULL,
  date_to DATE NOT NULL,
  type TEXT CHECK (type IN ('vacation', 'sick', 'training')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AUDIT LOG
CREATE TABLE team_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES team_members(id),
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  metadata JSONB DEFAULT '{}',
  performed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT
);

-- Indexes
CREATE INDEX idx_team_members_role ON team_members(role);
CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_creator_assignments_creator ON creator_manager_assignments(creator_id);
CREATE INDEX idx_creator_assignments_manager ON creator_manager_assignments(manager_id);
CREATE INDEX idx_team_permissions_member ON team_member_permissions(member_id);
CREATE INDEX idx_team_availability_member ON team_member_availability(member_id);
CREATE INDEX idx_team_audit_log_member ON team_audit_log(member_id);
CREATE INDEX idx_team_audit_log_action ON team_audit_log(action);
CREATE INDEX idx_team_audit_log_performed_at ON team_audit_log(performed_at);

-- Enable RLS
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_manager_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_member_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- team_members: admins full access, managers read-only
CREATE POLICY "team_members_admin_all" ON team_members
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'owner'))
  );

CREATE POLICY "team_members_read_own" ON team_members
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'manager', 'owner'))
  );

-- creator_manager_assignments: admin/manager full
CREATE POLICY "assignments_admin_all" ON creator_manager_assignments
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'owner'))
  );

CREATE POLICY "assignments_manager_read" ON creator_manager_assignments
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'manager', 'owner'))
  );

-- permissions: admin/manager read
CREATE POLICY "permissions_admin_all" ON team_member_permissions
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'owner'))
  );

CREATE POLICY "permissions_read" ON team_member_permissions
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'manager', 'owner'))
    OR auth.uid() IN (SELECT user_id FROM team_members WHERE id = member_id)
  );

-- availability: all can read, admin/manager write
CREATE POLICY "availability_read" ON team_member_availability
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'manager', 'owner'))
    OR auth.uid() IN (SELECT user_id FROM team_members WHERE id = member_id)
  );

CREATE POLICY "availability_admin_all" ON team_member_availability
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'owner'))
  );

-- audit_log: admin read-only + compliance_officer
CREATE POLICY "audit_log_admin_read" ON team_audit_log
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'owner'))
    OR auth.uid() IN (
      SELECT tm.user_id FROM team_members tm WHERE tm.role = 'compliance_officer' AND tm.status = 'active'
    )
  );

-- Row-level security: members can see own audit log
CREATE POLICY "audit_log_self" ON team_audit_log
  FOR SELECT USING (
    auth.uid() IN (SELECT user_id FROM team_members WHERE id = member_id)
  );
