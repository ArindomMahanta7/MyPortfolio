import { pgTable, uuid, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description").default(""),
  postCount: integer("post_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
