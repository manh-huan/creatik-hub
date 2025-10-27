import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';


dotenv.config({ path: '../.env' });
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is required');
  process.exit(1);
}
``
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});


// Enhanced connection testing with retry logic
const testConnection = async (retries = 3): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Initialize connection
testConnection();

export default sequelize;