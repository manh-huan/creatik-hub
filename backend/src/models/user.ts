import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare firstName: CreationOptional<string>;
  declare lastName: CreationOptional<string>;
  declare passwordHash: CreationOptional<string | null>;
  declare role: CreationOptional<string>;
  declare isActive: CreationOptional<boolean>;
  declare emailVerified: CreationOptional<boolean>;
  declare provider: CreationOptional<string | null>;
  declare providerId: CreationOptional<string | null>;
  declare avatarUrl: CreationOptional<string | null>;
  declare lastLoginAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'last_name',
    },
    role: {
      type: DataTypes.ENUM('CUSTOMER', 'ADMIN'),
      allowNull: false,
      defaultValue: 'CUSTOMER',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_active',
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verified',
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'password_hash',
    },
    provider: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'local',
      field: 'provider',
    },
    providerId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'provider_id',
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'avatar_url',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    underscored: true,
    timestamps: true,
  },
);

export default User;

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  provider?: string | null;
  avatarUrl?: string | null;
}
