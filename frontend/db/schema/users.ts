import { pgTable, varchar, timestamp, integer, pgEnum, boolean, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["admin", "cashier", "customer", "delivery"]);

export const users = pgTable("users", {
  id: uuid()
    .primaryKey()
    .unique()
    .notNull()
    .defaultRandom(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  phoneNumber: varchar("phone_number", { length: 20}).unique(),

  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),

  isVerified: boolean("is_verified").notNull().default(false),

  verificationToken: varchar("verification_token", { length: 255 }),
  verificationTokenExpires: timestamp("verification_token_expires"),

  verificationCode: varchar("verification_code", { length: 6 }),
  verificationCodeExpiresIn: timestamp("verification_code_expires_in"),

  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  role: roleEnum("role").notNull().default("customer"),
  points: integer("points").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull()
});
