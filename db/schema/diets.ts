import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const dietaryPreferences = pgTable("dietary_preferences", {
  id: uuid("id").primaryKey().defaultRandom(),
  label: varchar("label", { length: 50 }).notNull().unique(),
});