import { getUserIdFromCookies } from "@/utils/functions";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserPoints = async () => {
  const userId = await getUserIdFromCookies();
  if (!userId) throw new Error("Unauthorized");

  const result = await db
    .select({ points: users.points })
    .from(users)
    .where(eq(users.id, userId));

  if (!result[0]) {
    throw new Error("Failed to fetch points");
  };
  return result[0].points;
};