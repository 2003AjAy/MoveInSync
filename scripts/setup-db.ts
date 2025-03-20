import { migrate } from 'drizzle-orm/neon-http/migrator';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';
import { seedDatabase } from '../src/db/seed';

// Load environment variables
config();

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database...');
    
    // Create database connection
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle({ client: sql });
    
    // Run migrations
    console.log('🔄 Running migrations...');
    await migrate(db, { migrationsFolder: 'migrations' });
    console.log('✅ Migrations completed successfully');
    
    // Seed the database with initial data
    console.log('🌱 Seeding database with sample data...');
    await seedDatabase();
    
    console.log('✅ Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup
setupDatabase();