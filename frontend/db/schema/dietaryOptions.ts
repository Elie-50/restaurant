import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const dietaryOptions = pgTable("dietary_options", {
    id: uuid().unique().notNull().primaryKey().defaultRandom(),
    label: varchar("label", { length: 50 }).notNull().unique(),

})