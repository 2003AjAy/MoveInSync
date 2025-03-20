import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

// Create database connection
// The DATABASE_URL is provided through Vite's define configuration
const databaseUrl = process.env.DATABASE_URL || '';
const sql = neon(databaseUrl);
export const db = drizzle({ client: sql });

// Export schema types
export * from './schema';
