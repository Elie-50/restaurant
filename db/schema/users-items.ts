import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { items } from "./items";

export const favoriteItems = pgTable(
  "favorite_items",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.itemId] }),
  ]
);