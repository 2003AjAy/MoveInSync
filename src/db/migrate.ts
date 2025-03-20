import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

// Load environment variables
config();

export async function runMigrations() {
  try {
    // Create database connection
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle({ client: sql });
    
    console.log('Running migrations...');
    
    // Run migrations
    await migrate(db, { migrationsFolder: 'migrations' });
    
    console.log('Migrations completed successfully');
    return true;
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}

// Run directly if executed as script
if (import.meta.url === import.meta.resolve('./migrate.ts')) {
  runMigrations()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
