import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  const { firstName, lastName, phoneNumber } = body;

  const updatedUser = await db
    .update(users)
    .set({ firstName, lastName, phoneNumber })
    .where(eq(users.id, user.id))
    .returning();

  return NextResponse.json({ user: updatedUser[0] });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  return NextResponse.json({ user });
}