"use server"

import { z } from "zod"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { db } from "@/db"
import { verifyPassword } from "../auth"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import jwt from "jsonwebtoken"

const schema = z.object({
  email: z.email(),
  password: z.string().min(6),
})


export async function login(
  formData: FormData
): Promise<void> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    throw new Error("Invalid data");
  }

  const { email, password } = parsed.data

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    throw new Error("Invalid creadentials");
  }

  // Create JWT token
  const token = jwt.sign(
    { sub: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  // Store in cookies
  (await cookies()).set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  
  redirect("/dashboard");

}
