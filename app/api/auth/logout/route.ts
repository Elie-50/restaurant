import { clearAuthCookie } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
    secure: true,
    sameSite: "lax",
  });
  clearAuthCookie();
  return res;
}
