import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Create an expired cookie to overwrite the JWT
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0), // Expire immediately
  });

  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  response.headers.set("Set-Cookie", cookie);

  return response;
}