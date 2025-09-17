import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { dietaryPreferences } from "./diets";

export const userDietaryPreferences = pgTable(
  "user_dietary_preferences",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    dietaryPreferenceId: uuid("dietary_preference_id")
      .notNull()
      .references(() => dietaryPreferences.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.dietaryPreferenceId] }),
  ]
);