export type CommissionRow = {
  creator_id: string;
  creator_name: string;
  creator_avatar: string | null;
  department: string;
  tier: string;
  month: string;
  gross: number;
  contract_rate: number;
  contract_commission_eur: number;
  tier_min_revenue: number;
  tier_reason: string;
  net: number;
  adjustment: CommissionAdjustment | null;
  effective_commission_eur: number;
};

export type CommissionAdjustmentStatus = "pending" | "validated" | "rejected";

export type CommissionAdjustment = {
  id: string;
  creator_id: string;
  creator_name: string;
  month: string;
  original_commission_eur: number;
  adjusted_commission_eur: number;
  difference: number;
  reason: string;
  justification: string;
  status: CommissionAdjustmentStatus;
  requested_by: string;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
};
