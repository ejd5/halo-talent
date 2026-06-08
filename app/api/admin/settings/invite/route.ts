import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, full_name, role, assigned_creator_ids } = body;

    if (!email || !full_name || !role) {
      return NextResponse.json({ error: "Email, name, and role are required" }, { status: 400 });
    }

    // In production: create invite token, send email, store in DB
    const inviteToken = `invite_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    return NextResponse.json({
      success: true,
      invite: {
        id: `u-${Date.now()}`,
        email,
        full_name,
        role,
        token: inviteToken,
        invite_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/accept-invite?token=${inviteToken}`,
        expires_at: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
        assigned_creator_ids: assigned_creator_ids ?? [],
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
