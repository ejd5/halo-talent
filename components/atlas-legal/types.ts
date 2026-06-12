export interface Analysis {
  id: string;
  created_at: string;
  platform: string;
  total_score: number;
  risk_level: string;
  ai_diagnosis: string | null;
  clauses_checked: string[];
  clauses_details: { id: string; label: string; severity: number; category: string }[];
  agency_name: string | null;
  letter_generated: boolean;
  letters: { id: string; analysis_id: string; letter_type: string; created_at: string }[];
}

export interface KnowledgeEntry {
  id: string;
  category: string;
  platform: string | null;
  jurisdiction: string;
  title: string;
  summary: string | null;
  content: string;
  source_name: string;
  severity_score: number;
  tags: string[];
  last_verified_at: string | null;
  created_at: string;
}

export interface LegalUpdate {
  id: string;
  created_at: string;
  action: string;
  source: string;
  details: Record<string, string>;
  items_affected: number;
  reviewed_by_admin: boolean;
}

export interface ChangeEvent {
  id: string;
  created_at: string;
  platform: string;
  doc_type: string;
  source_url: string | null;
  summary: string;
  impact_level: string;
  affected_articles: string[] | null;
  human_reviewed: boolean;
  published: boolean;
  reviewed_by: string | null;
  reviewed_at: string | null;
  previous_snapshot_id: string | null;
  new_snapshot_id: string | null;
}
