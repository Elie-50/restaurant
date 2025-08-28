import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET as string;

function getUserIdFromRequest(req: Request): string | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.id;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ user: null }, { status: 401 });

  const user = await db.select().from(users).where(eq(users.id, userId));
  if (!user[0]) return NextResponse.json({ user: null }, { status: 404 });

  return NextResponse.json(user[0] , { status: 200 });
}

export async function PUT(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { username, email, firstName, lastName, phoneNumber } = body;

  try {
    await db
      .update(users)
      .set({
        ...(username && { username }),
        ...(email && { email }),
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phoneNumber && { phoneNumber })
      })
      .where(eq(users.id, userId));

    return NextResponse.json({ message: "Update Successful" }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.update(users).set({ isActive: false }).where(eq(users.id, userId));
    // Clear cookie
    const res = NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    res.cookies.set("token", "", { expires: new Date(0) });
    return res;
  } catch {
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
