import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("user"),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export async function up(db: any) {
  await db.schema.createTable(users).ifNotExists().execute();
}

export async function down(db: any) {
  await db.schema.dropTable(users).ifExists().execute();
}
