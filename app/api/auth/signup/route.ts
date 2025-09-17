import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { username, email, password, firstName, lastName } = await req.json();

  const existing = await db.select().from(users).where(or(eq(users.email, email), eq(users.username, username)));
  if (existing.length > 0) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const hash = await hashPassword(password);
  const [newUser] = await db.insert(users).values({
    username,
    firstName,
    lastName,
    email,
    password: hash,
  }).returning({ id: users.id });

  const token = signToken(newUser.id);
  const res = NextResponse.json({ success: true });
  setAuthCookie(res, token);
  return res;
}
