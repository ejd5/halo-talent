export type PayoutStatus = "pending" | "validated" | "completed" | "error";
export type PayoutMethod = "stripe" | "wire" | "other";

export type Payout = {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string | null;
  department: string;
  amount: number;
  period: string;
  method: PayoutMethod;
  scheduled_date: string;
  status: PayoutStatus;
  validated_by: string | null;
  validated_at: string | null;
  double_validated_by: string | null;
  double_validated_at: string | null;
  executed_at: string | null;
  error_message: string | null;
  notes: string | null;
  created_at: string;
};
