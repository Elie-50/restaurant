import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getUserIdFromRequest, isStaff } from "@/utils/functions";
import { db } from "@/db";
import { addresses } from "@/db/schema/addresses";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = getUserIdFromRequest(req);

    if (!cookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId, role } = cookie;
    const { id } = await params;

    const [address] = await db.select().from(addresses).where(eq(addresses.id, id));

    if (!address) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (address.userId !== userId && !isStaff(role))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json(address);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = getUserIdFromRequest(req);

    if (!cookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = cookie;
    const { id } = await params;

    const [address] = await db.select().from(addresses).where(eq(addresses.id, id));
    if (!address) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (address.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });


    // Parse multipart/form-data
    const formData = await req.formData();
    const street = formData.get("street") as string;
    const building = formData.get("building") as string;
    const city = formData.get("city") as string;
    const apartment = formData.get("apartment") as string | null;
    const gpsLink = formData.get("gpsLink") as string | null;

    const file = formData.get("image") as File | null;
    let imageUrl = address.imageUrl;

    if (file && file.size > 0) {
      const fileExtension = path.extname(file.name);
      const fileName = uuid() + fileExtension;
      const uploadPath = path.join(process.cwd(), "public", "media", "addresses");

      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

      const arrayBuffer = await file.arrayBuffer();
      fs.writeFileSync(path.join(uploadPath, fileName), Buffer.from(arrayBuffer));

      imageUrl = `/media/addresses/${fileName}`;
    }

    const [updated] = await db
    .update(addresses)
    .set({ street, building, city, apartment, gpsLink, imageUrl, updatedAt: new Date() })
    .where(eq(addresses.id, id))
    .returning();

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// DELETE address (only owner)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookie = getUserIdFromRequest(req);
    const { id } = await params;

    if (!cookie) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = cookie;

    const [address] = await db.select().from(addresses).where(eq(addresses.id, id));
    if (!address) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (address.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await db.delete(addresses).where(eq(addresses.id, id));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
