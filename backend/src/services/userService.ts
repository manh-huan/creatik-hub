import pool from '../config/database';
import { User, CreateUserData, LoginData } from '../models/User';
import { hashPassword, comparePassword, sanitizeUserForLogging } from '../utils/auth';

export class UserService {
  static async createUser(userData: CreateUserData): Promise<User> {
    const { email, name, password } = userData;

    try {
   
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const passwordHash = await hashPassword(password);


      const query = `
        INSERT INTO users (email, name, password_hash, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
        RETURNING id, email, name, created_at, updated_at
      `;

      const result = await pool.query(query, [email, name, passwordHash]);
      const user = result.rows[0];
      
      if (process.env.NODE_ENV !== 'production') {
        console.log('User created:', sanitizeUserForLogging(user));
      }
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    let client;
    try {
      // Get a client from the pool
      client = await pool.connect();
      if (process.env.NODE_ENV !== 'production') {
        console.log('Database client acquired from pool');
      }

      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await client.query(query, [email]);

      if (process.env.NODE_ENV !== 'production') {
        console.log(`Query executed, found ${result.rows.length} users`);
      }
      return result.rows[0] || null;
      
    } catch (error) {
      console.error('Error in findByEmail:', error);
      throw error;
    } finally {
      // Always release the client back to the pool
      if (client) {
        client.release();
        if (process.env.NODE_ENV !== 'production') {
          console.log('✅ Database client released back to pool');
        }
      }
    }
  }

  static async findById(id: string): Promise<User | null> {
    try {
      const query = 'SELECT id, email, name, created_at, updated_at FROM users WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async verifyLogin(loginData: LoginData): Promise<User | null> {
    const { email, password } = loginData;

    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      const user = result.rows[0];

      if (!user) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('User not found:', email);
        }
        return null;
      }

      const isValidPassword = await comparePassword(password, user.password_hash);
      if (!isValidPassword) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Invalid password for:', email);
        }
        return null;
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log('Login successful for:', email);
      }

      const { password_hash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error verifying login:', error);
      throw error;
    }
  }
}