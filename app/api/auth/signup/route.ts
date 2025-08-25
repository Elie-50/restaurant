import { db } from '@/db';
import { users } from "@/db/schema";
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

type SignupRequest = {
  username: string;
  email: string;
  password: string;
  confirm: string;
  firstName?: string;
  lastName?: string;
};

export async function POST(req: Request) {
    const body = (await req.json()) as Partial<SignupRequest>;
    const { username, email, password, confirm, firstName, lastName } = body;

    if (
        typeof username !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        typeof confirm !== 'string' ||
        (firstName !== undefined && typeof firstName !== "string") ||
        (lastName !== undefined && typeof lastName !== "string")
    ) {
        return NextResponse.json({ error: 'Invalid input types' }, { status: 400 });
    }

    if (!username || !email || !password || !confirm ) {
        return NextResponse.json({ error: "A required field is missing" }, { status: 400 });
    }

    if (password !== confirm) {
        return NextResponse.json({ error: "Passwords don't match" }, { status: 400 });
    }
    // hash password
    const password_hash = await bcrypt.hash(password, 10);

  try {
    const insertedUser = await db.insert(users).values({
      email,
      password: password_hash,
      username,
      firstName,
      lastName,
    });

    if (insertedUser)
    {
      return NextResponse.json({ message: "User added successfully" }, { status: 201 });
    }
    else
    {
      return NextResponse.json({ message: "Failed to add user" }, { status: 400 });
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Database query failed:', error);
    
    // UNIQUE CONSTRAINT FAILED
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      return NextResponse.json(
        { error: "Email or username already taken" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}