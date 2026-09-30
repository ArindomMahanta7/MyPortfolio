import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { posts } from "./post.schema.js";
import { projects } from "./project.schema.js";

export const views = pgTable(
  "views",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    postId: uuid("post_id")
      .references(() => posts.id, {
        onDelete: "set null",
      }),

    projectId: uuid("project_id")
      .references(() => projects.id, {
        onDelete: "set null",
      }),

    ipAddress: varchar("ip_address", {
      length: 45,
    }),

    userAgent: text("user_agent"),

    referrer: text("referrer"),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("views_post_id_idx").on(table.postId),

    index("views_project_id_idx").on(table.projectId),

    index("views_created_at_idx").on(table.createdAt),
  ]
);