import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const addresses = pgTable("addresses", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom()
    .notNull(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  street: varchar("street", { length: 255 }).notNull(),
  building: varchar("building", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  apartment: varchar("apartment", { length: 100 }),
  gpsLink: varchar("gps_link", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }),

  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
