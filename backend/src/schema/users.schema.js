import {pgTable,varchar} from "drizzle-orm/pg-core";

export const users=pgTable("users",{
    id : uuid().defaultRandom().primaryKey(),
    name : varchar("name",{length:255}).notNull(),
    email : varchar("email",{length:255}).notNull().unique(),
    password : varchar("password",{length:255}).notNull(),
    role : varchar("role").notNull().default("admin"),
})
