import pool from '../config/database';
import User, { CreateUserData, LoginData, PublicUser } from '../models/User';
import { hashPassword, comparePassword } from '../utils/auth';

export class UserService {

  static async createUser(userData: CreateUserData): Promise<User> {
    const { email, firstName, lastName, password } = userData;

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const passwordHash = await hashPassword(password);

    return await User.create({
      email,
      firstName,
      lastName,
      passwordHash
    });

  }

  static async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  static async findById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  static async verifyLogin(loginData: LoginData): Promise<PublicUser | null> {
    const { email, password } = loginData;

    try {
      const user = await this.findByEmail(email);
      if (!user) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('No user found with email:', email);
        }
        return null;
      }

      const isValidPassword = await comparePassword(password, user.passwordHash);
      if (!isValidPassword) {
        if (process.env.NODE_ENV !== 'production') {
          console.log('Invalid password for:', email);
        }
        return null;
      }

      if (process.env.NODE_ENV !== 'production') {
        console.log('Login successful for:', email);
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error('Error verifying login:', error);
      throw error;
    }
  }
}