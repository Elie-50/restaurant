import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { dietaryOptions } from "./dietaryOptions";

export const userPreferences = pgTable(
  "user_preferences",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dietaryOptionId: uuid("dietary_option_id")
      .notNull()
      .references(() => dietaryOptions.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.dietaryOptionId] }),
  ]
);
