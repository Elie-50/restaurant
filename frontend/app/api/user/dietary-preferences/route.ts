import { NextResponse } from "next/server";
import { db } from "@/db";
import { dietaryOptions, userPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserIdFromRequest } from "@/utils/functions";

export async function GET(req: Request) {
    try {
        const cookie = getUserIdFromRequest(req);
            
        if (!cookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId } = cookie;

        const result = await db
            .select({
                userId: userPreferences.userId,
                dietaryOptionId: userPreferences.dietaryOptionId,
                dietaryOptionName: dietaryOptions.label,
            })
            .from(userPreferences)
            .leftJoin(
                dietaryOptions,
                eq(userPreferences.dietaryOptionId, dietaryOptions.id)
            )
            .where(eq(userPreferences.userId, userId));

        return NextResponse.json(result, { status: 200});
    } catch {
        return NextResponse.json({ error: "Failed to fetch user preferences" }, { status: 500});
    }    
}

export async function POST(req: Request) {
  try {
    const cookie = getUserIdFromRequest(req);
    if (!cookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = cookie;
    const body = await req.json();

    if (!body.dietaryOptionId) {
      return NextResponse.json({ error: "Missing dietaryOptionId" }, { status: 400 });
    }

    // Insert into userPreferences
    await db.insert(userPreferences).values({
      userId,
      dietaryOptionId: body.dietaryOptionId,
    });

    return NextResponse.json({ message: "Dietary option added" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add dietary option" },
      { status: 500 }
    );
  }
}