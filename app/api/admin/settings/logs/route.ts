import { NextResponse } from "next/server";

// In production: query Supabase audit_logs table with filters + pagination
// GET /api/admin/settings/logs?search=&action_types=&severity=&status=&date_from=&date_to=&ip=&resource_type=&user_id=&page=1&page_size=50

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") ?? undefined,
    actionTypes: searchParams.get("action_types")?.split(",").filter(Boolean) ?? undefined,
    severity: searchParams.get("severity")?.split(",").filter(Boolean) ?? undefined,
    status: searchParams.get("status")?.split(",").filter(Boolean) ?? undefined,
    dateFrom: searchParams.get("date_from") ?? undefined,
    dateTo: searchParams.get("date_to") ?? undefined,
    ipAddress: searchParams.get("ip") ?? undefined,
    resourceType: searchParams.get("resource_type") ?? undefined,
    userId: searchParams.get("user_id") ?? undefined,
    page: parseInt(searchParams.get("page") ?? "1", 10),
    pageSize: Math.min(parseInt(searchParams.get("page_size") ?? "50", 10), 100),
  };

  // In production: build Supabase query with .ilike(), .in(), .gte(), .lte()
  // const supabase = createAdminClient();
  // let query = supabase.from("audit_logs").select("*", { count: "exact" });
  // if (filters.search) query = query.or(`action_verb.ilike.%${filters.search}%,resource_label.ilike.%${filters.search}%,user_name.ilike.%${filters.search}%`);
  // ...

  // Mock response
  const mockTotal = 30;
  const mockPage = filters.page;
  const mockPageSize = filters.pageSize;
  const mockPages = Math.ceil(mockTotal / mockPageSize);

  return NextResponse.json({
    data: [],
    pagination: {
      page: mockPage,
      page_size: mockPageSize,
      total: mockTotal,
      pages: mockPages,
      has_more: mockPage < mockPages,
    },
    filters,
  });
}
