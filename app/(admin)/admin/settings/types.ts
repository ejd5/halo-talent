export type Role = "owner" | "admin" | "manager" | "assistant" | "custom";

export type Permission = {
  action: string;
  label: string;
  description: string;
};

export type TeamMember = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  avatar_url: string | null;
  assigned_creators: { id: string; name: string }[];
  last_login: string | null;
  active: boolean;
  custom_permissions: Record<string, boolean>;
  invited_at: string;
  created_at: string;
};

export type RolePermissions = Record<string, Record<string, boolean>>;

export type AuditLogEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  details: string;
  created_at: string;
};

// Extended audit log types for the full audit page
export type LogSeverity = "info" | "warning" | "critical";
export type LogStatus = "success" | "failed";
export type LogActionType = "create" | "update" | "delete" | "view" | "login" | "export" | "system" | "other";
export type LogResourceType =
  | "creator"
  | "application"
  | "contract"
  | "payment"
  | "commission"
  | "settings"
  | "permissions"
  | "user"
  | "message"
  | "analytics"
  | "cms"
  | "system"
  | "cron"
  | "platform_sync"
  | "login";

export type AuditLogDetail = {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  user_email: string;
  action_type: LogActionType;
  action_verb: string;
  resource_type: LogResourceType;
  resource_id: string | null;
  resource_label: string | null;
  resource_href: string | null;
  old_value: Record<string, unknown> | string | null;
  new_value: Record<string, unknown> | string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string;
  user_agent: string | null;
  severity: LogSeverity;
  status: LogStatus;
  error_message: string | null;
  stack_trace: string | null;
  created_at: string;
  expanded?: boolean;
};

export type LogFilterState = {
  search: string;
  user_ids: string[];
  action_types: LogActionType[];
  resource_types: LogResourceType[];
  severity: LogSeverity[];
  status: LogStatus[];
  date_from: string;
  date_to: string;
  ip_address: string;
};

export type SystemStatus = {
  service: string;
  label: string;
  status: "healthy" | "degraded" | "down";
  latency_ms: number | null;
  last_check: string;
  icon: string;
};

export type CronJobStatus = {
  name: string;
  last_run: string | null;
  last_duration_ms: number | null;
  last_success: boolean | null;
  next_run: string | null;
  description: string;
};

export type BackupEntry = {
  id: string;
  size_mb: number;
  status: "completed" | "failed" | "in_progress";
  created_at: string;
  type: "daily" | "manual";
  restored_at: string | null;
};

export type QuotaUsage = {
  resource: string;
  used: number;
  limit: number;
  unit: string;
};
