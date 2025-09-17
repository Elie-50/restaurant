import { pgTable, uuid, integer, decimal, primaryKey } from "drizzle-orm/pg-core";
import { orders } from "./orders";
import { items } from "./items";

export const orderItems = pgTable(
  "order_items",
  {
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    itemId: uuid("item_id")
      .notNull()
      .references(() => items.id, { onDelete: "restrict" }),
    quantity: integer("quantity").default(1).notNull(),
    price: decimal("price", { precision: 6, scale: 2 }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.orderId, t.itemId] }),
  ]
);