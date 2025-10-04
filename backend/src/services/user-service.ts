/**
 * User Service
 * Handles user data retrieval operations
 * User creation is handled by passwordless-service and OAuth services
 */

import { User } from '../models';

export class UserService {
  static async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  static async findById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }

  static async findByProvider(provider: string, providerId: string): Promise<User | null> {
    return await User.findOne({
      where: {
        provider,
        providerId
      }
    });
  }
}