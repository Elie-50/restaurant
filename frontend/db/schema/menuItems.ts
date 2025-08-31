import { pgTable, uuid, varchar, decimal } from "drizzle-orm/pg-core";
import { foodCategories } from "./foodCategories";

export const menuItems = pgTable("menuItems", {
  id: uuid("id")
    .primaryKey()
    .defaultRandom()
    .notNull(),

  foodCategoryId: uuid("food_category_id")
    .notNull()
    .references(() => foodCategories.id, { onDelete: "cascade" }),

  name: varchar("name", { length: 50 }).notNull().unique(),
  ingredients: varchar("ingredients", { length: 500 }),
  price: decimal("price", { precision: 10, scale: 2}).notNull(),
  imageUrl: varchar("image_url", { length: 500 }),
});
