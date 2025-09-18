import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, UserTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken(user.id);
  const data = user as Omit<UserTable, "password">;
  const res = NextResponse.json({ success: true, user: data });
  setAuthCookie(res, token);
  return res;
}
