import { pgTable, uuid, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { addresses } from "./addresses";
import { users } from "./users";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  status: varchar("status", { length: 20 })
    .default("pending")
    .notNull(),
  totalPrice: decimal("total_price", { precision: 8, scale: 2 })
    .default("0")
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deliveryAddressId: uuid("delivery_address_id").references(() => addresses.id, {
    onDelete: "set null",
  }),
});