import { NextResponse } from "next/server";
import { db } from "@/db";
import { dietaryOptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserIdFromRequest } from "@/utils/functions";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = getUserIdFromRequest(req);
    
    if (!cookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = cookie;

    if (role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const { label } = await req.json();

    const [updated] = await db
      .update(dietaryOptions)
      .set({ label })
      .where(eq(dietaryOptions.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Option not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Failed to update option" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = getUserIdFromRequest(req);
    
    if (!cookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = cookie;

    if (role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;

    const [deleted] = await db
      .delete(dietaryOptions)
      .where(eq(dietaryOptions.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Option not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch {
    return NextResponse.json({ error: "Failed to delete option" }, { status: 500 });
  }
}
