import { PgTable , uuid , primaryKey } from "drizzle-orm/pg-core";

import { posts } from "./post.schema.js";
import { tags } from "./tag.schema.js";

export const postTags = pgTable("post_tags",{
    postId : uuid("post_id").references(()=>posts.id),
    tagId : uuid("tag_id").references(()=>tags.id),
    
}, (table) => {
    pk : primaryKey({
        columns : [table.postId, table.tagId],
    })
});