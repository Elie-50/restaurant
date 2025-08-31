/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { db } from "@/db"; // adjust to your drizzle instance
import { menuItems } from "@/db/schema/menuItems";
import { eq } from "drizzle-orm";

// GET /api/menu-items?categoryId=...
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");

  try {
    if (categoryId) {
      const items = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.foodCategoryId, categoryId));
      return NextResponse.json(items);
    }

    const items = await db.select().from(menuItems);
    return NextResponse.json(items);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/menu-items
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [created] = await db
      .insert(menuItems)
      .values({
        foodCategoryId: body.categoryId,
        name: body.name,
        price: body.price,
        imageUrl: body.imageUrl,
        ingredients: body.ingredients,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
