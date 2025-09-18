import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserFromCookies } from "@/lib/auth";

export async function GET() {
  const id = await getUserFromCookies();

  if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {

    const [user] = await db
        .select({
        points: users.points,
        })
        .from(users)
        .where(eq(users.id, id));

    if (!user) return NextResponse.json({ error: "User Not Found" }, { status: 404 });

    return NextResponse.json({ points: user.points }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
  
}