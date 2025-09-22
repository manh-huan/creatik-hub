import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' }); 
dotenv.config();

console.log('🔍 Environment check:');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false, // Disable SSL for local development
  max: 10, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
  connectionTimeoutMillis: 5000, // How long to wait when connecting
});


const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ PostgreSQL Connected:', result.rows[0].current_time);
    client.release(); // Important: release the client back to pool
  } catch (error) {
    console.error('❌ PostgreSQL Connection Failed:', error);
    process.exit(1); // Exit if database unavailable
  }
};

testConnection();

// Test the connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

export default pool;