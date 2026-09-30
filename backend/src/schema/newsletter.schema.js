import {
  pgTable,
  uuid,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const newsletter = pgTable("newsletter", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  email: varchar("email", {
    length: 255,
  })
    .notNull()
    .unique(),

  status: varchar("status", {
    length: 20,
  })
    .notNull()
    .default("active"),

  subscribedAt: timestamp("subscribed_at")
    .notNull()
    .defaultNow(),

  unsubscribedAt: timestamp("unsubscribed_at"),
});