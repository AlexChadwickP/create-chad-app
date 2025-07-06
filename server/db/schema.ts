import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    keycloakId: varchar("keycloak_id", { length: 255 }).notNull().unique(),
    email: varchar("email", { length: 255 }).notNull(),
    name: text("name"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});