import { pgTable, uuid, varchar, decimal, text, integer } from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  price: decimal("price", { precision: 4, scale: 2 }).notNull(),
  ingredients: text("ingredients").notNull(),
  image: varchar("image", { length: 255 }).notNull(), // store path or URL
  pointsRewards: integer("points_rewards").default(0).notNull(),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 })
    .default("0")
    .notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
});