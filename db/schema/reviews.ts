import { pgTable, uuid, integer, text, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { items } from "./items";

export const reviews = pgTable(
  "reviews",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.itemId] }),
  ]
);