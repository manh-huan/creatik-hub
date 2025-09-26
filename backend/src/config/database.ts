import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
dotenv.config();

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL is required');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Environment-based SSL configuration
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Optimized connection pooling
  max: parseInt(process.env.DB_POOL_MAX || '20'), // Increased for better concurrency
  min: parseInt(process.env.DB_POOL_MIN || '5'), // Maintain minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Enhanced connection testing with retry logic
const testConnection = async (retries = 3): Promise<void> => {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');

      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ PostgreSQL Connected:', {
          time: result.rows[0].current_time,
          version: result.rows[0].postgres_version.split(' ')[0]
        });
      }

      client.release();
      return;
    } catch (error) {
      console.error(`❌ PostgreSQL Connection Failed (attempt ${i + 1}/${retries}):`,
        process.env.NODE_ENV === 'production' ? 'Connection error' : error);

      if (i === retries - 1) {
        console.error('🚨 Database connection failed after all retries. Exiting...');
        process.exit(1);
      }

      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
    }
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Graceful shutdown initiated...');
  await pool.end();
  console.log('✅ Database connections closed');
});

// Initialize connection
testConnection();

export default pool;