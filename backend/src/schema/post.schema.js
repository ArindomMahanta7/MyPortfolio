import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

import { users } from "./user.schema.js";
import { categories } from "./category.schema.js";

export const posts = pgTable("posts", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  title: varchar("title", {
    length: 200,
  })
    .notNull(),

  slug: varchar("slug", {
    length: 220,
  })
    .notNull()
    .unique(),

  excerpt: text("excerpt"),

  content: text("content")
    .notNull(),

  coverImage: text("cover_image"),

  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  categoryId: uuid("category_id").notNull().references(() => categories.id, {onDelete: "restrict",}),

  status: varchar("status", {length: 20,}).notNull().default("draft"),

  publishedAt: timestamp("published_at"),

  readingTime: integer("reading_time"),

  seoTitle: varchar("seo_title", {length: 200,}),

  seoDescription: varchar("seo_description", {length: 320,}),

  ogImage: text("og_image"),

  isFeatured: boolean("is_featured").notNull().default(false),

  viewCount: integer("view_count").notNull().default(0),

  likeCount: integer("like_count").notNull().default(0),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});