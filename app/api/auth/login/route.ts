import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET as string;

type LoginRequest = {
  username: string;
  password: string;
};

export async function POST(req: Request) {

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const body = (await req.json()) as Partial<LoginRequest>;
  const { username, password } = body;

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid input types" }, { status: 400 });
  }

  if (!username || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  try {
    // Get only username + password hash from DB
    const result = await db
      .select({
        id: users.id, // maybe useful later for sessions/tokens
        username: users.username,
        email: users.email,
        password: users.password,
      })
      .from(users)
      .where(eq(users.username, username));

    if (result.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = result[0];

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Step 1: Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Step 2: Set JWT in HttpOnly cookie
    const cookie = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });



    const response =  NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
        },
      },
      { status: 200 }
    );

    response.headers.set('Set-Cookie', cookie);

    return response;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Database query failed:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
