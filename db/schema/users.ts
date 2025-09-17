import { pgTable, uuid, varchar, integer, pgEnum, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["admin", "cashier", "customer", "delivery"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().unique().notNull(),
  username: varchar("username", { length: 150 }).notNull().unique(),
  firstName: varchar("first_name", { length: 50 }).default("").notNull(),
  lastName: varchar("last_name", { length: 50 }).default("").notNull(),
  email: varchar("email", { length: 254 }).notNull().unique(),
  password: varchar("password", { length: 128 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).default("").notNull(),
  role: roleEnum("role").notNull().default("customer"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  points: integer("points").default(0).notNull(),

});