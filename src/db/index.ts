import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Load environment variables
config();

// Create database connection
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

// Export schema types
export * from './schema';
