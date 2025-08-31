import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getUserIdFromRequest } from "@/utils/functions";
import { db } from "@/db";
import { addresses } from "@/db/schema/addresses";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export async function GET(req: Request) {
  try {
    const cookie = getUserIdFromRequest(req);

    if (!cookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = cookie;

    const rows = await db.select().from(addresses).where(eq(addresses.userId, userId));

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// POST create new address
export async function POST(req: Request) {
  try {
    const cookie = getUserIdFromRequest(req);

    if (!cookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = cookie;



    // Parse multipart/form-data
    const formData = await req.formData();
    const street = formData.get("street") as string;
    const building = formData.get("building") as string;
    const city = formData.get("city") as string;
    const apartment = formData.get("apartment") as string | null;
    const gpsLink = formData.get("gpsLink") as string | null;

    const file = formData.get("image") as File | null;
    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      const fileExtension = path.extname(file.name);
      const fileName = uuid() + fileExtension;
      const uploadPath = path.join(process.cwd(), "public", "media", "addresses");

      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

      const arrayBuffer = await file.arrayBuffer();
      fs.writeFileSync(path.join(uploadPath, fileName), Buffer.from(arrayBuffer));

      imageUrl = `/media/addresses/${fileName}`;
    }

    const [address] = await db
    .insert(addresses)
    .values({ userId, street, building, city, apartment, gpsLink, imageUrl })
    .returning();

    return NextResponse.json(address, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
