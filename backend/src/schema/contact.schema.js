import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  name: varchar("name", {
    length: 100,
  }).notNull(),

  email: varchar("email", {
    length: 255,
  }).notNull(),

  subject: varchar("subject", {
    length: 200,
  }).notNull(),

  message: text("message").notNull(),

  isRead: boolean("is_read")
    .notNull()
    .default(false),

  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});