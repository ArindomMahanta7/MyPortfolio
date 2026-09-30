import {pgTable , uuid , varchar , text , integer} from "drizzle-orm/pg-core"

export const categories = pgTable("category", {
    id : uuid("id").defaultRandom().primaryKey(),
    name : varchar("name", {length:50}).notNull().unique(),
    slug : varchar("slug" , {lenght : 120}).notNull().unique(),
    description : text("description"),
    postCount : integer("post_count").notNull().default(0),
})