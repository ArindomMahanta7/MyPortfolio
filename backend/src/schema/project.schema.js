import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  boolean,
  integer,
  date,
  timestamp,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
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

  description: text("description"),

  longDescription: text("long_description"),

  technologies: jsonb("technologies")
    .notNull()
    .default([]),

  thumbnail: text("thumbnail"),

  screenshots: jsonb("screenshots")
    .notNull()
    .default([]),

  githubUrl: text("github_url"),

  liveDemoUrl: text("live_demo_url"),

  features: jsonb("features")
    .notNull()
    .default([]),

  category: varchar("category", {
    length: 100,
  }),

  isFeatured: boolean("is_featured")
    .notNull()
    .default(false),

  startDate: date("start_date"),

  endDate: date("end_date"),

  viewCount: integer("view_count")
    .notNull()
    .default(0),

  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});