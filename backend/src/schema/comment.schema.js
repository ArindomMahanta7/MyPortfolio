import { uuid , varchar , text , timestamp, pgTable } from "drizzle-orm/pg-core";

import {posts} from "./post.schema.js"

export const comments = pgTable("comments" , {
    id : uuid("id").defaultRandom().primaryKey(),
    postId : uuid("post_id").notNull().references(() => posts.id , {
        onDelete : "cascade",
    }),
    name : varchar("name" , {length : 100}).notNull(),
    content : text("content").notNull(),
    createdAt : timestamp("created_at").notNull().defaultNow(),
});