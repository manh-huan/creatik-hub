import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';



class User extends Model<InferAttributes<User>,InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare passwordHash: string;
  declare role: CreationOptional<string>;
  declare isActive: CreationOptional<boolean>;
  declare emailVerified: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init({
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
    allowNull: false,
    field: 'first_name',
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
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
    allowNull: false,
    field: 'password_hash',
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
}, {
  sequelize,
  tableName: 'users',
  modelName: 'User',
  underscored: true,
  timestamps: true,
});

export default User;

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface PublicUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}