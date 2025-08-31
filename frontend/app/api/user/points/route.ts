import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserIdFromRequest } from "@/utils/functions";

export async function GET(req: Request) {
  const cookie = getUserIdFromRequest(req);

    if (!cookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = cookie;
  if (!userId) return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });

  const points = await db.select({points: users.points}).from(users).where(eq(users.id, userId));
  if (!points[0]) return NextResponse.json({ user: null }, { status: 404 });

  return NextResponse.json({ points: points[0].points } , { status: 200 });
}