import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role, active, assigned_creator_ids } = body;

    // In production: validate permissions, update DB
    return NextResponse.json({
      success: true,
      member: {
        id,
        ...(role !== undefined && { role }),
        ...(active !== undefined && { active }),
        ...(assigned_creator_ids !== undefined && { assigned_creator_ids }),
        updated_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // In production: check self-deletion guard, soft-delete in DB
    return NextResponse.json({
      success: true,
      deleted_id: id,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
