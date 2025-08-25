import { mysqlTable, int,  varchar, timestamp, boolean } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }) // UUID stored as string
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()).unique().notNull(),
    
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(), // hashed password
  username: varchar("username", { length: 50 }).notNull().unique(),

  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),

  isVerified: boolean("is_verified").notNull().default(false),

  verificationToken: varchar("verification_token", { length: 255 }),
  verificationTokenExpires: timestamp("verification_token_expires", { mode: "date" }),

  verificationCode: varchar("verification_code", { length: 6 }),
  verificationCodeExpiresIn: timestamp("verification_code_expires_in", { mode: "date" }),

  createdAt: timestamp("created_at", { mode: "date" })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});