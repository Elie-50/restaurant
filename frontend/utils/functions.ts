import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

type jwtCookie = {
    userId: string;
    role: string;
};

const JWT_SECRET = process.env.JWT_SECRET as string;
export function getUserIdFromRequest(req: Request): jwtCookie | null {
  const cookie = req.headers.get("cookie");
  if (!cookie) return null;

  const token = cookie
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return { userId: decoded.id, role: decoded.role };
  } catch {
    return null;
  }
}


export async function getUserIdFromCookies(): Promise<string | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
      return (decoded as jwt.JwtPayload).id as string;
    }
    else {
      return null;
    }
  } catch {
    return null;
  }
}

export function isStaff(role: string) {
  return ["admin", "cashier", "delivery"].includes(role.toLowerCase());
}