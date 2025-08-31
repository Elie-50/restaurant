import { db } from "@/db";
import { userPreferences } from "@/db/schema";
import { getUserIdFromRequest } from "@/utils/functions";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = getUserIdFromRequest(req);
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = cookie;
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing dietaryOptionId" }, { status: 400 });
    }

    // Delete the matching preference
    await db
      .delete(userPreferences)
      .where(
        and(
          eq(userPreferences.userId, userId),
          eq(userPreferences.dietaryOptionId, id)
        )
      );

    return NextResponse.json({ message: "Dietary option removed" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to remove dietary option" },
      { status: 500 }
    );
  }
}