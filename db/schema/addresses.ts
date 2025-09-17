import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  street: varchar("street", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  building: varchar("building", { length: 100 }).notNull(),
  floor: varchar("floor", { length: 100 }).notNull(),
  gpsLink: varchar("gps_link", { length: 255 }).default("").notNull(),
  image: varchar("image", { length: 255 }), // optional
  createdAt: timestamp("created_at").defaultNow().notNull(),
});