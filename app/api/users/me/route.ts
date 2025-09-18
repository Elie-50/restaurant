import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const formData = await req.formData();
  const firstName = formData.get("firstName") as string | null;
  const lastName = formData.get("lastName") as string | null;
  const phoneNumber = formData.get("phoneNumber") as string | null;
  const file = formData.get("avatar") as File | null;

  const updateData: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    avatar?: string;
  } = {
    firstName: firstName ?? undefined,
    lastName: lastName ?? undefined,
    phoneNumber: phoneNumber ?? undefined,
  };

  if (file) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const filename = `${user.id}-${Date.now()}-${file.name}`;
    const filepath = path.join(
      process.cwd(),
      "public",
      "media",
      "users_avatars",
      filename
    );

    await writeFile(filepath, bytes);
    updateData.avatar = `/media/users_avatars/${filename}`;
  }

  const updatedUser = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, user.id))
    .returning();

  return NextResponse.json({ user: updatedUser[0] });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  return NextResponse.json({ user });
}