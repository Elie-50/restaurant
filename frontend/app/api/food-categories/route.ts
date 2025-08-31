import { NextResponse } from "next/server";
import { db } from "@/db";
import { foodCategories } from "@/db/schema";
import { getUserIdFromRequest } from "@/utils/functions";

// GET all
export async function GET() {
  const options = await db.select().from(foodCategories);
  return NextResponse.json(options);
}

// POST - create
export async function POST(req: Request) {
  try {

    const cookie = getUserIdFromRequest(req);
    
    if (!cookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = cookie;

    if (role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { label } = await req.json();

    if (!label) {
      return NextResponse.json({ error: "Label is required" }, { status: 400 });
    }

    const [created] = await db
      .insert(foodCategories)
      .values({ label })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create option" }, { status: 500 });
  }
}
