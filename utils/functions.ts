import jwt from "jsonwebtoken";

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

export function isStaff(role: string) {
  return ["admin", "cashier", "delivery"].includes(role.toLowerCase());
}