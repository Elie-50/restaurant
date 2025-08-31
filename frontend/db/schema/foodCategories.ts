import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const foodCategories = pgTable("food_categories", {
    id: uuid().unique().notNull().primaryKey().defaultRandom(),
    label: varchar("label", { length: 50 }).notNull().unique(),

})