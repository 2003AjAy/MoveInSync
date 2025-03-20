import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// Define the role type with the specific roles
export type UserRole = "super_admin" | "regional_admin" | "city_admin" | "local_admin";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("local_admin"),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
