import { db } from "@/db";
import { users } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

const userCache = new Map<string, Partial<User>>();

type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | "cashier" | "customer" | "delivery";
  phoneNumber: string;
  createdAt: Date;
  points: number;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string };
  } catch {
    return null;
  }
}

export async function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}

export async function clearAuthCookie() {
  (await cookies()).set("token", "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getUserFromCookies() {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  const payload = verifyToken(token);
  return payload?.sub ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  if (userCache.has(token)) return userCache.get(token)! as User;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string };

    const [user] = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        phoneNumber: users.phoneNumber,
        createdAt: users.createdAt,
        points: users.points,
      })
      .from(users)
      .where(eq(users.id, payload.sub));

    if (!user) return null;

    userCache.set(token, user);
    return user;
  } catch {
    return null;
  }
}