import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { items } from "./items";
import { dietaryPreferences } from "./diets";

export const itemDietaryPreferences = pgTable(
  "item_dietary_preferences",
  {
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    dietaryPreferenceId: uuid("dietary_preference_id")
      .notNull()
      .references(() => dietaryPreferences.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.itemId, t.dietaryPreferenceId] }),
  ]
);