/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/db";
import { menuItems } from "@/db/schema/menuItems";
import { eq } from "drizzle-orm";
import { getUserIdFromRequest } from "@/utils/functions";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {

    const { id } = await params;

    const [item] = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.id, id));

    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

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
    
    const body = await req.json();
    const { id } = await params;

    const [updated] = await db
      .update(menuItems)
      .set({
        name: body.name,
        price: body.price,
        imageUrl: body.imageUrl,
        ingredients: body.ingredients,
        foodCategoryId: body.categoryId,
      })
      .where(eq(menuItems.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/menu-items/:id
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
      .delete(menuItems)
      .where(eq(menuItems.id, id))
      .returning();

    if (!deleted)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(deleted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
