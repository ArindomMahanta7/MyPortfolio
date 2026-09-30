import { PgTable , uuid , varchar , timestamp , unique , index, pgTable } from "drizzle-orm/pg-core";

import {posts} from "./post.schema.js"

export const postLikes = pgTable("post_likes" , {
    id : uuid("id").defaultRandom().primaryKey(),
    postId : uuid("post_id").notNull().references(() => posts.id , { 
        onDelete : "cascade"
    }),
    ipAddress : varchar("ip_address" , {
        length : 45 , 
    }).notNull(),

    createdAt : timestamp("created_at").notNull().defaultNow(),
},
(table) => [
    unique("post_likes_post_ip_unique").on(
        table.postId , 
        table.ipAddress
    ),
    index("post_likes_post_id_idx").n(
        table.postId
    ),
]
)